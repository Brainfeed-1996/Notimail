import { getToken, SERVER_ADDRESS } from "./index.js";

/**
 * Supprime définitivement un utilisateur de la base de données
 *
 * Nécessite les permsissions administrateurs
 *
 * @param {string} firm_name - Nom de l'entreprise à supprimer
 * @returns {Promise<boolean>} `true` si la requête à réussi, `false` sinon
 */
export default async function deleteUser(firm_name) {
  const response = await fetch(SERVER_ADDRESS + "delete_user", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      firm_name: firm_name,
    })
  });

  if (response.ok) {
    return true;
  } else {
    return false;
  }
}
