import React, { useEffect, useState } from "react";
import HeaderComponent from "../../components/HeaderComponent";
import FooterComponent from "../../components/FooterComponent";
import NavBarComponent from "../../components/NavBarComponent";
import ListarComponent from "../../components/ListarComponent";
import "../../assets/styles/TipoPropiedadPage.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
const ReservaPage = () => {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  useEffect(() => {
    axios.get('http://localhost/reservas')
      .then(response => {
        setReservas(response.data.data);
      })
      .catch(error => {
        console.error('Error Fetching', error);
      });
  }, []);
  const navigateToNewReserva = () => {
    navigate('/reservas/newReserva');
  };
  const elementos=reservas.map(reserva=>({domicilio:reserva.Domicilio,apellido:reserva.Apellido,nombre:reserva.Nombre,fecha_desde:reserva.fecha_desde,cantidad_noches:reserva.cantidad_noches,valor_total:reserva.valor_total}));
  return (
    <div>
    <HeaderComponent />
      <NavBarComponent />
      <div className="main-content">
        <boton onClick={navigateToNewReserva} className="boton">Crear Nueva Reserva</boton>
        <ListarComponent elementos={elementos}/>
      </div>
      <FooterComponent />
    </div>
  );
};

export default ReservaPage;