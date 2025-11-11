import { useState } from "react";
import api from "../api.js"

function SidebarAdmin({ onLogout, onUpdate, userData, setUserData, onSelectPage }) {
  const [modalConfig, setModalConfig] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [openCadastros, setOpenCadastros] = useState(false);
  const [openDoacoes, setOpenDoacoes] = useState(false);

  const handleDeleteAccount = async () => {
    const ID_Usuario = localStorage.getItem("ID_Usuario");
    if (!ID_Usuario) {
      alert("Usuário não identificado!");
      return;
    }

    try {
      const response = await api.delete(
        `/usuario/${ID_Usuario}`
      );
      const data = await response.json();
      alert(data.msg || data.error);

      if (response.ok) {
        localStorage.removeItem("ID_Usuario");
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Erro ao deletar conta:", err);
    }
  };

  const handleOpenEdit = async () => {
    const ID_Usuario = localStorage.getItem("ID_Usuario");
    if (!ID_Usuario) {
      alert("Usuário não identificado!");
      return;
    }

    try {
      const response = await api.get(
        `/usuario/${ID_Usuario}`
      );
      const data = await response.json();

      if (response.ok) {
        setUserData(data);
        setModalEdit(true);
      } else {
        alert(data.error || "Erro ao buscar usuário");
      }
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
      alert("Erro no servidor ao buscar usuário");
    }
  };

  return (
    <aside className="asideAdmin">
      <img className="logoAdmin" src="LogoFundoBranco.avif" alt="logo" />

      <ul className="menuAdmin">
        <li>
          <button className="btnAdmin" onClick={() => onSelectPage("home")}>
            <img className="icon" src="home.png" alt="home" /> Página inicial
          </button>
        </li>
        <li>
          <button className="btnAdmin" onClick={() => onSelectPage("relatorios")}>
            <img className="icon" src="report.png" alt="relatorio" /> Relatórios
          </button>
        </li>

        {/* CADASTROS */}
        <li>
          <button
            className="btnAdmin"
            onClick={() => {
              setOpenCadastros(!openCadastros);
              if (!openCadastros) setOpenDoacoes(false); // fecha doações ao abrir cadastros
            }}
          >
            <img className="icon" src="verify.png" alt="cadastros" /> Cadastros
          </button>
          {openCadastros && (
            <ul className="submenu">
              <li>
                <button className="btnSub" onClick={() => onSelectPage("aluno")}>
                  <img className="icon" src="graduation.png" alt="Alunos" /> Aluno
                </button>
              </li>
              <li>
                <button className="btnSub" onClick={() => onSelectPage("grupos")}>
                  <img className="icon" src="people.png" alt="Grupo" /> Grupos
                </button>
              </li>
            </ul>
          )}
        </li>

        {/* DOAÇÕES */}
        <li>
          <button
            className="btnAdmin"
            onClick={() => {
              setOpenDoacoes(!openDoacoes);
              if (!openDoacoes) setOpenCadastros(false); // fecha cadastros ao abrir doações
            }}
          >
            <img className="icon" src="heart.png" alt="doacoes" /> Doações
          </button>
          {openDoacoes && (
            <ul className="submenu">
              <li>
                <button className="btnSub" onClick={() => onSelectPage("alimentos")}>
                  <img className="icon" src="restaurant.png" alt="alimentos" /> Alimentos
                </button>
              </li>
              <li>
                <button className="btnSub" onClick={() => onSelectPage("dinheiro")}>
                  <img className="icon" src="dollar.png" alt="dinheiro" /> Dinheiro
                </button>
              </li>
              <li>
                <button className="btnSub" onClick={() => onSelectPage("campanhas")}>
                  <img className="icon" src="campaign.png" alt="campanhas" /> Campanhas
                </button>
              </li>
            </ul>
          )}
        </li>

        <li>
          <button className="btnAdmin" onClick={() => onSelectPage("usuarios")}>
            <img className="icon" src="graduation.png" alt="usuarios" /> Usuários
          </button>
        </li>
        
        <li>
          <button
            className="btnAdmin"
            onClick={() => onSelectPage("suporte")}
          >
            <img className="icon" src="suport.png" alt="suporte" /> Suporte
          </button>
        </li>
      </ul>

      <ul className="menuAdmin bottomMenu">
        <li>
          <button
            className="btnConfig"
            onClick={() => setModalConfig(!modalConfig)}
          >
            <img className="icon" src="setting.png" alt="config" /> Configurações
          </button>
        </li>
        <li>
          <button className="btnSair" onClick={onLogout}>
            <img className="icon" src="logout.png" alt="sair" /> Sair
          </button>
        </li>
      </ul>

      {/* Modal Configurações */}
      {modalConfig && (
        <div className="modalConfig">
          <button className="btnModal" onClick={handleOpenEdit}>
            Alterar Perfil
          </button>
          <button className="btnModal delete" onClick={handleDeleteAccount}>
            Deletar Conta
          </button>
        </div>
      )}

      {/* Modal Editar Perfil */}
      {modalEdit && (
        <div className="modalEdit">
          <h2>Editar Perfil</h2>
          <input
            type="email"
            value={userData.Usuario_Email}
            onChange={(e) =>
              setUserData({ ...userData, Usuario_Email: e.target.value })
            }
            placeholder="Email"
          />
          <input
            type="password"
            value={userData.Usuario_Senha}
            onChange={(e) =>
              setUserData({ ...userData, Usuario_Senha: e.target.value })
            }
            placeholder="Senha"
          />
          <input
            type="text"
            value={userData.Usuario_Cargo}
            onChange={(e) =>
              setUserData({ ...userData, Usuario_Cargo: e.target.value })
            }
            placeholder="Cargo"
          />
          <div className="modalActions">
            <button onClick={onUpdate}>Alterar</button>
            <button onClick={() => setModalEdit(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </aside>
  );
}

export default SidebarAdmin;
