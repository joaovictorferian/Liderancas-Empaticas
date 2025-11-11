import React, { useState } from "react";
import api from "../../api.js";

export default function CriacaoChamado({
  onClose,
  onChamadoAdicionado,
  carregarChamados,
}) {
  const [Chamado_Titulo, setChamado_Titulo] = useState("");
  const [Mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const Criador_Tipo = localStorage.getItem("Tipo_Usuario");
  console.log("tipo: ", Criador_Tipo);

  const adicionarChamado = async () => {
    if (!Chamado_Titulo || !Mensagem) {
      alert("Preencha o título e a descrição!");
      return;
    }

    setLoading(true);
    const Chamado_Criador = localStorage.getItem("ID_Usuario");

    try {
      const res = await api.post("/AdicionarChamados", {
        Chamado_Titulo,
        Mensagem,
        Chamado_Criador,
        Criador_Tipo,
      });

      alert(res.data?.msg || "Chamado criado com sucesso!");

      if (onChamadoAdicionado) onChamadoAdicionado(res.data);
      if (carregarChamados) carregarChamados();

      onClose();
    } catch (err) {
      console.error("Erro ao criar chamado:", err);
      alert(err.response?.data?.error || "Erro no servidor ao criar chamado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Adicionar chamado</h2>

        <p>Digite o título do chamado abaixo!</p>
        <input
          type="text"
          value={Chamado_Titulo}
          onChange={(e) => setChamado_Titulo(e.target.value)}
          placeholder="Título do chamado"
          disabled={loading}
        />

        <p>Descreva de forma detalhada o problema encontrado!</p>
        <textarea
          rows="8"
          cols="50"
          value={Mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          placeholder="Descreva o chamado aqui..."
          disabled={loading}
        ></textarea>

        <div className="botoes-modal">
          <button
            type="button"
            className="tipo-btn entrada"
            onClick={adicionarChamado}
            disabled={loading}
          >
            {loading ? "Enviando..." : "Adicionar +"}
          </button>

          <button
            type="button"
            className="tipo-btn saida"
            onClick={() => {
              onClose();
              carregarChamados();
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
