import { useState } from "react";
import Aluno from './components/Aluno.jsx';
import Grupo from './components/grupo.jsx';
import SidebarAdmin from './components/SidebarAdmin.jsx';
import HeaderAdmin from './components/HeaderAdmin.jsx';

function Admin() {
  const [userData, setUserData] = useState({
    Usuario_Email: "",
    Usuario_Senha: "",
    Usuario_Cargo: ""
  });

  // controla qual tela está ativa
  const [activeScreen, setActiveScreen] = useState("home");

  const handleLogout = () => {
    localStorage.removeItem("ID_Usuario");
    window.location.href = "/";
  };

  const handleUpdate = async () => {
    const ID_Usuario = localStorage.getItem("ID_Usuario");
    try {
      const response = await fetch(
        `http://localhost:500/api/users/usuario/${ID_Usuario}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData)
        }
      );
      const data = await response.json();
      alert(data.msg || data.error);
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
    }
  };

  return (
    <div className="bodyAdmin">
      <SidebarAdmin
        onLogout={handleLogout}
        onUpdate={handleUpdate}
        userData={userData}
        setUserData={setUserData}
        onSelectPage={(page) => setActiveScreen(page)} // <-- aqui
      />

      <div className="mainAdmin">
        <HeaderAdmin />

        {/* renderiza a tela conforme activeScreen */}
        {activeScreen === "home" && <h2>Bem-vindo ao painel22222222</h2>}
        {activeScreen === "aluno" && <Aluno />}
        {activeScreen === "relatorios" && <div>Relatórios (placeholder)</div>}
        {activeScreen === "grupos" && <Grupo />}
        {activeScreen === "alimentos" && <div>Doações - Alimentos</div>}
        {activeScreen === "dinheiro" && <div>Doações - Dinheiro</div>}
        {activeScreen === "campanhas" && <div>Doações - Campanhas</div>}
        {activeScreen === "usuarios" && <div>Usuários (placeholder)</div>}
        {activeScreen === "administrativo" && <div>Administrativo (placeholder)</div>}
      </div>
    </div>
  );
}

export default Admin;
