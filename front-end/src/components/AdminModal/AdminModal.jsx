import { useState } from 'react';
import PanneauAdmin from '../../pages/panneauAdmin/PanneauAdmin.jsx';
import ModalNotifier from '../../pages/Notifier/Notifier.jsx';

const ParentComponent = () => {
  const [showModal, setShowModal] = useState(false);

  const handleBiMailSendClick = () => {
    setShowModal(true);
  };

  return (
    <>
      <ModalNotifier show={showModal} />
      <PanneauAdmin handleBiMailSendClick={handleBiMailSendClick} />
    </>
  );
};

export default ParentComponent;