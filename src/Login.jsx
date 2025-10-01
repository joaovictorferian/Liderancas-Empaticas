import { useState } from 'react';
import './index.css'; 
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
    Usuario_Email: "",
    Usuario_Senha: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:500/api/users/login", 
        form
      );

      console.log("Resposta do backend:", res.data);
      alert(res.data.msg);

      // Armazena no localStorage
      if (res.data.ID_Usuario) {
        localStorage.setItem("ID_Usuario", res.data.ID_Usuario);
        console.log("ID salvo no localStorage:", res.data.ID_Usuario);
      }

      navigate("/admin");
    } catch (err) {
      console.error("Erro no login:", err.response?.data || err.message);
      alert("Erro no login: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="bodyImg"> 
      <div className="divLogin">
        <aside className="asideLogin">
          <img className="logo" src="logo.png" alt="Logo" />

          <p className="lbl_Bemvindo">
            Seja bem-vindo ao
            <br />
            Lideranças Empáticas
          </p>

          <form className="login" onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                name="Usuario_Email"                
                className="inputLogin"
                type="email"
                placeholder="Email"
                id="email"
                required
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <input
                name="Usuario_Senha"   
                className="inputLogin"
                type="password"
                placeholder="Senha"
                id="senha"                          
                required
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="botaoLogin">Login</button>
          </form>

          <p>Não tem uma conta? <a href="/cadastro">Cadastre-se</a></p>
          <p className="footer">&copy; 2025, 404 not found</p>
        </aside>
      </div>
    </div>
  );
}

export default Login;
