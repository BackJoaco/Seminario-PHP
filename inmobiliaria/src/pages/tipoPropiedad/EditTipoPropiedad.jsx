import React, { useState, useEffect } from 'react';
import HeaderComponent from "../../components/HeaderComponent";
import FooterComponent from "../../components/FooterComponent";
import NavBarComponent from "../../components/NavBarComponent";
import { useParams } from 'react-router-dom';
import axios from "axios";
import "../../assets/styles/EditTipoPropiedad.css";

const EditTipoPropiedad = () => {
  const { id } = useParams();
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost/tipos_propiedad')
    .then(response => {
      const tipoPropiedad = response.data.data.find(item => item.id === parseInt(id));
      if (tipoPropiedad) {
        setNombre(tipoPropiedad.nombre);
      } else {
        setMessage("Tipo propiedad no encontrado");
      }
      setLoading(false);
    })
    .catch(error => {
      setMessage(error.response?.data?.message || "Hubo un error al obtener los datos");
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.put(`http://localhost/tipos_propiedad/${id}`, { nombre })
      .then(response => {
        setMessage(response.data.message || "Tipo propiedad actualizada con éxito");
      })
      .catch(error => {
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
        setMessage(errorMessage.trim()||"Hubo un error al actualizar los datos" );
      });
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <HeaderComponent />
      <NavBarComponent />
      <div className="container">
        <h2>Editar Tipo Propiedad</h2>
        {message && <div className="alert alert-info">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Guardar Cambios</button>
        </form>
      </div>
      <FooterComponent />
    </div>
  );
}

export default EditTipoPropiedad;
