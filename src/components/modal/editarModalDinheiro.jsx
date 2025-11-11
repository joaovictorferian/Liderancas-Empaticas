import React from "react";
import api from "../../api.js";

function EditarModalDinheiro({ isOpen, onClose, transacaoEdit, settransacaoEdit, carregartransacoes }) {
  if (!isOpen || !transacaoEdit) return null;

  const salvarEdicao = async () => {
    try {
      const id =
        transacaoEdit.ID_transacao ||
        transacaoEdit.ID_Transacao ||
        transacaoEdit.ID_TransacaoEntrada ||
        transacaoEdit.ID_TransacaoSaida ||
        transacaoEdit.id;
      const body = {
        transacao_Grupo: transacaoEdit.transacao_Grupo,
        transacao_Aluno: transacaoEdit.transacao_Aluno,
        transacao_Valor: transacaoEdit.transacao_Valor,
        transacao_Tipo: transacaoEdit.transacao_Tipo,
        transacao_Comprovante: transacaoEdit.transacao_Comprovante,
        tabela:
          transacaoEdit.transacao_Tipo === "entrada"
            ? "TransacaoEntrada"
            : transacaoEdit.transacao_Tipo === "saida"
              ? "TransacaoSaida"
              : undefined,
      };

      // determine tipo (entrada/saida) — prefer explicit field, otherwise infer from ID properties
      const tipo =
        transacaoEdit.transacao_Tipo ||
        (transacaoEdit.ID_TransacaoEntrada ? "entrada" :
         transacaoEdit.ID_TransacaoSaida ? "saida" : undefined);

      if (!tipo) {
        alert("Não foi possível determinar o tipo da transação (entrada/saida)");
        return;
      }

      const idValue = tipo === "entrada" ? (transacaoEdit.ID_TransacaoEntrada || id) : (transacaoEdit.ID_TransacaoSaida || id);

      // Debug log to help trace requests
      console.log("EditarTransacao -> PUT", `/transacao/${tipo}/${idValue}`, body);

      const response = await api.put(`/transacao/${tipo}/${idValue}`, body);
      const data = response.data;

      if (!response || response.status >= 400) {
        alert(data?.error || "Erro ao atualizar transação");
        return;
      }

      alert(`Transação de ${tipo} atualizada com sucesso!`);
      onClose();
      carregartransacoes();

    } catch (error) {
      console.error("Erro ao atualizar transação:", error);
      alert("Erro no servidor ao atualizar transação");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Editar Transação</h2>

        <div className="formEdit">
          <label>ID:</label>
          <input type="text" value={transacaoEdit.ID_transacao || transacaoEdit.ID_Transacao || ''} readOnly />

          <label>Grupo:</label>
          <input
            type="text"
            value={transacaoEdit.transacao_Grupo || ""}
            onChange={(e) => settransacaoEdit({ ...transacaoEdit, transacao_Grupo: e.target.value })}
          />

          <label>Aluno:</label>
          <input
            type="text"
            value={transacaoEdit.transacao_Aluno || ""}
            onChange={(e) => settransacaoEdit({ ...transacaoEdit, transacao_Aluno: e.target.value })}
          />

          <label>Valor:</label>
          <input
            type="number"
            value={transacaoEdit.transacao_Valor || ""}
            onChange={(e) => settransacaoEdit({ ...transacaoEdit, transacao_Valor: e.target.value })}
          />

          <label>Tipo:</label>
          <input
            type="text"
            value={transacaoEdit.transacao_Tipo || ""}
            onChange={(e) => settransacaoEdit({ ...transacaoEdit, transacao_Tipo: e.target.value })}
          />

          <label>Comprovante:</label>
          <input
            type="text"
            value={transacaoEdit.transacao_Comprovante || ""}
            onChange={(e) => settransacaoEdit({ ...transacaoEdit, transacao_Comprovante: e.target.value })}
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

export default EditarModalDinheiro;
