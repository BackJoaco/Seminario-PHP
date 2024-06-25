import React, { useState, useEffect } from 'react';
import HeaderComponent from "../../components/HeaderComponent";
import FooterComponent from "../../components/FooterComponent";
import NavBarComponent from "../../components/NavBarComponent";
import axios from "axios";
import { useParams } from 'react-router-dom';
const EditReserva = () => {
  const { id } = useParams();
  const [reserva, setReserva] = useState({
    propiedad_id: '',
    inquilino_id: '',
    fecha_desde: '',
    cantidad_noches: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [propiedades, setPropiedades] = useState([]);
  const [inquilinos, setInquilinos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch propiedades
        const propiedadesResponse = await axios.get('http://localhost/propiedades');
        setPropiedades(propiedadesResponse.data.data.map(propiedad => ({ value: propiedad.id, label: propiedad.domicilio })));

        // Fetch inquilinos
        const inquilinosResponse = await axios.get('http://localhost/inquilinos');
        setInquilinos(inquilinosResponse.data.data.map(inquilino => ({ value: inquilino.id, label: inquilino.nombre })));

        // If editing an existing reserva (id provided), fetch reserva details
        if (id) {
          const reservaResponse = await axios.get(`http://localhost/reservas/${id}`);
          setReserva(reservaResponse.data.data);
          console.log(reservaResponse);
        }
      } catch (error) {
        console.log(error);
      const errors = error.response?.data?.error;
      let errorMensaje = 'Ha ocurrido un error';
      if (errors) {
        errorMensaje = '';
        for (const key in errors) {
          if (errors.hasOwnProperty(key)) {
            errorMensaje += errors[key] + '. ';
          }
        }
      }
      console.log('Error message:', errorMensaje);
        const errorMessage = errorMensaje|| "Hubo un error al obtener los datos";
        setMessage(errorMessage.trim());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const apiUrl =  `http://localhost/reservas/${id}`;

    try {
      const axiosMethod = axios.put 
      const response = await axiosMethod(apiUrl, reserva);
      setMessage(response.data.actualizacion || "Reserva guardada con éxito");
    } catch (error) {
      console.log(error);
      const errors = error.response?.data?.error;
      let errorMensaje = 'Ha ocurrido un error';
      if (errors) {
        errorMensaje = '';
        for (const key in errors) {
          if (errors.hasOwnProperty(key)) {
            errorMensaje += errors[key] + '. ';
          }
        }
      }
      console.log('Error message:', errorMensaje);
        const errorMessage = errorMensaje|| "Hubo un error al guardar la reserva";
        setMessage(errorMessage.trim());
    }
  };

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    setReserva(prevReserva => ({
      ...prevReserva,
      [name]: type === 'number' ? parseInt(value) : value
    }));
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <HeaderComponent />
      <NavBarComponent />
      <div className="container">
        <h2> Editar Reserva </h2>
        {message && <div className="alert alert-info">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="propiedad_id">Propiedad</label>
            <select
              id="propiedad_id"
              name="propiedad_id"
              className="form-control"
              value={reserva.propiedad_id}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione...</option>
              {propiedades.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="inquilino_id">Inquilino</label>
            <select
              id="inquilino_id"
              name="inquilino_id"
              className="form-control"
              value={reserva.inquilino_id}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione...</option>
              {inquilinos.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="fecha_desde">Fecha Desde</label>
            <input
              type="date"
              id="fecha_desde"
              name="fecha_desde"
              className="form-control"
              value={reserva.fecha_desde}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cantidad_noches">Cantidad Noches</label>
            <input
              type="number"
              id="cantidad_noches"
              name="cantidad_noches"
              className="form-control"
              value={reserva.cantidad_noches}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Guardar Reserva</button>
        </form>
      </div>
      <FooterComponent />
    </div>
  );
};

export default EditReserva;
