{/*import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FiltroPropiedades = ({ onFilterChange }) => {
  const [localidades, setLocalidades] = useState([]);
  const [filtro, setFiltro] = useState({
    disponible: false,
    localidad: '',
    fechaInicio: '',
    cantidadHuespedes: 1,
  });

  useEffect(() => {
     axios.get('http://localhost/localidades')
      .then(response => {
        setLocalidades(response.data.data);
      })
      .catch(error => {
       console.error('Error fetching localidades:', error);
      });
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFiltro(prevFiltro => ({
      ...prevFiltro,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onFilterChange(filtro);
  };

  return (
    <div className="filter-properties">
      <h2>Filtrar Propiedades</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Disponible:
            <input
              type="checkbox"
              name="disponible"
              checked={filtro.disponible}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Localidad:
            <select
              name="localidad"
              value={filtro.localidad}
              onChange={handleChange}
            >
              <option value="">Seleccionar Localidad</option>
              {/*{Object.keys(localidades).map((key) => (
                <option key={localidad.id} value={localidad.nombre}></option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Fecha de inicio:
            <input
              type="date"
              name="fechaInicio"
              value={filtro.fechaInicio}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Cantidad de huéspedes:
            <input
              type="number"
              name="cantidadHuespedes"
              value={filtro.cantidadHuespedes}
              onChange={handleChange}
              min="1"
            />
          </label>
        </div>
        <button type="submit">Aplicar</button>
      </form>
    </div>
  );
};

export default FiltroPropiedades;
*/}