import { useState, useEffect } from "react";

import api from "../api.js";
import "../dash.css";

// 🔹 Componentes
import FiltroAno from "./FiltroAno.jsx";
import ResumoCards from "./ResumoCards.jsx";
import GraficoTransacoes from "./GraficoTransacoes.jsx";
import GraficoCampanhas from "./GraficoCampanhas.jsx";
import GraficoDistribuicaoGrupos from "./GraficoDistribuicaoGrupos.jsx";
import GraficoRankingGrupos from "./GraficoRankingGrupos.jsx";
import GraficoEvolucaoAlimentos from "./GraficoEvolucaoAlimentos.jsx";
import GraficoComparativoFinanceiro from "./GraficoComparativoFinanceiro.jsx";
import CardsCampanhas from "./CardsCampanhas.jsx";

export default function Relatorios() {
  const [ano, setAno] = useState(new Date().getFullYear());
  const [resumo, setResumo] = useState({});
  const [transacoes, setTransacoes] = useState([]);
  const [campanhas, setCampanhas] = useState([]);
  const [distribuicaoGrupos, setDistribuicaoGrupos] = useState([]);
  const [rankingGrupos, setRankingGrupos] = useState([]);
  const [evolucaoAlimentos, setEvolucaoAlimentos] = useState([]);
  const [comparativoFinanceiro, setComparativoFinanceiro] = useState([]);
  const [statusCampanhas, setStatusCampanhas] = useState({});

  // lista de grupos (preenchida pela API para o ano selecionado) e filtro selecionado
  const [gruposList, setGruposList] = useState(["Todos"]);
  const [grupoSelecionado, setGrupoSelecionado] = useState("Todos");

  useEffect(() => {
    carregarDados();
  }, [ano, grupoSelecionado]); // recarrega ao mudar ano ou grupo

  const carregarDados = async () => {
    try {
      // se selecionou um grupo específico, adiciona query string; caso "Todos", não adiciona
      const qs =
        grupoSelecionado && grupoSelecionado !== "Todos"
          ? `?grupo=${encodeURIComponent(grupoSelecionado)}`
          : "";

      const [
        resAlimentos,
        resRanking, // <-- agora sem filtro de grupo
        resAlunos,
        resUsuarios,
        resDoacoes,
        resGruposPorAno, // <-- será usado para popular o select de grupos
        resTransacoes,
        resCampanhas,
        resDistGrupos,
        resEvolucao,
        resComparativo,
        resStatusCamp,
      ] = await Promise.all([
        api.get(`/getTotalAlimentos/${ano}`).catch((err) => {
          console.error("Erro em totalAlimentos:", err);
          return { data: { totalAlimentos: 0 } };
        }),
        // REMOVI o qs aqui — ranking deve ser por ano apenas
        api.get(`/getRankingGrupos/${ano}`).catch((err) => {
          console.error("Erro em rankingGrupos:", err);
          return { data: [] };
        }),
        api.get(`/getQuantidadeAlunos/${ano}`).catch((err) => {
          console.error("Erro em quantidadeAlunos:", err);
          return { data: { totalAlunos: 0 } };
        }),
        api.get(`/getQuantidadeUsuarios/${ano}`).catch((err) => {
          console.error("Erro em quantidadeUsuarios:", err);
          return { data: { totalUsuarios: 0 } };
        }),
        api.get(`/getQuantidadeDoacoes/${ano}`).catch((err) => {
          console.error("Erro em quantidadeDoacoes:", err);
          return { data: { totalDoacoes: 0, valorTotal: 0 } };
        }),
        // chama a API que retorna os grupos referentes ao ano selecionado
        api.get(`/gruposAno/${ano}`).catch((err) => {
          console.error("Erro em grupos por ano:", err);
          return { data: [] };
        }),
        // as rotas abaixo recebem o filtro de grupo via qs
        api.get(`/getTransacoes/${ano}${qs}`).catch((err) => {
          console.error("Erro em transacoes:", err);
          return { data: [] };
        }),
        api.get(`/getCampanhasGrafico/${ano}${qs}`).catch((err) => {
          console.error("Erro em campanhas:", err);
          return { data: [] };
        }),
        api.get(`/getDistribuicaoGrupos/${ano}${qs}`).catch((err) => {
          console.error("Erro em distribuicaoGrupos:", err);
          return { data: [] };
        }),
        api.get(`/getEvolucaoAlimentos/${ano}${qs}`).catch((err) => {
          console.error("Erro em evolucaoAlimentos:", err);
          return { data: [] };
        }),
        api.get(`/getComparativoFinanceiro/${ano}${qs}`).catch((err) => {
          console.error("Erro em comparativoFinanceiro:", err);
          return { data: [] };
        }),
        api.get(`/getStatusCampanhas/${ano}${qs}`).catch((err) => {
          console.error("Erro em statusCampanhas:", err);
          return {
            data: { ativas: 0, concluidas: 0, metaAtingida: 0, taxaSucesso: 0 },
          };
        }),
      ]);

      setResumo({
        totalAlimentos: resAlimentos.data?.totalAlimentos ?? 0,
        totalAlunos: resAlunos.data?.totalAlunos ?? 0,
        totalUsuarios: resUsuarios.data?.totalUsuarios ?? 0,
        totalDoacoes: resDoacoes.data?.totalDoacoes ?? 0,
        valorTotalDoacoes: resDoacoes.data?.valorTotal ?? 0,
        rankingGrupos: resRanking.data ?? [],
        grupos: resGruposPorAno.data ?? [],
      });

      setTransacoes(resTransacoes.data ?? []);
      setCampanhas(resCampanhas.data ?? []);
      setDistribuicaoGrupos(resDistGrupos.data ?? []);
      setRankingGrupos(resRanking.data ?? []);
      setEvolucaoAlimentos(resEvolucao.data ?? []);
      setComparativoFinanceiro(resComparativo.data ?? []);
      setStatusCampanhas(resStatusCamp.data ?? {});

      // popula a lista de grupos a partir da resposta da API para o ano selecionado
      const listaRaw = resGruposPorAno.data ?? [];
      const normalizeName = (g) => {
        if (!g) return null;
        if (typeof g === "string") return g;
        return g.Grupo_Nome ?? g.nome ?? g.name ?? null;
      };
      const nomes = Array.isArray(listaRaw)
        ? listaRaw.map(normalizeName).filter(Boolean)
        : [];
      const uniq = ["Todos", ...Array.from(new Set(nomes))];
      setGruposList(uniq);

      // garante que o filtro atual exista na nova lista; se não, reseta para "Todos"
      if (!uniq.includes(grupoSelecionado)) {
        setGrupoSelecionado("Todos");
      }
    } catch (err) {
      console.error("❌ Erro ao carregar dados do relatório:", err);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-top">
        <div className="selectsDash">
          <FiltroAno ano={ano} setAno={setAno} />
        </div>
      </div>
      <div className="resumo-grid">
        <ResumoCards resumo={resumo} />
      </div>
      <div className="graficos-container">
        <div className="grafico-card">
          <h2 className="grafico-titulo"> 📈 Gráfico de Transações</h2>
          <div className="grafico-wrapper">
            <GraficoTransacoes dados={transacoes} />
          </div>
        </div>

        <div className="grafico-card">
                    <h2 className="grafico-titulo">💰 Entrada vs Saída</h2>
                    <div className="grafico-wrapper">
                        <GraficoComparativoFinanceiro dados={comparativoFinanceiro} />
                    </div>
                </div>

        <div className="grafico-card">
          <h2 className="grafico-titulo"> 🎯 Gráfico de Campanhas</h2>
          <div className="grafico-wrapper">
            <GraficoCampanhas dados={campanhas} />
          </div>
        </div>
        <div className="grafico-card card-status">
          <h2 className="grafico-titulo">📊 Status das Campanhas</h2>
          <CardsCampanhas status={statusCampanhas} />
        </div>

        <div className="grafico-card">
          <h2 className="grafico-titulo"> 🥇 Gráfico de Ranking de Grupos</h2>
          <div className="grafico-wrapper">
            <GraficoRankingGrupos dados={rankingGrupos} />
          </div>
        </div>

        <div className="grafico-card">
          <h2 className="grafico-titulo">
            {" "}
            🍰 Gráfico de Distribuição de Grupos
          </h2>
          <div className="grafico-wrapper">
            <GraficoDistribuicaoGrupos dados={distribuicaoGrupos} />
          </div>
        </div>

        <div className="grafico-card grafico-largo">
          <h2 className="grafico-titulo">📦 Evolução de Alimentos</h2>
          <div className="grafico-wrapper">
            <GraficoEvolucaoAlimentos dados={evolucaoAlimentos} />
          </div>
        </div>
      </div>
    </div>
  );
}
