import { SERVER_ADDRESS, getToken } from "./index.js";

/**
 * Modifie des informations d'un utilisateur
 *
 * @param {string} firm_name - Nom de l'entreprise à modifier
 * @param {any} user - Objet contenant des champs optionel à modifier sur l'utilisateur, voir /back-end/api.md pour la liste des champs
 * @returns {Promise<boolean>} Renvoie `true` si la requête est réussi, `false` sinon
 */
export default async function updateUser(firm_name, user) {
  const response = await fetch(SERVER_ADDRESS + "update_user", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      firm_name: firm_name,
      ...user
    })
  });

  if (response.ok) {
    return true;
  } else {
    return false;
  }
}
