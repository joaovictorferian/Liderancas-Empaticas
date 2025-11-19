import React, { useState } from "react";
import { FaTrashAlt, FaArrowLeft, FaSignInAlt } from "react-icons/fa";
import ModalChamado from "./modal/ModalChamado";
import api from "../api.js";
const Chamados = ({ tipo, chamados, onVoltar, carregarChamados }) => {
  const [chamadoSelecionado, setChamadoSelecionado] = useState(null);

  const filtrados = chamados.filter((c) => c.Chamado_Status === tipo);

  const excluirChamado = async (ID_Chamado) => {
    try {
      const Criador_Tipo = localStorage.getItem("Tipo_Usuario") || "Usuario";
      console.log("ExcluirChamado -> payload:", { ID_Chamado, Criador_Tipo });
      const response = await api.delete("/deleteChamado", { data: { ID_Chamado, Criador_Tipo } });
      alert(response.data?.msg || "Chamado excluído com sucesso!");
      if (carregarChamados) carregarChamados(); // atualiza a lista
    } catch (err) {
      console.error("Erro ao excluir chamado:", err);
      alert("Erro ao excluir chamado.");
    }
  };
  

  return (
    <div className="chamados-tela">
      <div className="chamados-header">
        <h2>{`Chamados ${tipo}`}</h2>
        <button className="btn-voltar" onClick={onVoltar}>
          <FaArrowLeft /> Voltar
        </button>
      </div>

      {filtrados.length === 0 ? (
        <p className="sem-chamados">Nenhum chamado encontrado.</p>
      ) : (
        <div className="lista-chamados">
          {filtrados.map((c) => (
            <div key={c.ID_Chamado} className="chamado-card">
              <div>
                <h3>{c.Chamado_Titulo}</h3>
                <p>Status: {c.Chamado_Status}</p>
                <small>
                  Criado em:{" "}
                  {new Date(c.created_at).toLocaleDateString("pt-BR")}
                </small>
              </div>
              <div className="acoes-chamado">
                <button
                  className="btn-entrar"
                  onClick={() => setChamadoSelecionado(c)}
                >
                  <FaSignInAlt /> Entrar
                </button>
                <button
                  className="btn-excluir"
                  onClick={() => excluirChamado(c.ID_Chamado)}
                >
                  <FaTrashAlt /> Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {chamadoSelecionado && (
        <ModalChamado
          chamado={chamadoSelecionado}
          onClose={() => setChamadoSelecionado(null)}
        />
      )}
    </div>
  );
};

export default Chamados;
