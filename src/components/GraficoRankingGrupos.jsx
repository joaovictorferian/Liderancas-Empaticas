GraficoRankingGrupos.jsx
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from "recharts";

const CORES_RANKING = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"];

export default function GraficoRankingGrupos({ dados }) {
  const data =
    dados && dados.length > 0
      ? dados.map((item, idx) => ({
          grupo: item.grupo || `Grupo ${idx + 1}`,
          total: parseInt(item.totalAlimentos ?? 0),
        }))
      : [
          { grupo: "Grupo 1", total: 0 },
          { grupo: "Grupo 2", total: 0 },
        ];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis type="number" stroke="#6b7280" />
        <YAxis dataKey="grupo" type="category" stroke="#6b7280" width={100} />
        <Tooltip />
        <Bar dataKey="total" radius={[0, 8, 8, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={CORES_RANKING[index % CORES_RANKING.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
