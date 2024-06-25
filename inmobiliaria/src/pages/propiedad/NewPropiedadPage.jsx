import React, { useEffect, useState } from "react";
import NewComponent from '../../components/NewComponent';
import "../../assets/styles/NewTipoPropiedad.css";
import axios from 'axios';
import HeaderComponent from "../../components/HeaderComponent";
import NavBarComponent from "../../components/NavBarComponent";
import FooterComponent from "../../components/FooterComponent";

const NewPropiedad = () => {
  const [tipoPropiedades, setTipoPropiedades] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [localidadesResponse, tipoPropiedadesResponse] = await Promise.all([
          axios.get('http://localhost/localidades'),
          axios.get('http://localhost/tipos_propiedad')
        ]);

        setLocalidades(localidadesResponse.data.data.map(tipo => ({ value: tipo.id, label: tipo.nombre })));
        setTipoPropiedades(tipoPropiedadesResponse.data.data.map(tipo => ({ value: tipo.id, label: tipo.nombre })));
      } catch (error) {
        console.error('Error Fetching Data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

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
    { name: 'imagen', label: 'Imagen', type: 'file' }
  ];

  return (
    <div>
      <HeaderComponent />
      <NavBarComponent />
      <NewComponent
        endpoint="http://localhost/propiedades"
        fields={camposPropiedad}
        title="Crear Nueva Propiedad"
      />
      <FooterComponent />
    </div>
  );
};

export default NewPropiedad;

