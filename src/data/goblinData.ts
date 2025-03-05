export const goblinNames = [
  ['Plaft', 'Plin', 'Tik', 'Tok', 'Bash', 'Cricri'],
  ['Glub', 'Tim', 'Ranço', 'Yhaa', 'Vrum', 'Aiaiai'],
  ['Crash', 'Guiniquegui', 'Sussa', 'Bibi', 'Boom', 'Bum'],
  ['Spray', 'Cringe', 'Sopa', 'Ovo', 'Ban', 'Nhack'],
  ['Bing', 'Riso', 'Slash', 'Coff', 'Ugh', 'Sniff'],
  ['[Última coisa que comeu]', '[Inverta seu nome]'],
]

export const occupations = [
  'Mercenário',
  'Caçador',
  'Gatuno',
  'Líder',
  'Incendiário',
  'Bruxo',
]

export const describers = [
  'Covarde',
  'Atrapalhado',
  'Tapado',
  'Fracote',
  'Medíocre',
  'Supimpa',
]

export const occupationModifiers = {
  Mercenário: { combate: 1 },
  Caçador: { combate: 1 },
  Gatuno: { habilidade: 1 },
  Líder: { vitalidade: 1 },
  Incendiário: { vitalidade: 1 },
  Bruxo: { noção: 1 },
}

export const describerModifiers = {
  Covarde: { combate: -1 },
  Atrapalhado: { habilidade: -1 },
  Tapado: { noção: -1 },
  Fracote: { vitalidade: -1 },
  Medíocre: { },
  Supimpa: { escolha: 1 },
}

export const traits = [
  ['Bomba-relógio', 'Minicabeça', 'Apêndice extra', 'Poros fedidos', 'Verdura', '[Role 2 vezes]'],
  ['Cinzento', 'Cabeção', 'Orelha extra', 'Pintas', 'Minion', 'Fosforescente'],
  ['Amaldiçoado', 'Linguão', 'Nariz extra', 'Listras', 'Galináceo', 'Colorido'],
  ['Tom bélico', 'Olho gigante', 'Olhos extras', 'Pompom', 'Peixoso', 'Amarelo'],
  ['Flutulência', 'Pés gigantes', 'Braço extra', 'Chifre', 'Felino', 'Azul'],
  ['[Role 2 vezes]', 'Mão gigante', 'Cabeça extra', 'Cicatrizes', 'Aracnídeo', 'Vermelho'],
]

export const occupationEquipment = {
  Mercenário: [
    ['Espada', 'Escudo'],
    ['Machadinha', 'Machadinha'],
    ['Machadão'],
  ],
  Caçador: [
    ['Adaga', 'Adaga', 'Adaga'],
    ['Arco e Flecha'],
    ['Pistola', 'Chapéu'],
  ],
  Gatuno: [
    ['Adaga', 'Adaga', 'Adaga'],
    ['Rapieira', 'Broquel'],
    ['Pistola', 'Chapéu'],
  ],
  Líder: [
    ['Espada', 'Medalhas de Guerra'],
    ['Lança', 'Elmo'],
    ['Espadona'],
  ],
  Incendiário: [
    ['Barril de Pólvora'],
    ['Pistola', 'Galinha Explosiva'],
    ['Bacamarte', 'Chapéu'],
  ],
  Bruxo: [
    ['Cajado'],
    ['Varinha', 'Cachecol'],
    ['Vassoura', 'Chapéu'],
  ],
}

