export interface ParticlePoint {
  id: string;
  offsetX: number; // pixel offset from unit hub
  offsetY: number;
  latOffset: number; // real geographic offset for leaflet
  lngOffset: number;
  size: number;
  opacity: number;
  pulseDelay: number;
}

export interface UnitKPIs {
  alunos: number;
  frequencia: number; // %
  autonomia: number; // /5
  evasao: number; // %
  educadores: number;
  refeicoes: number;
  custoAluno: number; // R$
  vagasOcupadas: number; // %
}

export interface TacticalUnit {
  id: string;
  code: string;
  name: string;
  fullName: string;
  address: string;
  phone: string;
  email: string;
  project: string;
  region: string;
  color: "cyan" | "orange" | "green" | "yellow";
  hexColor: string;
  // Tactical layout coordinates (percentage of canvas width/height)
  tacticalPos: {
    x: number; // 0 - 100%
    y: number; // 0 - 100%
  };
  // Real geographic coordinates for Leaflet / GIS
  geoPos: {
    lat: number;
    lng: number;
  };
  kpis: UnitKPIs;
  particles: ParticlePoint[];
  programs: string[];
}

export interface ValueChainStep {
  id: string;
  stepNumber: number;
  title: string;
  metric: string;
  subtitle: string;
  color: "cyan" | "orange" | "green" | "yellow";
  hexColor: string;
  highlightedUnits: string[];
  strategicGoal: string;
}

export interface WidgetConfig {
  id: keyof UnitKPIs;
  label: string;
  unit: string;
  format: (val: number) => string;
  enabled: boolean;
}

// Generate deterministic scattered particle cloud around unit hubs (students' homes)
function generateParticles(count: number, radiusSpread: number, seed: number): ParticlePoint[] {
  const points: ParticlePoint[] = [];
  for (let i = 0; i < count; i++) {
    // pseudo-random with seed
    const pseudo1 = Math.sin(seed + i * 1.7) * 10000;
    const pseudo2 = Math.cos(seed + i * 2.3) * 10000;
    const r1 = pseudo1 - Math.floor(pseudo1);
    const r2 = pseudo2 - Math.floor(pseudo2);

    const angle = r1 * Math.PI * 2;
    // Gaussian-like concentration towards center
    const distance = Math.pow(r2, 0.75) * radiusSpread;

    const rawX = Math.cos(angle) * distance;
    const rawY = Math.sin(angle) * distance * 0.75;
    const rawSize = 1.5 + (r1 * 2);
    const rawOpacity = 0.35 + (r2 * 0.55);

    // Geo offset for Leaflet: ~0.008 degrees radius (~800m)
    const geoRadius = (distance / radiusSpread) * 0.009;
    const latOffset = Math.sin(angle) * geoRadius;
    const lngOffset = Math.cos(angle) * geoRadius * 1.1;

    points.push({
      id: `p-${seed}-${i}`,
      offsetX: Math.round(rawX),
      offsetY: Math.round(rawY),
      latOffset: Number(latOffset.toFixed(5)),
      lngOffset: Number(lngOffset.toFixed(5)),
      size: Number(rawSize.toFixed(1)),
      opacity: Number(rawOpacity.toFixed(2)),
      pulseDelay: Number(((i % 5) * 0.6).toFixed(1)),
    });
  }
  return points;
}

