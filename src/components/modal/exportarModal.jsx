import React from "react";

function ExportModal({
  isOpen,
  onClose,
  exportType,
  setExportType,
  fileName,
  setFileName,
  rangeStart,
  setRangeStart,
  rangeEnd,
  setRangeEnd,
  exportarUsuarios,
  exportarEscolhendoLocal,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Exportar Usuários</h2>
        <label>
          Nome do arquivo:
          <input
            className="inpNomeArquivo"
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </label>

        {exportType === "intervalo" && (
          <label>
            Digite o ID inicial e o ID final:
            <div className="inputs-Exportar">
              <input
                className="inpRange"
                type="number"
                placeholder="Início"
                value={rangeStart}
                onChange={(e) => setRangeStart(e.target.value)}
              />
              <input
                className="inpRange"
                type="number"
                placeholder="Fim"
                value={rangeEnd}
                onChange={(e) => setRangeEnd(e.target.value)}
              />
            </div>
          </label>
        )}

        <div className="export-options">
          <label className="radio-option">
            <input
              type="radio"
              name="exportType"
              value="intervalo"
              checked={exportType === "intervalo"}
              onChange={() => setExportType("intervalo")}
            />
            Exportar por intervalo de IDs
          </label>

          <label className="radio-option">
            <input
              type="radio"
              name="exportType"
              value="todos"
              checked={exportType === "todos"}
              onChange={() => setExportType("todos")}
            />
            Exportar todos
          </label>
        </div>

        <div className="modal-actions">
          <button onClick={exportarUsuarios} className="botaoLogin">
            Exportar
          </button>
          <button onClick={onClose} className="botaoLogin">
            Cancelar
          </button>
          <button onClick={exportarEscolhendoLocal} className="botaoLogin teste">
            Escolher local
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExportModal;
