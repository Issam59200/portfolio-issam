// Images pour les avatars des stratégies
export const STRATEGY_IMAGES = {
  detective: '/agents/Detective.png',
  aleatoire: '/agents/Random.png',
  cooperer: '/agents/All Cooperate.png',
  trahir: '/agents/All Cheat.png',
  titfortat: '/agents/CopyCat.png',
  grudger: '/agents/Grudger.png',
  pavlov: '/agents/Simpleton.png',
  joueur: '/agents/Joueur.png',
};

// Libellés lisibles
export const STRATEGY_LABELS = {
  detective: 'Détective',
  aleatoire: 'Aléatoire',
  cooperer: 'Toujours coopérer',
  trahir: 'Toujours trahir',
  titfortat: 'Tit-for-Tat',
  grudger: 'Grudger',
  pavlov: 'Pavlov',
  joueur: 'Joueur',
};

// Mapping des noms de classes vers images
export const CLASS_TO_IMAGE = {
  RandomStrategy: '/agents/Random.png',
  ToujoursCoopererStrategy: '/agents/All Cooperate.png',
  ToujoursTrahirStrategy: '/agents/All Cheat.png',
  TitForTatStrategy: '/agents/CopyCat.png',
  GrudgerStrategy: '/agents/Grudger.png',
  DetectiveStrategy: '/agents/Detective.png',
  PavlovStrategy: '/agents/Simpleton.png',
};

// Mapping des noms de classes vers noms lisibles
export const CLASS_TO_LABEL = {
  RandomStrategy: 'Aléatoire',
  ToujoursCoopererStrategy: 'Toujours coopérer',
  ToujoursTrahirStrategy: 'Toujours trahir',
  TitForTatStrategy: 'Tit-for-Tat',
  GrudgerStrategy: 'Grudger',
  DetectiveStrategy: 'Détective',
  PavlovStrategy: 'Pavlov',
};

// Couleurs des stratégies pour les graphiques
export const STRATEGY_COLORS = {
  cooperer: '#00e5ff',
  trahir: '#ff2d55',
  titfortat: '#a259ff',
  grudger: '#ffe156',
  detective: '#ff9500',
  aleatoire: '#64ffda',
  pavlov: '#76ff03',
};

// Toutes les stratégies disponibles (sauf joueur humain)
export const ALL_STRATEGIES = ['cooperer', 'trahir', 'titfortat', 'grudger', 'detective', 'aleatoire', 'pavlov'];

// Descriptions des stratégies
export const STRATEGY_DESCRIPTIONS = {
  cooperer: 'Coopère à chaque tour, quoi qu\'il arrive.',
  trahir: 'Trahit à chaque tour, quoi qu\'il arrive.',
  titfortat: 'Coopère au 1er tour, puis copie le dernier coup de l\'adversaire.',
  grudger: 'Coopère jusqu\'à la première trahison, puis trahit pour toujours.',
  detective: 'Joue C, T, C, C puis exploite si l\'adversaire n\'a pas trahi, sinon joue Tit-for-Tat.',
  aleatoire: 'Joue aléatoirement : 50% de chance de coopérer ou trahir.',
  pavlov: 'Répète son coup si le résultat était bon, change sinon (Win-Stay, Lose-Shift).',
};
