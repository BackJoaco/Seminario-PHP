import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../assets/styles/DetailPropiedad.css'
import HeaderComponent from '../../components/HeaderComponent';
import NavBarComponent from '../../components/NavBarComponent';
import FooterComponent from '../../components/FooterComponent';
const PropertyDetail = () => {
  const { id } = useParams();
  const [propiedad, setPropiedad] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios.get(`http://localhost/propiedades/${id}`)
      .then(response => {
        setPropiedad(response.data.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error Fetching Property Details', error);
        setLoading(false);
      });
  }, [id]);
  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!propiedad) {
    return <div>Propiedad no encontrada</div>;
  }
        
  return (
    <div>
    <HeaderComponent/>
    <NavBarComponent></NavBarComponent>
      <h1 className='titulo'>Detalles de la Propiedad</h1>
       <ul className='list-container'>
       {Object.keys(propiedad).map((key) => (
            key !== "id"  && <div className="list-item" key={key}>
       <strong>{key}:</strong> {key === 'imagen' ? (
        <img src={propiedad[key]} alt={`Imagen de propiedad en ${propiedad.domicilio}`} />
      ) : (
        (key === "cochera" || key === "disponible") ? (
          <div>{propiedad[key] === 1 ? 'SI' : 'NO'}</div>
        ) : (
          <div>{propiedad[key]}</div>
        )
      )}
      <FooterComponent/>
    </div>
  )
)}
      </ul>    
    </div>
  );
};
export default PropertyDetail;