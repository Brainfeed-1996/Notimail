/**
 * Représente une session de connection
 */
export default class Session {
  /**
   * Le nom de l'entreprise associée à la session
   * @type {string | undefined}
   */
  firm_name;
  /**
   * Token aléatoire en base64 stockée également dans la base de données
   * @type {string | undefined}
   */
  token;

  /**
   * Récupère le token depuis la bearer authentification de la requête
   * @see https://datatracker.ietf.org/doc/html/rfc6750
   * @param {Request} req - Requête depuis laquelle le token est récupéré
   */
  constructor(req) {
    let authorization = req.headers.authorization;
    if (authorization == undefined) {
      return;
    }

    let full_token = authorization.slice(7);

    let [token, ...firm_name_parts] = full_token.split(':');
    this.token = token;
    this.firm_name = firm_name_parts.join(':');
  }
}

/**
 * @desc Etat et permissions d'une `Session`
 */
export const SessionState = {
  NO_SESSION: 0,
  USER: 1,
  ADMIN: 2,
}
