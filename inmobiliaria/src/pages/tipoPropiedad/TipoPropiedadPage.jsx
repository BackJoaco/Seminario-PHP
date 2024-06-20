import React, { useEffect, useState } from "react";
import HeaderComponent from "../../components/HeaderComponent";
import FooterComponent from "../../components/FooterComponent";
import NavBarComponent from "../../components/NavBarComponent";
import ListarComponent from "../../components/ListarComponent";
import axios from "axios";
import "../../assets/styles/TipoPropiedadPage.css";
import { useNavigate } from 'react-router-dom';
const TipoPropiedadPage= () => {
  const [tipoPropiedades, setTipoPropiedades] = useState([]);
  const navigate = useNavigate();

  const navigateToNewTipoPropiedad = () => {
    navigate('/tipos_Propiedad/newTipos_propiedad');
  };
  useEffect(() => {
    axios.get('http://localhost/tipos_propiedad')
      .then(response => {
        setTipoPropiedades(response.data.data);
      })
      .catch(error => {
        console.error('Error Fetching', error);
      });
  }, []);
  let linkEdit="/tipos_propiedad/newTipos_propiedad";
  const elementos=tipoPropiedades.map(tipoPropiedad=>({nombre:tipoPropiedad.nombre}));
  return (
    <div>
      <HeaderComponent />
      <NavBarComponent />
      <div className="main-content">
        <ListarComponent elementos={elementos} linkEdit={linkEdit} />
        <button onClick={navigateToNewTipoPropiedad} className="boton">
          Crear Nuevo Tipo Propiedad
        </button>
      </div>
      <FooterComponent />
    </div>

  );
};

export default TipoPropiedadPage;