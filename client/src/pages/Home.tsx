import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownUp,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  CircleHelp,
  Database,
  Download,
  FileSpreadsheet,
  Filter,
  Gauge,
  Info,
  Layers3,
  Menu,
  MousePointer2,
  RotateCcw,
  Search,
  SlidersHorizontal,
  UploadCloud,
  X,
  Zap,
} from "lucide-react";
import { gpuData, type GPU } from "@/data/gpus";

/**
 * Direção visual: Instrument Panel Editorial.
 * Use a assimetria do painel, marfim-cinza, Archivo Narrow/Manrope/IBM Plex Mono,
 * lima para eficiência, coral para custo e azul ultramarino para desempenho.
 * Cada decisão visual deve tornar a escolha de hardware mais explícita.
 */

type MetricField = "price" | "fps";
type SortKey = "efficiency" | "cost" | "tdp" | "name";
type Overrides = Record<string, { price?: number | null; fps?: number | null }>;

const STORAGE_KEY = "gpu-metrics-inputs-v1";
const HERO_IMAGE = "/manus-storage/gpu-metrics-hero_8d358e27.png";
const CARD_IMAGE = "/manus-storage/gpu-metrics-card_cb380fef.png";
const THERMAL_IMAGE = "/manus-storage/gpu-metrics-thermal_e21b9b8a.png";

const RTX3060_REFERENCE = {
  name: "GeForce RTX 3060 12 GB",
  tdp: 170,
  gamingWatts: 181,
  idleWatts: 13,
  multiMonitorWatts: 16,
  videoPlaybackWatts: 17,
  maximumWatts: 179,
  fps1080p: 117,
  fps1440p: 86,
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 1,
});

const preciseCurrencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function parseNumber(value: string) {
  const raw = value.replace(/R\$\s?/gi, "").replace(/\s/g, "");
  const normalized = raw.includes(",") ? raw.replace(/\./g, "").replace(",", ".") : raw;
  const result = Number(normalized.replace(/[^\d.-]/g, ""));
  return Number.isFinite(result) && result > 0 ? result : null;
}

function formatCurrency(value: number | null) {
  return value === null ? "—" : currencyFormatter.format(value);
}

function formatMetric(value: number | null, suffix = "") {
  return value === null ? "—" : `${numberFormatter.format(value)}${suffix}`;
}

function fpsPerWatt(gpu: GPU) {
  return gpu.fps !== null && gpu.fps > 0 && gpu.tdp > 0 ? gpu.fps / gpu.tdp : null;
}

function costPerFps(gpu: GPU) {
  return gpu.price !== null && gpu.price > 0 && gpu.fps !== null && gpu.fps > 0
    ? gpu.price / gpu.fps
    : null;
}

function getInputValue(value: number | null) {
  return value === null ? "" : String(value);
}

function TargetDistribution({ data }: { data: GPU[] }) {
  const targets = [
    { key: "4k", label: "4K", tone: "blue" },
    { key: "2k", label: "1440p", tone: "lime" },
    { key: "FullHD", label: "Full HD", tone: "coral" },
    { key: "900p", label: "900p", tone: "ink" },
    { key: "720p", label: "720p", tone: "muted" },
  ];
  const counts = targets.map((target) => ({ ...target, count: data.filter((gpu) => gpu.target === target.key).length }));
  const max = Math.max(...counts.map((item) => item.count), 1);

  return (
    <div className="distribution-chart" aria-label="Distribuição das placas por faixa de desempenho">
      {counts.map((item) => (
        <div className="distribution-row" key={item.key}>
          <div className="distribution-label"><span>{item.label}</span><strong>{item.count}</strong></div>
          <div className="distribution-track"><div className={`distribution-fill ${item.tone}`} style={{ width: `${(item.count / max) * 100}%` }} /></div>
        </div>
      ))}
      <p className="chart-caption">Classificação editorial da planilha, sem estimar FPS.</p>
    </div>
  );
}

