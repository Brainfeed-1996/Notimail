import { getToken, SERVER_ADDRESS } from "./index.js";

/**
 * Créer un nouvel utilisateur dans la base de données
 *
 * Nécessite les permsissions administrateurs
 *
 * @param {string} firm_name - Nom de l'entreprise à créer
 * @param {string} first_name - Prénom du contact de l'entreprise
 * @param {string} last_name - Nom de famille du contact de l'entreprise
 * @param {string} email - Adresse Email de l'entreprise
 * @param {string} phone_number - Numéro de téléhpone de l'entreprise
 * @param {string} password - Mot de passe de l'entreprise
 * @param {boolean} is_admin - Si l'utilisateur créer à les permissions administrateurs ou non
 * @returns {Promise<boolean>} Renvoie `true` si la requête à réussi, false sinon
 */
export default async function createUser(
  firm_name,
  first_name,
  last_name,
  email,
  phone_number,
  password,
  is_admin
) {
  const response = await fetch(SERVER_ADDRESS + "create_user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      firm_name: firm_name,
      first_name: first_name,
      last_name: last_name,
      email: email,
      phone_number: phone_number,
      password: password,
      is_admin: is_admin,
    })
  });

  if (!response.ok) {
    return true;
  } else {
    return false;
  }
}
