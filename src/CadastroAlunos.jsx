// CadastroAlunos.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import api from "./api.js"

export default function CadastroAlunos() {
  const navigate = useNavigate();
  const [qtd, setQtd] = useState(0);
  const [first, setFirst] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const [alunos, setAlunos] = useState({
    Aluno_Nome: [],
    Aluno_Email: [],
    Aluno_RA: [],
    Aluno_Senha: []
  })
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);
  const camposInvalidos = !alunos.Aluno_Nome[step]?.trim() || !alunos.Aluno_Email[step]?.trim() || !alunos.Aluno_RA[step]?.trim() || !alunos.Aluno_Senha[step]?.trim()  

  useEffect(() => {
    const totalStr = localStorage.getItem("qtdIntegrantes");
    const totalNum = totalStr ? Number(totalStr) : 0;
    const firstSaved = localStorage.getItem("firstIntegrante") || null;

    console.log("DEBUG CadastroAlunos - totalNum:", totalNum, "firstSaved:", firstSaved);

    if (!totalNum) {
      navigate("/forms", { replace: true });
      return;
    }

    if (!firstSaved) {
      navigate("/cadastroalunomentor", { replace: true });
      return;
    }

    setQtd(totalNum);
    setFirst(firstSaved);
    const rem = Math.max(0, totalNum - 1);
    setRemaining(rem);
    setAlunos({
      Aluno_Nome: Array(rem).fill(""),
      Aluno_Email: Array(rem).fill(""),
      Aluno_RA: Array(rem).fill(""),
      Aluno_Senha: Array(rem).fill("")
    })
    setStep(0);
    setReady(true);
  }, [navigate]);

  const handleAlunosChange = (field, index, value) => {
    setAlunos(prev => ({
      ...prev,
      [field]: prev[field].map((item,i) => (i === index ? value : item))
    }))   
  };

  const proximo = () => {
    if (step < remaining - 1) setStep((s) => s + 1);
  };
  const anterior = () => {
    if (step > 0) setStep((s) => s - 1);
  };  
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const mentorData = JSON.parse(localStorage.getItem("firstIntegrante"))
    const grupoData = JSON.parse(localStorage.getItem("grupo"))

    const todosAlunos = mentorData ? [mentorData.nome, ...alunos.Aluno_Nome] : [...alunos.Aluno_Nome]
    const ra = mentorData ? [mentorData.ra, ...alunos.Aluno_RA] : [...alunos.Aluno_RA]
    const email = mentorData ? [mentorData.email, ...alunos.Aluno_Email] : [...alunos.Aluno_Email]
    const senha = mentorData ? [mentorData.senha, ...alunos.Aluno_Senha] : [...alunos.Aluno_Senha]
    
    let Id_Grupo = null
    let todosJuntos = []
    
    try{
      console.log("Dados enviados para o backend:", todosJuntos);
      const grupoResponse = await axios.post("http://localhost:500/api/users/grupos", grupoData)
      Id_Grupo = grupoResponse.data.id
      console.log("Resposta do backend", grupoResponse.data)
      
      todosJuntos = todosAlunos.map((nome, i) => ({
        Aluno_Nome: nome,
        Aluno_RA: ra[i],
        Aluno_Email: email[i],
        Aluno_Senha: senha[i],
        Grupo_Nome: grupoData?.nome,
        Grupo_Curso: grupoData?.curso,
        Id_Grupo: grupoResponse?.Id_Grupo
      }))
      
      const res = await axios.post("http://localhost:500/api/users/alunos", todosJuntos)
      console.log("Resposta do backend: ", res.data)
      alert("Cadastro concluído!")
      alert(res.data.msg)  
      navigate("/login") 
    }catch (err){
      console.error("Erro no cadastro:", err.response?.data || err.message)
      alert("Erro no cadastro:" + (err.response?.data?.error || err.message))      
    }
  }

  if (!ready) return <p>Carregando...</p>;

  return (
    <div className="formsAlunos">
      <div className="formsTituloAlunos">
        <header className="headerFormsAlunos">
          <img className="logoForms" src="LogoFundoBranco.avif" alt="logo" />
          <h1>Lideranças Empáticas</h1>
        </header>
        <div className="tituloFormsAlunos">
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
      </div>

      <form onSubmit={handleSubmit}>
      <div className="perguntaAlunos">
        <p className="tituloPerguntaAluno">1.0   Nome do {step + 2}° integrante</p>
        <input className="inputPerguntaAluno"
          type="text"
          placeholder={`Nome do integrante ${step + 2}`}
          value={alunos.Aluno_Nome[step] || ""}
          onChange={(e) => handleAlunosChange("Aluno_Nome", step, e.target.value)}
        />
      </div>

      <div className="perguntaAlunos">
        <p className="tituloPerguntaAluno">2.0   RA do {step + 2}° integrante</p>
        <input className="inputPerguntaAluno"
          type="text"
          placeholder={`RA do integrante ${step + 2}`}
          value={alunos.Aluno_RA[step] || ""}
          onChange={(e) => handleAlunosChange("Aluno_RA", step, e.target.value)}
        />
      </div>

      <div className="perguntaAlunos">
        <p className="tituloPerguntaAluno">3.0   Email do {step + 2}° integrante</p>
        <input className="inputPerguntaAluno"
          type="email"
          placeholder={`Email do integrante ${step + 2}`}
          value={alunos.Aluno_Email[step] || ""}
          onChange={(e) => handleAlunosChange("Aluno_Email", step, e.target.value)}
        />
      </div>

      <div className="pergunta">
          <p className="pTitulo">4.0 Digite a senha do {step+2}° integrante</p>
        <div>
          <input 
          className="inputPergunta" 
          type="password" 
          value={alunos.Aluno_Senha[step]}
          onChange={(e) => handleAlunosChange("Aluno_Senha", step, e.target.value)}
          placeholder={`Senha do integrante ${step+2}`} />
        </div>
      </div>

      <div className={`botoesAluno ${step > 0 ? "dois-botoes" : "um-botao"}`}>
        {step > 0 && (
          <button className="voltarAluno" type="button" onClick={anterior}>
            Anterior
          </button>
        )}

        {step < remaining - 1 && (
          <button className="proximoAluno" type="button" disabled = {camposInvalidos}  onClick={proximo}>
            Próximo
          </button>
        )}

        {step === remaining - 1 && (
          <button className="finalizar" type="submit" disabled = {camposInvalidos}>
            Finalizar
          </button>
        )}
      </div>
      </form>
    </div>
  );
}
