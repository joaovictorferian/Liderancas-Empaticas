import { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import ExportarModal from "./modal/exportarModal.jsx";
import FiltroModal from "./modal/FilterModal.jsx";
import OrdenarModal from "./modal/ordenarModal.jsx";
import ExcluirModal from "./modal/excluirModal.jsx";
import EditarModal from "./modal/editarModalDinheiro.jsx";
import ModalTipoTransacao from "./modal/ModalTipoTransacao.jsx";
import api from "../api.js";

function transacoes({ onSelectPage }) {
  const [filterSelecionado, setFilterSelecionado] = useState("igual");
  const [transacoes, settransacoes] = useState([]);
  const [transacoesOriginais, settransacoesOriginais] = useState([]);
  const [selected, setSelected] = useState([]);
  const [fileName, setFileName] = useState("transacoes_exportados");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [exportType, setExportType] = useState("Todos");
  const [valorSelecionado, setValorSelecionado] = useState("ID_transacao");
  const [tipoTransacao, setTipoTransacao] = useState("");
  const [showModalTipo, setshowModalTipo] = useState(true);

  const [transacaoEdit, settransacaoEdit] = useState(null);
  const [filtros, setFiltros] = useState([]);
  const headerCheckboxRef = useRef(null);

  const campostransacao = [
    { value: "ID_transacao", label: "ID da transação" },
    { value: "transacao_Grupo", label: "Grupo da transacao" },
    { value: "transacao_Aluno", label: "Aluno" },
    { value: "transacao_Valor", label: "Valor" },
    { value: "transacao_Tipo", label: "Tipo" },
    { value: "created_at", label: "Data de criação" },
  ];
  // Controle dos modais
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModalOrdenar, setshowModalOrdenar] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const teste =
    tipoTransacao === "entrada"
      ? "TransacaoEntrada"
      : tipoTransacao === "saida"
        ? "TransacaoSaida"
        : "";

  const idFieldName =
    tipoTransacao === "entrada"
      ? "ID_TransacaoEntrada"
      : tipoTransacao === "saida"
        ? "ID_TransacaoSaida"
        : "ID_transacao";

  const getId = (u) =>
    u?.ID_TransacaoEntrada ?? u?.ID_TransacaoSaida ?? u?.ID_Transacao ?? u?.ID_transacao ?? u?.id;


  filtros[0] = "transacoes";

  // Opções dos filtros
  const handleSelect = (tipoEscolhido) => {
    setTipoTransacao(tipoEscolhido);
    setshowModalTipo(false); // Fecha o modal de tipo
    console.log("Tipo escolhido:", tipoEscolhido);
  };

  // Manipulação de filtros
  const handleChange = (event) => {
    setValorSelecionado(event.target.value);
    if (event.target.value === "id") setFilterSelecionado("igual");
  };

  const carregartransacoes = async () => {
    try {
      if (!teste) return;
      const response = await api.post("/tabela", { teste });
      const data = response.data;
      settransacoes(data);
      settransacoesOriginais(data);
    } catch (err) {
      console.error("Erro ao buscar transacoes:", err);
      alert("Erro no servidor ao buscar transacoes");
    }
  };

  useEffect(() => {
    if (tipoTransacao) {
      carregartransacoes();
    }
  }, [tipoTransacao]);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === transacoes.length) {
      setSelected([]);
    } else {
      setSelected(transacoes.map((u) => getId(u)).filter(Boolean));
    }
  };

  const isAllSelected = selected.length === transacoes.length;

  useEffect(() => {
    if (headerCheckboxRef.current) {
      const isPartial =
        selected.length > 0 && selected.length < transacoes.length;
      headerCheckboxRef.current.indeterminate = isPartial;
    }
  }, [selected, transacoes.length]);

  // Exportação
  const gerarWorkbook = (dados) => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "transacoes");
    return workbook;
  };

  const exportartransacoes = () => {
    let dadosFiltrados = transacoes;

    if (exportType === "intervalo") {
      if (!rangeStart || !rangeEnd) {
        alert("Preencha o ID inicial e final!");
        return;
      }
      const start = parseInt(rangeStart, 10);
      const end = parseInt(rangeEnd, 10);
      dadosFiltrados = transacoes.filter((u) => {
        const id = getId(u);
        return id >= start && id <= end;
      });

      if (dadosFiltrados.length === 0) {
        alert("Nenhum transacao encontrado no range informado!");
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

  const handleExportartransacoes = async () => {
    try {
      console.log("🧾 Iniciando exportação de todos os transacoess...");
      setExportType("Todos");
      await exportartransacoes();
      alert("✅ Planilha exportada com sucesso!");
    } catch (erro) {
      console.error("❌ Erro ao exportar transacoess:", erro);
      alert("Erro ao exportar planilha");
    }
  };

  // Abrir modal de edição
  const abrirModalEdicao = async () => {
    if (selected.length !== 1) {
      alert("Selecione exatamente 1 transacoes para editar!");
      return;
    }
    const id = selected[0];
    let url = `/transacao/${id}`;
    try {
      if (tipoTransacao === "entrada") {
        url = `/transacao/entrada/${id}`;
      } else if (tipoTransacao === "saida") {
        url = `/transacao/saida/${id}`;
      }
      const response = await api.get(url);
      const data = response.data;
      settransacaoEdit(data);
      setShowEditModal(true);
    } catch (err) {
      console.error("Erro ao buscar transacoes:", err);
      alert("Erro ao buscar dados do transacoes");
    }
  };

  // 🔹 JSX

  return (


    <div className="main-container-tabela">
      {showModalTipo && <ModalTipoTransacao onSelect={handleSelect} />}

      <div className="cabecalho-tabela">
        <button
          className="btn-tabela adicionar-tabela"
          onClick={() => onSelectPage("CadastroDinheiro")}
        >
          Adicionar +
        </button>

        <div className="dropdown-tabela">
          <button className="btn-tabela mais-opcoes-tabela">
            Mais opções ▾
          </button>
          <div className="dropdown-content-tabela">
            <a onClick={() => setShowModal(true)}>Exportar transações</a>

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
        {selected.length} transacoes(s) selecionado(s)
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
              <th>Grupo</th>
              <th>Aluno</th>
              <th>Valor</th>
              <th>Tipo</th>
              <th>Comprovante</th>
              <th>Criado em</th>
            </tr>
          </thead>

          <tbody>
            {transacoes.map((u) => (
              <tr key={getId(u)}>
                <td>
                  <input
                    className="chk-tabela"
                    type="checkbox"
                    checked={selected.includes(getId(u))}
                    onChange={() => toggleSelect(getId(u))}
                  />
                </td>
                <td>{getId(u)}</td>
                <td>{u.transacao_Grupo}</td>
                <td>{u.transacao_Aluno}</td>
                <td>{u.transacao_Valor}</td>
                <td>{u.transacao_Tipo}</td>
                <td>{u.transacao_Comprovante}</td>
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

      {/* 🔹 Modais importados e controlados por estado */}
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
        exportarUsuarios={exportartransacoes}
      />



      <ExcluirModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        selected={selected}
        setItens={settransacoes}
        idField={idFieldName}
        carregarItens={carregartransacoes}
        tabela={teste}
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
        usuariosOriginais={transacoesOriginais}
        setResponse={settransacoes}
        campos={campostransacao}
        tabela={teste}
      />

      <OrdenarModal
        isOpen={showModalOrdenar}
        onClose={() => setshowModalOrdenar(false)}
        valorSelecionado={valorSelecionado}
        setValorSelecionado={setValorSelecionado}
        filterSelecionado={filterSelecionado}
        setFilterSelecionado={setFilterSelecionado}
        setItens={settransacoes}
        tabela={teste}
        campos={campostransacao}
      />

      <EditarModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        transacaoEdit={transacaoEdit}
        settransacaoEdit={settransacaoEdit}
        carregartransacoes={carregartransacoes}
      />
    </div>
  );
}

export default transacoes;
