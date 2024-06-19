import React, { useState } from 'react';
import axios from 'axios';
import "../../assets/styles/NewTipoPropiedad.css";
import HeaderComponent from "../../components/HeaderComponent";
import FooterComponent from "../../components/FooterComponent";
import NavBarComponent from "../../components/NavBarComponent";

const NewTipoPropiedad = () => {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');

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
      const response = await axios.post('http://localhost/tipos_propiedad', { nombre });
      setMensaje(`Nuevo tipo de propiedad creado: ${response.data?.status} ${response.data?.Registrado} ${response.data?.code}`);
      console.log(response);
    } catch (error) {
      console.log(error);
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
      console.log('Error message:', errorMessage);
      setMensaje(errorMessage.trim());
      
    }
    alert(mensaje);
  };

  return (
    <div>
      <HeaderComponent />
      <NavBarComponent />
      <div className='formulario'>
        <h1>Crear Nuevo Tipo de Propiedad</h1>
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
          <button type="submit">Crear</button>
        </form>
        {alert}
        {/*{mensaje && <p className="error">{mensaje}</p>}*/}
      </div>
      <FooterComponent />
    </div>
  );
};

export default NewTipoPropiedad;

