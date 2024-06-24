import NewComponent from '../../components/NewComponent';
import "../../assets/styles/NewTipoPropiedad.css";
import axios from "axios";
import React, {useState, useEffect} from 'react';
import Layout from '../../utils/layout';
const NewReserva=()=>{
    const [propiedades, setPropiedades] = useState([]);
    const [inquilinos, setInquilinos] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchPropiedades = axios.get('http://localhost/propiedades');
      const fetchInquilinos = axios.get('http://localhost/inquilinos');
  
      Promise.all([fetchPropiedades, fetchInquilinos])
        .then(([propiedadesResponse, inquilinosResponse]) => {
          setPropiedades(propiedadesResponse.data.data.map(prop => ({ value: prop.id, label: prop.domicilio })));
          setInquilinos(inquilinosResponse.data.data.map(inq => ({ value: inq.id, label: inq.documento })));
          setLoading(false);
        })
        .catch(error => {
          console.error('Error Fetching Data', error);
          setLoading(false);
        });
    }, []);
  
    if (loading) {
      return <div>Cargando...</div>;
    }
  
const camposReserva = [
    {name: 'propiedad_id', label:'Propiedad', type:'select',options:propiedades} ,
    {name:'inquilino_id',label:'Inquilino',type:'select',options:inquilinos},
    {name:'fecha_desde',label:'Fecha Desde',type:'date'},
    {name:'cantidad_noches',label:'Cantidad Noches',type:'number'},
    {name:'valor_total',label:'Valor Total',type:'number'},
   ];
   
   
      return( 
        <Layout>
     <NewComponent
       endpoint="http://localhost/reservas" 
       fields={camposReserva} 
       title="Crear Nueva Reserva" 
     />
     </Layout>
   );
   
   }
   export default NewReserva;