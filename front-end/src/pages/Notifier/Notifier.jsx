import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../../pages/Notifier/notifier.css";
import { NavLink } from "react-router-dom";

// Composant Modal
const Modal = ({ show, setShowModal, handleEnvoi }) => {
  const [data, setData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState([
    "microsoft",
    "google",
    "meta",
    "amazon",
    "tesla",
    "space",
  ]);
  const [isLoading, setIsLoading] = useState(false); // État du chargement
  const handleClose = () => {
    setShowModal(false);
  };

  // Effet secondaire pour récupérer des données de l'API lors du montage
  useEffect(() => {
    fetch("/api/data")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  // Rendu JSX du composant Modal
  return (
    <div>
      <section className="modal-main">
        <div className="cadre">
          <h2>Vous vous apprêtez à notifier :</h2>
          {selectedCompany.map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
          <div className="container">
            <button className="close" onClick={handleClose}>
              Annuler
            </button>
            <button className="envoi" onClick={handleEnvoi}>
              Envoyer
            </button>
          </div>
        </div>
      </section>
      <NavLink to="/admin" onClick={handleClose}>
        Close
      </NavLink>
    </div>
  );
};
// Composant MyComponent
const MyComponent = ({ show }) => {
  // Rendu JSX du composant MyComponent
  return (
    <div>
      {show ? <p>Le composant est affiché</p> : <p>Le composant est masqué</p>}
    </div>
  );
};

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleEnvoi: PropTypes.func.isRequired,
};
// Export du composant Modal
export default Modal;
