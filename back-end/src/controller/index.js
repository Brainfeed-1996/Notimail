import mysql from "mysql";
import bcrypt from "bcrypt";
import crypto from "crypto";

import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASSWORD,
  MYSQL_PORT,
} from "../environment.js";
import PermissionException from "./permission_exception.js";
import { SessionState } from "../session.js"
import notify from "../notify.js"

/**
 * Gère toutes les intéraction avec la base de données
 *
 * Ne doit pas être directement construit, voir (@link controller)
 */
class Controller {
  /**
   * @type {Connection}
   */
  connection;

  /**
   * Initialise la connection à la base de données
   *
   * Créer la base de données si elle n'existe pas
   */
  constructor() {
    this.connect();
  }

  /**
   * Initialise la connection à la base de données
   *
   * Créer la base de données si elle n'existe pas
   */
  connect() {
    this.connection = mysql.createConnection({
      host: DATABASE_HOST,
      user: DATABASE_USER,
      password: DATABASE_PASSWORD,
      database: DATABASE_NAME,
      port: MYSQL_PORT,
    });

    this.connection.connect((err) => {
      if (err) {
        console.log(err.errno);
        if (err.errno == 1049 /* Database doesn't exists */) {
          let connection = mysql.createConnection({
            host: DATABASE_HOST,
            user: DATABASE_USER,
            password: DATABASE_PASSWORD,
            port: MYSQL_PORT,
          });

          connection.query(
            "CREATE DATABASE " + DATABASE_NAME,
            (err, _results) => {
              if (err) {
                console.error(
                  "Failed to create database '" +
                  DATABASE_NAME +
                  "': " +
                  err.stack
                );
                process.exit(-1);
              }

              console.log("Created database '" + DATABASE_NAME + "'");

              this.connect();
              this.initialize_database();
            }
          );
          return;
        }

        console.error(
          "Failed to connect to my database '" + DATABASE_NAME + "': ",
          err.stack
        );
        process.exit(-1);
      }

      console.log(
        "Connected to mysql database database '" + DATABASE_NAME + "'"
      );
    });
  }

  /**
   * Créer la base de données
   */
  initialize_database() {
    let initialization_query = `
      CREATE TABLE IF NOT EXISTS users (
        firm_name varchar(120) NOT NULL,
        first_name varchar(50) DEFAULT NULL,
        last_name varchar(50) DEFAULT NULL,
        email varchar(320) NULL,
        phone_number varchar(25) NULL,
        password_hash varchar(72) NOT NULL,
        last_received_mail timestamp NULL DEFAULT NULL,
        last_picked_up timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        has_mail bit(1) NOT NULL DEFAULT b'0',
        is_admin bit(1) NOT NULL DEFAULT b'0',
        token char(64) NULL DEFAULT NULL,
        last_token_usage timestamp NULL DEFAULT NULL,
        PRIMARY KEY (firm_name)
      );`;
    this.connection.query(initialization_query, (err, _results) => {
      if (err) {
        console.error(
          "Failed to setup database '" + DATABASE_NAME + "': " + err.stack
        );
      } else {
        console.log("Database '" + DATABASE_NAME + "' initialized");
      }
    });
  }

