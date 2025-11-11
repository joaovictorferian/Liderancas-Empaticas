import { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import api from "../api.js";

import ImportModal from "./modal/importarModal.jsx";
import ExportarModal from "./modal/exportarModal.jsx";
import FiltroModal from "./modal/FilterModal.jsx";
import OrdenarModal from "./modal/ordenarModal.jsx";
import ExcluirModal from "./modal/excluirModal.jsx";
import EditarModal from "./modal/editarModalAlimento.jsx";

function Alimentos({ onSelectPage }) {
  const [filterSelecionado, setFilterSelecionado] = useState("igual");
  const [alimentos, setAlimentos] = useState([]);
  const [alimentosOriginais, setAlimentosOriginais] = useState([]);
  const [selected, setSelected] = useState([]);
  const [fileName, setFileName] = useState("alimentos_exportados");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [exportType, setExportType] = useState("Todos");
  const [valorSelecionado, setValorSelecionado] = useState("ID_Alimento");

  const [alimentoEdit, setAlimentoEdit] = useState(null);
  const [filtros, setFiltros] = useState([]);
  const headerCheckboxRef = useRef(null);

  const camposAlimento = [
    { value: "ID_Alimento", label: "ID do Alimento" },
    { value: "Alimento_Nome", label: "Nome" },
    { value: "Alimento_Marca", label: "Marca" },
    { value: "Alimento_Codigo", label: "Código" },
    { value: "Alimento_Validade", label: "Validade" },
    { value: "Alimento_Peso", label: "Peso (g)" },
    { value: "Alimento_Quantidade", label: "Quantidade" },
    { value: "Alimento_Total", label: "Peso Total (g)" },
  ];

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModalOrdenar, setShowModalOrdenar] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const tabela = "Alimentos";
  filtros[0] = tabela;

  const carregarAlimentos = async () => {
    try {
      const response = await api.post("/usuarios", { teste: tabela });
      setAlimentos(response.data);
      setAlimentosOriginais(response.data);
    } catch (err) {
      console.error("Erro ao buscar alimentos:", err);
      alert(err.response?.data?.error || "Erro ao buscar alimentos");
    }
  };

  useEffect(() => {
    carregarAlimentos();
  }, []);

  // Seleção de alimentos
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === alimentos.length) {
      setSelected([]);
    } else {
      setSelected(alimentos.map((u) => u.ID_Alimento));
    }
  };

  const isAllSelected = selected.length === alimentos.length;

  useEffect(() => {
    if (headerCheckboxRef.current) {
      const isPartial =
        selected.length > 0 && selected.length < alimentos.length;
      headerCheckboxRef.current.indeterminate = isPartial;
    }
  }, [selected, alimentos.length]);

  // Exportação
  const gerarWorkbook = (dados) => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Alimentos");
    return workbook;
  };

  const exportarAlimentos = () => {
    let dadosFiltrados = alimentos;

    if (exportType === "intervalo") {
      if (!rangeStart || !rangeEnd) {
        alert("Preencha o ID inicial e final!");
        return;
      }
      const start = parseInt(rangeStart, 10);
      const end = parseInt(rangeEnd, 10);
      dadosFiltrados = alimentos.filter(
        (u) => u.ID_Alimento >= start && u.ID_Alimento <= end
      );

      if (dadosFiltrados.length === 0) {
        alert("Nenhum alimento encontrado no range informado!");
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

  const handleExportarAlimentos = async () => {
    try {
      console.log("🧾 Iniciando exportação de todos os alimentos...");
      setExportType("Todos");
      await exportarAlimentos();
      alert("✅ Planilha exportada com sucesso!");
    } catch (erro) {
      console.error("❌ Erro ao exportar alimentos:", erro);
      alert("Erro ao exportar planilha");
    }
  };

  const abrirModalEdicao = async () => {
    if (selected.length !== 1) {
      alert("Selecione exatamente 1 alimento para editar!");
      return;
    }
    const id = selected[0];
    try {
      const response = await api.get(`/alimentos/${id}`);  
      setAlimentoEdit(response.data);
      setShowEditModal(true);
    } catch (err) {
      console.error("Erro ao buscar alimento:", err);
      alert("Erro ao buscar dados do alimento");
    }
  };

  return (
    <div className="main-container-tabela">
      <div className="cabecalho-tabela">
   
        <button
          className="btn-tabela adicionar-tabela"
          onClick={() => onSelectPage("CadastroAlimento")}
        >
          Adicionar +
        </button>
        <div className="dropdown-tabela">
          <button className="btn-tabela mais-opcoes-tabela">
            Mais opções ▾
          </button>
          <div className="dropdown-content-tabela">
            <a onClick={() => setShowModal(true)}>Exportar alimentos</a>
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
            onClick={() => setShowModalOrdenar(true)}
          >
            Ordenar
          </button>
        </div>
      </div>

      <p className="indicador-selecionados-tabela">
        {selected.length} alimento(s) selecionado(s)
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
              <th>Nome</th>
              <th>Marca</th>
              <th>Código</th>
              <th>Validade</th>
              <th>Peso (kg)</th>
              <th>Quantidade</th>
              <th>Total (kg)</th>
            </tr>
          </thead>

          <tbody>
            {alimentos.map((u) => (
              <tr key={u.ID_Alimento}>
                <td>
                  <input
                    className="chk-tabela"
                    type="checkbox"
                    checked={selected.includes(u.ID_Alimento)}
                    onChange={() => toggleSelect(u.ID_Alimento)}
                  />
                </td>
                <td>{u.ID_Alimento}</td>
                <td>{u.Alimento_Nome}</td>
                <td>{u.Alimento_Marca}</td>
                <td>{u.Alimento_Codigo}</td>
                <td>
                  {new Date(u.Alimento_Validade).toLocaleDateString("pt-BR", {
                    timeZone: "America/Sao_Paulo",
                  })}
                </td>
                <td>{u.Alimento_Peso}</td>
                <td>{u.Alimento_Quantidade}</td>
                <td>{u.Alimento_Total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔹 Modais */}
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
        exportarAlimentos={exportarAlimentos}
      />

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportSuccess={carregarAlimentos}
        handleExportarAlimentos={handleExportarAlimentos}
        tabela="Alimento"
      />

      <ExcluirModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        selected={selected}
        setItens={setAlimentos}
        carregarItens={carregarAlimentos}
        tabela="Alimento"
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
        usuariosOriginais={alimentosOriginais}
        setResponse={setAlimentos}
        campos={camposAlimento}
        tabela="Alimento"
      />

      <OrdenarModal
        isOpen={showModalOrdenar}
        onClose={() => setShowModalOrdenar(false)}
        valorSelecionado={valorSelecionado}
        setValorSelecionado={setValorSelecionado}
        filterSelecionado={filterSelecionado}
        setFilterSelecionado={setFilterSelecionado}
        setItens={setAlimentos}
        tabela="Alimento"
        campos={camposAlimento}
      />

      <EditarModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        alimentoEdit={alimentoEdit}
        setAlimentoEdit={setAlimentoEdit}
        carregarAlimentos={carregarAlimentos}
      />
    </div>
  );
}

export default Alimentos;
