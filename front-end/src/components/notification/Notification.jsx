import Valid from '../../assets/images/vector-valid.svg'
import Cross from '../../assets/images/vector-cross.svg'
import MailRedDot from '../../assets/images/mail-reddot.svg'
import MailLogo from '../../assets/images/mail-logo.svg'
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './notification.css';
import updateUser from "../../requests/update_user.js"
import getUser from "../../requests/get_user.js"
import { getFirmName } from '../../requests/index.js';

// Composant Modal : C'est un modal simple qui apparaît lorsque isOpen est vrai. 
// Il contient deux boutons - un pour confirmer et un autre pour annuler.
const Modal = (props) => {
  const dialog = useRef(null);

  const openHandler = () => {
    dialog.current.showModal();
  }

  const closeHandler = () => {
    dialog.current.close();
  }

  return (
    <>
      <div className="modal">
        <dialog className='modal-reception' ref={dialog}>
          <p>Confirmer la réception du courrier</p>
          <div className='ValidCross'>
            <button className="Cross" onClick={() => { closeHandler() }}><img src={Cross} /></button>
            <button className="Valid" onClick={() => { closeHandler(); props.validate() }}><img src={Valid} /></button>
          </div>
        </dialog>
        <button className="receptionner" type="button" onClick={openHandler} disabled={!props.hasMail}>
          Réceptionner
        </button>
      </div>
    </>
  );
}

// Composant Notification : Gère l'affichage du Modal et le bouton de confirmation.
const Notification = () => {
  const navigate = useNavigate();
  const [hasMail, setHasMail] = useState(false);

  useEffect(() => {
    getUser(getFirmName())
      .then(user => {
        if (user == null) {
          navigate("/");
        }

        setHasMail(user.has_mail);
      })
      .catch(_ => { navigate("/"); });
  }, []);

  const onValidate = () => {
    updateUser(getFirmName(), {
      has_mail: false,
    }).then(result => {
      if (result) {
        setHasMail(false);
      } else {
        alert("Impossible de valider le reçu du mail");
      }
    }).catch(_ => {
      alert("Impossible de valider le reçu du mail");
    });
  }

  return (
    <>
      <div className='alert'>
        <div className='image-mail-attente'>
          {
            hasMail ?
              <img src={MailRedDot} alt="e-mail en attente" /> :
              <img src={MailLogo} alt="aucun e-mail en attente" />
          }
        </div>
        <div className="string-container">
          {/* Bouton pour déclencher la confirmation et afficher le Modal */}
          <span>
            {
              hasMail ?
                "Vous avez du courrier en attente" :
                "Vous n'avez aucun courrier en attente"
            }
          </span>
        </div>

        <Modal validate={onValidate} hasMail={hasMail} />
      </div>
    </>
  );
}

export default Notification;
