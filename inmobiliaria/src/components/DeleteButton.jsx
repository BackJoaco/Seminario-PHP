import React from 'react';
import axios from 'axios';

const DeleteButton = ({ endpoint, id, setMensaje, setElementos }) => {
  const handleDelete = async () => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este elemento?");
    if (!confirmDelete) {
      return;
    }
    try {
      console.log({endpoint});
      const response = await axios.delete(`${endpoint}/${id}`);
      if (response.status === 204) {
        
        setMensaje('Elemento eliminado correctamente.');
        setElementos(prevElementos => prevElementos.filter(elemento => elemento.id !== id));
      } else {
        console.error('Error en la respuesta DELETE:', response);
        setMensaje(response?.data?.error ||'Ha ocurrido un error al eliminar. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      const errors = error.response?.data?.error;
      let errorMessage = 'Ha ocurrido un error';
      if (errors) {
        errorMessage = 'Error: ';
        for (const key in errors) {
          if (errors.hasOwnProperty(key)) {
            errorMessage += errors[key] + '. ';
          }
        }
      }
      console.log('Error message:', errorMessage);
      setMensaje(errorMessage.trim());
    }
  };

  return (
    <button onClick={handleDelete}>
      Eliminar
    </button>
  );
};

export default DeleteButton;
