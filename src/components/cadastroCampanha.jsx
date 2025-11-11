import { useState } from "react";
import api from "../api";

function CadastroCampanha({ onSelectPage }) {
  const [formData, setFormData] = useState({
    Campanha_Nome: "",
    Campanha_Local: "",
    Campanha_Grupo: "",
    Campanha_Meta: "",
    Campanha_Finalizacao: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validações simples
    if (
      !formData.Campanha_Nome ||
      !formData.Campanha_Local ||
      !formData.Campanha_Grupo ||
      !formData.Campanha_Meta ||
      !formData.Campanha_Finalizacao
    ) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    setLoading(true);

    try {
      const dadosEnvio = {
        ...formData,
        tabela: "Campanha",
      };

      const response = await api.post("/cadastroCampanha", dadosEnvio);
      alert(response.data.msg || "Campanha cadastrada com sucesso!");

      setFormData({
        Campanha_Nome: "",
        Campanha_Local: "",
        Campanha_Grupo: "",
        Campanha_Meta: "",
        Campanha_Finalizacao: "",
      });

      // Retorna à tela de campanhas
      if (onSelectPage) onSelectPage("campanhas");

    } catch (err) {
      console.error("Erro no cadastro:", err);
      alert(err.response?.data?.error || "Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Deseja cancelar o cadastro? Os dados serão perdidos.")) {
      setFormData({
        Campanha_Nome: "",
        Campanha_Local: "",
        Campanha_Grupo: "",
        Campanha_Meta: "",
        Campanha_Finalizacao: "",
      });

      if (onSelectPage) onSelectPage("campanhas");
    }
  };

  return (
    <div className="cadastro-container">
      <h2>Cadastro de Campanha</h2>

      <form className="cadastro-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome da Campanha *</label>
          <input
            type="text"
            name="Campanha_Nome"
            value={formData.Campanha_Nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Local *</label>
          <input
            type="text"
            name="Campanha_Local"
            value={formData.Campanha_Local}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Grupo *</label>
          <input
            type="text"
            name="Campanha_Grupo"
            value={formData.Campanha_Grupo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Meta *</label>
          <input
            type="number"
            name="Campanha_Meta"
            value={formData.Campanha_Meta}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Data de Finalização *</label>
          <input
            type="date"
            name="Campanha_Finalizacao"
            value={formData.Campanha_Finalizacao}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-buttons">
          <button
            type="submit"
            className="btn-confirmar"
            disabled={loading}
          >
            {loading ? "Cadastrando..." : "Confirmar Cadastro"}
          </button>

          <button
            type="button"
            className="btn-cancelar"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar Cadastro
          </button>
        </div>
      </form>
    </div>
  );
}

export default CadastroCampanha;
