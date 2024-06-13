import '../assets/styles/NavBarComponent.css';
const NavBarComponent =()=>{
    return (
      <nav className="navbar">
        <ul>
          <li>
            {/*<Link to="/">Inicio</Link>*/}
            INICIO
          </li>
          <li>
            {/*<Link to="/propiedades">Propiedades</Link>*/}
            Propiedades
          </li>
          <li>
            {/*<Link to="/contacto">Contacto</Link>*/}
            Contactos
          </li>
        </ul>
      </nav>
    )
    
}
export default NavBarComponent;