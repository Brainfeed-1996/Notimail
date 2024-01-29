import { createRef, useState, useEffect } from 'react'; //Importe le hook useState
import { useNavigate } from 'react-router-dom';
import "./panneauAdmin.css"
import { FaSearch } from 'react-icons/fa';
import { IoMdAddCircle } from "react-icons/io";
import { BiMailSend } from "react-icons/bi";
import { Link } from 'react-router-dom';
import { Card } from '../../components/Card/Card';
import SendMailsModal from "../../components/SendMailsModal/SendMailsModal.jsx";
import listUsers from '../../requests/list_users.js';
import getUser from "../../requests/get_user.js";

const PanneauAdmin = () => {
  const navigate = useNavigate();

  const sendMailsModal = createRef();

  // Liste d'utilisateur tel que retourner par getUser plus le champ unstaged_has_mail
  const [users, setUsers] = useState([])
  // Liste d'index dans le state users
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [modifiedUsers, setModifiedUsers] = useState([]);

  // Utilise le hook useEffect pour effectuer une action après le rendu initial du composant
  useEffect(() => {
    // Effectue une requête GET pour récupérer les recettes depuis l'API
    listUsers()
      .then(firm_names => {
        if (firm_names == null) {
          return;
        }

        return Promise.all(firm_names.map(async (firm_name) => {
          let user = await getUser(firm_name);
          if (user == null) {
            navigate("/");
            return;
          }
          return {
            unstaged_has_mail: user.has_mail,
            ...user
          };
        }));
      })
      .then((users) => {
        setUsers(users);
        setFilteredUsers(Array.from(users.keys()))
      })
      .catch(error => {
        console.error(error);
      })
  }, []);

  const handleSearch = (e) => {
    const filters = e.target.value.split(/[\s,;.:]+/);

    setFilteredUsers(Array.from(users.keys()).filter(i => {
      let user = users[i];

      return filters.every(filter => {
        return [
          user.firm_name,
          user.first_name,
          user.last_name,
          user.email,
          user.phone_number
        ]
          .some(e => e.includes(filter));
      });
    }));
  }

  return (
    <>
      <div className="bandeau">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher"
            className="text-input"
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="cards">
        {filteredUsers.map(i => <Card
          key={users[i].firm_name}
          set_users={setUsers}
          users={users}
          set_modified_users={setModifiedUsers}
          user={users[i]}
        />)}
      </div>

      <footer>
        <div className="logos-footer">
          <Link to="/entreprises">
            <IoMdAddCircle className="icon-style" />
          </Link>
          <button
            onClick={e => {
              if (e.button == 0) {
                sendMailsModal.current.showModal();
              }
            }}
            disabled={modifiedUsers.length == 0}
          >
            <BiMailSend
              className="icon-style"
            />
          </button>
          <SendMailsModal
            modifiedUsers={modifiedUsers}
            setModifiedUsers={setModifiedUsers}
            setUsers={setUsers}
            dialogRef={sendMailsModal} />
        </div>
      </footer>
    </>
  );
};

export default PanneauAdmin;
