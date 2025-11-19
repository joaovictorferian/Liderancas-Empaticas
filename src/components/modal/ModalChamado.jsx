import React, { useEffect, useState } from "react";
import { FaTimes, FaPaperPlane } from "react-icons/fa";
import api from "../../api.js";

const ModalChamado = ({ chamado, onClose }) => {
  const [mensagens, setMensagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [novaMensagem, setNovaMensagem] = useState("");
  const ID_Usuario = localStorage.getItem("ID_Usuario");
  const Tipo_Usuario = localStorage.getItem("Tipo_Usuario");

  const carregarMensagens = async () => {
    try {
      const ID_Chamado = chamado.ID_Chamado;
      const res = await api.get(`/getMensagensChamado/${ID_Chamado}`);
      if (res.data) {
        setMensagens(Array.isArray(res.data) ? res.data : []);
      } else {
        alert(res.error || "Erro ao carregar mensagens.");
      }
    } catch (err) {
      console.error("Erro ao buscar mensagens:", err);
      alert("Erro no servidor ao buscar mensagens.");
    } finally {
      setLoading(false);
    }
  };

  const enviarMensagem = async () => {
    if (!novaMensagem.trim())
      return alert("Digite uma mensagem antes de enviar.");

    try {
      const resMensagem = await api.post("/enviarMensagem", {
        ID_Chamado: chamado.ID_Chamado,
        Mensagem: novaMensagem,
        Remetente: ID_Usuario,
        Remetente_Tipo: Tipo_Usuario,
      });

      if (resMensagem.status === 201) {
        setNovaMensagem("");
        carregarMensagens();
      } else {
        alert(resMensagem.data.error || "Erro ao enviar mensagem.");
      }
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
      alert("Erro no servidor ao enviar mensagem.");
    }
  };

  useEffect(() => {
    carregarMensagens();
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="chamados-header">
          <h2>{chamado.Chamado_Titulo}</h2>
          <button className="btn-fechar-modal" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <p>
          <strong>Status:</strong> {chamado.Chamado_Status}
        </p>

        {loading ? (
          <p>Carregando mensagens...</p>
        ) : mensagens.length === 0 ? (
          <p>Nenhuma mensagem encontrada.</p>
        ) : (
          <div className="mensagens-lista">
            {mensagens.map((m) => {
            let remetente = m.Remetente
            let tipoRemetente = m.Tipo_Remetente
           
              let isSuporte =
              tipoRemetente == "Usuario" && remetente == 1;

              // Define a classe correta
              const classeMsg = isSuporte
                ? "mensagem-item suporte-mensagem"
                : "mensagem-item aluno-mensagem";

              return (
                <div key={m.ID_ChamadosMensagem} className={classeMsg}>
                  <p>{m.Mensagem}</p>
                  <small>{m.DataEnvio}</small>
                </div>
              );
            })}
          </div>
        )}

        <div className="enviar-mensagem">
          <input
            type="text"
            className="input-mensagem"
            placeholder="Digite sua mensagem..."
            value={novaMensagem}
            onChange={(e) => setNovaMensagem(e.target.value)}
          />
          <button className="btn-enviar" onClick={enviarMensagem}>
            <FaPaperPlane /> Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalChamado;
