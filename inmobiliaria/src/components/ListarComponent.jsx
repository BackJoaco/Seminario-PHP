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

  const elementos = props.elementos;

  return (
    <div className="list-container">
      {elementos.map((elemento, index) => (
        <div className="list-item" key={index}>
          {Object.keys(elemento).map((key) => (
            <div key={key}><strong>{key}:</strong> {elemento[key]}</div>
          ))}
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
