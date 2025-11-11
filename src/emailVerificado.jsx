import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function VerificandoEmail() {
  const navigate = useNavigate();
  const {tokenVerifyMail} = useParams()

  useEffect(() => {
    const emailVerificado = async () => {
        try{
            const response = await axios.get(`http://localhost:500/api/users/verificar/${tokenVerifyMail}`)
            alert(response.data.msg || "Email verificado com sucesso!")
            navigate("/")

        }catch(err){
            console.error("Erro ao verificar email", err)
            alert("Erro de conexão com o servidor")
        }        
    }
    emailVerificado()
  }, [tokenVerifyMail, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Verificando seu e-mail...</h2>
    </div>
  );
}

export default VerificandoEmail;
