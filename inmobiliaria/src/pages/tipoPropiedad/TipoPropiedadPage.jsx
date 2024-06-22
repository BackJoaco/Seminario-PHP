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

  const handleDeleteElemento = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este tipo de propiedad?");
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await axios.delete(`http://localhost/tipos_propiedad/${id}`);
      if (response.status === 204) {
        setTipoPropiedades(prevTipos => prevTipos.filter(tipo => tipo.id !== id));
      } else {
        console.error('Error en la respuesta DELETE:', response);
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  return (
    <div>
      <HeaderComponent />
      <NavBarComponent />
      <div className="main-content">
        <ListarComponent
          elementos={tipoPropiedades}
          linkEdit="/tipos_propiedad/editTiposPropiedad"
          setElementos={setTipoPropiedades} // Pasar setElementos como prop
          handleDelete={handleDeleteElemento} // Pasar la función de eliminar como prop
        />
        <button onClick={navigateToNewTipoPropiedad} className="boton">
          Crear Nuevo Tipo Propiedad
        </button>
      </div>
      <FooterComponent />
    </div>
  );
};

export default TipoPropiedadPage;