  /**
   * Execute la requête sql `query` et renvoie le résultat de la requête
   * @param {string} query - The sql query to be executed
   * @param {[string] | undefined} values - Remplace les '?' dans la requête par les éléments de la liste
   * @return {Promise<any>} the result of the sql request
  */
  async executeQuery(query, values) {
    return new Promise((resolve, reject) => {
      this.connection.query(query, values, function(error, results, _fields) {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  /**
   * Verifie le niveau de permission d'une session
   * @param {Session} session - session dont le niveau de permission va être vérifié
   * @return {Promise<SessionState>} niveau de permission de la session
   */
  async verify_session(session) {
    if (session.firm_name == undefined || session.token == undefined) {
      return SessionState.NO_SESSION;
    }

    let results = await this.executeQuery(
      `
        SELECT is_admin FROM users WHERE
        firm_name = ? AND
        token = ? AND
        last_token_usage > SUBTIME(NOW(), "8:0")
      `,
      [session.firm_name, session.token]
    );

    if (results[0] == undefined) {
      return SessionState.NO_SESSION;
    }

    return results[0].is_admin[0] == 1 ? SessionState.ADMIN : SessionState.USER;
  }

  /**
   * Créer un token de connection pour les indentifiants donné
   * @param {string} firm_name - Le nom de l'entreprise avec laquelle se connecter
   * @param {string} password - Le mot de passe avec lequelle se connecter
   * @return {Promise<string | null>} Le token de connection sous la forme "token:firm_name"
   */
  async authentificate(firm_name, password) {
    let results = await this.executeQuery(`SELECT password_hash FROM users WHERE firm_name = '${firm_name}'`);
    if (results[0] == undefined) {
      return null;
    }

    if (!await bcrypt.compare(password, results[0].password_hash)) {
      return null;
    }

    let token = Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('base64');

    await this.executeQuery(
      `
        UPDATE users SET
        token = ?,
        last_token_usage = NOW()
        WHERE firm_name = ?
      `,
      [token, firm_name]
    )

    return token + ":" + firm_name;
  }

  /**
   * Renvoie la liste des noms d'entreprises
   * @return {Promise<[string]>} Le liste des noms d'entreprises
   */
  async listUsers() {
    let results = await this.executeQuery("SELECT firm_name FROM users");

    return results.map(
      (result) => {
        return result.firm_name;
      }
    );
  }

  /**
   * Créer un utilisateur avec à partir des arguments
   * @throws {PermissionException} Throw quand le session n'as pas les permissions administateurs
   * @param {Session} session - Session utilisé pour créer l'utilisateur
   * @param {string} firm_name - Nom de l'entreprise à créer
   * @param {string} first_name - Prénom du contact
   * @param {string} last_name - Nom du contact
   * @param {string} email - Email  sur laquelle seront envoyées les notifications de courrier
   * @param {string} phone_number - Numéro de téléphone sur lequelle seront envoyées les notifications de courrier
   * @param {string} password - Mot de passe
   * @param {boolean} is_admin - Définit si l'utilisateur sera un administrateur
   * @returns {Promise<boolean>} Renvoie `false` si le nom d'entreprise est déjà utilisé et que l'opération à échoué, `true` sinon
   */
  async createUser(
    session,
    firm_name,
    first_name,
    last_name,
    email,
    phone_number,
    password,
    is_admin,
  ) {
    if (await this.verify_session(session) != SessionState.ADMIN) {
      throw new PermissionException();
    }

    try {
      await this.executeQuery(
        `
          INSERT INTO users (
            firm_name,
            first_name,
            last_name,
            email,
            phone_number,
            password_hash,
            is_admin
          )
          VALUES (?, ?, ?, ?, ?, ?, b'${is_admin ? 1 : 0}')
        `,
        [
          firm_name,
          first_name,
          last_name,
          email,
          phone_number,
          await bcrypt.hash(password, 12),
          is_admin ? "1" : "0",
        ]
      );
    } catch (err) {
      if (err.code == "ER_DUP_ENTRY") {
        return false;
      }
      throw err;
    }

    return true;
  }

  /**
   * Supprime un utilisateur
   * @throws {PermissionException} Throw quand le session n'as pas les permissions administateurs
   * @param {Session} session - Session utilisé pour supprimer l'utilisateur
   * @param {Promise<string>} firm_name - Nom de l'entreprise à supprimer
   */
  async deleteUser(session, firm_name) {
    if (await this.verify_session(session) != SessionState.ADMIN) {
      throw new PermissionException();
    }

    // Empêche de un admin de se détruire
    if (session.firm_name == firm_name) {
      throw new PermissionException();
    }

    return (await this.executeQuery(`DELETE FROM users WHERE firm_name = ?`, firm_name)).affectedRows > 0;
  }

  /**
   * Modifie des informations liée à un utilisateur
   * @throws {PermissionException} Throw quand le session n'as pas les permissions administrateur
             sauf si seulement has_mail est définit et le session correspond à l'utilisateur modifier
   * @param {Session} session - Session utilisé pour modifier l'utilisateur
   * @param {string | undefined} firm_name - Nom de l'entreprise à modifier
   * @param {string | undefined} first_name - Nouveau prénom du contact
   * @param {string | undefined} last_name - Nouveau nom du contact
   * @param {string | undefined} email - Nouvel email sur laquelle seront envoyées les notifications de courrier
   * @param {string | undefined} phone_number - Nouveau numéro de téléphone sur lequelle seront envoyées les notifications de courrier
   * @param {string | undefined} password - Nouveau mot de passe
   * @param {boolean | undefined} has_mail - Définit si l'utilisateur à recu un mail ou non,
            utiliser `true` pour signaler l'arrivée d'un nouveau courrier,
            `false` pour signaler la récupération d'un courrier
   * @param {boolean | undefined} is_admin - Définit si l'utilisateur sera un administrateur
   * @returns {Promise<boolean>} Renvoie `false` si le nom d'entreprise n'est pas enregistré et que l'opération à échoué, `true` sinon
   */
  async updateUser(
    session,
    firm_name,
    first_name,
    last_name,
    email,
    phone_number,
    password,
    has_mail,
    is_admin
  ) {
    let session_state = await this.verify_session(session)
    if (
      session_state == SessionState.NO_SESSION ||
      (session_state == SessionState.USER && session.firm_name != firm_name)
    ) {
      throw new PermissionException();
    }

    let require_admin = false;
    let should_notify = false;

    let updated_fields = [];
    let updated_values = [];

    if (first_name != undefined) {
      updated_fields.push(`first_name = ?`);
      updated_values.push(first_name);
      require_admin = true;
    }
    if (last_name != undefined) {
      updated_fields.push(`last_name = ?`);
      updated_values.push(last_name);
      require_admin = true;
    }
    if (email != undefined) {
      updated_fields.push(`email = ?`);
      updated_values.push(email);
      require_admin = true;
    }
    if (phone_number != undefined) {
      updated_fields.push(`phone_number = ?`);
      updated_values.push(phone_number);
      require_admin = true;
    }
    if (password != undefined) {
      updated_fields.push(`password_hash = ?`);
      updated_values.push(await bcrypt.hash(password, 12));
      require_admin = true;
    }
    if (has_mail != undefined) {
      updated_fields.push(`has_mail = b'${has_mail ? 1 : 0}'`);
      if (has_mail) {
        updated_fields.push(`last_received_mail = NOW()`);
      } else {
        updated_fields.push(`last_picked_up = NOW()`);
      }

      if (has_mail) {
        require_admin = true;
        should_notify = true;
      }
    }
    if (is_admin != undefined) {
      updated_fields.push(`is_admin = b'${is_admin ? 1 : 0}'`);
      require_admin = true;
    }

    if (require_admin && session_state != SessionState.ADMIN) {
      throw new PermissionException();
    }

    let result = await this.executeQuery(
      `
        UPDATE users SET 
        ${updated_fields.join(",")}
        WHERE firm_name = ?
      `,
      [...updated_values, firm_name]
    );

    if (should_notify) {
      const contact_information = (await this.executeQuery(
        'SELECT email, phone_number FROM users WHERE firm_name = ?',
        firm_name,
      ))[0];

      if (contact_information != undefined) {
        const { email, phone_number } = contact_information;
        notify(email, phone_number);
      } else {
        console.error(`Error: Failed to query contact informations for notifying '${firm_name}'`);
      }
      // TODO
    }

    return result.affectedRows > 0;
  }

  /**
   * Renvoie les information d'un utilisateur
   * @throws {PermissionException} Throw quand le session n'as pas les permissions administrateur
             sauf si le nom d'entreprise correspond au nom d'entreprise de la session 
   * @param {Session} session - Session utilisé pour obtenir l'utilisateur
   * @param {string} firm_name - Le nom de l'entreprise dont les informations doivent être renvoyé 
   * @returns {Promise<* | null>} - Retourne first_name, last_name, email, phone_number,
              last_received_mail, last_picked_up, has_mail, is_admin 
   */
  async getUser(session, firm_name) {
    let session_state = await this.verify_session(session);
    if (
      session_state == SessionState.NO_SESSION ||
      (session_state == SessionState.USER && firm_name != session.firm_name)
    ) {
      throw new PermissionException();
    }

    const query = `
      SELECT
        first_name,
        last_name,
        email,
        phone_number,
        last_received_mail,
        last_picked_up,
        has_mail,
        is_admin
      FROM users WHERE firm_name = ?
    `;

    let user = (await this.executeQuery(query, [firm_name]))[0];
    if (user == undefined) {
      return null;
    }

    user.has_mail = user.has_mail[0] != 0;
    user.is_admin = user.is_admin[0] != 0;

    return user;
  }

  /**
   * Déconnecte la session utilisé, suppriment le token de la base de données
   * @throws {PermissionException} Throw quand le session n'est pas valide
   * @param {Session} session - La session à déconnecter
   */
  async disconnect(session) {
    if (await this.verify_session(session) == SessionState.NO_SESSION) {
      throw new PermissionException();
    }

    this.executeQuery(`UPDATE users SET token = NULL where firm_name = ?`, session.firm_name);
  }
}

export default new Controller();
