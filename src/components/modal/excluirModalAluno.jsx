import React from "react";
import api from "../../api";

function ExcluirModal({
  isOpen,
  onClose,
  selectedAluno,
  setAlunosExcluir, 
  carregarAlunosExcluir,
  tabelaAluno
}) {
  if (!isOpen) return null;

  const excluirAlunos = async () => {
    if (selectedAluno.length === 0) {
      alert("Nenhum item selecionado para exclusão!");
      return;
    }

    try {
      const response = await api.delete('/deleteFromTable', {
        data:{ids: selectedAluno, tabela: tabelaAluno}
      });
        alert(response.data.msg || "Alunos excluídos com sucesso!")
        setAlunosExcluir((prev) =>
        prev.filter((item) => !selectedAluno.includes(item.ID_Aluno)))
        carregarAlunosExcluir();
        onClose();
    } catch (err) {
      console.error("Erro ao excluir:", err);
      alert("Erro no servidor ao excluir itens");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Confirmar exclusão</h2>
        <p>Deseja realmente excluir os alunos selecionados?</p>

        <div className="footerModal">
          <button className="btnFilter" onClick={excluirAlunos}>
            Confirmar
          </button>
          <button className="btnFilter" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExcluirModal;
