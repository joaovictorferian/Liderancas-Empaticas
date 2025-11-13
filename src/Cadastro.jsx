import { useState } from "react"
import axios from "axios"
import Login from "./Login";

function Register() {
    const [form, setForm] = useState({
        Usuario_Nome: "",
        Usuario_Email: "",
        Usuario_Senha: "",
        Usuario_RA: "",
        Usuario_CPF: "",
        Usuario_Cargo: "",
        Usuario_Telefone: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Enviando form:", form) 
        try {
            const res = await axios.post("https://projeto404-site-backend.vercel.app/api/users/register", form)
            console.log("Resposta do backend:", res.data)
            alert(res.data.msg)
            window.location.href = "login";

        }
        catch (err) {
            console.error("Erro no cadastro:", err.response?.data || err.message)
            alert("Erro no cadastro:" + (err.response?.data?.error || err.message))
        }
    }

    return (
        <div className="bodyImg">
            <aside className="asideCadastro">
                <img className="logoCadastro" src="logo.png" alt="logo" />
                <h1 className="h1Cadastro">Crie sua conta agora e impulsione lideranças empáticas</h1>

                <form className="formCadastro" onSubmit={handleSubmit}>
                    <div className="inputGroupRow">
                        <input 
                          type="text" 
                          name="Usuario_Nome" 
                          placeholder="Primeiro Nome*" 
                          className="inputCadastro"
                          onChange={handleChange}
                          required
                        />
                        <input 
                          type="text" 
                          name="Usuario_RA" 
                          placeholder="Matrícula*" 
                          className="inputCadastro"
                          onChange={handleChange}
                          required
                        />
                    </div>

                    <input 
                      type="email" 
                      name="Usuario_Email" 
                      placeholder="E-mail*" 
                      className="inputCadastro"
                      onChange={handleChange}
                      required
                    />

                    <input 
                      type="password" 
                      name="Usuario_Senha" 
                      placeholder="Senha*" 
                      className="inputCadastro"
                      onChange={handleChange}
                      required
                    />

                    <div className="inputGroupRow">
                        <input 
                          type="text" 
                          name="Usuario_Cargo" 
                          placeholder="Cargo*" 
                          className="inputCadastro"
                          onChange={handleChange}
                          required
                        />
                        <input 
                          type="text" 
                          name="Usuario_Telefone" 
                          placeholder="Telefone*" 
                          className="inputCadastro"
                          onChange={handleChange}
                          required
                        />
                    </div>

                    <button type="submit" className="btnProximo">Próximo</button>                 
          
                </form>
                
            </aside>
            
        </div>
    )
}

export default Register