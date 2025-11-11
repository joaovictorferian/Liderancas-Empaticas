FiltroAno.jsx
export default function FiltroAno({ ano, setAno }) {
  const anos = [];
  const atual = new Date().getFullYear();
  for (let i = atual; i >= 2020; i--) anos.push(i);

  return (
    <div className="flex justify-end mb-6">
      <select
        value={ano}
        onChange={(e) => setAno(Number(e.target.value))}

        className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {anos.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
    </div>
  );
}
