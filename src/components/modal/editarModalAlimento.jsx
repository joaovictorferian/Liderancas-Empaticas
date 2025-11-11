import React from "react";
import api from "../../api";

function editarModalAlimento({
  isOpen,
  alimentoEdit,
  setAlimentoEdit,
  onClose,
  carregarAlimentos
}) {
  if (!isOpen || !alimentoEdit) return null;

  const salvarEdicaoAlimentos = async () => {
    try {
      const dadosEditaveis = {
        Alimento_Validade: alimentoEdit.Alimento_Validade,
        Alimento_Quantidade: alimentoEdit.Alimento_Quantidade
      };
      console.log("log de alimento:", dadosEditaveis)
      const response = await api.put(`/alimentos/${alimentoEdit.ID_Alimento}`, dadosEditaveis);
      setAlimentoEdit(response.data)
      alert("Alimento atualizado com sucesso!");
      onClose();
      carregarAlimentos();
    } catch (error) {
      console.error("Erro no update:", error);
      alert("Erro no servidor ao atualizar alimento");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Editar Alimento</h2>

        <div className="formEdit">
          <label>ID:</label>
          <input type="text" value={alimentoEdit.ID_Alimento} readOnly />

          <label>Validade:</label>
          <input
            type="text"
            value={alimentoEdit.Alimento_Validade || ""}
            onChange={(e) =>
              setAlimentoEdit({ ...alimentoEdit, Alimento_Validade: e.target.value })
            }
          />

          <label>Quantidade:</label>
          <input
            type="text"
            value={alimentoEdit.Alimento_Quantidade || ""}
            onChange={(e) =>
              setAlimentoEdit({
                ...alimentoEdit,
                Alimento_Quantidade: e.target.value,
              })
            }
          />
        
        </div>

        <div className="footerModal">
          <button className="btnFilter" onClick={onClose}>
            Fechar
          </button>
          <button className="btnFilter" onClick={salvarEdicaoAlimentos}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

export default editarModalAlimento;
