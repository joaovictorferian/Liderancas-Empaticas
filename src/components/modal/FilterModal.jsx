import React, { useState } from "react";
import api from "../../api";

const opcoesNumericas = [
  { value: "igual", label: "é igual a" },
  { value: "maior", label: "é maior que" },
  { value: "menor", label: "é menor que" },
];

const opcoesTextuais = [
  { value: "igual", label: "é igual a" },
  { value: "contem", label: "contém" },
  { value: "naoContem", label: "não contém" },
];

function FiltroModal({
  isOpen,
  onClose,
  filtros,
  setFiltros,
  valorSelecionado,
  setValorSelecionado,
  filterSelecionado,
  setFilterSelecionado,
  usuariosOriginais,
  setResponse,
  campos,
  tabela,
}) {
  const [valorFiltro, setValorFiltro] = useState("");

  if (!isOpen) return null;

  const aplicarFiltros = async () => {
    try {
      console.log("tabela definida", tabela)
      const response = await api.post("/filtrar", {filtros, tabela})
      setResponse(response.data);
      onClose();
    } catch (err) {
      console.error("Erro ao aplicar filtros:", err);
      alert("Erro ao aplicar filtros");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Filtrar</h2>

        <div className="sectionfilter">
          <select
            name="selectFilter"
            value={valorSelecionado}
            onChange={(e) => setValorSelecionado(e.target.value)}
          >
            {campos.map((campo) => (
              <option key={campo.value} value={campo.value}>
                {campo.label}
              </option>
            ))}
          </select>

          <select
            value={filterSelecionado}
            onChange={(e) => setFilterSelecionado(e.target.value)}
          >
            {(valorSelecionado === "ID_Usuario" ||
            valorSelecionado === "Campanha_Meta" ||
            valorSelecionado === "Campanha_Quantidade" ||
            valorSelecionado === "ID_Campanha" ||
            valorSelecionado === "ID_transacao" ||
            valorSelecionado === "transacao_Valor"
              ? opcoesNumericas
              : opcoesTextuais
            ).map((op) => (
              <option key={op.value} value={op.value}>
                {op.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Digite o valor..."
            value={valorFiltro}
            onChange={(e) => setValorFiltro(e.target.value)}
          />

          <button
            className="btnFilter"
            onClick={() => {
              if (!valorFiltro.trim()) return alert("Digite um valor!");
              const novoFiltro = {
                campo: valorSelecionado,
                condicao: filterSelecionado,
                valor: valorFiltro.trim(),
              };
              setFiltros((prev) => [...prev, novoFiltro]);
              setValorFiltro("");
            }}
          >
            Adicionar
          </button>
        </div>

        {filtros.length > 0 && (
          <div className="lista-filtros">
            <h4>Filtros adicionados:</h4>
            {filtros.map((f, i) => (
              <div key={i} className="filtro-item">
                <span>
                  {f.campo?.replace("Usuario_", "")} {f.condicao} "{f.valor}"
                </span>
                <button
                  className="btnRemoverFiltro"
                  onClick={() =>
                    setFiltros((prev) => prev.filter((_, idx) => idx !== i))
                  }
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="footerModal">
          <button className="btnFilter" onClick={aplicarFiltros}>
            Aplicar Filtros
          </button>
          <button
            className="btnFilter"
            onClick={() => {
              setResponse(usuariosOriginais);
              setFiltros([]);
              onClose();
            }}
          >
            Limpar Filtros
          </button>
          <button className="btnFilter" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default FiltroModal;
