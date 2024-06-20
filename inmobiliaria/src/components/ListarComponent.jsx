import React from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "../assets/styles/ListarComponent.css";

const ListarComponent = (props) => {
  const navigate = useNavigate();
  const [mensaje, setMensaje] = React.useState('');

  const navigateToNewTipoPropiedad = () => {
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
        // Aquí podrías actualizar la lista de elementos si es necesario
        props.setElementos(prevElementos => prevElementos.filter(elemento => elemento.id !== id));
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      const errors = error.response?.data?.errors;
      let errorMessage = 'Ha ocurrido un error al eliminar.';
      if (errors) {
        errorMessage = '';
        for (const key in errors) {
          if (errors.hasOwnProperty(key)) {
            errorMessage += errors[key] + '. ';
          }
        }
      }
      setMensaje(errorMessage.trim());
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
          <button onClick={navigateToNewTipoPropiedad}>Editar</button>
          <button onClick={() => handleDelete(elemento.id)}>Eliminar</button>
        </div>
      ))}
      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  );
};

export default ListarComponent;