function EfficiencyMap({ data, selectedId, onSelect }: { data: GPU[]; selectedId: string; onSelect: (id: string) => void }) {
  const ready = data.filter((gpu) => fpsPerWatt(gpu) !== null && gpu.price !== null);
  if (ready.length < 2) {
    return (
      <div className="empty-chart">
        <div className="empty-chart-ruler"><span>Y / FPS POR WATT</span><span>MAPA DE INVESTIMENTO</span><span>X / PREÇO À VISTA</span></div>
        <div className="empty-chart-mark"><Zap size={22} strokeWidth={1.8} /></div>
        <div>
          <p className="empty-chart-title">A bancada ainda está em silêncio.</p>
          <p className="empty-chart-copy">Informe preço e FPS médio em pelo menos duas placas para revelar o mapa de eficiência.</p>
        </div>
        <div className="formula-strip">
          <span><b>FPS/W</b> = FPS ÷ TDP</span>
          <span><b>R$/FPS</b> = preço ÷ FPS</span>
        </div>
      </div>
    );
  }

  const minPrice = Math.min(...ready.map((gpu) => gpu.price ?? 0));
  const maxPrice = Math.max(...ready.map((gpu) => gpu.price ?? 0));
  const minEff = Math.min(...ready.map((gpu) => fpsPerWatt(gpu) ?? 0));
  const maxEff = Math.max(...ready.map((gpu) => fpsPerWatt(gpu) ?? 0));
  const rangePrice = Math.max(maxPrice - minPrice, 1);
  const rangeEff = Math.max(maxEff - minEff, 0.01);

  return (
    <div className="efficiency-map">
      <div className="map-axis-y"><span>mais FPS/W</span><span>menos</span></div>
      <svg className="map-svg" viewBox="0 0 720 300" role="img" aria-label="Mapa de preço por eficiência">
        <defs>
          <pattern id="chart-grid" width="60" height="50" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.13" /></pattern>
        </defs>
        <rect x="0" y="0" width="720" height="300" fill="url(#chart-grid)" />
        {[0, 1, 2, 3, 4].map((line) => <line key={line} x1="0" x2="720" y1={line * 60} y2={line * 60} className="chart-line" />)}
        {ready.map((gpu) => {
          const x = 24 + (((gpu.price ?? minPrice) - minPrice) / rangePrice) * 660;
          const y = 276 - (((fpsPerWatt(gpu) ?? minEff) - minEff) / rangeEff) * 252;
          const selected = gpu.id === selectedId;
          return (
            <g key={gpu.id} className={`map-point ${selected ? "selected" : ""}`} onClick={() => onSelect(gpu.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onSelect(gpu.id); }} tabIndex={0} role="button" aria-label={`${gpu.name}, ${formatMetric(fpsPerWatt(gpu), " FPS/W")}`}>
              <circle cx={x} cy={y} r={selected ? 8 : 5} />
              <circle cx={x} cy={y} r={selected ? 14 : 10} className="point-halo" />
            </g>
          );
        })}
      </svg>
      <div className="map-axis-x"><span>menor investimento</span><span>preço mais alto</span></div>
      <div className="map-legend"><span><i className="dot lime-dot" /> eficiência</span><span>{ready.length} placas comparáveis</span></div>
    </div>
  );
}

