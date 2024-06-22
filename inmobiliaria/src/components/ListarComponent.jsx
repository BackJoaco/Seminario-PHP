import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "../assets/styles/ListarComponent.css";

const ListarComponent = (props) => {
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState('');

  const navigateToEditTipoPropiedad = (elemento) => {
    navigate(props.linkEdit);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este tipo de propiedad?");
    if (!confirmDelete) {
      return;
    }
    try {
      const response = await axios.delete(`http://localhost/tipos_propiedad/${id}`);
      if (response.status === 204) {
        setMensaje('Tipo de propiedad eliminado correctamente.');
        props.setElementos(prevElementos => prevElementos.filter(elemento => elemento.id !== id));
      } else {
        console.error('Error en la respuesta DELETE:', response);
        setMensaje('Ha ocurrido un error al eliminar. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      setMensaje('Ha ocurrido un error al eliminar. Por favor, inténtalo de nuevo.');
    }
  };

  const elementos = props.elementos;

  return (
    <div className="list-container">
      {elementos.map((elemento, index) => (
        <div className="list-item" key={index}>
          {Object.keys(elemento).map((key) => (
            <div key={key}><strong>{key}:</strong> {elemento[key]}</div>
          ))}
          <button onClick={() => navigateToEditTipoPropiedad(elemento)}>Editar</button>
          <button onClick={() => handleDelete(elemento.id)}>Eliminar</button>
        </div>
      ))}
      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  );
};

export default ListarComponent;