// Tabelas de dados para geração aleatória de goblins

// Nomes de goblins (primeiro nome + sobrenome)
export const firstNames = [
  'Zug', 'Grik', 'Blat', 'Snot', 'Guz', 'Urg', 'Skab', 'Kruk', 'Glob', 'Rot',
  'Pus', 'Muk', 'Grub', 'Stink', 'Squig', 'Zit', 'Crud', 'Gob', 'Skrat', 'Nib',
  'Grim', 'Skrut', 'Zap', 'Blort', 'Gluk', 'Dreg', 'Skwik', 'Fang', 'Gnarl', 'Snik'
];

export const lastNames = [
  'Nariz-Torto', 'Pé-Fedido', 'Dedo-Podre', 'Olho-Vesgo', 'Bunda-Suja', 'Cospe-Longe',
  'Rabo-Curto', 'Orelha-Caída', 'Dente-Quebrado', 'Perna-Torta', 'Mão-Pegajosa',
  'Barriga-Inchada', 'Língua-Comprida', 'Cabeça-Oca', 'Peido-Azedo', 'Unha-Preta',
  'Cuspe-Verde', 'Pele-Grudenta', 'Verme-Feliz', 'Rato-Comedor', 'Ladrão-de-Galinhas',
  'Cata-Lixo', 'Foge-Rápido', 'Quebra-Tudo', 'Lambe-Botas', 'Rouba-Comida',
  'Mata-Humano', 'Cheira-Mal', 'Bebe-Muito', 'Caga-Mole'
];

// Características físicas
export const height = [
  '60cm (minúsculo mesmo para um goblin)',
  '70cm (bem pequeno)',
  '80cm (tamanho padrão)',
  '90cm (alto para um goblin)',
  '1m (gigante entre os goblins)',
  '1,10m (anormalmente grande)'
];

export const weight = [
  '15kg (esquelético)',
  '20kg (magrelo)',
  '25kg (peso médio)',
  '30kg (rechonchudo)',
  '35kg (gorducho)',
  '40kg (obeso para padrões goblin)'
];

export const skinColor = [
  'verde-musgo', 'verde-limão', 'verde-escuro', 'verde-amarelado',
  'verde-acinzentado', 'verde-azulado', 'verde-vômito', 'verde-podre'
];

export const eyeColor = [
  'amarelo brilhante', 'vermelho sangue', 'laranja intenso', 'preto como carvão',
  'branco leitoso', 'roxo doentio', 'verde fluorescente', 'azul elétrico'
];

export const physicalTraits = [
  'orelhas pontudas e caídas', 'nariz comprido e torto', 'dentes afiados e amarelados',
  'olhos grandes e esbugalhados', 'verrugas por todo o rosto', 'cicatrizes de batalha',
  'um olho maior que o outro', 'mãos com seis dedos', 'pés enormes e chatos',
  'cabeça desproporcional ao corpo', 'braços longos e finos', 'pernas arqueadas',
  'queixo protuberante', 'sobrancelhas grossas e unidas', 'cabelo ralo e oleoso',
  'unhas compridas e sujas', 'barriga protuberante', 'postura corcunda',
  'orelha faltando um pedaço', 'tatuagens tribais mal feitas'
];

// Traços de personalidade
export const personalityTraits = [
  'covarde ao extremo', 'trapaceiro compulsivo', 'piromaníaco', 'cleptomaníaco',
  'glutão insaciável', 'mentiroso patológico', 'curioso demais', 'preguiçoso crônico',
  'bajulador de superiores', 'colecionador de bugigangas inúteis', 'supersticioso',
  'medroso de sombras', 'fanfarrão (mas só quando está seguro)', 'invejoso de tudo',
  'rancoroso e vingativo', 'fala sozinho constantemente', 'adora contar histórias exageradas',
  'ri em momentos inapropriados', 'adora fazer pegadinhas', 'tem medo de água',
  'acredita ser o goblin mais esperto', 'sonha em ser um grande chefe', 'odeia elfos com paixão',
  'tem um amigo imaginário', 'coleciona orelhas de inimigos', 'sempre com fome',
  'desconfia de todos', 'adora brilhos e coisas coloridas', 'imita os outros', 'gosta de cantar (mal)'
];