export default function Home() {
  const [overrides, setOverrides] = useState<Overrides>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    } catch {
      return {};
    }
  });
  const [query, setQuery] = useState("");
  const [targetFilter, setTargetFilter] = useState("Todos");
  const [technologyFilter, setTechnologyFilter] = useState("Todas");
  const [sortKey, setSortKey] = useState<SortKey>("efficiency");
  const [activeTab, setActiveTab] = useState<"overview" | "table">("overview");
  const [selectedId, setSelectedId] = useState(gpuData[0]?.id ?? "");
  const [importStatus, setImportStatus] = useState("");
  const [showMethodology, setShowMethodology] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [energyTariff, setEnergyTariff] = useState("0,80823");
  const [energyHours, setEnergyHours] = useState("4");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  }, [overrides]);

  const mergedData = useMemo(() => gpuData.map((gpu) => ({
    ...gpu,
    price: overrides[gpu.name]?.price ?? gpu.price,
    fps: overrides[gpu.name]?.fps ?? gpu.fps,
  })), [overrides]);

  const technologies = useMemo(() => Array.from(new Set(mergedData.map((gpu) => gpu.technology))).sort(), [mergedData]);
  const targets = useMemo(() => Array.from(new Set(mergedData.map((gpu) => gpu.target))), [mergedData]);
  const readyData = useMemo(() => mergedData.filter((gpu) => fpsPerWatt(gpu) !== null && gpu.price !== null), [mergedData]);
  const filteredData = useMemo(() => {
    const normalizedQuery = normalize(query);
    const rows = mergedData.filter((gpu) => {
      const matchesQuery = !normalizedQuery || normalize(gpu.name).includes(normalizedQuery);
      const matchesTarget = targetFilter === "Todos" || gpu.target === targetFilter;
      const matchesTechnology = technologyFilter === "Todas" || gpu.technology === technologyFilter;
      return matchesQuery && matchesTarget && matchesTechnology;
    });
    return rows.sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name);
      if (sortKey === "tdp") return b.tdp - a.tdp;
      if (sortKey === "cost") return (costPerFps(a) ?? Infinity) - (costPerFps(b) ?? Infinity);
      return (fpsPerWatt(b) ?? -Infinity) - (fpsPerWatt(a) ?? -Infinity);
    });
  }, [mergedData, query, targetFilter, technologyFilter, sortKey]);
  const visibleData = filteredData.slice(0, 18);
  const selectedGpu = mergedData.find((gpu) => gpu.id === selectedId) ?? mergedData[0];
  const comparableCount = readyData.length;
  const completedInputCount = mergedData.filter((gpu) => gpu.price !== null || gpu.fps !== null).length;
  const tariffValue = parseNumber(energyTariff) ?? 0.80823;
  const hoursValue = parseNumber(energyHours) ?? 4;
  const rtx3060 = mergedData.find((gpu) => gpu.name === RTX3060_REFERENCE.name);
  const rtx3060CostPerHour = (RTX3060_REFERENCE.gamingWatts / 1000) * tariffValue;
  const rtx3060MonthlyKwh = (RTX3060_REFERENCE.gamingWatts / 1000) * hoursValue * 30;
  const rtx3060MonthlyCost = rtx3060MonthlyKwh * tariffValue;
  const rtx3060AnnualCost = (RTX3060_REFERENCE.gamingWatts / 1000) * hoursValue * 365 * tariffValue;

  function formatPreciseCurrency(value: number) {
    return preciseCurrencyFormatter.format(value);
  }

  function updateMetric(name: string, field: MetricField, rawValue: string) {
    const value = rawValue.trim() === "" ? null : parseNumber(rawValue);
    setOverrides((current) => ({ ...current, [name]: { ...current[name], [field]: value } }));
  }

  function clearInputs() {
    setOverrides({});
    setImportStatus("Dados editados removidos deste navegador.");
  }

  function downloadTemplate() {
    const csv = ["Placa;Preço;FPS médio", ...gpuData.map((gpu) => `${gpu.name};;`)].join("\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "gpu-metrics-precos-fps.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    setImportStatus("Modelo CSV baixado. Preencha Preço e FPS médio para importar.");
  }

  function importCsv(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      const delimiter = text.includes(";") ? ";" : ",";
      const lines = text.split(/\r?\n/).filter((line) => line.trim());
      if (lines.length < 2) {
        setImportStatus("CSV sem linhas de dados reconhecíveis.");
        return;
      }
      const split = (line: string) => line.split(delimiter).map((cell) => cell.replace(/^\"|\"$/g, "").trim());
      const headers = split(lines[0]).map(normalize);
      const gpuIndex = headers.findIndex((header) => header.includes("placa") || header.includes("modelo") || header === "gpu");
      const priceIndex = headers.findIndex((header) => header.includes("preco") || header.includes("price"));
      const fpsIndex = headers.findIndex((header) => header.includes("fps"));
      if (gpuIndex < 0 || (priceIndex < 0 && fpsIndex < 0)) {
        setImportStatus("Use as colunas Placa, Preço e/ou FPS médio.");
        return;
      }
      const next: Overrides = {};
      lines.slice(1).forEach((line) => {
        const cells = split(line);
        const importedName = cells[gpuIndex] ?? "";
        const match = gpuData.find((gpu) => normalize(gpu.name) === normalize(importedName));
        if (!match) return;
        next[match.name] = {
          ...(priceIndex >= 0 ? { price: parseNumber(cells[priceIndex] ?? "") } : {}),
          ...(fpsIndex >= 0 ? { fps: parseNumber(cells[fpsIndex] ?? "") } : {}),
        };
      });
      setOverrides((current) => ({ ...current, ...next }));
      setImportStatus(next && Object.keys(next).length ? `${Object.keys(next).length} placas atualizadas a partir do CSV.` : "Nenhum nome de placa do CSV coincidiu com a base.");
    };
    reader.readAsText(file, "UTF-8");
  }

  return (
    <div className="app-shell">
      <aside className={`side-rail ${mobileNav ? "is-open" : ""}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><img src="/manus-storage/gpu-metrics-mark-transparent_67773144.png" alt="" /></div>
          <div><span className="brand-name">GPU</span><span className="brand-name brand-name-accent">METRICS</span><span className="brand-subtitle">DECISION LAB / 01</span></div>
        </div>
        <button className="mobile-close" onClick={() => setMobileNav(false)} aria-label="Fechar navegação"><X size={20} /></button>
        <nav className="primary-nav" aria-label="Navegação principal">
          <a className="nav-item active" href="#overview" onClick={() => setMobileNav(false)}><BarChart3 size={17} /><span>Visão geral</span><b>01</b></a>
          <a className="nav-item" href="#energy-study" onClick={() => setMobileNav(false)}><Zap size={17} /><span>Energia em SP</span><b>02</b></a>
          <a className="nav-item" href="#data-table" onClick={() => setMobileNav(false)}><Database size={17} /><span>Base da planilha</span><b>03</b></a>
          <a className="nav-item" href="#methodology" onClick={() => setMobileNav(false)}><CircleHelp size={17} /><span>Como ler</span><b>04</b></a>
        </nav>
        <div className="rail-rule" />
        <div className="rail-note"><span className="eyebrow">LEGENDA</span><p>O que a placa entrega por watt importa tanto quanto o pico de FPS.</p></div>
        <div className="rail-bottom"><span className="live-dot" /> <span>Planilha local conectada</span><span className="rail-version">v1.0</span></div>
      </aside>

      <main className="main-canvas" id="overview">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileNav(true)} aria-label="Abrir navegação"><Menu size={21} /></button>
          <div className="topbar-brand"><span className="topbar-brand-mark"><img src="/manus-storage/gpu-metrics-mark-transparent_67773144.png" alt="" /></span><span className="topbar-brand-wordmark">GPU <b>METRICS</b></span><span className="topbar-brand-slash">/</span><span className="topbar-brand-note">FIELD NOTES 01</span></div>
          <div className="topbar-context"><span className="topbar-dot" /> <span>BENCHMARK DE VALOR</span><i /> <span>PLANILHA LOCAL</span></div>
          <div className="topbar-actions">
            <button className="ghost-action" onClick={downloadTemplate}><Download size={15} /> <span>Modelo CSV</span></button>
            <button className="upload-action" onClick={() => fileInputRef.current?.click()}><UploadCloud size={15} /> <span>Importar dados</span></button>
            <input ref={fileInputRef} className="sr-only" type="file" accept=".csv,text/csv" onChange={(event) => { const file = event.target.files?.[0]; if (file) importCsv(file); event.target.value = ""; }} />
          </div>
        </header>

        <div className="content-wrap">
          <section className="hero-section" aria-labelledby="page-title">
            <div className="hero-copy">
              <div className="hero-brandplate"><span className="hero-brandplate-mark"><img src="/manus-storage/gpu-metrics-mark-transparent_67773144.png" alt="" /></span><div><span className="hero-brandplate-title">GPU METRICS</span><span className="hero-brandplate-subtitle">INSTRUMENTO DE EFICIÊNCIA / 001</span></div></div>
              <span className="eyebrow">GPU METRICS <b>/</b> DECISÃO DE COMPRA</span>
              <h1 id="page-title">Mais quadros<br /><em>não significam</em><br />mais valor.</h1>
              <p className="hero-description">Cruze FPS médio, consumo e preço para enxergar a placa que entrega mais jogo por cada watt — e por cada real.</p>
              <div className="hero-actions"><a className="primary-cta" href="#data-table"><SlidersHorizontal size={16} /> Adicionar preço e FPS <ArrowUpRight size={15} /></a><button className="text-cta" onClick={() => { setShowMethodology(true); document.getElementById("methodology")?.scrollIntoView({ behavior: "smooth" }); }}>Ver metodologia <ArrowUpRight size={14} /></button></div>
              <div className="hero-proof"><span className="proof-number">83</span><span>GPUs catalogadas<br /><i>na planilha enviada</i></span><span className="proof-divider" /><span className="proof-number">5</span><span>faixas de<br /><i>resolução alvo</i></span></div>
            </div>
            <div className="hero-visual">
              <img src={HERO_IMAGE} alt="Detalhe editorial de uma placa de vídeo sobre uma bancada técnica" />
              <div className="visual-scanlines" />
              <div className="visual-topline"><span>FIG. 01 / GPU FIELD</span><span>26.08.26</span></div>
              <div className="visual-badge"><span className="badge-pulse" /> <strong>LIVE DATASET</strong><small>sem valores inventados</small></div>
              <div className="visual-caption"><span>Eficiência é uma<br />decisão mensurável.</span><b>↗</b></div>
              <div className="visual-corner corner-tl" /><div className="visual-corner corner-br" />
            </div>
          </section>

          <section className="kpi-band" aria-label="Resumo da base de dados">
            <div className="kpi-item"><span className="kpi-label">BASE DISPONÍVEL</span><strong>{mergedData.length}<small> GPUs</small></strong><span className="kpi-foot">modelos preenchidos na origem</span></div>
            <div className="kpi-item"><span className="kpi-label">TDP MAPEADO</span><strong>{mergedData.filter((gpu) => gpu.tdp > 0).length}<small> / {mergedData.length}</small></strong><span className="kpi-foot"><Zap size={12} /> watts disponíveis</span></div>
            <div className="kpi-item kpi-alert"><span className="kpi-label">COMPARÁVEIS AGORA</span><strong>{comparableCount}<small> placas</small></strong><span className="kpi-foot"><Info size={12} /> preço + FPS necessários</span></div>
            <div className="kpi-item kpi-status"><span className="kpi-label">STATUS DO ESTUDO</span><div className="status-line"><span className="status-orb" /><strong>{completedInputCount ? "EM CONSTRUÇÃO" : "AGUARDANDO INPUT"}</strong></div><span className="kpi-foot">dados derivados, não estimados</span></div>
          </section>

          <section className="analysis-section" aria-labelledby="analysis-title">
            <div className="section-header"><div><span className="section-index">02 / 05</span><h2 id="analysis-title">Mapa de decisão</h2></div><div className="section-header-note"><span>Uma leitura em duas camadas</span><b>qualitativa + quantitativa</b></div></div>
            <div className="tab-row" role="tablist" aria-label="Visualização da análise">
              <button className={activeTab === "overview" ? "tab active" : "tab"} onClick={() => setActiveTab("overview")} role="tab" aria-selected={activeTab === "overview"}><Gauge size={15} /> Painel de eficiência</button>
              <button className={activeTab === "table" ? "tab active" : "tab"} onClick={() => { setActiveTab("table"); document.getElementById("data-table")?.scrollIntoView({ behavior: "smooth" }); }} role="tab" aria-selected={activeTab === "table"}><FileSpreadsheet size={15} /> Tabela de entrada</button>
              <span className="tab-help"><MousePointer2 size={13} /> clique nos pontos quando houver dados</span>
            </div>
            <div className="analysis-grid">
              <article className="panel efficiency-panel">
                <div className="panel-heading"><div><span className="eyebrow">LEITURA QUANTITATIVA</span><h3>Eficiência por investimento</h3></div><span className="panel-code">A / 01</span></div>
                <p className="panel-intro">O mapa posiciona o preço no eixo horizontal e o FPS por watt no eixo vertical. Quanto mais alto e à esquerda, melhor o equilíbrio.</p>
                <EfficiencyMap data={mergedData} selectedId={selectedId} onSelect={setSelectedId} />
              </article>
              <article className="panel distribution-panel">
                <div className="panel-heading"><div><span className="eyebrow">LEITURA QUALITATIVA</span><h3>Faixa de entrega</h3></div><span className="panel-code">A / 02</span></div>
                <p className="panel-intro">A planilha já traz uma orientação de resolução sem Ray Tracing. Use-a como ponto de partida — não como FPS medido.</p>
                <TargetDistribution data={mergedData} />
                <div className="thermal-thumb"><img src={THERMAL_IMAGE} alt="Mapa térmico abstrato em uma folha técnica" /><div><span className="eyebrow">NOTA DE CAMPO</span><p>O TDP é o recurso. O FPS é a entrega. O custo é a decisão.</p></div></div>
              </article>
            </div>
          </section>

          <section className="energy-section" id="energy-study" aria-labelledby="energy-title">
            <div className="section-header"><div><span className="section-index">03 / 05</span><h2 id="energy-title">Energia em São Paulo</h2><p className="section-lede">Uma RTX 3060 não custa apenas na compra: o consumo contínuo também entra na conta.</p></div><div className="energy-source-note"><span className="live-dot" /> TARIFA EDITÁVEL <b>R$ / kWh</b></div></div>
            <div className="energy-layout">
              <article className="energy-hero-panel">
                <div className="energy-panel-top"><span className="eyebrow">RTX 3060 12 GB / BANCADA</span><span className="panel-code">SP / 08.26</span></div>
                <div className="energy-main-reading"><strong>{formatPreciseCurrency(rtx3060CostPerHour)}</strong><span>por hora de gaming</span></div>
                <div className="energy-reading-rule"><span /> <b>{RTX3060_REFERENCE.gamingWatts} W medidos</b> <span /></div>
                <p>Estimativa baseada no consumo Gaming da EVGA RTX 3060 XC medido pela TechPowerUp e na tarifa residencial B1 de São Paulo, com a bandeira amarela de agosto de 2026.</p>
                <div className="energy-controls"><label><span>Tarifa aplicada</span><div className="energy-input-wrap"><span>R$</span><input inputMode="decimal" aria-label="Tarifa de energia em reais por quilowatt-hora" value={energyTariff} onChange={(event) => setEnergyTariff(event.target.value)} /><small>/ kWh</small></div></label><label><span>Horas de gaming / dia</span><div className="energy-input-wrap"><input inputMode="decimal" aria-label="Horas de gaming por dia" value={energyHours} onChange={(event) => setEnergyHours(event.target.value)} /><small>h</small></div></label></div>
                <div className="energy-source-links"><span>FONTE / MÉTODO</span><a href="https://www.techpowerup.com/gpu-specs/geforce-rtx-3060-12-gb.c3682" target="_blank" rel="noreferrer">TechPowerUp specs ↗</a><a href="https://www.techpowerup.com/review/evga-geforce-rtx-3060-xc/36.html" target="_blank" rel="noreferrer">Power review ↗</a><a href="https://www.enel.com.br/pt-saopaulo/Para_Voce/tarifa-energia-eletrica.html" target="_blank" rel="noreferrer">Enel SP ↗</a></div>
              </article>
              <div className="energy-side-stack">
                <article className="energy-summary-panel"><div className="panel-heading"><div><span className="eyebrow">CENÁRIO CONFIGURADO</span><h3>{numberFormatter.format(hoursValue)} h / dia</h3></div><span className="panel-code">C / 01</span></div><div className="energy-summary-grid"><div><span>consumo mensal</span><strong>{numberFormatter.format(rtx3060MonthlyKwh)} <small>kWh</small></strong></div><div><span>custo mensal</span><strong>{formatPreciseCurrency(rtx3060MonthlyCost)}</strong></div><div><span>custo anual</span><strong>{formatPreciseCurrency(rtx3060AnnualCost)}</strong></div><div><span>tarifa calculada</span><strong>{formatPreciseCurrency(tariffValue)} <small>/ kWh</small></strong></div></div><p className="energy-disclaimer">Antes de impostos, CIP e eventuais ajustes de faturamento. Altere a tarifa para refletir sua conta real.</p></article>
                <article className="energy-comparison-panel"><div className="panel-heading"><div><span className="eyebrow">ESTADOS DE CONSUMO</span><h3>A mesma placa, ritmos diferentes</h3></div><span className="panel-code">C / 02</span></div>{[{ label: "Idle", watts: RTX3060_REFERENCE.idleWatts, note: "desktop em repouso" }, { label: "Multi-monitor", watts: RTX3060_REFERENCE.multiMonitorWatts, note: "duas ou mais telas" }, { label: "Video playback", watts: RTX3060_REFERENCE.videoPlaybackWatts, note: "reprodução de vídeo" }, { label: "Gaming", watts: RTX3060_REFERENCE.gamingWatts, note: "carga de jogos" }, { label: "Máximo", watts: RTX3060_REFERENCE.maximumWatts, note: "pico do review" }].map((state) => <div className="energy-bar-row" key={state.label}><div className="energy-bar-meta"><span>{state.label}</span><small>{state.note}</small><b>{state.watts} W</b></div><div className="energy-bar-track"><div className={`energy-bar-fill ${state.label === "Gaming" ? "gaming" : ""}`} style={{ width: `${Math.min((state.watts / 181) * 100, 100)}%` }} /></div></div>)}</article></div>
            </div>
            <div className="energy-performance-strip"><div><span className="eyebrow">PERFORMANCE AGREGADA / TPU</span><strong>{RTX3060_REFERENCE.fps1080p} <small>FPS</small></strong><span>média em 1920×1080</span></div><div><span className="eyebrow">PERFORMANCE AGREGADA / TPU</span><strong>{RTX3060_REFERENCE.fps1440p} <small>FPS</small></strong><span>média em 2560×1440</span></div><div><span className="eyebrow">EFICIÊNCIA DE BANCADA</span><strong>{numberFormatter.format(RTX3060_REFERENCE.fps1080p / RTX3060_REFERENCE.gamingWatts)} <small>FPS/W</small></strong><span>1080p ÷ 181 W Gaming</span></div><div><span className="eyebrow">EFICIÊNCIA DE BANCADA</span><strong>{numberFormatter.format(RTX3060_REFERENCE.fps1440p / RTX3060_REFERENCE.gamingWatts)} <small>FPS/W</small></strong><span>1440p ÷ 181 W Gaming</span></div></div>
            <p className="energy-footnote">Referência: EVGA RTX 3060 XC, review publicado em 25/02/2021. Os 117 FPS e 86 FPS são médias do conjunto de jogos do review; não representam todos os jogos atuais. A tarifa inicial combina Enel B1 (R$ 0,78938/kWh) com bandeira amarela ANEEL de agosto de 2026 (R$ 0,01885/kWh).</p>
          </section>

          <section className="data-section" id="data-table" aria-labelledby="data-title">
            <div className="section-header data-header"><div><span className="section-index">04 / 05</span><h2 id="data-title">Base comparável</h2><p className="section-lede">Edite os campos que faltam. O cálculo acontece no mesmo instante, sem sair da tabela.</p></div><div className="input-status"><span className="status-orb" /> {completedInputCount} campos com dados locais</div></div>
            <div className="data-toolbar">
              <label className="search-box"><Search size={17} /><input type="search" placeholder="Buscar placa..." value={query} onChange={(event) => setQuery(event.target.value)} /><kbd>⌘ K</kbd></label>
              <div className="select-wrap"><Filter size={15} /><select value={targetFilter} onChange={(event) => setTargetFilter(event.target.value)}><option value="Todos">Todas as resoluções</option>{targets.map((target) => <option value={target} key={target}>{target}</option>)}</select><ChevronDown size={14} /></div>
              <div className="select-wrap"><Layers3 size={15} /><select value={technologyFilter} onChange={(event) => setTechnologyFilter(event.target.value)}><option value="Todas">Todas as tecnologias</option>{technologies.map((technology) => <option value={technology} key={technology}>{technology}</option>)}</select><ChevronDown size={14} /></div>
              <div className="select-wrap sort-wrap"><ArrowDownUp size={15} /><select value={sortKey} onChange={(event) => setSortKey(event.target.value as SortKey)}><option value="efficiency">Ordenar: eficiência</option><option value="cost">Ordenar: custo/FPS</option><option value="tdp">Ordenar: TDP</option><option value="name">Ordenar: A–Z</option></select><ChevronDown size={14} /></div>
            </div>
            <div className="table-shell">
              <table className="gpu-table"><thead><tr><th className="col-index">#</th><th>Placa de vídeo</th><th>Entrega sem RT</th><th>Tech / PCIe</th><th>TDP <span>(W)</span></th><th className="editable-head">Preço <span>R$</span><Info size={12} /></th><th className="editable-head">FPS médio <Info size={12} /></th><th>FPS / W</th><th>R$ / FPS</th></tr></thead>
                <tbody>{visibleData.map((gpu, index) => {
                  const efficiency = fpsPerWatt(gpu);
                  const cost = costPerFps(gpu);
                  const isSelected = selectedGpu?.id === gpu.id;
                  return <tr key={gpu.id} className={isSelected ? "selected-row" : ""} onClick={() => setSelectedId(gpu.id)}>
                    <td className="col-index">{String(filteredData.indexOf(gpu) + 1).padStart(2, "0")}</td>
                    <td><div className="gpu-name-cell"><span className={`vendor-mark ${gpu.name.includes("Radeon") ? "amd" : gpu.name.includes("Arc") ? "intel" : "nvidia"}`} /> <strong>{gpu.name}</strong>{isSelected && <span className="focus-tag">FOCO</span>}</div></td>
                    <td><span className="tier-label">{gpu.tier}</span><small className="target-label">{gpu.target}</small></td>
                    <td><span className="tech-label">{gpu.technology}</span><small className="pcie-label">PCIe {gpu.pcie}</small></td>
                    <td><span className="mono-value">{gpu.tdp}</span></td>
                    <td><input className="metric-input price-input" aria-label={`Preço da ${gpu.name}`} placeholder="informe" value={getInputValue(gpu.price)} onChange={(event) => updateMetric(gpu.name, "price", event.target.value)} onClick={(event) => event.stopPropagation()} /></td>
                    <td><input className="metric-input fps-input" aria-label={`FPS médio da ${gpu.name}`} placeholder="informe" value={getInputValue(gpu.fps)} onChange={(event) => updateMetric(gpu.name, "fps", event.target.value)} onClick={(event) => event.stopPropagation()} /></td>
                    <td><strong className={`computed-value ${efficiency !== null ? "has-value lime-text" : ""}`}>{formatMetric(efficiency)}</strong></td>
                    <td><strong className={`computed-value ${cost !== null ? "has-value coral-text" : ""}`}>{cost === null ? "—" : formatCurrency(cost)}</strong></td>
                  </tr>;
                })}</tbody>
              </table>
            </div>
            <div className="table-footer"><span>Exibindo {visibleData.length} de {filteredData.length} placas filtradas</span><span className="table-foot-note"><Info size={14} /> Preço e FPS ficam salvos apenas neste navegador.</span><button className="reset-button" onClick={clearInputs}><RotateCcw size={14} /> Limpar entradas</button></div>
            {importStatus && <div className="import-status"><Check size={15} /> {importStatus}</div>}
          </section>

          <section className="focus-section" aria-labelledby="focus-title">
            <div className="focus-image"><img src={CARD_IMAGE} alt="Close-up de fans de uma placa de vídeo" /><span className="image-label">FIG. 02 / COOLING</span></div>
            <div className="focus-copy"><span className="section-index">05 / 05</span><span className="eyebrow">PLACA EM FOCO</span><h2 id="focus-title">{selectedGpu?.name ?? "Selecione uma placa"}</h2><p>Leitura de bancada para um modelo específico. Clique em qualquer linha da base para trocar o foco.</p><div className="focus-metrics"><div><span>faixa indicada</span><strong>{selectedGpu?.tier ?? "—"}</strong></div><div><span>consumo de projeto</span><strong>{selectedGpu ? `${selectedGpu.tdp} W` : "—"}</strong></div><div><span>tecnologia</span><strong>{selectedGpu?.technology ?? "—"}</strong></div></div><a href="#data-table" className="focus-link">Completar dados desta placa <ArrowUpRight size={15} /></a></div>
          </section>

          <section className="methodology-section" id="methodology" aria-labelledby="methodology-title">
            <div className="methodology-heading"><span className="section-index">MÉTODO / NOTAS</span><h2 id="methodology-title">Como ler sem cair na armadilha do número único.</h2><p>Uma placa pode entregar mais FPS e ainda ser pior negócio quando exige mais energia ou custa muito mais. O painel separa os sinais para a decisão ficar auditável.</p></div>
            <div className="formula-grid"><div className="formula-card"><span className="formula-number">01</span><span className="eyebrow">EFICIÊNCIA</span><strong>FPS / W</strong><p>FPS médio dividido pelo TDP informado na planilha. Quanto maior, mais quadros por watt de projeto.</p><code>fps ÷ tdp</code></div><div className="formula-card coral-card"><span className="formula-number">02</span><span className="eyebrow">CUSTO DIRETO</span><strong>R$ / FPS</strong><p>Preço da placa dividido pelo FPS médio. Quanto menor, menos reais por quadro entregue.</p><code>preço ÷ fps</code></div><div className="formula-card blue-card"><span className="formula-number">03</span><span className="eyebrow">ORIGEM</span><strong>DADO ≠ PALPITE</strong><p>Modelo, TDP, tecnologia e faixa vieram da planilha. Preço e FPS só entram quando você informar.</p><code>fonte: planilha local</code></div></div>
            <div className="methodology-toggle"><button onClick={() => setShowMethodology(!showMethodology)}>{showMethodology ? "Ocultar detalhes" : "Ver detalhes de importação"} <ChevronDown size={15} className={showMethodology ? "rotated" : ""} /></button>{showMethodology && <div className="methodology-detail"><p>Use o botão “Modelo CSV” para baixar uma estrutura pronta com as 83 placas. Depois de preencher as colunas <b>Preço</b> e <b>FPS médio</b>, importe o arquivo. Os valores são persistidos no armazenamento local do navegador e não são enviados para um servidor.</p><p>O dashboard aceita separadores <b>;</b> ou <b>,</b> e identifica o nome da placa por correspondência exata.</p></div>}</div>
          </section>
        </div>

        <footer className="site-footer"><div className="footer-brand"><div className="brand-mark small"><img src="/manus-storage/gpu-metrics-mark-transparent_67773144.png" alt="" /></div><span>GPU METRICS</span></div><span>Instrumento editorial para decisões de hardware.</span><span className="footer-right">BASE LOCAL / 2026 <span className="footer-rule" /> sem telemetria</span></footer>
      </main>
    </div>
  );
}
