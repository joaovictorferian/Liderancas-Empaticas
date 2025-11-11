import { useState, useEffect } from 'react';
import './index.css'; 
import { useNavigate } from "react-router-dom";
import api from "./api.js"

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showAdminButton, setShowAdminButton] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/login", { email, senha });
      const { msg, token, verificado, tipo, ID, error, Grupo } = res.data;

      if (error) {
        alert(error);
        return;
      }


      if(Grupo){
        localStorage.setItem("Aluno_Grupo", Grupo);
      }
      localStorage.setItem("Tipo_Usuario", tipo);
     
      localStorage.setItem("token", token);
      localStorage.setItem("Email", email);
      localStorage.setItem("ID_Usuario", ID);

      alert(msg);

      console.log("Tipo:", tipo);
      console.log("ID:", ID);

      const tipoLower = (tipo || "").toString().toLowerCase();
      if (tipoLower === "aluno") {
        setShowAdminButton(false);
        setShowLogout(true);
      } else if (tipoLower === "usuario") {
        if (ID) localStorage.setItem("ID_Usuario", ID);
        setShowAdminButton(true);
        setShowLogout(true);
      } else {
        setShowAdminButton(false);
        setShowLogout(!!token);
      }

      if (verificado != 1) {
        navigate(`/enviaremail/${token}`);
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Erro no login:", err.response?.data || err.message);
      alert("Erro no login: " + (err.response?.data?.error || err.message));
    }
  };

  useEffect(() => {
    const storedTipo = (localStorage.getItem("Tipo_Usuario") || "").toLowerCase();
    const storedID = localStorage.getItem("ID_Usuario");
    const token = localStorage.getItem("token");
    if (storedTipo === "aluno") {
      setShowAdminButton(false);
      setShowLogout(!!token);
    } else if (storedTipo === "usuario" && storedID) {
      setShowAdminButton(true);
      setShowLogout(!!token);
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("ID_Usuario");
      localStorage.removeItem("Tipo_Usuario");
      localStorage.removeItem("Email");
    } catch (err) {
      console.warn("Erro ao limpar localStorage:", err);
    }
    setShowAdminButton(false);
    setShowLogout(false);

    navigate("/");
  };

  return (
    <div className="bodyImg">
      <div className="divLogin">
        <aside className="asideLogin">
          <img className="logo" src="/logo.png" alt="Logo" />

          <p className="lbl_Bemvindo">
            Seja bem-vindo ao
            <br />
            Lideranças Empáticas
          </p>

          <p>
            Não tem uma conta? <a href="/forms">Cadastre-se</a>
          </p>

          <form className="login" onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                className="inputLogin"
                type="email"
                placeholder="Email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <input
                className="inputLogin"
                type="password"
                placeholder="Senha"
                required
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            <button type="submit" className="botaoLogin">
              Login
            </button>
          </form>

          <a href="/esquecer-senha">Esqueci minha senha</a>
          <div className="connect-area">
            {showAdminButton && (
              <a className="botaoAdmin" href="/admin">Admin</a>
            )}

            {showLogout && (
              <button className="conecteSeBtn" onClick={handleLogout}>Deslogar</button>
            )}
          </div>
          <p className="footerLogin">&copy; 2025, 404 not found</p>
        </aside>
      </div>
    </div>
  );
}
export default Login;
