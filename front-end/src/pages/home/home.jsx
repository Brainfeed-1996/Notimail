import listUsers from "../../requests/list_users"
// Importation des hooks useState et useEffect depuis React
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./home.css";
import authentificate from '../../requests/authentificate';
import get_user from '../../requests/get_user';

export default () => {
  // Utilisation du hook useState pour gérer l'état des entreprises
  const [entreprises, setEntreprises] = useState([]);
  const [firmName, setFirmName] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const navigate = useNavigate()
  // Utilisation du hook useEffect pour effectuer une action au chargement du composant
  useEffect(() => {
    // Fonction asynchrone pour récupérer la liste des entreprises depuis l'API
    const fetchEntreprises = async () => {
      try {
        // Récupère la liste des entreprise à partir de l'api
        let firm_list = await listUsers();
        // Vérifie que la liste à bien pu être récupéré
        if (firm_list == null) {
          throw Error("Impossible de récupérer la liste des utilisateurs");
        }

        // Met à jour de la liste d'entreprises à partir des données le l'api
        setEntreprises(firm_list);
      } catch (erreur) {
        // Affichage de l'erreur en cas d'échec de la récupération des entreprises
        console.error('Erreur lors de la récupération des entreprises:', erreur);
      }
    };

    // Appel de la fonction fetchEntreprises lors du chargement initial du composant
    fetchEntreprises();
  }, []);

  // cree une fonction par "...(e) =>..."
  const handleSubmit = (e) => {
    //execute la fonction par authentificate avec ses arguments entre parentheses
    authentificate(firmName, password).then((result) => {
      if (result == false) {
        setErrorMessage("Identifiant invalide")
        return
      }
      get_user(firmName).then((user) => {
        if (user == null) {
          return
        }
        if (user.is_admin) {
          navigate('/admin')
        } else {
          navigate('/user')
        }
      })
    })
    //empeche le rechargement de la page
    e.preventDefault()
  }

  // Rendu du composant Home
  return (
    <>
      <header className="home_header">
        <img className="home_logo" src="../../src/assets/images/logo-home.svg" alt="Logo" />
      </header>

      {/* Section de connexion */}
      <form className='home_form' onSubmit={handleSubmit}>

        {/* Sélecteur d'entreprise avec la possibilité de le désactiver pendant le chargement */}
        <label className='home_firm_label home_label'>
          <select
            className="home_firm_input home_input"
            disabled={entreprises.length == 0}
            defaultValue={"DEFAULT"}
            onChange={(e) => setFirmName(e.target.value)}
          >
            <option disabled value="DEFAULT">Entreprise</option>
            {/* Affichage des options basées sur la liste des entreprises récupérées */}

            {entreprises.map(firm_name => (
              <option key={firm_name}>
                {firm_name}
              </option>
            ))
            }
          </select>
        </label>

        {/* Zone d'entrée du mot de passe avec le composant BtnConnect */}
        <label className="home_password_label home_label">
          <input
            className="home_password_input home_input"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="home_submit" type='submit'>
            <img className="home_submit_img" src="../../src/assets/images/padlock.svg" alt="submit" />
          </button>
        </label>

        {errorMessage != null && <h4 class="home_error">{errorMessage}</h4>}

      </form>
    </>
  );
};

