/**
 * Utility functions for savings objectives
 */

/**
 * Get the appropriate emoji for a savings objective based on its name
 * @param name - The name of the savings objective
 * @returns The emoji string
 */
export const getObjectiveEmoji = (name: string): string => {
  const lowerName = name.toLowerCase();

  switch (true) {
    case lowerName.includes('vacance') || lowerName.includes('été') || lowerName.includes('voyage') || lowerName.includes('plage'):
      return '🏖️';
    case lowerName.includes('téléphone') || lowerName.includes('phone') || lowerName.includes('mobile') || lowerName.includes('iphone'):
      return '📱';
    case lowerName.includes('voiture') || lowerName.includes('permis') || lowerName.includes('conduire') || lowerName.includes('auto'):
      return '🚗';
    case lowerName.includes('maison') || lowerName.includes('appartement') || lowerName.includes('immobilier') || lowerName.includes('logement'):
      return '🏠';
    case lowerName.includes('études') || lowerName.includes('formation') || lowerName.includes('école') || lowerName.includes('université'):
      return '🎓';
    case lowerName.includes('mariage') || lowerName.includes('noces') || lowerName.includes('cérémonie'):
      return '💒';
    case lowerName.includes('retraite') || lowerName.includes('pension') || lowerName.includes('fin de carrière'):
      return '👴';
    case lowerName.includes('ordinateur') || lowerName.includes('pc') || lowerName.includes('laptop') || lowerName.includes('macbook'):
      return '💻';
    case lowerName.includes('vêtement') || lowerName.includes('vetement') || lowerName.includes('habit') || lowerName.includes('mode'):
      return '👕';
    case lowerName.includes('sport') || lowerName.includes('fitness') || lowerName.includes('gym') || lowerName.includes('musculation'):
      return '🏋️';
    case lowerName.includes('musique') || lowerName.includes('instrument') || lowerName.includes('guitare') || lowerName.includes('piano'):
      return '🎸';
    case lowerName.includes('jeu') || lowerName.includes('gaming') || lowerName.includes('console') || lowerName.includes('playstation'):
      return '🎮';
    case lowerName.includes('livre') || lowerName.includes('lecture') || lowerName.includes('bibliothèque'):
      return '📚';
    case lowerName.includes('cadeau') || lowerName.includes('anniversaire') || lowerName.includes('noël'):
      return '🎁';
    case lowerName.includes('restaurant') || lowerName.includes('cuisine') || lowerName.includes('chef'):
      return '🍽️';
    case lowerName.includes('bijou') || lowerName.includes('montre') || lowerName.includes('bague'):
      return '💍';
    case lowerName.includes('animal') || lowerName.includes('chat') || lowerName.includes('chien') || lowerName.includes('pet'):
      return '🐕';
    case lowerName.includes('jardin') || lowerName.includes('plante') || lowerName.includes('fleur'):
      return '🌱';
    case lowerName.includes('voyage') || lowerName.includes('avion') || lowerName.includes('découverte'):
      return '✈️';
    case lowerName.includes('urgence') || lowerName.includes('fonds') || lowerName.includes('sécurité'):
      return '🛡️';
    default:
      return '💰';
  }
};

/**
 * Format a date string to a readable format
 * @param dateString - The date string to format
 * @returns Formatted date string or null
 */
export const formatSavingsDate = (dateString: string | null): string | null => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}; 