import React, { useState, useEffect } from 'react';
import HeaderComponent from "../../components/HeaderComponent";
import FooterComponent from "../../components/FooterComponent";
import NavBarComponent from "../../components/NavBarComponent";
import { useParams } from 'react-router-dom';
import axios from "axios";


const EditPropiedad = () => {
  const { id } = useParams();
  const [propiedad, setPropiedad] = useState({
    domicilio: '',
    localidad_id: '',
    cantidad_habitaciones: 0,
    cantidad_banios: 0,
    cochera: false,
    cantidad_huespedes: 0,
    fecha_inicio_disponibilidad: '',
    cantidad_dias: 0,
    disponible: false,
    valor_noche: 0,
    tipo_propiedad_id: '',
    imagen: null,
    tipo_imagen: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [localidades, setLocalidades] = useState([]);
  const [tipoPropiedades, setTipoPropiedades] = useState([]);

  // Definición de camposPropiedad para este componente EditPropiedad
  const camposPropiedad = [
    { name: 'domicilio', label: 'Domicilio', type: 'text' },
    { name: 'localidad_id', label: 'Localidad', type: 'select', options: localidades },
    { name: 'cantidad_habitaciones', label: 'Cantidad Habitaciones', type: 'number' },
    { name: 'cantidad_banios', label: 'Cantidad Baños', type: 'number' },
    { name: 'cochera', label: 'Cochera', type: 'checkbox' },
    { name: 'cantidad_huespedes', label: 'Cantidad Huespedes', type: 'number' },
    { name: 'fecha_inicio_disponibilidad', label: 'Fecha Inicio Disponibilidad', type: 'date' },
    { name: 'cantidad_dias', label: 'Cantidad Dias', type: 'number' },
    { name: 'disponible', label: 'Disponible', type: 'checkbox' },
    { name: 'valor_noche', label: 'Valor Noche', type: 'number' },
    { name: 'tipo_propiedad_id', label: 'Tipo de Propiedad', type: 'select', options: tipoPropiedades },
    { name: 'imagen', label: 'Imagen', type: 'file' },
    { name: 'tipo_imagen', label: 'Tipo Imagen', type: 'text' }
  ];

  useEffect(() => {
    // Fetch propiedad details
    axios.get(`http://localhost/propiedades/${id}`)
      .then(response => {
        setPropiedad(response.data);
        setLoading(false);
      })
      .catch(error => {
        setMessage(error.response?.data?.message || "Hubo un error al obtener los datos de la propiedad");
        setLoading(false);
      });

    // Fetch localidades
    axios.get('http://localhost/localidades')
      .then(response => {
        setLocalidades(response.data.data.map(localidad => ({ value: localidad.id, label: localidad.nombre })));
      })
      .catch(error => {
        console.error('Error Fetching Localidades', error);
      });

    // Fetch tipos de propiedad
    axios.get('http://localhost/tipos_propiedad')
      .then(response => {
        setTipoPropiedades(response.data.data.map(tipo => ({ value: tipo.id, label: tipo.nombre })));
      })
      .catch(error => {
        console.error('Error Fetching Tipos de Propiedad', error);
      });
  }, [id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.put(`http://localhost/propiedades/${id}`, propiedad)
      .then(response => {
        setMessage(response.data.message || "Propiedad actualizada con éxito");
      })
      .catch(error => {
        setMessage(error.response?.data?.message || "Hubo un error al actualizar la propiedad");
      });
  };

  const handleChange = (event) => {
    const { name, value, type, checked, files } = event.target;
    const newValue = type === 'checkbox' ? checked : type === 'file' ? files[0] : value;
    setPropiedad(prevPropiedad => ({
      ...prevPropiedad,
      [name]: newValue
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
        <h2>Editar Propiedad</h2>
        {message && <div className="alert alert-info">{message}</div>}
        <form onSubmit={handleSubmit}>
          {camposPropiedad.map((campo, index) => (
            <div key={index} className="form-group">
              <label htmlFor={campo.name}>{campo.label}</label>
              {campo.type === 'select' ?
                <select
                  id={campo.name}
                  name={campo.name}
                  className="form-control"
                  value={propiedad[campo.name]}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  {campo.name === 'localidad_id' ?
                    localidades.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    )) :
                    tipoPropiedades.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))
                  }
                </select>
                :
                campo.type === 'checkbox' ?
                  <input
                    type="checkbox"
                    id={campo.name}
                    name={campo.name}
                    checked={propiedad[campo.name]}
                    onChange={handleChange}
                  />
                  :
                  campo.type === 'file' ?
                    <input
                      type="file"
                      id={campo.name}
                      name={campo.name}
                      onChange={handleChange}
                    />
                    :
                    <input
                      type={campo.type}
                      id={campo.name}
                      name={campo.name}
                      className="form-control"
                      value={propiedad[campo.name]}
                      onChange={handleChange}
                      required={campo.type !== 'file'}
                    />
              }
            </div>
          ))}
          <button type="submit" className="btn btn-primary">Guardar Cambios</button>
        </form>
      </div>
      <FooterComponent />
    </div>
  );
}

export default EditPropiedad;
