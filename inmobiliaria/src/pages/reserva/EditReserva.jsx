import React, { useState, useEffect } from 'react';
import HeaderComponent from "../../components/HeaderComponent";
import FooterComponent from "../../components/FooterComponent";
import NavBarComponent from "../../components/NavBarComponent";
import axios from "axios";


const EditReserva = ({ id }) => {
  const [reserva, setReserva] = useState({
    propiedad_id: '',
    inquilino_id: '',
    fecha_desde: '',
    cantidad_noches: 0
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [propiedades, setPropiedades] = useState([]);
  const [inquilinos, setInquilinos] = useState([]);

  useEffect(() => {
    // Fetch propiedades
    axios.get('http://localhost/propiedades')
      .then(response => {
        setPropiedades(response.data.data.map(propiedad => ({ value: propiedad.id, label: propiedad.domicilio })));
      })
      .catch(error => {
        console.error('Error Fetching Propiedades', error);
      });

    // Fetch inquilinos
    axios.get('http://localhost/inquilinos')
      .then(response => {
        setInquilinos(response.data.data.map(inquilino => ({ value: inquilino.id, label: inquilino.nombre })));
      })
      .catch(error => {
        console.error('Error Fetching Inquilinos', error);
      });

    // If editing an existing reserva (id provided), fetch reserva details
    if (id) {
      axios.get(`http://localhost/reservas/${id}`)
        .then(response => {
          setReserva(response.data);
          setLoading(false);
        })
        .catch(error => {
          setMessage(error.response?.data?.message || "Hubo un error al obtener los datos de la reserva");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const apiUrl = id ? `http://localhost/reservas/${id}` : 'http://localhost/reservas'; // Determine API URL based on whether ID is present

    const axiosMethod = id ? axios.put : axios.post; // Use PUT for update, POST for create

    axiosMethod(apiUrl, reserva)
      .then(response => {
        setMessage(response.data.actualizacion || "Reserva guardada con éxito");
      })
      .catch(error => {
        setMessage(error.response?.data?.error || "Hubo un error al guardar la reserva");
      });
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
        <h2>{id ? 'Editar Reserva' : 'Crear Nueva Reserva'}</h2>
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
}

export default EditReserva;
