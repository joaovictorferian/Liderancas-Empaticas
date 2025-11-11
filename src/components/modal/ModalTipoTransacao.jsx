import React from "react";


export default function ModalTipoTransacao({ onSelect }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Selecione o tipo de transação</h2>
        <p>Escolha o tipo de movimentação que deseja visualizar.</p>

        <div className="tipo-modal-buttons">
          <button
            className="tipo-btn entrada"
            onClick={() => onSelect("entrada")}
          >
           Entrada
          </button>
          <button className="tipo-btn saida" onClick={() => onSelect("saida")}>
           Saída
          </button>
        </div>
      </div>
    </div>
  );
}
