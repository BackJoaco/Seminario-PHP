/*import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../assets/styles/DetailPropiedad.css';
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

  const getImageSrc = (tipo, contenido) => {
    return `data:image/${tipo};base64,${contenido}`;
  };

  return (
    <div>
      <HeaderComponent/>
      <NavBarComponent/>
      <h1 className='titulo'>Detalles de la Propiedad</h1>
      <ul className='list-container'>
        {Object.keys(propiedad).map((key) => (
          key !== "id" && key !== "imagen_tipo" && key !== "imagen_contenido" && (
            <div className="list-item" key={key}>
              <strong>{key}:</strong> {(key === 'cochera' || key === 'disponible') ? (
                <div>{propiedad[key] === 1 ? 'SI' : 'NO'}</div>
              ) : (
                <div>{propiedad[key]}</div>
              )}
            </div>
          )
        ))}
        {propiedad.imagen_tipo && propiedad.imagen_contenido && (
          <div className="list-item">
            <strong>Imagen:</strong>
            <img 
              src={getImageSrc(propiedad.imagen_tipo, propiedad.imagen_contenido)} 
              alt={`Imagen de propiedad en ${propiedad.domicilio}`} 
            />
          </div>
        )}
      </ul>
      <FooterComponent/>
    </div>
  );
};

export default PropertyDetail;*/
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../assets/styles/DetailPropiedad.css';
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
      <HeaderComponent />
      <NavBarComponent />
      <h1 className='titulo'>Detalles de la Propiedad</h1>
      <ul className='list-container'>
        {Object.keys(propiedad).map((key) => (
          key !== "id" && <div className="list-item" key={key}>
            <strong>{key}:</strong> {key === 'imagen' ? (
             <img
             className="propiedad-img"
             src={
               propiedad.imagen && typeof propiedad.imagen === 'string'
                 ? `data:image/${propiedad.tipo_imagen};base64,${propiedad.imagen}`
                 : propiedad.imagen
             }
             alt={`Imagen de propiedad en ${propiedad.domicilio}`}
           />  
            ) : (
              (key === "cochera" || key === "disponible") ? (
                <div>{propiedad[key] === 1 ? 'SI' : 'NO'}</div>
              ) : (
                <div>{propiedad[key]}</div>
              )
            )}
          </div>
        ))}
      </ul>
      <FooterComponent />
    </div>
  );
};

export default PropertyDetail;
