import React from "react";
import api from "../../api.js"

function OrderModal({
  isOpen,
  onClose,
  valorSelecionado,
  setValorSelecionado,
  filterSelecionado,
  setFilterSelecionado,
  setItens,
  tabela,
  campos,
}) {
  console.log(campos)
  // 🔸 Se o modal estiver fechado, não renderiza nada
  if (!isOpen) return null;

  // 🔹 Função que envia a ordenação para o backend
  const ordenar = async () => {
    try {
      const body = {
        campo: valorSelecionado,     
        direcao: filterSelecionado,  
       tabela          
      };
  
      console.log("📤 Enviando para backend:", body);
  
      const response = await api.post("/ordenar", body);
  
      console.log("✅ Dados recebidos:", response.data);
  
      setItens(response.data);
      onClose();
    } catch (error) {
      console.error("❌ Erro ao aplicar ordenação:", error);
      alert("Erro ao aplicar ordenação. Veja o console para detalhes.");
    }
  };
  

  // 🔹 Retorno JSX
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Ordenar Usuários</h2>

        <div className="sectionfilter2">
          <select
            onChange={(e) => setValorSelecionado(e.target.value)}
            value={valorSelecionado}
          >
            {campos.map((campo) => (
              <option key={campo.value} value={campo.value}>
                {campo.label}
              </option>
            ))}
          </select>

          <select
            onChange={(e) => setFilterSelecionado(e.target.value)}
            value={filterSelecionado}
          >
            <option value="asc">Crescente</option>
            <option value="desc">Decrescente</option>
          </select>
        </div>

        <div className="footerModal">
          <button className="btnFilter" onClick={ordenar}>
            Ordenar
          </button>
          <button className="btnFilter" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderModal;
