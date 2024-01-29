import { SERVER_ADDRESS } from ".";

/**
 * Retourne la list de tout les noms d'entreprise
 * @return {Promise<string | null>} La liste des noms d'entreprise ou null si la requête à échoué
 */
export default async function listUsers() {
  const response = await fetch(SERVER_ADDRESS + "list_users", {
    method: "GET",
  });

  if (response.ok) {
    return await response.json();
  } else {
    return null;
  }
}
