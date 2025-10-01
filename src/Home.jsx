import { useState } from "react";

function Home() {
  return (

    <body className="bodyImg">
    
    <div className="divHome">
      <header className="headerHome">
        <img
          className="logoHome"
          src="LogoFundoBranco.avif"
          alt="Logo"
        />

        <nav className="navHome">
          <div className="dropdownHome">
            <button className="navHomeBotoes">Institucional</button>
            <ul className="dropdown-menu-home1">
              <li><a href="#">Resultados</a></li>
              <li><a href="#">Mentores</a></li>
              <li><a href="#">Instituto Alma</a></li>
              <li><a href="#">FECAP</a></li>
            </ul>
          </div>

          

          <div className="dropdownHome1">
          <button className="navHomeBotoes">Informações</button>
            <ul className="dropdown-menu-home2">
              <li><a href="#">Videoaulas</a></li>
              <li><a href="#">Certificados</a></li>
              <li><a href="#">Documentos</a></li>
             
            </ul>
          </div>
          <button className="navHomeBotoes">Notícias</button>
          <button className="navHomeBotoes">Contato</button>
          <button className="btnConectar" onClick={()=> window.location.href = "login"}>Conecte-se</button>
          
        </nav>
      </header>
    
    <div className="divTxt">
      <h1 className="txt1Home">Em breve 7° Edição</h1>
      <h1 className="txt2Home">Lideranças <br /> Empáticas</h1>
      <p className="txt3Home">Educar é desenvolver competências</p>
    </div>

    </div>
      
    </body>
  );
}

export default Home;
