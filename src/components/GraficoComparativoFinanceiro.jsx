GraficoComparativoFinanceiro.jsx
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";

export default function GraficoComparativoFinanceiro({ dados }) {
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  
  const data = dados && dados.length > 0
    ? dados.map(item => ({
        mes: meses[parseInt(item.mes) - 1] || item.mes,
        entrada: parseFloat(item.entrada || 0),
        saida: parseFloat(item.saida || 0),
        saldo: parseFloat(item.entrada || 0) - parseFloat(item.saida || 0)
      }))
    : meses.slice(0, 4).map(mes => ({ mes, entrada: 0, saida: 0, saldo: 0 }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="mes" stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip 
          formatter={(value) => `R$ ${parseFloat(value).toFixed(2)}`}
        />
        <Legend />
        <Bar dataKey="entrada" fill="#10b981" name="Entrada" radius={[6, 6, 0, 0]} />
        <Bar dataKey="saida" fill="#ef4444" name="Saída" radius={[6, 6, 0, 0]} />
        <Line 
          type="monotone" 
          dataKey="saldo" 
          stroke="#3b82f6" 
          strokeWidth={2}
          name="Saldo"
          dot={{ r: 4 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}