import "../pages/propiedad/PropiedadPage";
import { useNavigate } from "react-router-dom";
const ListarComponent = (props) => {
    const navigate = useNavigate();

  const navigateToNewTipoPropiedad = () => {
    navigate(props.linkEdit);
  };
    const elementos = props.elementos;
    return (
        <div className="list-container">
            {elementos.map((elemento, index) => (
                <div className="list-item" key={index}>
                    {Object.keys(elemento).map((key) => (
                        <div key={key}><strong>{key}:</strong> {elemento[key]}</div>
                    ))}
                    <button onClick={navigateToNewTipoPropiedad}>editar</button>
                    <button>eliminar</button>
                </div>
            ))}
        </div>
    );
};

export default ListarComponent;