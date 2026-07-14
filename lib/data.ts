export type DimKey =
  | "LOGICO"
  | "VERBAL"
  | "CIENTIFICO"
  | "CREATIVO"
  | "SOCIAL"
  | "EMPRENDEDOR";

export const DIMKEYS: DimKey[] = [
  "LOGICO",
  "VERBAL",
  "CIENTIFICO",
  "CREATIVO",
  "SOCIAL",
  "EMPRENDEDOR",
];

export const DIMS: Record<DimKey, { label: string; color: string }> = {
  LOGICO: { label: "Lógico-matemático", color: "#4B6BE5" },
  VERBAL: { label: "Verbal y comunicación", color: "#E8663D" },
  CIENTIFICO: { label: "Científico e investigativo", color: "#1FA6A6" },
  CREATIVO: { label: "Creativo y artístico", color: "#C247B0" },
  SOCIAL: { label: "Social y humano", color: "#D89A20" },
  EMPRENDEDOR: { label: "Organizativo y emprendedor", color: "#2FA65A" },
};

export type Weights = Partial<Record<DimKey, number>>;

export type Question = {
  q: string;
  opts: { t: string; w: Weights }[];
};

export const APT: Question[] = [
  {
    q: "Tienes una tarde libre y ganas de resolver algo. ¿Qué se te da más natural?",
    opts: [
      { t: "Armar un presupuesto o un plan paso a paso", w: { LOGICO: 2, EMPRENDEDOR: 1 } },
      { t: "Escribir o explicar algo para que otros lo entiendan", w: { VERBAL: 2 } },
      { t: "Descubrir por qué algo funciona (desarmarlo, investigar)", w: { CIENTIFICO: 2, LOGICO: 1 } },
      { t: "Diseñar o dibujar cómo se vería", w: { CREATIVO: 2 } },
    ],
  },
  {
    q: "En un trabajo en grupo, sueles ser quien…",
    opts: [
      { t: "Lidera y organiza las tareas", w: { EMPRENDEDOR: 2, SOCIAL: 1 } },
      { t: "Encuentra los errores en los datos o cálculos", w: { LOGICO: 2, CIENTIFICO: 1 } },
      { t: "Pone las ideas visuales y el diseño", w: { CREATIVO: 2 } },
      { t: "Escucha al equipo y resuelve los roces", w: { SOCIAL: 2, VERBAL: 1 } },
    ],
  },
  {
    q: "¿Qué tipo de problema te sale con más facilidad?",
    opts: [
      { t: "Matemáticos o de lógica", w: { LOGICO: 2 } },
      { t: "De experimentos y observación", w: { CIENTIFICO: 2 } },
      { t: "De expresar una idea con palabras", w: { VERBAL: 2 } },
      { t: "De crear algo desde cero", w: { CREATIVO: 2 } },
    ],
  },
  {
    q: "Cuando algo no te sale, tú…",
    opts: [
      { t: "Buscas el patrón o la fórmula", w: { LOGICO: 2 } },
      { t: "Preguntas y hablas con alguien que sepa", w: { SOCIAL: 1, VERBAL: 1 } },
      { t: "Pruebas una y otra vez hasta entenderlo", w: { CIENTIFICO: 2 } },
      { t: "Lo replanteas de una forma nueva", w: { CREATIVO: 1, EMPRENDEDOR: 1 } },
    ],
  },
  {
    q: "Un profe te pide una exposición. Tu parte fuerte es…",
    opts: [
      { t: "Los datos y las gráficas", w: { LOGICO: 1, CIENTIFICO: 1 } },
      { t: "Hablar frente al grupo", w: { VERBAL: 2, SOCIAL: 1 } },
      { t: "Las diapositivas y lo visual", w: { CREATIVO: 2 } },
      { t: "Coordinar quién hace qué", w: { EMPRENDEDOR: 2 } },
    ],
  },
  {
    q: "¿Con cuál te sientes más cómodo?",
    opts: [
      { t: "Números y datos", w: { LOGICO: 2 } },
      { t: "Personas y sus historias", w: { SOCIAL: 2 } },
      { t: "Ideas y teorías", w: { CIENTIFICO: 2 } },
      { t: "Formas, colores e imágenes", w: { CREATIVO: 2 } },
    ],
  },
  {
    q: "Te dan a cargo un proyecto del colegio. Lo primero que haces es…",
    opts: [
      { t: "Un plan y un cronograma", w: { EMPRENDEDOR: 2, LOGICO: 1 } },
      { t: "Investigar cómo se ha hecho antes", w: { CIENTIFICO: 2 } },
      { t: "Reunir al equipo y repartir roles", w: { SOCIAL: 1, EMPRENDEDOR: 1 } },
      { t: "Imaginar cómo se verá el resultado", w: { CREATIVO: 2 } },
    ],
  },
  {
    q: "La materia donde mejor te va suele ser…",
    opts: [
      { t: "Matemáticas o física", w: { LOGICO: 2, CIENTIFICO: 1 } },
      { t: "Español o filosofía", w: { VERBAL: 2 } },
      { t: "Artes o tecnología/diseño", w: { CREATIVO: 2 } },
      { t: "Ciencias sociales o ética", w: { SOCIAL: 2 } },
    ],
  },
];

