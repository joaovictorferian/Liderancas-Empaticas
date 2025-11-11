GraficoCampanhas.jsx
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function GraficoCampanhas({ dados }) {
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
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="mes" stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip />
        <Bar dataKey="total" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
