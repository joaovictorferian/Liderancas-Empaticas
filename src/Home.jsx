import { useState, useEffect } from "react";
function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showConecteSe, setShowConecteSe] = useState(true);
  const [showAdminButton, setShowAdminButton] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    const storedTipo = (localStorage.getItem("Tipo_Usuario") || "").toLowerCase();
    const storedID = localStorage.getItem("ID_Usuario");
    const token = localStorage.getItem("token");
    if (storedTipo === "aluno") {
      setShowConecteSe(false);
      setShowAdminButton(false);
      setShowLogout(true);
    } else if (storedTipo === "usuario" && storedID) {
      setShowConecteSe(false);
      setShowAdminButton(true);
      setShowLogout(true);
    } else {
      setShowConecteSe(true);
      setShowAdminButton(false);
      // if there's a token but no explicit tipo/ID, still show logout
      setShowLogout(!!token);
    }
  }, []);

  const handleLogout = () => {
    // Remove auth-related keys from localStorage
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("ID_Usuario");
      localStorage.removeItem("Tipo_Usuario");
      localStorage.removeItem("Email");
    } catch (err) {
      console.warn("Erro ao limpar localStorage:", err);
    }

    // Update local UI state
    setShowConecteSe(true);
    setShowAdminButton(false);
    setShowLogout(false);

    // Redirect to home (refresh ensures any other components read cleared storage)
    window.location.href = "/";
  };
  return (
    <body className="bodyImg">
       
      <div className="divHome">
         
      <header className="headerHome">
     <img className="logoHome" src="LogoFundoBranco.avif" alt="Logo" />
     <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</button>
     <nav className={`navHome ${isMenuOpen ? 'open' : ''}`}>
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
       {showConecteSe && (
         <button className="btnConectar" onClick={() => (window.location.href = "login")}>Conecte-se</button>
       )}
       {!showConecteSe && showAdminButton && (
         <button className="btnConectar" onClick={() => (window.location.href = "/admin")}>Admin</button>
       )}

       {showLogout && (
         <button className="btnConectar" onClick={handleLogout}>Deslogar</button>
       )}
     </nav> 
   </header>
    
        <div className="divTxt">
           
          <h1 className="txt1Home">Em breve 7° Edição</h1> 
          <h1 className="txt2Home">
            Lideranças <br /> Empáticas
          </h1> 
          <p className="txt3Home">Educar é desenvolver competências</p> 
        </div> 
      </div> 
    </body>
    
  );
}
export default Home;
