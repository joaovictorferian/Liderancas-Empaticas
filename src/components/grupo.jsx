import { useState, useEffect, useRef } from "react";

function Grupo() {
  const [selected, setSelected] = useState([]);
  const headerCheckboxRef = useRef(null);

  const grupos = [
    {
      id: "G001",
      nome: "Grupo Alpha",
      mentor: "Prof. Carlos",
      alunos: [
        "Breno Groba",
        "João Silva",
        "Maria Souza",
        "Pedro Santos",
        "Ana Lima",
        "Ricardo Alves",
        "Juliana Costa",
        "Lucas Pereira",
        "Fernanda Dias",
      ],
    },
    {
      id: "G002",
      nome: "Grupo Beta",
      mentor: "Prof. João",
      alunos: [
        "André Silva",
        "Beatriz Santos",
        "Clara Mendes",
        "Diego Rocha",
        "Elisa Martins",
        "Fabio Ferreira",
        "Gabriela Souza",
        "Hugo Barbosa",
        "Isabela Costa",
      ],
    },
  ];

  // Alterna a seleção de um único grupo
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // Alterna a seleção de todos os grupos
  const toggleSelectAll = () => {
    if (selected.length === grupos.length) {
      setSelected([]);
    } else {
      setSelected(grupos.map((g) => g.id));
    }
  };

  // Verifica se todos os grupos estão selecionados
  const isAllSelected = selected.length === grupos.length;

  // Aplica o estado visual "indeterminado" no checkbox do cabeçalho
  useEffect(() => {
    if (headerCheckboxRef.current) {
      const isPartial =
        selected.length > 0 && selected.length < grupos.length;
      headerCheckboxRef.current.indeterminate = isPartial;
    }
  }, [selected, grupos.length]);

  return (
    <div className="main-container-aluno">
      {/* Cabeçalho com botões */}
      <div className="cabecalho-aluno">
        <button className="btn-aluno adicionar-aluno">Adicionar +</button>
        <button className="btn-aluno formulario-aluno">Formulário</button>
        <div className="dropdown-aluno">
          <button className="btn-aluno mais-opcoes">Mais opções ▾</button>
          <div className="dropdown-content-aluno">
            <a href="#">Exportar grupos</a>
            <a href="#">Importar grupos</a>
            <a href="#">Excluir</a>
            <a href="#">Editar</a>
          </div>
        </div>
        <div className="rightMenu">
          <button className="btn-aluno filtrar-aluno">Filtrar</button>
          <button className="btn-aluno ordenar-aluno">Ordenar</button>
        </div>
      </div>

      {/* Indicador de grupos selecionados */}
      <p className="indicador-selecionados">
        {selected.length} grupo(s) selecionado(s)
      </p>

      <div className="tabela">
        {/* Tabela de grupos */}
        <table >
          <thead className="tabela-teste">
            <tr>
              <th>
                <input
                  className="chkalunos"
                  type="checkbox"
                  ref={headerCheckboxRef}
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>ID</th>
              <th>Nome</th>
              <th>Mentor</th>
              <th>Aluno 1</th>
              <th>Aluno 2</th>
              <th>Aluno 3</th>
              <th>Aluno 4</th>
              <th>Aluno 5</th>
              <th>Aluno 6</th>
              <th>Aluno 7</th>
              <th>Aluno 8</th>
              <th>Aluno 9</th>
            </tr>
          </thead>

          <tbody>
            {grupos.map((grupo) => (
              <tr key={grupo.id}>
                <td>
                  <input
                    className="chkalunos"
                    type="checkbox"
                    checked={selected.includes(grupo.id)}
                    onChange={() => toggleSelect(grupo.id)}
                  />
                </td>
                <td>{grupo.id}</td>
                <td>{grupo.nome}</td>
                <td>{grupo.mentor}</td>
                {grupo.alunos.map((aluno, index) => (
                  <td key={index}>{aluno}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Grupo;
