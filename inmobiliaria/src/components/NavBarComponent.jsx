import '../assets/styles/NavBarComponent.css';
const NavBarComponent =()=>{
    return (
      <nav className="navbar">
        <ul>
          <li><a href="/tipos_Propiedad">Tipos de propiedades</a></li>
          <li><a href="/propiedad">Propiedades</a></li>
          <li><a href="/reservas">Reservas</a></li>
        </ul>
      </nav>
    )
    
}
export default NavBarComponent;