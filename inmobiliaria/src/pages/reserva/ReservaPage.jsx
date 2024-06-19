import React, { useEffect, useState } from "react";
import HeaderComponent from "../../components/HeaderComponent";
import FooterComponent from "../../components/FooterComponent";
import NavBarComponent from "../../components/NavBarComponent";
import ListarComponent from "../../components/ListarComponent";
import axios from "axios";
const ReservaPage = () => {
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
  const elementos=reservas.map(reserva=>({domicilio:reserva.Domicilio,apellido:reserva.Apellido,nombre:reserva.Nombre,fecha_desde:reserva.fecha_desde,cantidad_noches:reserva.cantidad_noches,valor_total:reserva.valor_total}));
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

export default ReservaPage;