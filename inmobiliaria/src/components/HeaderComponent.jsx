import React from 'react';
import '../assets/styles/HeaderComponent.css';
import headerImage from '../assets/images/logoInmobiliaria.jpg';
const HeaderComponent = () => {
    return (
      <header className="header">
        <img src={headerImage} alt="Header">
        </img>
        <h1>
          Inmobiliaria  
          </h1>
      </header>
    );
  };
  
  export default HeaderComponent;