export const INT: Question[] = [
  {
    q: "Sin pensar si es “buena carrera”, ¿qué te gustaría hacer todos los días?",
    opts: [
      { t: "Resolver retos técnicos o con tecnología", w: { LOGICO: 2, CIENTIFICO: 1 } },
      { t: "Ayudar a personas directamente", w: { SOCIAL: 2 } },
      { t: "Crear cosas que otros vean o usen", w: { CREATIVO: 2 } },
      { t: "Liderar proyectos o negocios", w: { EMPRENDEDOR: 2 } },
    ],
  },
  {
    q: "¿Qué tipo de contenido consumes por gusto?",
    opts: [
      { t: "Videos de ciencia o de cómo funcionan las cosas", w: { CIENTIFICO: 2 } },
      { t: "Arte, diseño, música, cine", w: { CREATIVO: 2 } },
      { t: "Debates, historia, actualidad", w: { VERBAL: 1, SOCIAL: 1 } },
      { t: "Emprendimiento, dinero, negocios", w: { EMPRENDEDOR: 2 } },
    ],
  },
  {
    q: "Un plan ideal de fin de semana sería…",
    opts: [
      { t: "Armar o programar algo", w: { LOGICO: 2 } },
      { t: "Salir y estar con mucha gente", w: { SOCIAL: 2 } },
      { t: "Un proyecto creativo (dibujar, grabar, escribir)", w: { CREATIVO: 2 } },
      { t: "Organizar un evento o vender algo", w: { EMPRENDEDOR: 2 } },
    ],
  },
  {
    q: "¿Qué te emociona más?",
    opts: [
      { t: "Entender cómo funciona el cuerpo o la naturaleza", w: { CIENTIFICO: 2 } },
      { t: "Convencer o inspirar a otros", w: { VERBAL: 1, EMPRENDEDOR: 1 } },
      { t: "Que algo que hiciste se vea increíble", w: { CREATIVO: 2 } },
      { t: "Que alguien se sienta mejor por tu ayuda", w: { SOCIAL: 2 } },
    ],
  },
  {
    q: "El tema del que podrías hablar horas es…",
    opts: [
      { t: "Tecnología y cómo mejorar las cosas", w: { LOGICO: 2 } },
      { t: "Justicia, leyes y cómo debería ser el mundo", w: { VERBAL: 1, SOCIAL: 1 } },
      { t: "Salud, cuerpo y cómo cuidarnos", w: { CIENTIFICO: 1, SOCIAL: 1 } },
      { t: "Diseño, estética y tendencias", w: { CREATIVO: 2 } },
    ],
  },
  {
    q: "¿Qué ambiente de trabajo te llama más?",
    opts: [
      { t: "Un laboratorio o un hospital", w: { CIENTIFICO: 1, SOCIAL: 1 } },
      { t: "Una oficina de tecnología", w: { LOGICO: 2 } },
      { t: "Un estudio creativo", w: { CREATIVO: 2 } },
      { t: "Tu propio negocio o empresa", w: { EMPRENDEDOR: 2 } },
    ],
  },
  {
    q: "Preferirías un trabajo donde…",
    opts: [
      { t: "Los números y la lógica manden", w: { LOGICO: 2 } },
      { t: "Escribas, hables y comuniques", w: { VERBAL: 2 } },
      { t: "Cada día crees algo distinto", w: { CREATIVO: 2 } },
      { t: "Trabajes rodeado de gente", w: { SOCIAL: 2 } },
    ],
  },
  {
    q: "¿Qué te haría sentir que “valió la pena”?",
    opts: [
      { t: "Resolver un problema muy difícil", w: { LOGICO: 1, CIENTIFICO: 1 } },
      { t: "Construir un proyecto propio exitoso", w: { EMPRENDEDOR: 2 } },
      { t: "Que tu obra o idea llegue a mucha gente", w: { CREATIVO: 1, VERBAL: 1 } },
      { t: "Haber ayudado a mejorar vidas", w: { SOCIAL: 2 } },
    ],
  },
];

export type Career = {
  id: string;
  name: string;
  color: string;
  profile: Weights;
  caso: string | null;
  casoBy: string | null;
  mercado: { empleabilidad: string; salario: string; nota: string } | null;
};

