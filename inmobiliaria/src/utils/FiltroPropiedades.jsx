import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FilterForm = ({ onFilterChange }) => {
  const [disponible, setDisponible] = useState(false);
  const [localidad_id, setLocalidad] = useState('');
  const [fecha_inicio_disponibilidad, setFechaInicio] = useState('');
  const [cantidad_huespedes, setCantidadHuespedes] = useState('');
  const [localidades, setLocalidades] = useState([]);

  useEffect(() => {
    // Fetch localidades from the server
    axios.get('http://localhost/localidades')
      .then(response => {
        setLocalidades(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching localidades:', error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    onFilterChange({ disponible, localidad_id, fecha_inicio_disponibilidad, cantidad_huespedes });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Disponible:
          <input
            type="checkbox"
            checked={disponible}
            onChange={(e) => setDisponible(e.target.checked)}
          />
        </label>
      </div>
      <div>
        <label>
          Localidad:
          <select value={localidad_id} onChange={(e) => setLocalidad(e.target.value)}>
            <option value="">Seleccione una localidad</option>
            {localidades.map((loc) => (
              <option key={loc.id} value={loc.id}>{loc.nombre}</option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Fecha de inicio:
          <input
            type="date"
            value={fecha_inicio_disponibilidad}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Cantidad de huéspedes:
          <input
            type="number"
            value={cantidad_huespedes}
            onChange={(e) => setCantidadHuespedes(e.target.value)}
          />
        </label>
      </div>
      <button type="submit">Aplicar Filtros</button>
    </form>
  );
};

export default FilterForm;
