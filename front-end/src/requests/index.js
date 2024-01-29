export const SERVER_ADDRESS = "http://localhost:3000/"

/**
 * Retourne le token d'authentification stocké dans le `localStorage`
 * 
 * @returns {string | null} Token d'authentification
 */
export function getToken() {
  return window.localStorage.getItem("token");
}

/**
 * Retourne le nom d'entreprise inclut dans le token d'authentification stocké dans le `localStorage`
 *
 * @returns {string | null} Nom de l'entreprise connectée
 */
export function getFirmName() {

  let token = getToken();
  if (token == null) {
    return null;
  }

  let [_, ...firm_name_parts] = token.split(':');
  return firm_name_parts.join(':');
}
