import React, { useEffect, useState } from "react";
import HeaderComponent from "../../components/HeaderComponent";
import FooterComponent from "../../components/FooterComponent";
import NavBarComponent from "../../components/NavBarComponent";
import ListarComponent from "../../components/ListarComponent";
import axios from "axios";
import "../../assets/styles/ListarComponent.css";
import "../../assets/styles/PropiedadPage.css";
import { useNavigate } from 'react-router-dom';
const PropiedadPage = () => {
  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  {/*const buscarPropiedades=(filtro)=>{
    const url = 'http://localhost/propiedades';
    axios.get(url, { params: filtro })*/}
    useEffect(()=>{
    axios.get('http://localhost/propiedades')
      .then(response => {
        setPropiedades(response.data.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error Fetching', error);
        setLoading(false);
      });
  }, []);
  const navigateToNewPropiedad = () => {
    navigate('/propiedades/newPropiedad');
  };
  let esProp=true;
  const elementos=propiedades.map(propiedad=>({id:propiedad.id,domicilio:propiedad.domicilio,ciudad:propiedad.ciudad,tipoPropiedad:propiedad.tipoPropiedad,fecha_inicio_disponibilidad:propiedad.fecha_inicio_disponibilidad,cantidad_huespedes:propiedad.cantidad_huespedes,valor_noche:propiedad.valor_noche}));
  return (
    <div>
    <HeaderComponent />
      <NavBarComponent />
      <div className="main-content">
      <button onClick={navigateToNewPropiedad} className="boton">
          Crear Propiedad
        </button>
       {/* <FiltroPropiedades onFilterChange={buscarPropiedades} />
        {loading ? (
        <div>Cargando propiedades...</div>
      ) :(*/}
        <ListarComponent
          elementos={elementos} esProp={esProp}
          linkEdit="/propiedad/editPropiedad"
          linkDelete="http://localhost/propiedades"
          setElementos={setPropiedades}
        />
      </div>
      <FooterComponent />
    </div>
  );
};

export default PropiedadPage;