export const occupationTechniques = {
  Mercenário: {
    1: 'Mestre de Armas: Você sempre rola + dado em todos os ataques que fizer lutando com sua arma favorita.',
    2: 'Ataque Giratório: Sempre que você causar dano a um inimigo com uma arma corporal, pode fazer mais um ataque contra outro inimigo que estiver ao seu alcance.',
    3: 'Ataque Brutal: Uma vez por dia, você pode declarar um Ataque Brutal. Faça um ataque corporal normalmente com o dobro de dados.',
  },
  Caçador: {
    1: 'Inimigo: Escolha uma espécie de criatura quando começar o jogo. Você sempre rola + dado em todos os ataques contra essa espécie de criatura.',
    2: 'Rastrear: Você sabe seguir pegadas e identificar a criatura das pegadas.',
    3: 'Tiro Certeiro: Uma vez por dia, você pode declarar um Tiro Certeiro. Faça um ataque à distância normalmente com o dobro de dados.',
  },
  Gatuno: {
    1: 'Roubar: Conseguindo 1 hit em um teste de Habilidade, você pode roubar um objeto do bolso de qualquer pessoa sem que ela perceba.',
    2: 'Ataque Furtivo: Você sempre rola 2 dados a mais se fizer um ataque contra um alvo que não sabe onde você está.',
    3: 'Esconder: Uma vez por dia, você pode se esconder sem precisar fazer um teste. Você estará completamente escondido até se mexer ou emitir som.',
  },
  Líder: {
    1: 'Grito de Guerra: Uma vez por dia, você pode dar este grito. Faça um teste de Noção e, se conseguir 1 hit, todos os seus aliados ficarão com Combate +1 até o final da batalha.',
    2: 'Humilhação: Uma vez por dia, você pode gritar e xingar um aliado seu que eliminará todos os ferimentos dele.',
    3: 'Ataque Brutal: Uma vez por dia, você pode declarar um Ataque Brutal. Faça um ataque corporal normalmente com o dobro de dados.',
  },
  Incendiário: {
    1: 'Resistência: Você sempre recebe 1 ferimento a menos de ataques de fogo ou tiro de armas de fogo.',
    2: 'Delírio: Você pode se livrar de todos os ferimentos se você explodir ou queimar completamente uma casa ou algo maior que isso.',
    3: 'Imunidade: Você é imune a fogo.',
  },
  Bruxo: {
    1: 'Magias: Você pode conjurar magias da sua lista (escolha 3 magias). Para conjurar uma magia, faça um teste de Noção e consulte o efeito da magia.',
    2: 'Condutor Mágico: Se você conjurar a magia por uma varinha, cajado ou outro Condutor Mágico, você rola 1 dado a mais.',
    3: 'Implacável: Uma vez por dia, você pode conjurar uma magia sem rolar os dados, apenas escolhendo o resultado.',
  },
}

export const spells = [
  'Fogo',
  'Gelo',
  'Relâmpago',
  'Troca',
  'Cura',
  'Morte',
  'Planta',
]

export const spellEffects = {
  Fogo: {
    0: 'Uma explosão queima seu rosto e você recebe 1 ferimento.',
    1: 'Uma bolinha de fogo capaz de iluminar o caminho. Não dá pra arremessá-la.',
    2: 'Uma grande bola de fogo que pode ser usada para iluminar lugares ou ser arremessada, causando automaticamente 3 ferimentos a um alvo visível.',
    3: 'Uma rajada de fogo engole todas as criaturas à sua frente, incluindo aliados. Todos receberão 4 ferimentos de fogo.',
  },
  Gelo: {
    0: 'Um dos seus braços se congela e não pode ser usado até o final do dia.',
    1: 'Um raio de frio atinge um inimigo que recebe 1 ferimento.',
    2: 'Um raio de frio atinge um inimigo que recebe 1 ferimento e não poderá agir no seu próximo turno.',
    3: 'Todas as criaturas visíveis, incluindo aliados, ficam completamente congelados por alguns minutos (mas estarão conscientes embaixo do gelo).',
  },
  Relâmpago: {
    0: 'Um relâmpago cai em cima de você e causa 1 ferimento.',
    1: 'Um relâmpago cai em um inimigo à sua escolha e causa 1 ferimento.',
    2: 'Um relâmpago cai em até 4 inimigos à sua escolha e causa 1 ferimento em cada um.',
    3: 'Uma tempestade se forma no céu. Relâmpagos caem aleatoriamente até o final da batalha.',
  },
  Troca: {
    0: 'Sua roupa é trocada pela roupa de outro personagem aleatório.',
    1: 'Você desaparece e aparece em um local à sua escolha. Suas roupas e pertences ficam para trás.',
    2: 'Você desaparece e aparece em um local à sua escolha. Suas roupas e pertences vão junto.',
    3: 'Você desaparece e aparece em um local aleatório desconhecido.',
  },
  Cura: {
    0: 'Sua pele fica pálida e você fica tonto. Perca 1 de Vitalidade até o final do dia.',
    1: 'Um aliado ao seu toque remove 1 ferimento.',
    2: 'Um aliado ao seu toque remove todos seus ferimentos.',
    3: 'Todas as criaturas visíveis, incluindo inimigos, removem todos seus ferimentos.',
  },
  Morte: {
    0: 'Sua pele cai e você vira um esqueleto ambulante. Perca permanentemente 1 de Habilidade e 1 de Vitalidade.',
    1: 'Você pode animar um esqueleto que esteja inteiro. Ele lutará para você por 2 turnos.',
    2: 'Você pode animar um esqueleto que esteja inteiro. Ele lutará para você até o final da batalha.',
    3: 'Todos os esqueletos a até 10 metros de você ganham vida e começam a dançar por 1 hora.',
  },
  Planta: {
    0: 'Nascem folhas e flores por todo o seu corpo.',
    1: 'Você cria plantas ou arbustos com o seu toque na terra.',
    2: 'Você pode criar plantas ou arbustos em qualquer lugar visível. Você pode usar isso para prender os pés de inimigos.',
    3: 'Surge um matagal cheio de plantas à sua volta (raio de 5 metros de você).',
  },
}

