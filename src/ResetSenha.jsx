import { useState } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

function ResetSenha() {
  console.log("Componente ResetSenha renderizado")
  const [senha, setSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [mensagem, setMensagem] = useState("")
  const {token} = useParams()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Clicou no botão!");

    try {
      console.log("Enviando requisição...");
      const response = await axios.put(
      `http://localhost:500/api/users/auth/resetPassword/${token}`,
        {senha, confirmarSenha }
      )
      console.log("Resposta recebida:", response.data);
      setMensagem(response.data.message)
      // Clear any stale auth state so the login page doesn't show admin/logout buttons
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("ID_Usuario");
        localStorage.removeItem("Tipo_Usuario");
        localStorage.removeItem("Email");
      } catch (e) {
        console.warn("Erro limpando localStorage após reset de senha:", e);
      }
      navigate("/login")
    } catch (err) {
      // Try to extract a meaningful error message from the server response
      console.error("Erro ao mudar a senha", err);
      const serverMessage = err?.response?.data?.error || err?.response?.data?.message || err?.message;
      setMensagem(serverMessage || "Erro ao redefinir senha.");
    }
  }

  return (
    <div className="divResetSenha">
      <aside className="asideResetSenha">
        <img className="logoResetSenha" src="/LogoFundoBranco.avif" alt="logo" />
        <h1 className="h1ResetSenha">Recuperação de senha</h1>
        <h2 className="h2ResetSenha">
          Digite sua nova senha abaixo e confirme. As senhas digitadas devem ser exatamente iguais.
        </h2>

        <form className="formResetSenha" onSubmit={handleSubmit}>
          <input
            className="inputResetSenha"
            type="password"
            id="senha"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <input
            className="inputResetSenha"
            type="password"
            id="confirmarSenha"
            placeholder="Confirmar Senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
          />
          <button type="submit" className="btnResetSenha">
            Confirmar
          </button>
        </form>
        {mensagem && <p>{mensagem}</p>}
      </aside>
    </div>
  )
}

export default ResetSenha
