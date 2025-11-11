GraficoDistribuicaoGrupos.jsx
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

const CORES = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4"];

export default function GraficoDistribuicaoGrupos({ dados }) {
  const data = dados && dados.length > 0
    ? dados.map(item => ({
        name: item.grupo || item.Grupo_Nome || "Sem Grupo",
        value: parseInt(item.totalDoacoes || item.totalParticipantes || 0)
      }))
    : [{ name: "Sem dados", value: 1 }];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={90}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
}
