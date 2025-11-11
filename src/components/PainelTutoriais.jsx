import React from "react";

const PainelTutoriais = ({ tutoriais }) => {
  return (
    <section className="painel-tutoriais">
      <h2 className="titulo-secao">Tutoriais</h2>

      <div className="grade-tutoriais">
        {tutoriais.map((tutorial, indice) => (
          <div key={indice} className="cartao-tutorial">
            <div className="miniatura"></div>
            <p className="titulo-tutorial">{tutorial.titulo}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PainelTutoriais;
