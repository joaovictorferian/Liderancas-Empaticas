import { useState } from "react";
import api from "../api";

function CadastroUsuario() {
  const [formData, setFormData] = useState({
    nome: "",
    empresa: "",
    cpfCnpj: "",
    email: "",
    telefone: "",
    senha: "",
    confirmSenha: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validações no frontend
    if (!formData.nome || !formData.email || !formData.senha) {
      alert("Nome, e-mail e senha são obrigatórios!");
      return;
    }

    if (formData.senha !== formData.confirmSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    if (formData.senha.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres!");
      return;
    }

    setLoading(true);

    try {
      const dadosEnvio = {
        nome: formData.nome,
        empresa: formData.empresa,
        cpfCnpj: formData.cpfCnpj,
        email: formData.email,
        telefone: formData.telefone,
        senha: formData.senha,
        tabela: "Usuario"
      };

      const response = await api.post("/cadastroUsuario", dadosEnvio)

      alert(response.data.msg || "Usuário cadastrado com sucesso!")

        setFormData({
          nome: "",
          empresa: "",
          cpfCnpj: "",
          email: "",
          telefone: "",
          senha: "",
          confirmSenha: "",
        });

    } catch (err) {
      console.error("Erro no cadastro:", err);
      alert( err.response?.data?.error|| "Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Deseja cancelar o cadastro? Os dados serão perdidos.")) {
      setFormData({
        nome: "",
        empresa: "",
        cpfCnpj: "",
        email: "",
        telefone: "",
        senha: "",
        confirmSenha: "",
      });
    }

    onSelectPage("usuario");
  };

  return (
    <div className="cadastro-container">
      <h2>Cadastro de Colaborador</h2>

      <form className="cadastro-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome *</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Empresa</label>
          <input
            type="text"
            name="empresa"
            value={formData.empresa}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>CPF/CNPJ</label>
          <input
            type="text"
            name="cpfCnpj"
            value={formData.cpfCnpj}
            onChange={handleChange}
            maxLength="18"
          />
        </div>

        <div className="form-group">
          <label>E-mail *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Telefone</label>
          <input
            type="text"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            maxLength="15"
          />
        </div>

        <div className="form-group">
          <label>Senha *</label>
          <input
            type="password"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            required
            minLength="6"
          />
        </div>

        <div className="form-group">
          <label>Confirmação de senha *</label>
          <input
            type="password"
            name="confirmSenha"
            value={formData.confirmSenha}
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

export default CadastroUsuario;