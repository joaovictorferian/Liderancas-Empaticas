import { useState } from "react";
import api from "./api.js";
import Aluno from "./components/Aluno.jsx";
import Grupo from "./components/grupo.jsx";
import Alimentos from "./components/alimentos.jsx";
import Dinheiro from "./components/dinheiro.jsx";
import Campanhas from "./components/campanhas.jsx";
import Usuarios from "./components/usuarios.jsx";
import PainelSuporte from "./Suporte.jsx";
import SidebarAdmin from "./components/SidebarAdmin.jsx";

import CadastroUsuario from "./components/cadastroUsuario.jsx";
import CadastroCampanha from "./components/cadastroCampanha.jsx";
import CadastroGrupo from "./components/CadastroGrupo.jsx";
import CadastroAlimento from "./components/CadastroAlimento.jsx";
import CadastroAluno from "./components/CadastroAluno.jsx";
import CadastroDinheiro from "./components/CadastroDinheiro.jsx";
import Relatorios from "./components/Relatorios.jsx";

function Admin() {
  const [userData, setUserData] = useState({
    Usuario_Email: "",
    Usuario_Senha: "",
    Usuario_Cargo: "",
  });

  const [activeScreen, setActiveScreen] = useState("home");

  const handleLogout = () => {
    localStorage.removeItem("ID_Usuario");
    window.location.href = "/";
  };

  const handleUpdate = async () => {
    const ID_Usuario = localStorage.getItem("ID_Usuario");
    try {
      const response = await api.put(`/usuario/${ID_Usuario}`);
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
        onSelectPage={(page) => setActiveScreen(page)}
      />
      <div className="mainAdmin">
          

        {/* renderiza a tela conforme activeScreen */}
        {/* {activeScreen === "home" && <h2>Bem-vindo ao painel22222222</h2>} */}
        {activeScreen === "aluno" && (
          <Aluno onSelectPage={(page) => setActiveScreen(page)} />
        )}
        {/* {activeScreen === "relatorios" && <div>Relatórios (placeholder)</div>} */}
        {activeScreen === "grupos" && (
          <Grupo onSelectPage={(page) => setActiveScreen(page)} />
        )}
        {activeScreen === "alimentos" && (
          <Alimentos onSelectPage={(page) => setActiveScreen(page)} />
        )}
        {activeScreen === "dinheiro" && (
          <Dinheiro onSelectPage={(page) => setActiveScreen(page)} />
        )}
        {activeScreen === "campanhas" && (
          <Campanhas onSelectPage={(page) => setActiveScreen(page)} />
        )}
        {activeScreen === "usuarios" && (
          <Usuarios onSelectPage={(page) => setActiveScreen(page)} />
        )}
        {activeScreen === "relatorios" && (
          <Relatorios onSelectPage={(page) => setActiveScreen(page)} />
        )}
        {activeScreen === "CadastroUsuario" && <CadastroUsuario />}
        {activeScreen === "CadastroAluno" && <CadastroAluno />}
        {activeScreen === "CadastroGrupo" && <CadastroGrupo />}
        {activeScreen === "CadastroAlimento" && (
          <CadastroAlimento onSelectPage={(page) => setActiveScreen(page)} />
        )}

        {activeScreen === "CadastroCampanha" && <CadastroCampanha />}
  {activeScreen === "CadastroDinheiro" && <CadastroDinheiro onSelectPage={(page) => setActiveScreen(page)} />}
        {activeScreen === "suporte" && <PainelSuporte />}
      </div>
    </div>
  );
}

export default Admin;
