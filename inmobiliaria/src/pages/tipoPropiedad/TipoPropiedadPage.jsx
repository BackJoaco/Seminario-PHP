import React, { useEffect, useState } from "react";
import HeaderComponent from "../../components/HeaderComponent";
import FooterComponent from "../../components/FooterComponent";
import NavBarComponent from "../../components/NavBarComponent";
import ListarComponent from "../../components/ListarComponent";
import axios from "axios";
import "../../assets/styles/TipoPropiedadPage.css";
import { useNavigate } from 'react-router-dom';

const TipoPropiedadPage = () => {
  const [tipoPropiedades, setTipoPropiedades] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost/tipos_propiedad')
      .then(response => {
        setTipoPropiedades(response.data.data);
      })
      .catch(error => {
        console.error('Error Fetching', error);
      });
  }, []);

  const navigateToNewTipoPropiedad = () => {
    navigate('/tipos_propiedad/newTiposPropiedad');
  };

  return (
    <div>
      <HeaderComponent />
      <NavBarComponent />
      <div className="main-content">
        <button onClick={navigateToNewTipoPropiedad} className="boton">
            Crear Nuevo Tipo Propiedad
          </button>
          <ListarComponent
            elementos={tipoPropiedades}
            linkEdit="/tipos_propiedad/editTiposPropiedad"
            linkDelete="http://localhost/tipos_propiedad"
            setElementos={setTipoPropiedades} // Pasar setElementos como prop
          />
      </div>
      <FooterComponent />
    </div>
  );
};

export default TipoPropiedadPage;