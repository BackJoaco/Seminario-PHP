import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import ListarComponent from '../../components/ListarComponent';
import FiltroPropiedades from '../../utils/FiltroPropiedades';
import HeaderComponent from '../../components/HeaderComponent';
import NavBarComponent from '../../components/NavBarComponent';
import { useNavigate } from 'react-router-dom';
import FooterComponent from '../../components/FooterComponent';

const PropiedadPage = () => {
  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    disponible: '',
    localidad_id: '',
    fecha_inicio_disponibilidad: '',
    cantidad_huespedes: ''
  });
  const navigate = useNavigate();

  const fetchPropiedades = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      const activeFilters = Object.keys(filters).reduce((acc, key) => {
        if (filters[key] !== '') {
          acc[key] = filters[key];
        }
        return acc;
      }, {});

      if (Object.keys(activeFilters).length > 0) {
        const queryString = new URLSearchParams(activeFilters).toString();
        response = await axios.get(`http://localhost/propiedades?${queryString}`);
      } else {
        response = await axios.get('http://localhost/propiedades');
      }

      setPropiedades(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching propiedades:', error);
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPropiedades();
  }, [fetchPropiedades]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const navigateToNewPropiedad = () => {
    navigate('/propiedades/newPropiedad');
  };

  const elementos = propiedades.map(propiedad => ({
    id: propiedad.id,
    domicilio: propiedad.domicilio,
    ciudad: propiedad.ciudad,
    tipoPropiedad: propiedad.tipoPropiedad,
    fecha_inicio_disponibilidad: propiedad.fecha_inicio_disponibilidad,
    cantidad_huespedes: propiedad.cantidad_huespedes,
    valor_noche: propiedad.valor_noche
  }));

  const esProp = true;

  return (
    <div>
      <HeaderComponent />
      <NavBarComponent />
      <main className="main-content">
        <button onClick={navigateToNewPropiedad} className="boton">
          Crear Propiedad
        </button>
        <FiltroPropiedades onFilterChange={handleFilterChange} />
        {loading ? (
          <div>Cargando propiedades...</div>
        ) : (
          <ListarComponent 
            elementos={elementos} 
            esProp={esProp}
            linkEdit="/propiedad/editPropiedad"
            linkDelete="http://localhost/propiedades"
            setElementos={setPropiedades}
          />
        )}
      </main>
      <FooterComponent />
    </div>
  );
};

export default PropiedadPage;
