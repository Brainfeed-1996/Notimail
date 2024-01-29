import { SERVER_ADDRESS, getToken } from "./index.js";

/**
 * Retourne les information d'un utilisateur
 *
 * @param {string} firm_name - Nom de l'utilisateur dont on veut obtenir les informations
 * @returns {Promise<any | null>} Information de l'utilisateur, voir `/back-end/api.md` pour la liste des informations
 */
export default async function getUser(firm_name) {
  const response = await fetch(SERVER_ADDRESS + "get_user/" + firm_name, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${getToken()}`,
    },
  });

  if (response.ok) {
    return {
      firm_name: firm_name,
      ...await response.json()
    };
  } else {
    return null
  }
}
