import Valid from '../../assets/images/vector-valid.svg'
import Cross from '../../assets/images/vector-cross.svg'

const UserModal = ({onClose}) => {



    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {/* Contenu de la modal */}
                <p>Vous avez un nouveau courrier.</p>
                <button onClick={onClose}><img src={Valid} /></button>
                <button onClick={onClose}><img src={Cross} /></button>
            </div>
        </div>
    );
}
export default UserModal;