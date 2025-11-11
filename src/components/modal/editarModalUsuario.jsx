import React from "react";
import api from "../../api";

function EditModal({
  isOpen,
  usuarioEdit,
  setUsuarioEdit,
  onClose,
  carregarUsuarios,
}) {
  if (!isOpen || !usuarioEdit) return null;

  const salvarEdicao = async () => {
    try {
      const dadosEditaveis = {
        Usuario_Nome: usuarioEdit.Usuario_Nome,
        Usuario_Empresa: usuarioEdit.Usuario_Empresa,
        Usuario_Telefone: usuarioEdit.Usuario_Telefone,
        Usuario_Senha: usuarioEdit.Usuario_Senha
      }
      console.log(usuarioEdit)
      const response = await api.put( `/usuario/${usuarioEdit.ID_Usuario}`, dadosEditaveis);
      setUsuarioEdit(response.data)
      alert("Usuário atualizado com sucesso!");
      onClose();
      carregarUsuarios();
    } catch (error) {
      console.error("Erro no update:", error);
      alert("Erro no servidor ao atualizar usuário");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Editar Usuário</h2>

        <div className="formEdit">
          <label>ID:</label>
          <input type="text" value={usuarioEdit.ID_Usuario} readOnly />

          <label>Nome:</label>
          <input
            type="text"
            value={usuarioEdit.Usuario_Nome || ""}
            onChange={(e) =>
              setUsuarioEdit({ ...usuarioEdit, Usuario_Nome: e.target.value })
            }
          />

          <label>Empresa:</label>
          <input
            type="text"
            value={usuarioEdit.Usuario_Empresa || ""}
            onChange={(e) =>
              setUsuarioEdit({
                ...usuarioEdit,
                Usuario_Empresa: e.target.value,
              })
            }
          />

          <label>Telefone:</label>
          <input
            type="text"
            value={usuarioEdit.Usuario_Telefone || ""}
            onChange={(e) =>
              setUsuarioEdit({
                ...usuarioEdit,
                Usuario_Telefone: e.target.value,
              })
            }
          />

          <label>Senha:</label>
          <input
            type="text"
            value={usuarioEdit.Usuario_Senha || ""}
            onChange={(e) =>
              setUsuarioEdit({
                ...usuarioEdit,
                Usuario_Senha: e.target.value,
              })
            }
          />
        </div>

        <div className="footerModal">
          <button className="btnFilter" onClick={onClose}>
            Fechar
          </button>
          <button className="btnFilter" onClick={salvarEdicao}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
