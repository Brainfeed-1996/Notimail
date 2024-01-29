import { useState } from "react";

const PanneauUser = () => {
  const [showModal, setShowModal] = useState(true);
  const [hasMail, setHasMail] = useState(true);

  return (
    <>
    <div className="panneau">
      <img src="../../src/assets/images/mail-reddot.svg"/>
      <h2>{hasMail ? "Vous avez du courrier en attente" : "Aucun courrier en attente"}</h2>
      <button onClick={() => setShowModal(true)}>Réceptionner</button>
      {hasMail && (
        <div className="modal">
          <p>Confirmer la réception du courrier</p>
          <button onClick={() => setHasMail(false)}>Annuler</button>
          <button onClick={() => alert("Courrier reçu")}>Valider</button>
        </div>
      )}
      </div>
    </>
  );
};

export default PanneauUser;