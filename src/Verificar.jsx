import { useParams } from "react-router-dom";
import axios from "axios";
import api from "./api";

function Verificar(){ 
    const email = localStorage.getItem("alunoEmail")

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            const res = await api.post(
                `/enviaremail`,
                {email}
             )
             console.log("Requisição recebida", res)

             console.log("Resposta do backend", res.data)

        }catch(err){
            console.error("Erro na verificação", err.response?.data || err.message)
            alert("Erro na verificação: " + (err.response?.data?.error || err.message))
        }        
    }

    return(
        <div className="divVerificar">
            
        <aside className="asideVerificar">
            <img className="logoVerificar" src="/LogoFundoBranco.avif" alt="logo" />
            <h1 className="h1VerificarEmail">Verificação de E-mail</h1>
            <p className="pVerificar">Não recebeu? <a href=""> Reenviar código</a></p>
            <h1 className="h1Verificar">Clique no botão abaixo para verificar seu E-mail. Um código será enviado para o seu e-mail logo após.
            Verifique sua caixa de e-mail e entre na sua conta! (Confira a caixa de spam ou a lixeira.)</h1>
            <form onSubmit={handleSubmit}>
            <button type = "submit" className="btnVerificar">Verificar</button>
            </form>

        </aside>
        
        </div>
        

    )
}

export default Verificar;