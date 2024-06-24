import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderComponent from "../../components/HeaderComponent";
import FooterComponent from "../../components/FooterComponent";
import NavBarComponent from "../../components/NavBarComponent";

const EditTipoPropiedad = () => {
  const { id } = useParams(); // Obtener el id del tipo de propiedad a editar desde la URL
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setNombre(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!nombre) {
      setMensaje('El nombre no puede estar vacío');
      return;
    }
    try {
      console.log(id);
      const response = await axios.put(`http://localhost/tipos_propiedad/${id}`, { nombre });
      setMensaje(`Tipo de propiedad actualizado correctamente: ${response.data?.status} ${response.data?.Actualizado} ${response.data?.code}`);
      navigate('/tipos_propiedad'); // Redirigir después de la actualización exitosa
    } catch (error) {
      console.error('Error actualizando el tipo de propiedad:', error);
      const errors = error.response?.data?.error;
      let errorMessage = 'Ha ocurrido un error';
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

  return (
    <div>
      <HeaderComponent />
      <NavBarComponent />
      <div className='formulario'>
        <h1>Editar Tipo de Propiedad</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit">Actualizar</button>
        </form>
        {mensaje && <p className="mensaje">{mensaje}</p>}
      </div>
      <FooterComponent />
    </div>
  );
};

export default EditTipoPropiedad;
