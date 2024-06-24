import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import DeleteButton from './DeleteButton'; // Asegúrate de ajustar la ruta según la ubicación del archivo
import "../assets/styles/ListarComponent.css";

const ListarComponent = (props) => {
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState('');

  const navigateToEditTipoPropiedad = () => {
    navigate(props.linkEdit);
  };
  const navigateToDetailPropiedad =(id) =>{
    navigate(`/propiedades/detailPropiedad/${id}`); //Detalle Propiedad
  };
  const elementos = props.elementos;
  const esProp=props.esProp;
  return (
    <div className="list-container">
      {elementos.map((elemento, index) => (
        <div className="list-item" key={index}>
          {Object.keys(elemento).map((key) => (
            key !== "id" && (
              <div key={key}>
                <strong>{key}:</strong> {elemento[key]}
              </div>
            )
          ))} 
          {esProp && <button onClick={()=> navigateToDetailPropiedad(elemento.id)}> Ver Propiedad en Detalle</button>}
          <button onClick={() => navigateToEditTipoPropiedad()}>Editar</button>
          <DeleteButton
            endpoint="http://localhost/tipos_propiedad"
            id={elemento.id}
            setMensaje={setMensaje}
            setElementos={props.setElementos}
          />
        </div>
      ))}
      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  );
};

export default ListarComponent;
