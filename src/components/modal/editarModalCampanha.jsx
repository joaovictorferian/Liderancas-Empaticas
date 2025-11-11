import React from "react";
import api from "../../api";

function EditCampanhaModal({
  isOpen,
  campanhaEdit,
  setCampanhaEdit,
  onClose,
  carregarCampanhas,
}) {
  if (!isOpen || !campanhaEdit) return null;

  
  const formatarData = (data) => {
    if (!data) return "";
    try {
      return new Date(data).toISOString().split("T")[0];
    } catch {
      return data;
    }
  };

  const salvarEdicao = async () => {
    try {
      const dadosEditaveis = {
        Campanha_Nome: campanhaEdit.Campanha_Nome,
        Campanha_Local: campanhaEdit.Campanha_Local,
        Campanha_Meta: campanhaEdit.Campanha_Meta,
        finish_at: campanhaEdit.finish_at,
      }
      const response = await api.put(`/campanhas/${campanhaEdit.ID_Campanha}`, dadosEditaveis)
      setCampanhaEdit(response.data)      
      alert("Campanha atualizada com sucesso!")
      onClose();
      carregarCampanhas();
    } catch (error) {
      console.error("Erro no update da campanha:", error);
      alert("Erro no servidor ao atualizar campanha");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Editar Campanha</h2>

        <div className="formEdit">
          <label>ID:</label>
          <input type="text" value={campanhaEdit.ID_Campanha} readOnly />

          <label>Nome:</label>
          <input
            type="text"
            value={campanhaEdit.Campanha_Nome || ""}
            onChange={(e) =>
              setCampanhaEdit({
                ...campanhaEdit,
                Campanha_Nome: e.target.value,
              })
            }
          />

          <label>Local:</label>
          <input
            type="text"
            value={campanhaEdit.Campanha_Local || ""}
            onChange={(e) =>
              setCampanhaEdit({
                ...campanhaEdit,
                Campanha_Local: e.target.value,
              })
            }
          />

          <label>Grupo:</label>
          <input
            type="text"
            value={campanhaEdit.Campanha_Grupo || ""}
            readOnly
          />

          <label>Meta:</label>
          <input
            type="number"
            value={campanhaEdit.Campanha_Meta || ""}
            onChange={(e) =>
              setCampanhaEdit({
                ...campanhaEdit,
                Campanha_Meta: e.target.value,
              })
            }
          />

          <label>Quantidade:</label>
          <input
            type="number"
            value={campanhaEdit.Campanha_Quantidade || ""}
            readOnly
          />

          <label>Criado em:</label>
          <input
            type="date"
            value={formatarData(campanhaEdit.created_at)}
            readOnly
          />

          <label>Acaba em:</label>
          <input
            type="date"
            value={formatarData(campanhaEdit.finish_at)}
            onChange={(e) =>
              setCampanhaEdit({
                ...campanhaEdit,
                finish_at: e.target.value,
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

export default EditCampanhaModal;
