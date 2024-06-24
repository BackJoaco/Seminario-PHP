import React, { useEffect, useState } from "react";
import NewComponent from '../../components/NewComponent';
import "../../assets/styles/NewTipoPropiedad.css";
import axios from 'axios';
import HeaderComponent from "../../components/HeaderComponent";
import NavBarComponent from "../../components/NavBarComponent";
import FooterComponent from "../../components/FooterComponent";
const NewPropiedad =()=>{
    const [tipoPropiedades, setTipoPropiedades] = useState([]);
    const [loading, setLoading] = useState(true);
    const[localidades,setLocalidades]= useState([]);
    useEffect(() => {
      axios.get('http://localhost/localidades')
      .then(response => {
        setLocalidades(response.data.data.map(tipo => ({ value: tipo.id, label: tipo.nombre })));
        setLoading(false);
      })
      .catch(error => {
        console.error('Error Fetching', error);
        setLoading(false);
      })
      axios.get('http://localhost/tipos_propiedad')
        .then(response => {
          setTipoPropiedades(response.data.data.map(tipo => ({ value: tipo.id, label: tipo.nombre })));
          setLoading(false);
        })
        .catch(error => {
          console.error('Error Fetching', error);
          setLoading(false);
        });
    }, []);
  
    if (loading) {
      return <div>Cargando...</div>;
    }
const camposPropiedad = [
 { name: 'domicilio', label: 'Domicilio', type:'text' },
 {name: 'localidad_id', label:'Localidad', type:'select',options:localidades} ,
 {name:'cantidad_habitaciones',label:'Cantidad Habitaciones',type:'number'},
 {name:'cantidad_banios',label:'Cantidad Baños',type:'number'},
 {name:'cochera',label:'Cochera',type:'checkbox'},
 {name:'cantidad_huespedes',label:'Cantidad Huespedes',type:'number'},
 {name:'fecha_inicio_disponibilidad',label:'Fecha Inicio Disponibilidad',type:'date'},
 {name:'cantidad_dias',label:'Cantidad Dias',type:'number'},
 {name:'disponible',label:'Disponible',type:'checkbox'},
 {name:'valor_noche',label:'Valor Noche',type:'number'},
 {name:'tipo_propiedad_id',label:'Tipo de Propiedad',type:'select',options:tipoPropiedades},
 {name:'imagen',label:'Imagen',type:'file'},
 {name:'tipo_imagen',label:'Tipo Imagen',type:'text'}
];


   return( 
    <div>
    <HeaderComponent/>
    <NavBarComponent></NavBarComponent>
  <NewComponent
    endpoint="http://localhost/propiedades" 
    fields={camposPropiedad} 
    title="Crear Nueva Propiedad" 
  />
  </div>
);

}
export default NewPropiedad;