export const weapons = {
  'Adaga': { uso: 'Uma mão', ataque: 'Corporal', bônus: 1, especial: 'Arremesso' },
  'Arco e Flecha': { uso: 'Duas mãos', ataque: 'Distância', bônus: 2, especial: 'Munição [10]' },
  'Bacamarte': { uso: 'Duas mãos', ataque: 'Distância', bônus: 3, especial: 'Recarga; Munição [2]' },
  'Besta': { uso: 'Duas mãos', ataque: 'Distância', bônus: 3, especial: 'Recarga; Munição [6]' },
  'Cajado': { uso: 'Duas mãos', ataque: 'Corporal', bônus: 1, especial: 'Condutor Mágico' },
  'Clava': { uso: 'Uma mão', ataque: 'Corporal', bônus: 1, especial: '' },
  'Espada': { uso: 'Uma mão', ataque: 'Corporal', bônus: 2, especial: '' },
  'Espada de Madeira': { uso: 'Uma mão', ataque: 'Corporal', bônus: 0, especial: '' },
  'Espadona': { uso: 'Duas mãos', ataque: 'Corporal', bônus: 3, especial: '' },
  'Estilingue': { uso: 'Duas mãos', ataque: 'Distância', bônus: 0, especial: 'Recarga' },
  'Faca': { uso: 'Uma mão', ataque: 'Corporal', bônus: 1, especial: '' },
  'Forcado': { uso: 'Duas mãos', ataque: 'Corporal', bônus: 2, especial: '' },
  'Gadanha': { uso: 'Duas mãos', ataque: 'Corporal', bônus: 3, especial: '' },
  'Lança': { uso: 'Duas mãos', ataque: 'Corporal', bônus: 3, especial: '' },
  'Machadão': { uso: 'Duas mãos', ataque: 'Corporal', bônus: 3, especial: '' },
  'Machadinha': { uso: 'Uma mão', ataque: 'Corporal', bônus: 2, especial: 'Arremesso' },
  'Martelão': { uso: 'Duas mãos', ataque: 'Corporal', bônus: 3, especial: '' },
  'Pistola': { uso: 'Uma mão', ataque: 'Distância', bônus: 2, especial: 'Recarga; Munição [5]' },
  'Rapieira': { uso: 'Uma mão', ataque: 'Corporal', bônus: 2, especial: '' },
  'Varinha': { uso: 'Uma mão', ataque: 'Corporal', bônus: 0, especial: 'Condutor Mágico' },
  'Vassoura': { uso: 'Duas mãos', ataque: 'Corporal', bônus: 1, especial: 'Condutor Mágico' },
}

export const protections = {
  'Broquel': { uso: 'Uma mão', durabilidade: 1, especial: '' },
  'Cachecol': { uso: 'Pescoço', durabilidade: 0, especial: 'Arcano' },
  'Chapéu': { uso: 'Cabeça', durabilidade: 0, especial: 'Sorte' },
  'Cota de Malha': { uso: 'Tronco', durabilidade: 2, especial: '' },
  'Elmo': { uso: 'Cabeça', durabilidade: 2, especial: '' },
  'Escudo': { uso: 'Uma mão', durabilidade: 2, especial: '' },
  'Panela': { uso: 'Cabeça', durabilidade: 1, especial: '' },
  'Peitoral': { uso: 'Tronco', durabilidade: 3, especial: '' },
  'Penico': { uso: 'Cabeça', durabilidade: 1, especial: 'Sorte' },
  'Tampa de Panela': { uso: 'Uma mão', durabilidade: 1, especial: '' },
}

