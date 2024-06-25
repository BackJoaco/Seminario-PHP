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
  const elementos=reservas.map(reserva=>({id:reserva.id,domicilio:reserva.Domicilio,apellido:reserva.Apellido,nombre:reserva.Nombre,fecha_desde:reserva.fecha_desde,cantidad_noches:reserva.cantidad_noches,valor_total:reserva.valor_total}));
  return (
    <div>
    <HeaderComponent />
      <NavBarComponent />
      <div className="main-content">
        <button onClick={navigateToNewReserva} className="boton">Crear Nueva Reserva</button>
        <ListarComponent 
          elementos={elementos}
          linkEdit="/reserva/editReserva"
          linkDelete="http://localhost/reservas"
          setElementos={setReservas} 
        />
      </div>
      <FooterComponent />
    </div>
  );
};

export default ReservaPage;