import React, { useEffect, useState } from "react";
import HeaderComponent from "../../components/HeaderComponent";
import FooterComponent from "../../components/FooterComponent";
import NavBarComponent from "../../components/NavBarComponent";
import ListarComponent from "../../components/ListarComponent";
import axios from "axios";
import "../../assets/styles/ListarComponent.css";
const PropiedadPage = () => {
  const [propiedades, setPropiedades] = useState([]);
  useEffect(() => {
    axios.get('http://localhost/propiedades')
      .then(response => {
        setPropiedades(response.data.data);
      })
      .catch(error => {
        console.error('Error Fetching', error);
      });
  }, []);
  const elementos=propiedades.map(propiedad=>({domicilio:propiedad.domicilio,ciudad:propiedad.ciudad,tipoPropiedad:propiedad.tipoPropiedad,fecha_inicio_disponibilidad:propiedad.fecha_inicio_disponibilidad,cantidad_huespedes:propiedad.cantidad_huespedes,valor_noche:propiedad.valor_noche}));
  return (
    <div>
    <HeaderComponent />
      <NavBarComponent />
      <div>
        <ListarComponent elementos={elementos}/>
      </div>
      <FooterComponent />
    </div>
  );
};

export default PropiedadPage;
