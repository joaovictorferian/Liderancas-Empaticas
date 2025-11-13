import { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { data } from "react-router-dom";
import api from "../api.js"

// 🔹 Imports dos modais
import ImportModal from "./modal/importarModal.jsx";
import ExportarModal from "./modal/exportarModal.jsx";
import FiltroModal from "./modal/FilterModal.jsx";
import OrdenarModal from "./modal/ordenarModal.jsx";
import ExcluirModal from "./modal/excluirModalAluno.jsx";
import EditarModal from "./modal/editarModalAluno.jsx";

function Alunos({ onSelectPage }) {
  const [filterSelecionado, setFilterSelecionado] = useState("igual");
  const [alunos, setAlunos] = useState([]);
  const [alunosOriginais, setAlunosOriginais] = useState([]);
  const [selected, setSelected] = useState([]);
  const [fileName, setFileName] = useState("alunos_exportados");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [exportType, setExportType] = useState("Todos");
  const [valorSelecionado, setValorSelecionado] = useState("ID_Aluno");

  const [alunoEdit, setAlunoEdit] = useState(null);
  const [filtros, setFiltros] = useState([]);
  const headerCheckboxRef = useRef(null);

  const camposAluno = [
    { value: "ID_Aluno", label: "ID do alunos" },
    { value: "Aluno_RA", label: "RA do aluno" },
    { value: "Aluno_Nome", label: "Nome" },
    { value: "Aluno_Email", label: "Email" },
    { value: "Aluno_CPF", label: "CPF" },
    { value: "Aluno_Telefone", label: "Telefone" },
    { value: "Aluno_Grupo", label: "Grupo" },
    { value: "Aluno_Turma", label: "Turma" },
    { value: "created_at", label: "Data de criação" },
  ];
  // Controle dos modais
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModalOrdenar, setshowModalOrdenar] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const teste = "Aluno";
  filtros[0] = "Alunos";

  const carregarAlunos = async () => {
    try {
      const response = await api.post("/usuarios", { teste });

      setAlunos(response.data);
      setAlunosOriginais(response.data);
    } catch (err) {
      console.error("Erro ao buscar alunos:", err);
      alert(err.response?.data?.error || "Erro ao buscar alunos");
    }
  };

  useEffect(() => {
    carregarAlunos();
  }, []);

  // Seleção de alunoss
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === alunos.length) {
      setSelected([]);
    } else {
      setSelected(alunos.map((u) => u.ID_Aluno));
    }
  };

  const isAllSelected = selected.length === alunos.length;

  useEffect(() => {
    if (headerCheckboxRef.current) {
      const isPartial = selected.length > 0 && selected.length < alunos.length;
      headerCheckboxRef.current.indeterminate = isPartial;
    }
  }, [selected, alunos.length]);

  // Exportação
  const gerarWorkbook = (dados) => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Alunos");
    return workbook;
  };

  const exportarAlunos = () => {
    let dadosFiltrados = alunos;

    if (exportType === "intervalo") {
      if (!rangeStart || !rangeEnd) {
        alert("Preencha o ID inicial e final!");
        return;
      }
      const start = parseInt(rangeStart, 10);
      const end = parseInt(rangeEnd, 10);
      dadosFiltrados = alunos.filter(
        (u) => u.ID_Aluno >= start && u.ID_Aluno <= end
      );

      if (dadosFiltrados.length === 0) {
        alert("Nenhum aluno encontrado no range informado!");
        return;
      }
    }

    const workbook = gerarWorkbook(dadosFiltrados);
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(data, `${fileName}.xlsx`);
    setShowModal(false);
  };

  const handleExportarAlunos = async () => {
    try {
      console.log("🧾 Iniciando exportação de todos os alunoss...");
      setExportType("Todos");
      await exportarAlunos();
      alert("✅ Planilha exportada com sucesso!");
    } catch (erro) {
      console.error("❌ Erro ao exportar alunoss:", erro);
      alert("Erro ao exportar planilha");
    }
  };

