import React from "react";

const PainelSuporte = ({
  chamadosAbertos,
  chamadosEmSolucao,
  chamadosFinalizados,
  onNovoChamado,
  onVerChamados,
}) => {
  return (
    <section className="painel-suporte">
      <h2 className="titulo-secao">Suporte</h2>

      <div className="caixa-status verde">
        <button
          className="btnChamados"
          onClick={() => onVerChamados("Aberto")}
        >
          <p>Chamados abertos</p>
          <span className="numero">{chamadosAbertos.length}</span>
        </button>
      </div>

      <div className="caixa-status verde">
        <button
          className="btnChamados"
          onClick={() => onVerChamados("Em solução")}
        >
          <p>Chamados em solução</p>
          <span className="numero">{chamadosEmSolucao.length}</span>
        </button>
      </div>

      <div className="caixa-status verde">
        <button
          className="btnChamados"
          onClick={() => onVerChamados("Finalizado")}
        >
          <p>Chamados finalizados</p>
          <span className="numero">{chamadosFinalizados.length}</span>
        </button>
      </div>

      <button className="botao-abrir-chamado" onClick={onNovoChamado}>
        Abrir mais chamados +
      </button>
    </section>
  );
};

export default PainelSuporte;
