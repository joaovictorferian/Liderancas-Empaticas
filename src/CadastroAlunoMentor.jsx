import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CadastroAlunoMentor() {
  const [mentor, setMentor] = useState({
    Mentor_Nome: "",
    Mentor_RA: "", 
    Mentor_Email: "",
    Mentor_Senha: ""
  })

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()    
  }

  useEffect(() => {
    const qtd = Number(localStorage.getItem("qtdIntegrantes") || 0);
    if (!qtd) {
      navigate("/forms", { replace: true });
    }
  }, [navigate]);

  const continuar = () => {
    const mentorData ={
      nome: mentor.Mentor_Nome.trim(),
      ra: mentor.Mentor_RA.trim(),
      email: mentor.Mentor_Email.trim(),
      senha: mentor.Mentor_Senha.trim()
    }
    localStorage.setItem("firstIntegrante", JSON.stringify(mentorData));
    navigate("/cadastroalunos");
  };

  return (    
    <div className="formsMentor">
      <div className="formsTituloMentor">
        <header className="headerFormsMentor">
          <img className="logoForms" src="LogoFundoBranco.avif" alt="logo" />
          <h1>Lideranças Empáticas</h1>
        </header>
        <div className="TituloFormsMentor">
        <h2>
          Este questionário foi desenvolvido para facilitar o cadastro de todos
          os grupos da FECAP interessados em participar do projeto "Lideranças
          Empáticas".
        </h2>
        <p>
          As informações aqui coletadas serão tratadas de forma anônima e
          protegida. Como o projeto é exclusivo para membros da Fundação,
          pedimos que utilizem o e-mail institucional da FECAP para que possamos
          realizar o controle dos alunos participantes.
        </p>
        </div>      
      
      <form onSubmit={handleSubmit}>
      <div className="perguntaMentor">
        <p className="tituloPerguntaMentor">1.0  Nome do aluno mentor</p>
      <input className="inputPerguntaMentor"
        type="text"
        placeholder="Nome do mentor"
        value={mentor.Mentor_Nome}
        onChange={(e) => setMentor({...mentor, Mentor_Nome: e.target.value})}
      />
      </div>

      <div className="perguntaMentor"> 
        <p className="tituloPerguntaMentor">2.0  RA do aluno mentor</p>       
      <input className="inputPerguntaMentor"
        type="text"
        placeholder="RA do mentor"
        value={mentor.Mentor_RA}
        onChange={(e) => setMentor({...mentor, Mentor_RA: e.target.value})}
      />
      </div>

      <div className="perguntaMentor">
        <p className="tituloPerguntaMentor">3.0  Email do aluno mentor</p>
      <input className="inputPerguntaMentor"
        type="email"
        placeholder="Email do mentor"
        value={mentor.MentorEmail}
        onChange={(e) => setMentor({...mentor, Mentor_Email: e.target.value})}
      />
      <div className="pergunta">
          <p className="pTitulo">4.0 Digite a senha</p>
        <div>
          <input 
          className="inputPergunta" 
          type="password"
          value={mentor.MentorSenha} 
          onChange={(e) => setMentor({...mentor, Mentor_Senha: e.target.value})}
          placeholder="Senha" />
        </div>
      </div>

      

      </div>
      <div className="divBotoesMentor">
        <button className = "voltar" type="button" onClick={() => navigate(-1)}>
          Voltar
        </button>
        <button className="proximoMentor" 
        type="submit" 
        disabled = {mentor.Mentor_Nome === "" || mentor.Mentor_RA === "" ||  mentor.Mentor_Email === "" || mentor.Mentor_Senha === "" } 
        onClick={continuar}>
          Próximo
        </button>
      </div>
      </form>
      </div>
    </div>
  );
}
