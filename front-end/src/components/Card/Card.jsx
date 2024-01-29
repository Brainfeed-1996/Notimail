// Importation des hooks et des styles nécessaires
import { useState } from 'react';
import "./card.css"
import { useNavigate } from 'react-router-dom';

// Définition du composant Card, qui prend un 'id' en tant que prop
export const Card = ({ set_users, users, set_modified_users, user }) => {

  //la fonction navigate = useNavigate indispensable pour aller d'une page a une autre
  const navigate = useNavigate()

  // État pour gérer l'activation/désactivation du toggle (interrupteur)
  const [toggleState, setToggleState] = useState(false);

  // Gere si la carte est cliquee
  const [isClicked, setIsClicked] = useState(false);

  // Nouvel état pour gérer l'ouverture des détails (pour l'effet de glissement des détails)
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleClick = () => {
    setIsClicked(prevState => !prevState); // Inverse l'état précédent
    setDetailsOpen(prevState => !prevState); // Basculer l'état des détails lors du clic
  };

  return (
    <details className="card_display">
      <summary className={detailsOpen ? 'details-open' : ''}> {/*Condition pour le glissement en css*/}
        <div className="card" onClick={handleClick}>
          {/* Contenu de gauche de la carte */}

          <div className="content-left">
            <div className="inline-items">
              <h3>{user.firm_name}</h3>
              <p>{`${user.last_name} ${user.first_name}`}</p>
              <p>{user.creation_date}</p>
            </div>
          </div>

          {/* Contenu de droite de la carte */}
          <div className="content-right">
            {/* Toggle (interrupteur) */}
            <input
              id={`cmn-toggle-${user.firm_name}`}
              className="cmn-toggle cmn-toggle-round"
              type="checkbox"
              defaultChecked={user.has_mail}
              onChange={e => {
                set_users(prev => {
                  prev.find(e => e.firm_name == user.firm_name).unstaged_has_mail = e.target.checked;
                  return prev;
                });
                set_modified_users(users.filter(user => user.has_mail != user.unstaged_has_mail));
              }}
            />
            <label htmlFor={`cmn-toggle-${user.firm_name}`}></label>

            <a href={"/entreprises/" + user.firm_name}>
              <img
                className="img-button"
                src="../../src/assets/images/option.svg"
                alt="Submit"
              />
            </a>
          </div>
        </div>
      </summary>
      <div className='wrapper-details'>
        <div className='details-right'>
          <p>Email</p>
          <p>Téléphone</p>
        </div>
        <div className='details-left'>
          <p>{user.email}</p>
          <p>{user.phone_number}</p>
        </div>
      </div>
    </details>


  );
};
