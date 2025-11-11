import React from "react";
import api from "../../api";

function DeleteModal({
  isOpen,
  onClose,
  selected,
  setItens, 
  idField,
  carregarItens, 
  tabela
}) {
  if (!isOpen) return null;

  const excluirItens = async () => {
    try {   
      const response = await api.delete('/deleteFromTable', {
        data:{ids:selected, tabela: tabela}});
        console.log("ids da exclusão",selected)
        alert(response.data.msg || "Itens excluídos com sucesso!");
        setItens((prev) => prev.filter((item) => !selected.includes(item[idField])));
        carregarItens();
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
        <p>Deseja realmente excluir os itens selecionados?</p>

        <div className="footerModal">
          <button className="btnFilter" onClick={excluirItens}>
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

export default DeleteModal;
