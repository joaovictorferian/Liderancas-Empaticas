import { useState } from "react";
import api from "../api";

function CadastroAluno({ onSelectPage }) {
  const [formData, setFormData] = useState({
    Aluno_Nome: "",
    Aluno_Email: "",
    Aluno_RA: "",
    Grupo: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validações
    if (!formData.Aluno_Nome || !formData.Aluno_Email || !formData.Aluno_RA || !formData.Grupo) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    setLoading(true);

    try {
      const dadosEnvio = {
        Aluno_Nome: formData.Aluno_Nome,
        Aluno_Email: formData.Aluno_Email,
        Aluno_RA: formData.Aluno_RA,
        Grupo: formData.Grupo,   
        tabela: "Aluno"
      };

      const response = await api.post("/cadastroAluno", dadosEnvio);
      alert(response.data.msg || "Aluno cadastrado com sucesso!");

      setFormData(response.data)
      
      if (onSelectPage) onSelectPage("aluno");

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
        Aluno_Nome: "",
        Aluno_Email: "",
        Aluno_RA: "",
        Grupo: "",
        Aluno_Senha: "",
        confirmSenha: "",
      });

      if (onSelectPage) onSelectPage("aluno");
    }
  };

  return (
    <div className="cadastro-container">
      <h2>Cadastro de Aluno</h2>

      <form className="cadastro-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome *</label>
          <input
            type="text"
            name="Aluno_Nome"
            value={formData.Aluno_Nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="Aluno_Email"
            value={formData.Aluno_Email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Matrícula *</label>
          <input
            type="text"
            name="Aluno_RA"
            value={formData.Aluno_RA}
            onChange={handleChange}
            maxLength="18"
            required
          />
        </div>

        <div className="form-group">
          <label>Grupo *</label>
          <input
            type="text"
            name="Grupo"
            value={formData.Grupo}
            onChange={handleChange}
            maxLength="15"
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

export default CadastroAluno;
