import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TiArrowLeftThick } from "react-icons/ti";
import "../Entreprise/entreprise.css";

import { ImArrowLeft2 } from "react-icons/im";
import getUser from "../../requests/get_user.js";
import createUser from "../../requests/create_user.js";
import deleteUser from "../../requests/delete_user.js";
import updateUser from "../../requests/update_user.js";

const Entreprises = () => {
  const navigate = useNavigate();
  const [user, set_user] = useState(undefined);
  const [firmName, setFirmName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const param_firm_name = useParams().firm_name;

  useEffect(
    () => {
      if (param_firm_name != undefined) {
        getUser(param_firm_name).then((user) => {
          if (user == null) {
            navigate("/");
          } else {
            set_user(user);
            setFirmName(user.firm_name);
            setFirstName(user.first_name);
            setLastName(user.last_name);
            setPhoneNumber(user.phone_number);
            setEmail(user.email);
            setIsAdmin(user.is_admin);
          }
        })
      }
    },
    []
  );

  const onClickFinish = e => {
    e.preventDefault();

    if (user == undefined) {
      createUser(
        firmName,
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        isAdmin
      ).then(() => navigate("/admin"));
    } else {
      updateUser(
        user.firm_name,
        {
          first_name: firstName == user.first_name ? undefined : firstName,
          last_name: lastName == user.last_name ? undefined : lastName,
          email: email == user.email ? undefined : email,
          phone_number: phoneNumber == user.phone_number ? undefined : phoneNumber,
          password: password == "" ? undefined : password,
          is_admin: isAdmin == user.is_admin ? undefined : isAdmin,
        }
      ).then(() => navigate("/admin"))
    }
  };

  const onClickDelete = e => {
    e.preventDefault();

    deleteUser(
      user.firm_name
    ).then(() => navigate("/admin"));
  };

  return (
    <>
      <header className="home_header">
        <img
          className="home_logo"
          src="../../src/assets/images/logo-home.svg"
          alt="Logo"
        />
      </header>
      <div className="retour">
        <a href="/admin"><ImArrowLeft2 id="retour-icon" /></a>


        <h2 className="entreprise-title">Entreprise</h2>
      </div>
      <div className="cardEntreprise">
        <div className="entreprises">
          <form id="form">
            <div className="formulaire">
              <label>Entreprise :</label>
              <input
                type="text"
                name="entreprise"
                value={firmName}
                onChange={e => setFirmName(e.target.value)}
                placeholder="*********"
                disabled={user != undefined}
              />
            </div>
            <div className="formulaire">
              <label>Contact :</label>
              <div className="formulaireContact">
                <input
                  type="text"
                  name="last_name"
                  placeholder="Nom"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                />
                <input
                  type="text"
                  name="first_name"
                  placeholder="Prenom"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                />
              </div>
            </div>

            <div className="formulaire">
              <label>Téléphone :</label>
              <input
                type="text"
                name="phone_number"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="+33***********"
              />
            </div>

            <div className="formulaire">
              <label>Email :</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="*********"
              />
            </div>

            <div className="formulaire">
              <label>Identifiant :</label>
              <input
                type="text"
                name="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="****"
              />
            </div>

            <div className="formulaire">
              <label>
                Admin :
                <input
                  id="checkbox"
                  type="checkbox"
                  name="is_admin"
                  checked={isAdmin}
                  onChange={e => setIsAdmin(e.target.checked)}
                />
              </label>
            </div>

            <div className="button">
              <button style={{ border: "unset !important" }} id="terminer" onClick={onClickFinish}>
                Terminer
              </button>
              <button id="supprimer" type="button" onClick={onClickDelete}>
                Supprimer
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Entreprises;
