/**
 * Convert text to title case (capitalize first letter of each word)
 * Preserves backend-formatted text that's already properly capitalized
 * Example: "co-operation marketing and textiles department" 
 *          becomes "Co-Operation Marketing And Textiles Department"
 * Example: "Road Construction And Maintenance" stays "Road Construction And Maintenance"
 */
export const toTitleCase = (text: string | null | undefined): string => {
  if (!text) return '';
  
  // Check if text is already mostly capitalized (from backend)
  // If more than 30% of words start with uppercase, assume it's already formatted
  const words = text.split(' ');
  const capitalizedWords = words.filter(word => word.length > 0 && word.charAt(0) === word.charAt(0).toUpperCase()).length;
  const percentCapitalized = (capitalizedWords / words.length) * 100;
  
  // If already well-formatted from backend, return as-is
  if (percentCapitalized > 30) {
    return text;
  }
  
  // Otherwise, apply title case
  return text
    .toLowerCase()
    .split(' ')
    .map(word => {
      // Handle hyphenated words like "co-operation"
      return word.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('-');
    })
    .join(' ');
};
