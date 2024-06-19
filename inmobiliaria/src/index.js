import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import PropiedadPage from './pages/propiedad/PropiedadPage';
import TipoPropiedadPage from './pages/tipoPropiedad/TipoPropiedadPage';
import ReservaPage from './pages/reserva/ReservaPage';
import NewTipoPropiedad from './pages/tipoPropiedad/NewTipoPropiedad';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/propiedad" element={<PropiedadPage />} />
        <Route path="/tipos_propiedad" element={<TipoPropiedadPage/>}/>
        <Route path="/reservas" element={<ReservaPage/>}/>
        <Route path="/tipos_propiedad/newTipos_propiedad" element={<NewTipoPropiedad/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
