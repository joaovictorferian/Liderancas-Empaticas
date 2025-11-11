import { useState } from "react";
import api from "../api.js";

function CadastroDinheiro({ onSelectPage }) {
  const [tipo, setTipo] = useState("entrada");
  const [formData, setFormData] = useState({
    transacao_Grupo: "",
    transacao_Aluno: "",
    transacao_Valor: "",
    transacao_Comprovante: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.transacao_Grupo || !formData.transacao_Aluno || !formData.transacao_Valor) {
      alert("Preencha os campos obrigatórios (Grupo, Aluno, Valor)");
      return;
    }

    setLoading(true);
    try {
      const tabela = tipo === "entrada" ? "TransacaoEntrada" : "TransacaoSaida";
      const body = { ...formData, transacao_Tipo: tipo, tabela };

      const response = await api.post("/transacao", body);
      alert(response.data.msg || "Transação cadastrada com sucesso");

      setFormData({ transacao_Grupo: "", transacao_Aluno: "", transacao_Valor: "", transacao_Comprovante: "" });

      if (onSelectPage) onSelectPage("dinheiro");
    } catch (err) {
      console.error("Erro no cadastro de transação:", err.response || err);
      alert(err.response?.data?.error || "Erro ao cadastrar transação");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onSelectPage) onSelectPage("dinheiro");
  };

  return (
    <div className="cadastro-container">
      <h2>Cadastro de Transação</h2>

      <div className="tipo-btns-container">
        <button
          className={`bntTiposEntrada ${tipo === 'entrada' ? 'bntTiposEntradaSelecionado' : ''}`}
          onClick={() => setTipo('entrada')}
        >
          Entrada
        </button>
        <button
          className={`bntTiposEntrada ${tipo === 'saida' ? 'bntTiposEntradaSelecionado' : ''}`}
          onClick={() => setTipo('saida')}
        >
          Saída
        </button>
      </div>

      <form className="cadastro-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Grupo *</label>
          <input type="text" name="transacao_Grupo" value={formData.transacao_Grupo} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Aluno *</label>
          <input type="text" name="transacao_Aluno" value={formData.transacao_Aluno} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Valor *</label>
          <input type="number" name="transacao_Valor" value={formData.transacao_Valor} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Comprovante</label>
          <input type="text" name="transacao_Comprovante" value={formData.transacao_Comprovante} onChange={handleChange} />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-confirmar" disabled={loading}>{loading ? 'Cadastrando...' : `Cadastrar ${tipo === 'entrada' ? 'Entrada' : 'Saída'}`}</button>
          <button type="button" className="btn-cancelar" onClick={handleCancel} disabled={loading}>Cancelar Cadastro</button>
        </div>
      </form>
    </div>
  );
}

export default CadastroDinheiro;
