import React, { useState } from 'react';
import axios from 'axios';
import HandleImageUpload from '../utils/HandleImageUpload';
import "../assets/styles/NewTipoPropiedad.css";

const NewComponent = ({ endpoint, fields, title }) => {
    const [formValues, setFormValues] = useState({});
    const [mensaje, setMensaje] = useState('');
    const [imageData, setImageData] = useState(null); // Estado para almacenar datos de imagen

    const handleInputChange = (event) => {
        const { name, value, type, checked, files } = event.target;
        if (type === 'file') {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result;
                const parts = base64.match(/^data:image\/([a-z0-9]+);base64,(.+)$/);
                setImageData({ tipo: parts[1], contenido: parts[2] });
            };
            reader.readAsDataURL(file);
        } else {
            setFormValues({
                ...formValues,
                [name]: type === 'checkbox' ? checked : value
            });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let messages = '';
        for (const field of fields) {
            if (!formValues[field.name] && field.type !== 'checkbox' && field.type !== 'file') {
                messages += `El campo ${field.label} no puede estar vacío, `;
            }
        }
        setMensaje(messages);
        if (messages) {
            return;
        }

        try {
            const formData = new FormData();
            // Agregar campos del formulario
            for (const key in formValues) {
                if (typeof formValues[key] === 'boolean') {
                    formData.append(key, formValues[key] ? 1 : 0);
                } else {
                    formData.append(key, formValues[key]);
                }
            }

            // Agregar datos de la imagen al formData
            if (imageData) {
                formData.append('tipo_imagen', imageData.tipo);
                formData.append('imagen', imageData.contenido);
            }

            // Enviar formData al endpoint usando Axios
            const response = await axios.post(endpoint, formData);
            setMensaje(`Nuevo recurso creado: ${response.data?.status} ${response.data?.code} ${response.data?.Registrado}`);
            console.log(response);
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
            setMensaje(errorMessage.trim());
        }
    };

    return (
        <div className='formulario'>
            <main className="main-content">
                <h1>{title}</h1>
                <form onSubmit={handleSubmit}>
                    {fields.map((field) => (
                        <div key={field.name}>
                            <label htmlFor={field.name}>{field.label}:</label>
                            {field.type === 'select' ? (
                                <select
                                    id={field.name}
                                    name={field.name}
                                    value={formValues[field.name] || ''}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Seleccione una opción</option>
                                    {field.options && field.options.map((option, index) => (
                                        <option key={index} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            ) : field.type === 'checkbox' ? (
                                <input
                                    type="checkbox"
                                    id={field.name}
                                    name={field.name}
                                    checked={formValues[field.name] || false}
                                    onChange={handleInputChange}
                                />
                            ) : field.type === 'file' ? (
                                <input
                                    type="file"
                                    id={field.name}
                                    name={field.name}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <input
                                    type={field.type || 'text'}
                                    id={field.name}
                                    name={field.name}
                                    value={formValues[field.name] || ''}
                                    onChange={handleInputChange}
                                    {...(field.type === 'number' ? { min: "0", step: "1" } : {})}
                                />
                            )}
                        </div>
                    ))}
                    <button type="submit">Crear</button>
                </form>
                {mensaje && <p className="error">{mensaje}</p>}
            </main>
        </div>
    );
};

export default NewComponent;
