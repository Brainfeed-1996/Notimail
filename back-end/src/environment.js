let is_environment_missing = false;

/**
 * Port du serveur http,
 * stocké dans le .env
 * @type {string}
 */
export const PORT = process.env.NOTIMAIL_PORT;
if (PORT == undefined) {
  console.error("Error: The 'NOTIMAIL_PORT' environment variable should be set");
  is_environment_missing = true;
}

/**
 * Hôte de la base de donnée, example: `localhost`,
 * stocké dans le .env
 * @type {string}
 */
export const DATABASE_HOST = process.env.NOTIMAIL_DATABASE_HOST;
if (DATABASE_HOST == undefined) {
  console.error(
    "Error: The 'NOTIMAIL_DATABASE_HOST' environment variable should be set"
  );
  is_environment_missing = true;
}

/**
 * Nom de la base de données mysql,
 * stocké dans le .env
 * @type {string}
 */
export const DATABASE_NAME = process.env.NOTIMAIL_DATABASE_NAME;
if (DATABASE_NAME == undefined) {
  console.error(
    "Error: The 'NOTIMAIL_DATABASE_NAME' environment variable should be set"
  );
  is_environment_missing = true;
}

/**
 * Nom de l'utilisateur mysql,
 * stocké dans le .env
 * @type {string}
 */
export const DATABASE_USER = process.env.NOTIMAIL_DATABASE_USER;
if (DATABASE_USER == undefined) {
  console.error(
    "Error: The 'NOTIMAIL_DATABASE_USER' environment variable should be set"
  );
  is_environment_missing = true;
}

/**
 * Mot de passe de l'utilisateur mysql,
 * stocké dans le .env
 * @type {string}
 */
export const DATABASE_PASSWORD = process.env.NOTIMAIL_DATABASE_PASSWORD;
if (DATABASE_PASSWORD == undefined) {
  console.error(
    "Error: The 'NOTIMAIL_DATABASE_PASSWORD' environment variable should be set"
  );
  is_environment_missing = true;
}

let mysql_port = process.env.NOTIMAIL_MYSQL_PORT;
if (mysql_port == undefined) {
  console.log(
    "INFO: The 'NOTIMAIL_MYSQL_PORT' environment variable is not set, defaulting to 3306"
  );
  mysql_port = "3306";
}
/**
 * Port de la base de données mysql,
 * stocké dans le .env ou 3306 par défaut
 * @type {string}
 */
export const MYSQL_PORT = mysql_port;

let email_service = process.env.NOTIMAIL_EMAIL_SERVICE;
if (email_service == undefined) {
  console.log("Info: The 'NOTIMAIL_EMAIL_SERVICE' environment variable is not set, defaulting to 'gmail'");
  email_service = "gmail";
}
/**
 * Service nodemailer utilisé pour envoyer les notification de colis recus, exemple: 'gmail'
 * stocké dans le .env
 * @type {string}
 */
export const EMAIL_SERVICE = email_service;


/**
 * Address email utilisé pour envoyer les notification de colis recus
 * stocké dans le .env
 * @type {string}
 */
export const EMAIL = process.env.NOTIMAIL_EMAIL;
if (EMAIL == undefined) {
  console.error(
    "Error: The 'NOTIMAIL_EMAIL' environment variable should be set"
  );
  is_environment_missing = true;
}

/**
 * Mot de passe de l'addresse email utilisé pour envoyer les notification de colis recus
 * stocké dans le .env
 * @type {string}
 */
export const EMAIL_PASSWORD = process.env.NOTIMAIL_EMAIL_PASSWORD;
if (EMAIL_PASSWORD == undefined) {
  console.error(
    "Error: The 'NOTIMAIL_EMAIL_PASSWORD' environment variable should be set"
  );
  is_environment_missing = true;
}


/**
 * Adresse du site web notimail, envoyé dans le sms et le mail de notification
 * stocké dans le .env
 * @type {string}
 */
export const FRONT_END_ADDRESS = process.env.NOTIMAIL_FRONT_END_ADDRESS;
if (FRONT_END_ADDRESS == undefined) {
  console.error(
    "Error: The 'NOTIMAIL_FRONT_END_ADDRESS' environment variable should be set"
  );
  is_environment_missing = true;
}

/**
 * Adresse du site web notimail, envoyé dans le sms et le mail de notification
 * stocké dans le .env
 * @type {string}
 */
export const ALLMYSMS_TOKEN = process.env.NOTIMAIL_ALLMYSMS_TOKEN;
if (ALLMYSMS_TOKEN == undefined) {
  console.error(
    "Error: The 'NOTIMAIL_ALLMYSMS_TOKEN' environment variable should be set"
  );
  is_environment_missing = true;
}

if (is_environment_missing) {
  process.exit(-1);
}
