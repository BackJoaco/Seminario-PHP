import React from 'react';
import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";
import "../App.css"; 
import NavBarComponent from '../components/NavBarComponent';

const Layout = ({ children }) => {
  return (
    <div id="root">
      <HeaderComponent />
      <NavBarComponent></NavBarComponent>
      <main>
        {children}
      </main>
     <FooterComponent />
    </div>
  );
};

export default Layout;
