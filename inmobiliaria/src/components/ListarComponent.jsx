import React, { useState } from 'react';
import DeleteButton from './DeleteButton';
import EditButton from './EditButton';
import "../assets/styles/ListarComponent.css";
import { useNavigate } from 'react-router-dom';

const ListarComponent = (props) => {
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const navigateToDetailPropiedad =(id) =>{
    navigate(`/propiedades/detailPropiedad/${id}`); //Detalle Propiedad
  };
  const elementos = props.elementos;
  const esProp=props.esProp;
  return (
    <div className="list-container">
      {elementos.map((elemento, index) => (
        <div className="list-item" key={index}>
          {Object.keys(elemento).map((key) => (
            key !== "id" && (
              <div key={key}>
                <strong>{key}:</strong> {elemento[key]}
              </div>
            )
          ))} 
          {esProp && <button onClick={()=> navigateToDetailPropiedad(elemento.id)}> Ver Propiedad en Detalle</button>}
          <EditButton
            linkEdit={props.linkEdit}
            id={elemento.id}
          />
          <DeleteButton
            endpoint={props.linkDelete}
            id={elemento.id}
            setMensaje={setMensaje}
            setElementos={props.setElementos}
          />
        </div>
      ))}
      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  );
};

export default ListarComponent;
