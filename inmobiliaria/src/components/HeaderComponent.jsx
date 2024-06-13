import React from 'react';
import '../assets/styles/HeaderComponent.css';
import headerImage from '../assets/images/logoInmobiliaria.jpg';
const HeaderComponent = () => {
    return (
      <header className="header">
        <div className="logo">
          <img src={headerImage} alt="Logo" />
        </div>
        <h1 className="title">Inmobiliaria</h1>
      </header>
    );
  };
  
  export default HeaderComponent;