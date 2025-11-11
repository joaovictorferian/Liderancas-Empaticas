export default function CardsCampanhas({ status }) {
    const cards = [
      {
        titulo: "Ativas",
        valor: status?.ativas || 0,
        cor: "#10b981",
        icone: "🟢"
      },
      {
        titulo: "Concluídas",
        valor: status?.concluidas || 0,
        cor: "#3b82f6",
        icone: "✅"
      },
      {
        titulo: "Meta Atingida",
        valor: status?.metaAtingida || 0,
        cor: "#8b5cf6",
        icone: "🎯"
      },
      {
        titulo: "Taxa de Sucesso",
        valor: status?.taxaSucesso ? `${status.taxaSucesso}%` : "0%",
        cor: "#f59e0b",
        icone: "📊"
      }
    ];
  
    return (
      <div className="cards-campanhas-grid">
      {cards.map((card, i) => (
        <div key={i} className="card-campanha-mini" style={{ borderLeft: `4px solid ${card.cor}` }}>
          <div className="card-campanha-icone">{card.icone}</div>
          <div className="card-campanha-info">
            <span className="card-campanha-titulo">{card.titulo}</span>
            <span className="card-campanha-valor" style={{ color: card.cor }}>
              {card.valor}
            </span>
          </div>
        </div>
      ))}
    </div>
    );
  }