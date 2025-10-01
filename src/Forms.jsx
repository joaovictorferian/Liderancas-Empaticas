import { useState } from "react";

function Forms() {
  const [selecionado, setSelecionado] = useState(""); // 🔹 só um valor
  const opcoes = ["5", "6", "7", "8", "9", "10"];

  return (
    <div className="forms">
      <div className="formsTitulo">
        <header className="headerForms">
          <img src="LogoFundoBranco.avif" alt="logo" />
          <h1>Lideranças Empáticas</h1>
        </header>
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

        <div className="pergunta">
          <p className="p1Titulo">
            1.0 Digite o nome do grupo: *
          </p>
          <div className="inputPergunta">
            <input type="text" placeholder="Nome do grupo" />
          </div>
        </div>

        <div className="pergunta">
            <p>2.0  Quantos integrante o seu grupo possui?</p>
            <div className="inputPergunta">
            {opcoes.map((opcao) => (          
            <label key={opcao}>
              <input
                type="radio"
                name="qtdIntegrantes" 
                value={opcao}
                checked={selecionado === opcao} 
                onChange={(e) => setSelecionado(e.target.value)} 
              />
              {opcao}
            </label>
            ))}
            </div>
                
        </div>
        
        <div className="pergunta">
            <p>3.0  Digite o código do seu curso que se encontra no Moodle (Exemplo: 2NAADM/2MADM) </p>
            <div className="inputPergunta">
                <input type="text"
                placeholder="Curso"
                />
            </div>
        </div>  

        <div className="pergunta">
            <p>4.0  Digite a senha geral do grupo</p>
            <div className="inputPergunta">
                <input type="password" 
                placeholder="Senha"
                />

            </div>


        </div>      

      </div>
    </div>
  );
}

export default Forms;