// Equipamentos iniciais
export const weapons = [
  'faca enferrujada', 'porrete com pregos', 'estilingue remendado', 'arco torto',
  'lança improvisada', 'machado cego', 'adaga quebrada', 'espada muito grande (para ele)',
  'martelo pesado demais', 'atiradeira de pedras', 'garras metálicas', 'besta que falha',
  'corrente com peso', 'foice enferrujada', 'cajado com crânio', 'zarabatana entupida'
];

export const armor = [
  'trapos sujos', 'couro remendado', 'chapéu de lata', 'escudo improvisado de madeira',
  'peças de armadura roubadas', 'peles de rato costuradas', 'couraça de tartaruga',
  'capacete grande demais', 'cota de malha furada', 'proteção de ombro feita de ossos',
  'sem armadura, confia na sorte', 'armadura de panelas amarradas'
];

export const items = [
  'saco de bugigangas brilhantes', 'rato de estimação', 'garrafa de bebida forte',
  'mapa incompreensível', 'chaves de portas desconhecidas', 'dados viciados',
  'espelho quebrado', 'pente sem dentes', 'relógio que não funciona', 'anel "mágico" (não é)',
  'cogumelos suspeitos', 'dente de gigante (na verdade de cavalo)', 'pé de coelho (sem sorte)',
  'boneco de pano assustador', 'apito que só irrita outros goblins', 'pedra "da sorte"',
  'frasco com "veneno" (é só água suja)', 'pergaminho com rabiscos', 'moedas falsas',
  'orelha seca de elfo', 'colar de dentes', 'isqueiro falho', 'luneta quebrada',
  'poção misteriosa (provavelmente perigosa)'
];

// Talentos especiais
export const specialTalents = [
  'gritar tão alto que assusta até outros goblins',
  'morder com força surpreendente',
  'correr muito rápido (especialmente fugindo)',
  'esconder-se em espaços minúsculos',
  'imitar sons de animais com perfeição',
  'encontrar comida em qualquer lugar',
  'resistência incomum a venenos',
  'sentido de direção subterrâneo',
  'faro apurado para tesouros',
  'habilidade de dormir em qualquer posição',
  'fazer armadilhas improvisadas',
  'roubar sem ser notado',
  'sobreviver com quase nada de comida',
  'consertar objetos quebrados (de forma precária)',
  'entender linguagens que nunca estudou',
  'fazer amizade com animais perigosos',
  'prever o clima com precisão',
  'resistir a temperaturas extremas',
  'enxergar no escuro total',
  'nadar surpreendentemente bem',
  'imitar a voz de outras pessoas',
  'cozinhar "iguarias" com ingredientes duvidosos',
  'sentir a presença de magia',
  'nunca se perder em labirintos',
  'encontrar água potável em qualquer lugar'
];

// Sorte/Maldição
export const luckTraits = [
  'sempre encontra moedas no chão',
  'as armas dos inimigos tendem a quebrar',
  'raramente é notado por predadores',
  'sobreviveu a várias situações fatais por pura sorte',
  'frequentemente encontra itens úteis por acaso',
  'os guardas sempre olham para o outro lado',
  'nunca pega doenças comuns',
  'sempre consegue fugir no último segundo',
  'as pessoas tendem a gostar dele sem motivo aparente',
  'encontra comida fresca com facilidade',
  'as fechaduras parecem mais fáceis de abrir',
  'sempre cai em pé'
];

export const curseTraits = [
  'tropeça em momentos críticos',
  'armas tendem a escorregar de suas mãos',
  'atrai insetos irritantes',
  'frequentemente confundido com alvo por arqueiros',
  'comida estraga rapidamente em sua posse',
  'tende a ser o primeiro a ser atacado',
  'ronca alto quando tenta se esconder',
  'bolsos furados que deixam cair itens importantes',
  'alergias aleatórias em momentos inconvenientes',
  'cheiro que atrai predadores',
  'sempre escolhe o caminho mais perigoso sem querer',
  'tem pesadelos que se tornam realidade'
]; 
