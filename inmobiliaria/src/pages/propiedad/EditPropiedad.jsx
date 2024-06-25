/*import React, { useState, useEffect } from 'react';
import HeaderComponent from "../../components/HeaderComponent";
import FooterComponent from "../../components/FooterComponent";
import NavBarComponent from "../../components/NavBarComponent";
import { useParams } from 'react-router-dom';
import axios from "axios";
import "../../assets/styles/EditPropiedadForm.css";

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
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propiedadResponse = await axios.get(`http://localhost/propiedades/${id}`);
        const { data } = propiedadResponse.data;
        setPropiedad({
          ...data,
          tipo_imagen: data.tipo_imagen || '',
          imagen:data.imagen,
        });

        const localidadesResponse = await axios.get('http://localhost/localidades');
        setLocalidades(localidadesResponse.data.data.map(localidad => ({ value: localidad.id, label: localidad.nombre })));
        
        const tiposPropiedadResponse = await axios.get('http://localhost/tipos_propiedad');
        setTipoPropiedades(tiposPropiedadResponse.data.data.map(tipo => ({ value: tipo.id, label: tipo.nombre })));
        
        setLoading(false);
      } catch (error) {
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
        setMessage(errorMessage.trim()|| "Hubo un error al obtener los datos de la propiedad");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleImageUpload = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        const parts = base64.match(/^data:image\/([a-z0-9]+);base64,(.+)$/);
        if (parts) {
          resolve({
            tipo_imagen: parts[1],
            imagen: parts[2]
          });
        } else {
          reject(new Error("Formato de imagen inválido"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (propiedad.imagen instanceof File) {
      try {
        const { tipo_imagen, imagen } = await handleImageUpload(propiedad.imagen);
        setPropiedad(prevPropiedad => ({
          ...prevPropiedad,
          tipo_imagen,
          imagen
        }));
      } catch (error) {
        setMessage("Error al procesar la imagen");
        return;
      }
    }
    axios.put(`http://localhost/propiedades/${id}`, propiedad)
      .then(response => {
        setMessage(response.data.actualizacion || "Propiedad actualizada con éxito");
      })
      .catch(error => {
        const errors = error.response?.data?.error;
        const errorMessage = errors ? Object.values(errors).join('. ') : 'Ha ocurrido un error al actualizar la propiedad';
        setMessage(errorMessage);
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
              {campo.type === 'select' ? (
                <select
                  id={campo.name}
                  name={campo.name}
                  className="form-control"
                  value={propiedad[campo.name]}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  {campo.name === 'localidad_id'
                    ? localidades.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))
                    : tipoPropiedades.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                </select>
              ) : campo.type === 'checkbox' ? (
                <input
                  type="checkbox"
                  id={campo.name}
                  name={campo.name}
                  checked={propiedad[campo.name]}
                  onChange={handleChange}
                />
              ) : campo.type === 'file' ? (
                <div>
                  <input
                    type="file"
                    id={campo.name}
                    name={campo.name}
                    onChange={handleChange}
                  />
                   {propiedad.imagen && typeof propiedad.imagen === 'string' && (
                    <img
                      className="propiedad-img"
                      src={`data:image/${propiedad.tipo_imagen};base64,${propiedad.imagen}`}
                      alt={`Imagen de propiedad en ${propiedad.domicilio}`}

                    />
                  )}
                </div>
              ) : (
                <input
                  type={campo.type}
                  id={campo.name}
                  name={campo.name}
                  className="form-control"
                  value={propiedad[campo.name]}
                  onChange={handleChange}
                  required={campo.type !== 'file'}
                />
              )}
            </div>
          ))}
          <button type="submit" className="btn btn-primary">Guardar Cambios</button>
        </form>
      </div>
      <FooterComponent />
    </div>
  );
};

export default EditPropiedad;*/
import React, { useState, useEffect } from 'react';
import HeaderComponent from "../../components/HeaderComponent";
import FooterComponent from "../../components/FooterComponent";
import NavBarComponent from "../../components/NavBarComponent";
import { useParams } from 'react-router-dom';
import axios from "axios";
import "../../assets/styles/EditPropiedadForm.css";

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
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propiedadResponse = await axios.get(`http://localhost/propiedades/${id}`);
        setPropiedad(propiedadResponse.data.data);
        const localidadesResponse = await axios.get('http://localhost/localidades');
        setLocalidades(localidadesResponse.data.data.map(localidad => ({ value: localidad.id, label: localidad.nombre })));
        
        const tiposPropiedadResponse = await axios.get('http://localhost/tipos_propiedad');
        setTipoPropiedades(tiposPropiedadResponse.data.data.map(tipo => ({ value: tipo.id, label: tipo.nombre })));
        
        setLoading(false);
      } catch (error) {
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
        setMessage(errorMessage.trim()|| "Hubo un error al obtener los datos de la propiedad");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleImageUpload = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        const parts = base64.match(/^data:image\/([a-z0-9]+);base64,(.+)$/);
        if (parts) {
          resolve({
            tipo_imagen: parts[1],
            imagen: parts[2]
          });
        } else {
          reject(new Error("Formato de imagen inválido"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (propiedad.imagen instanceof File) {
      try {
        const { tipo_imagen, imagen } = await handleImageUpload(propiedad.imagen);
        propiedad.tipo_imagen = tipo_imagen;
        propiedad.imagen = imagen;
      } catch (error) {
        setMessage("Error al procesar la imagen");
        return;
      }
    }
    axios.put(`http://localhost/propiedades/${id}`, propiedad)
      .then(response => {
        setMessage(response.data.actualizacion || "Propiedad actualizada con éxito");
      })
      .catch(error => {
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
        setMessage(errorMessage.trim());
      });
  };

  const handleChange = async (event) => {
    const { name, value, type, checked, files } = event.target;
    if (type === 'file' && files[0]) {
      try {
        const { tipo_imagen, imagen } = await handleImageUpload(files[0]);
        setPropiedad(prevPropiedad => ({
          ...prevPropiedad,
          tipo_imagen,
          imagen
        }));
      } catch (error) {
        setMessage("Error al procesar la imagen");
      }
    } else {
      const newValue = type === 'checkbox' ? checked : value;
      setPropiedad(prevPropiedad => ({
        ...prevPropiedad,
        [name]: newValue
      }));
    }
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
              {campo.type === 'select' ? (
                <select
                  id={campo.name}
                  name={campo.name}
                  className="form-control"
                  value={propiedad[campo.name]}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  {campo.name === 'localidad_id'
                    ? localidades.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))
                    : tipoPropiedades.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                </select>
              ) : campo.type === 'checkbox' ? (
                <input
                  type="checkbox"
                  id={campo.name}
                  name={campo.name}
                  checked={propiedad[campo.name]}
                  onChange={handleChange}
                />
              ) : campo.type === 'file' ? (
                <div>
                  <input
                    type="file"
                    id={campo.name}
                    name={campo.name}
                    onChange={handleChange}
                  />
                  {propiedad.imagen && (
                    <img
                      className="propiedad-img"
                      src={
                        typeof propiedad.imagen === 'string'
                          ? `data:image/${propiedad.tipo_imagen};base64,${propiedad.imagen}`
                          : URL.createObjectURL(propiedad.imagen)
                      }
                      alt={`Imagen de propiedad en ${propiedad.domicilio}`}
                    />
                  )}
                </div>
              ) : (
                <input
                  type={campo.type}
                  id={campo.name}
                  name={campo.name}
                  className="form-control"
                  value={propiedad[campo.name]}
                  onChange={handleChange}
                  required={campo.type !== 'file'}
                />
              )}
            </div>
          ))}
          <button type="submit" className="btn btn-primary">Guardar Cambios</button>
        </form>
      </div>
      <FooterComponent />
    </div>
  );
};

export default EditPropiedad;