const abrirModalEdicao = async () => {
  if (selected.length !== 1) {
    alert("Selecione exatamente 1 aluno para editar!");
    return;
  }
  const id = selected[0];
  try {
    const response = await api.get(`/alunos/${id}`);

    const aluno = response.data.rows[0]
  
    setAlunoEdit(aluno);
    setShowEditModal(true);
  } catch (err) {
    console.error("Erro ao buscar aluno:", err);
    alert("Erro ao buscar dados do aluno");
  }
};
  return (
    <div className="main-container-tabela">
      <div className="cabecalho-tabela">
        <button
          className="btn-tabela adicionar-tabela"
          onClick={() => onSelectPage("CadastroAluno")}
        >
          Adicionar +
        </button>

        <div className="dropdown-tabela">
          <button className="btn-tabela mais-opcoes-tabela">
            Mais opções ▾
          </button>
          <div className="dropdown-content-tabela">
            <a onClick={() => setShowModal(true)}>Exportar alunos</a>
            <a onClick={() => setShowImportModal(true)}>Importar alunos</a>
            <a onClick={() => setShowDeleteModal(true)}>Excluir</a>
            <a onClick={abrirModalEdicao}>Editar</a>
          </div>
        </div>

        <div className="rightMenu-tabela">
          <button
            className="btn-tabela filtrar-tabela"
            onClick={() => setShowFilterModal(true)}
          >
            Filtrar
          </button>
          <button
            className="btn-tabela ordenar-tabela"
            onClick={() => setshowModalOrdenar(true)}
          >
            Ordenar
          </button>
        </div>
      </div>

      <p className="indicador-selecionados-tabela">
        {selected.length} alunos(s) selecionado(s)
      </p>

      <div className="tabela">
        <table className="tabela-container-tabela">
          <thead>
            <tr>
              <th>
                <input
                  className="chk-tabela"
                  type="checkbox"
                  ref={headerCheckboxRef}
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>ID</th>
              <th>RA</th>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Grupo</th>
              <th>Criado em</th>
            </tr>
          </thead>

          <tbody>
            {alunos.map((u) => (
              <tr key={u.ID_Aluno}>
                <td>
                  <input
                    className="chk-tabela"
                    type="checkbox"
                    checked={selected.includes(u.ID_Aluno)}
                    onChange={() => toggleSelect(u.ID_Aluno)}
                  />
                </td>
                <td>{u.ID_Aluno}</td>
                <td>{u.Aluno_RA}</td>
                <td>{u.Aluno_Nome}</td>
                <td>{u.Aluno_Email}</td>
                <td>{u.Aluno_Grupo}</td>
                <td>
                  {new Date(u.created_at).toLocaleDateString("pt-BR", {
                    timeZone: "America/Sao_Paulo",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ExportarModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        exportType={exportType}
        setExportType={setExportType}
        fileName={fileName}
        setFileName={setFileName}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        setRangeStart={setRangeStart}
        setRangeEnd={setRangeEnd}
        exportarUsuarios={exportarAlunos}
      />

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportSuccess={carregarAlunos}
        handleExportarUsuarios={handleExportarAlunos}
        tabela="Aluno "
      />

      <ExcluirModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        selectedAluno={selected}
        setAlunosExcluir={setAlunos}        
        carregarAlunosExcluir={carregarAlunos}
        tabelaAluno="Aluno "
      />

      <FiltroModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filtros={filtros}
        setFiltros={setFiltros}
        valorSelecionado={valorSelecionado}
        setValorSelecionado={setValorSelecionado}
        filterSelecionado={filterSelecionado}
        setFilterSelecionado={setFilterSelecionado}
        usuariosOriginais={alunosOriginais}
        setResponse={setAlunos}
        campos={camposAluno}
        tabela="Aluno "
      />

      <OrdenarModal
        isOpen={showModalOrdenar}
        onClose={() => setshowModalOrdenar(false)}
        valorSelecionado={valorSelecionado}
        setValorSelecionado={setValorSelecionado}
        filterSelecionado={filterSelecionado}
        setFilterSelecionado={setFilterSelecionado}
        setItens={setAlunos}
        tabela="Aluno "
        campos={camposAluno}
      />

      <EditarModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        alunoEdit={alunoEdit}
        setAlunoEdit={setAlunoEdit}
        carregarAlunos={carregarAlunos}
      />
    </div>
  );
}

export default Alunos;