export const miscEquipment = {
  'Aljava': 'Possui flechas suficientes para duplicar a quantidade de munição de um arco ou besta.',
  'Banquete': 'Comida suficiente pra alimentar um bando de goblins por 1d6 dias.',
  'Barril de Cerveja': 'O suficiente pra embebedar uma festa de goblins inteira.',
  'Barril de Pólvora': 'Se for aceso, vai explodir e causar 4 ferimentos a todos em sua volta e 2 ferimentos a todos a até 5 metros. Pode usá-lo para completar a munição de até 3 armas de fogo.',
  'Corda e Gancho': 'Para escalar paredes e muralhas. Adiciona 2 dados no teste de Habilidade para escalar.',
  'Guarda-chuva': 'Não se molhará se chover. Cobre até 4 goblins. Ajuda a diminuir a queda (-1 ferimento).',
  'Galinha Explosiva': 'Você pode arremessá-la ou deixá-la andando. Explode em dois turnos. Quando explode, causa 3 ferimentos a todos em sua volta.',
  'Livro Estranho': 'O que dá pra fazer? Não sei. Aquele que conseguir 2 hits em um teste de Noção pode conseguir ler. Existe 1 chance em 6 de ser um livro de magia. Se for, sorteie uma magia da lista.',
  'Roupa Chique': 'Um goblin nojento vestindo isso ainda fica parecendo um goblin nojento, mas pelo menos ajuda a melhorar a autoestima dele.',
  'Tenda': 'Tenda grande para até 5 goblins (10 se não se importarem de ficar empilhados).',
  'Veneno': 'Pode colocar na bebida de alguém. Aquele que beber receberá 1 ferimento por minuto.',
}

export const enemies = {
  'Camponês': { combate: 3, habilidade: 3, noção: 3, vitalidade: 3, equipamento: 'Clava', bônus: 1 },
  'Guarda': { combate: 4, habilidade: 4, noção: 3, vitalidade: 3, equipamento: 'Lança e Peitoral', bônus: [3, 3] },
  'Taverneiro': { combate: 3, habilidade: 3, noção: 4, vitalidade: 5, equipamento: 'Clava', bônus: 1 },
  'Nobre': { combate: 2, habilidade: 2, noção: 3, vitalidade: 2, equipamento: 'Espada Especial e Peitoral Reforçado', bônus: [3, 4] },
  'Criança': { combate: 2, habilidade: 2, noção: 2, vitalidade: 2, equipamento: 'Espada de Madeira', bônus: 0 },
  'Aventureiro': { combate: 5, habilidade: 4, noção: 4, vitalidade: 4, equipamento: 'Espada, Escudo, Peitoral e Elmo', bônus: [2, 7] },
  'Grande Mago': { combate: 2, habilidade: 3, noção: 5, vitalidade: 4, magia: 'Todas as magias, mas pode controlar o resultado removendo hits depois que rolar.' },
  'Cão': { combate: 4, habilidade: 3, noção: 2, vitalidade: 2 },
  'Lobo': { combate: 5, habilidade: 4, noção: 3, vitalidade: 4, especial: 'Uivo: Em vez de atacar, pode uivar. Em dois turnos, aparecerá outro lobo.' },
  'Galinha': { combate: 1, habilidade: 2, noção: 1, vitalidade: 1 },
  'Goblin Comum': { combate: 2, habilidade: 2, noção: 2, vitalidade: 2, equipamento: 'Adaga', bônus: 1 },
}

export const randomAdventures = [
  'Saquear Viajantes',
  'Sequestrar Pessoa Importante',
  'Saquear Casa Humana',
  'Proteger Masmorra',
  'Invadir Vizinhos',
]

export const inspirationTable = [
  ['Explosões', 'Medo', 'Destruir'],
  ['Madeira', 'Risada', 'Construir'],
  ['Vento', 'Dança', 'Aparecer'],
  ['Terra', 'Força', 'Atacar'],
  ['Água', 'Tranquilidade', 'Mudar'],
  ['Fogo', 'Amor', 'Resistir'],
]

export const magicItemTypes = {
  1: 'Artefato',
  2: 'Especial',
  3: 'Especial',
  4: 'Estranho',
  5: 'Estranho',
  6: 'Porcaria',
}

export const magicItems = {
  Artefato: [
    'Espada Destruidora de Mundos',
    'Martelo do Poder',
    'Coroa do Rei Feiticeiro',
    'Estatueta do Deus Serpente',
    'Ombreiras do Lorde Anão',
    'Necronomicon',
  ],
  Especial: [
    'Poção',
    'Bracelete Mágico',
    'Tocha Mágica',
    'Espada Brilhante',
    'Adaga Matadora',
    'Anel Mágico',
  ],
  Estranho: [
    'Latinhas sem Fio',
    'Piranha Empalhada',
    'Escudo Falante',
    'Corda-Serpente',
    'Cinto que Cai pra Cima',
    'Relógio Tic-Ploc',
  ],
  Porcaria: [
    'Torta Deliciosa',
    'Maçã Cheirosa',
    'Elmo-Cadeira',
    'Dentes Postiços',
    'Sandália da Vayanna',
    'Peteca',
  ],
}
