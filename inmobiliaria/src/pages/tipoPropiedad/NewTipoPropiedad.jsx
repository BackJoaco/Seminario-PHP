import NewComponent from '../../components/NewComponent';
import "../../assets/styles/NewTipoPropiedad.css";
import HeaderComponent from '../../components/HeaderComponent';
import NavBarComponent from '../../components/NavBarComponent';
import FooterComponent from '../../components/FooterComponent';

const camposTipoPropiedad = [
  { name: 'nombre', label: 'Nombre' }
];


const NewTipoPropiedad = () => (
  <div>
    <HeaderComponent/>
    <NavBarComponent/>
    <NewComponent 
      endpoint="http://localhost/tipos_propiedad" 
      fields={camposTipoPropiedad} 
      title="Crear Nuevo Tipo de Propiedad" 
    />
   <footer>
    <FooterComponent/>
  </footer>
  </div>
);


export default NewTipoPropiedad;

