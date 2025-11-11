import { useState } from "react";
import api from "../api";

function CadastroGrupo({ onSelectPage }) {
  const [grupoData, setGrupoData] = useState({
    Grupo_Nome: "",
    Grupo_Curso: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGrupoData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!grupoData.Grupo_Nome || !grupoData.Grupo_Curso) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    setLoading(true);

    try {
      const dadosEnvio = {
        Grupo_Nome: grupoData.Grupo_Nome,
        Grupo_Curso: grupoData.Grupo_Curso,
        tabela: "Grupo"
      };

      const response = await api.post("/cadastroGrupo", dadosEnvio);
      alert(response.data.msg || "Grupo cadastrado com sucesso!");

      setGrupoData(response.data)

      if (onSelectPage) onSelectPage("grupo");

    } catch (err) {
      console.error("Erro no cadastro:", err);
      alert(err.response?.data?.error || "Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Deseja cancelar o cadastro? Os dados serão perdidos.")) {
      setGrupoData({
        Grupo_Nome: "",
        Grupo_Curso: "",
      });
      
      if (onSelectPage) onSelectPage("grupo");
      console.log(onSelectPage)
    }
  };

  return (
    <div className="cadastro-container">
      <h2>Cadastro de Grupo</h2>

      <form className="cadastro-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome do Grupo *</label>
          <input
            type="text"
            name="Grupo_Nome"
            value={grupoData.Grupo_Nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Curso *</label>
          <input
            type="text"
            name="Grupo_Curso"
            value={grupoData.Grupo_Curso}
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

export default CadastroGrupo;
