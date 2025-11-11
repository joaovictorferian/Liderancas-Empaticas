GraficoTransacoes.jsx
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function GraficoTransacoes({ dados }) {
  // Garante que tenha dados para exibir
  const data =
    dados && dados.length > 0
      ? dados
      : [
          { mes: "Jan", total: 0 },
          { mes: "Fev", total: 0 },
          { mes: "Mar", total: 0 },
          { mes: "Abr", total: 0 },
        ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="mes" stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 4, fill: "#3b82f6" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