export const CAREERS: Career[] = [
  {
    id: "med",
    name: "Medicina",
    color: "#1FA6A6",
    profile: { LOGICO: 2, VERBAL: 1, CIENTIFICO: 3, CREATIVO: 0, SOCIAL: 3, EMPRENDEDOR: 1 },
    caso: "Entré pensando que era memorizar. En la práctica es aguante: turnos larguísimos, muchísimo estudio y aprender a estar con la gente en sus peores días. Lo que me sostiene no es la nota, es que de verdad me importa la persona que tengo enfrente.",
    casoBy: "Valentina, médica general",
    mercado: { empleabilidad: "Alta", salario: "$3.5M – $5M / mes", nota: "El salario crece bastante con especialización, que implica de 4 a 7 años más de estudio." },
  },
  {
    id: "sis",
    name: "Ingeniería de Sistemas",
    color: "#4B6BE5",
    profile: { LOGICO: 3, VERBAL: 0, CIENTIFICO: 2, CREATIVO: 2, SOCIAL: 0, EMPRENDEDOR: 1 },
    caso: "Nadie programa solo en un cuarto oscuro: me la paso resolviendo problemas con un equipo y explicando ideas. Lo que más uso no es un lenguaje específico, es aprender rápido algo nuevo casi cada semana.",
    casoBy: "Andrés, desarrollador",
    mercado: { empleabilidad: "Muy alta", salario: "$3M – $4.5M / mes", nota: "Una de las carreras con más demanda hoy, con opción real de trabajo remoto e internacional." },
  },
  {
    id: "dis",
    name: "Diseño Gráfico",
    color: "#C247B0",
    profile: { LOGICO: 1, VERBAL: 1, CIENTIFICO: 0, CREATIVO: 3, SOCIAL: 1, EMPRENDEDOR: 1 },
    caso: "El talento para dibujar es como el 20%. El resto es entender qué necesita el cliente y saber defender por qué una decisión de diseño funciona. Aprendí más de comunicación que de arte.",
    casoBy: "Mariana, diseñadora",
    mercado: { empleabilidad: "Media", salario: "$1.8M – $2.8M / mes", nota: "Mucho trabajo independiente; el ingreso varía bastante según el portafolio y los clientes." },
  },
  {
    id: "psi",
    name: "Psicología",
    color: "#D89A20",
    profile: { LOGICO: 0, VERBAL: 2, CIENTIFICO: 2, CREATIVO: 1, SOCIAL: 3, EMPRENDEDOR: 1 },
    caso: "No es dar consejos. Es aprender a escuchar de verdad y aguantar historias difíciles sin llevártelas a casa. Estudié mucha más estadística e investigación de la que esperaba.",
    casoBy: "Camila, psicóloga",
    mercado: { empleabilidad: "Media", salario: "$2M – $3M / mes", nota: "Campos muy variados: clínica, organizacional y educativa; el área organizacional suele pagar mejor al inicio." },
  },
  {
    id: "der",
    name: "Derecho",
    color: "#6D3BF5",
    profile: { LOGICO: 2, VERBAL: 3, CIENTIFICO: 0, CREATIVO: 1, SOCIAL: 2, EMPRENDEDOR: 2 },
    caso: "Pensé que iba a ser como en las series. Es leer muchísimo, escribir con precisión y argumentar. Si no te gusta redactar, se hace cuesta arriba.",
    casoBy: "Sebastián, abogado",
    mercado: { empleabilidad: "Alta oferta / competida", salario: "$2.5M – $4M / mes", nota: "Hay muchos egresados; destacar depende bastante de la especialización y de la universidad." },
  },
  {
    id: "adm",
    name: "Administración de Empresas",
    color: "#2FA65A",
    profile: { LOGICO: 2, VERBAL: 2, CIENTIFICO: 0, CREATIVO: 1, SOCIAL: 2, EMPRENDEDOR: 3 },
    caso: "Es la carrera comodín: te da un poco de todo. La ventaja y la trampa son la misma; si no te especializas en algo, terminas compitiendo con muchísima gente.",
    casoBy: "Laura, administradora",
    mercado: { empleabilidad: "Amplia", salario: "$2.2M – $3.5M / mes", nota: "Muy versátil; el crecimiento depende del área que profundices (finanzas, marketing, operaciones)." },
  },
  {
    id: "arq",
    name: "Arquitectura",
    color: "#E8663D",
    profile: { LOGICO: 2, VERBAL: 1, CIENTIFICO: 1, CREATIVO: 3, SOCIAL: 1, EMPRENDEDOR: 1 },
    caso: null,
    casoBy: null,
    mercado: null,
  },
  {
    id: "com",
    name: "Comunicación Social",
    color: "#E85C8A",
    profile: { LOGICO: 0, VERBAL: 3, CIENTIFICO: 0, CREATIVO: 2, SOCIAL: 2, EMPRENDEDOR: 2 },
    caso: "Aprendí a contar historias en todos los formatos. Lo difícil no fue crear contenido, fue entender datos y estrategia para que ese contenido sirviera a un objetivo real.",
    casoBy: "Juan, comunicador",
    mercado: { empleabilidad: "Media", salario: "$2M – $3M / mes", nota: "El marketing digital y la comunicación estratégica son las áreas con más demanda hoy." },
  },
];
