import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Home from './pages/home/home.jsx'
import Navbar from './components/navbar/navbar.jsx';
import PanneauAdmin from "./pages/panneauAdmin/PanneauAdmin.jsx";
import Entreprises from './pages/Entreprise/Entreprises.jsx';
import PanneauUser from "./pages/panneauUser/PanneauUser.jsx";
import ModalNotifier from "./pages/Notifier/Notifier.jsx";
import Notification from "./components/notification/Notification.jsx";

// Importez vos autres composants ici
// let user = { companyName: 'entreprise 1' }
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<PanneauAdmin />} />
        <Route path="/user" element={<Notification />} />
        <Route path="/entreprises" element={<Entreprises />} />
        <Route path="/entreprises/:firm_name" element={<Entreprises />} />
        <Route path="/notifier" element={<ModalNotifier />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
