import React from "react";
import api from "../../api";

function EditModal({
  isOpen,
  alunoEdit,
  setAlunoEdit,
  onClose,
  carregarAlunos
}) {
  if (!isOpen || !alunoEdit) return null;

  const salvarEdicaoAlunos = async () => {
    try {
      const dadosEditaveis = {
        Aluno_Nome: alunoEdit.Aluno_Nome,
        Aluno_Telefone: alunoEdit.Aluno_Telefone,
        Aluno_Senha: alunoEdit.Aluno_Senha,
      };
      console.log(alunoEdit)
      const response = await api.put(`/alunos/${alunoEdit.ID_Aluno}`, dadosEditaveis);
      setAlunoEdit(response.data)
      alert("Usuário atualizado com sucesso!");
      onClose();
      carregarAlunos();
    } catch (error) {
      console.error("Erro no update:", error);
      alert("Erro no servidor ao atualizar usuário");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Editar Aluno</h2>

        <div className="formEdit">
          <label>ID:</label>
          <input type="text" value={alunoEdit.ID_Aluno} readOnly />

          <label>Nome:</label>
          <input
            type="text"
            value={alunoEdit.Aluno_Nome || ""}
            onChange={(e) =>
              setAlunoEdit({ ...alunoEdit, Aluno_Nome: e.target.value })
            }
          />

          <label>Telefone:</label>
          <input
            type="text"
            value={alunoEdit.Aluno_Telefone || ""}
            onChange={(e) =>
              setAlunoEdit({
                ...alunoEdit,
                Aluno_Telefone: e.target.value,
              })
            }
          />

          <label>Senha:</label>
          <input
            type="text"
            value={alunoEdit.Aluno_Senha || ""}
            onChange={(e) =>
              setAlunoEdit({
                ...alunoEdit,
                Aluno_Senha: e.target.value,
              })
            }
          />
        </div>

        <div className="footerModal">
          <button className="btnFilter" onClick={onClose}>
            Fechar
          </button>
          <button className="btnFilter" onClick={salvarEdicaoAlunos}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
