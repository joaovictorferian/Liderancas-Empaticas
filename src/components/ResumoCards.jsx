export default function ResumoCards({ resumo }) {
    const cards = [
      { titulo: "Total de Alimentos", valor: resumo.totalAlimentos },
      { titulo: "Total de Alunos", valor: resumo.totalAlunos },
      { titulo: "Total de Usuários", valor: resumo.totalUsuarios },
      { titulo: "Total de Doações", valor: resumo.totalDoacoes },
      { titulo: "Valor Total Doações (R$)", valor: resumo.valorTotalDoacoes },
    ];
  
    return (
      <div className="resumo-grid">
        {cards.map((c, i) => (
          <div key={i} className="resumo-card">
            <h2 className="resumo-titulo">{c.titulo}</h2>
            <p className="resumo-valor">{c.valor ?? 0}</p>
          </div>
        ))}
      </div>
    );
  }
  