export const MOCK_UNITS: TacticalUnit[] = [
  {
    id: "sna",
    code: "UNIDADE SNA",
    name: "Shopping Nova América",
    fullName: "Unidade Shopping Nova América",
    address: "Av. Pastor Martin Luther King Jr., nº 126 – Del Castilho, Estacionamento G4 deck 2 do Shopping Nova América, RJ, CEP 20765-000",
    phone: "(21) 3083-1894",
    email: "plantandoamanha@redecruzada.org.br",
    project: "Projeto Plantando o Amanhã",
    region: "Del Castilho / Zona Norte - RJ",
    color: "cyan",
    hexColor: "#0284c7",
    tacticalPos: { x: 22, y: 68 },
    geoPos: { lat: -22.8778, lng: -43.2717 },
    kpis: {
      alunos: 340,
      frequencia: 94,
      autonomia: 4.2,
      evasao: 1.8,
      educadores: 24,
      refeicoes: 680,
      custoAluno: 610,
      vagasOcupadas: 98,
    },
    particles: generateParticles(65, 82, 101),
    programs: ["Plantando o Amanhã (Música & Cidadania)", "Deskobrir Maker", "Apoio Familiar"],
  },
  {
    id: "cdd",
    code: "UNIDADE CDD",
    name: "Cidade de Deus",
    fullName: "Unidade Cidade de Deus",
    address: "Rua Edgard Werneck, 420 – Jacarepaguá, Rio de Janeiro, RJ, CEP 22763-010",
    phone: "(21) 3342-6956",
    email: "elacay@redecruzada.org.br",
    project: "Espaço Cultural & Socioeducativo Elacay",
    region: "Jacarepaguá / Cidade de Deus - RJ",
    color: "green",
    hexColor: "#059669",
    tacticalPos: { x: 44, y: 62 },
    geoPos: { lat: -22.9463, lng: -43.3592 },
    kpis: {
      alunos: 410,
      frequencia: 89,
      autonomia: 4.0,
      evasao: 3.1,
      educadores: 31,
      refeicoes: 820,
      custoAluno: 640,
      vagasOcupadas: 100,
    },
    particles: generateParticles(75, 85, 303),
    programs: ["Creche Integral Elacay", "Capoeira & Expressão Corporal", "Cultura Comunitária"],
  },
  {
    id: "rch",
    code: "UNIDADE RCH",
    name: "Riachuelo",
    fullName: "Unidade Riachuelo (Casa de Leyla)",
    address: "Rua Ana Neri, 2400 – Sampaio, Rio de Janeiro, RJ, CEP 20960-008",
    phone: "(21) 2261-2105",
    email: "casadeleyla@redecruzada.org.br",
    project: "Casa de Leyla",
    region: "Sampaio / Riachuelo - RJ",
    color: "yellow",
    hexColor: "#d97706",
    tacticalPos: { x: 66, y: 64 },
    geoPos: { lat: -22.8996, lng: -43.2562 },
    kpis: {
      alunos: 210,
      frequencia: 95,
      autonomia: 4.5,
      evasao: 1.2,
      educadores: 16,
      refeicoes: 420,
      custoAluno: 590,
      vagasOcupadas: 96,
    },
    particles: generateParticles(48, 72, 404),
    programs: ["Casa de Leyla - Primeira Infância", "Artes Visuais", "Inclusão Digital"],
  },
  {
    id: "sjvrp",
    code: "UNIDADE SJVRP",
    name: "São José do Vale do Rio Preto",
    fullName: "Unidade São José do Vale do Rio Preto",
    address: "Rua Deputado Menezes Cortes, nº 151, Águas Claras, São José do Vale do Rio Preto, RJ, CEP 25780-000",
    phone: "(24) 2224-1332",
    email: "daschu@redecruzada.org.br",
    project: "Polo Comunitário Daschu",
    region: "Águas Claras / Região Serrana - RJ",
    color: "orange",
    hexColor: "#ea580c",
    tacticalPos: { x: 86, y: 48 },
    geoPos: { lat: -22.1517, lng: -42.9239 },
    kpis: {
      alunos: 280,
      frequencia: 91,
      autonomia: 3.9,
      evasao: 2.4,
      educadores: 19,
      refeicoes: 560,
      custoAluno: 580,
      vagasOcupadas: 94,
    },
    particles: generateParticles(55, 78, 202),
    programs: ["Educação Rural & Sustentabilidade", "Deskobrir Serrano", "Capacitação Profissional"],
  },
];

export const VALUE_CHAIN_STEPS: ValueChainStep[] = [
  {
    id: "dev_tech",
    stepNumber: 1,
    title: "1. Desenvolver Tecnologias Socioeducacionais",
    metric: "2 Projetos Core",
    subtitle: "Inovação Pedagógica & Matriz BNCC",
    color: "cyan",
    hexColor: "#0284c7",
    highlightedUnits: ["sna", "rch"],
    strategicGoal: "Metodologia Socioeducativa própria validada em 100% dos polos.",
  },
  {
    id: "mobilize",
    stepNumber: 2,
    title: "2. Mobilizar Recursos",
    metric: "92% da Meta (R$ 4.2M)",
    subtitle: "Captação Institucional & Editais",
    color: "orange",
    hexColor: "#ea580c",
    highlightedUnits: ["sjvrp", "cdd"],
    strategicGoal: "Sustentabilidade financeira plurianual garantida para os 4 territórios.",
  },
  {
    id: "deliver",
    stepNumber: 3,
    title: "3. Entregar Processos Formativos",
    metric: "1.240 Alunos Ativos",
    subtitle: "Atendimento Direto & Frequência",
    color: "green",
    hexColor: "#059669",
    highlightedUnits: ["sna", "sjvrp", "cdd", "rch"],
    strategicGoal: "Zero abandono escolar e nota de autonomia média acima de 4.0/5.",
  },
  {
    id: "register",
    stepNumber: 4,
    title: "4. Registrar Tudo",
    metric: "42% Migrado (C#)",
    subtitle: "Transição Tecnológica & Governança",
    color: "yellow",
    hexColor: "#d97706",
    highlightedUnits: ["sna", "cdd"],
    strategicGoal: "Auditoria contínua de presença, prontuários e prestação de contas automatizada.",
  },
];

export const INITIAL_WIDGET_CONFIGS: WidgetConfig[] = [
  {
    id: "alunos",
    label: "Alunos",
    unit: "",
    format: (val) => `${val}`,
    enabled: true,
  },
  {
    id: "frequencia",
    label: "Freq",
    unit: "%",
    format: (val) => `${val}%`,
    enabled: true,
  },
  {
    id: "autonomia",
    label: "Autonomia",
    unit: "/5",
    format: (val) => `${val.toFixed(1)}/5`,
    enabled: true,
  },
  {
    id: "evasao",
    label: "Evasão",
    unit: "%",
    format: (val) => `${val}%`,
    enabled: false,
  },
  {
    id: "educadores",
    label: "Educadores",
    unit: "",
    format: (val) => `${val}`,
    enabled: false,
  },
  {
    id: "refeicoes",
    label: "Refeições/dia",
    unit: "",
    format: (val) => `${val}`,
    enabled: false,
  },
  {
    id: "custoAluno",
    label: "Custo Aluno",
    unit: "R$",
    format: (val) => `R$ ${val}`,
    enabled: false,
  },
];
