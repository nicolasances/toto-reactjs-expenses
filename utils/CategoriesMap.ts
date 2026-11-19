/**
 * A category of transactions: its icon (an SVG under /public, to render with MaskedSvgIcon) and its label.
 */
export interface CategoryInfo {
  icon: string;     // Public path of the SVG icon, e.g. /images/cat/AUTO.svg
  label: string;    // Label shown to the user
}

/**
 * Expense categories, by category code.
 */
const categoriesMap = new Map<string, CategoryInfo>([
  ['AUTO', { icon: '/images/cat/AUTO.svg', label: 'Transport' }],
  ['CLOTHES', { icon: '/images/cat/CLOTHES.svg', label: 'Clothes' }],
  ['FOOD', { icon: '/images/cat/FOOD.svg', label: 'Eating out' }],
  ['FURNITURE', { icon: '/images/cat/FURNITURE.svg', label: 'Furniture' }],
  ['HOME', { icon: '/images/cat/HOME.svg', label: 'Home expenses' }],
  ['PALESTRA', { icon: '/images/cat/PALESTRA.svg', label: 'Fitness' }],
  ['SALUTE', { icon: '/images/cat/SALUTE.svg', label: 'Health' }],
  ['SUPERMERCATO', { icon: '/images/cat/SUPERMERCATO.svg', label: 'Groceries' }],
  ['SVAGO', { icon: '/images/cat/SVAGO.svg', label: 'Entertainement' }],
  ['USCITE', { icon: '/images/cat/USCITE.svg', label: 'Night out' }],
  ['VARIE', { icon: '/images/cat/VARIE.svg', label: 'Other' }],
  ['VIAGGI', { icon: '/images/cat/VIAGGI.svg', label: 'Trips' }],
  ['XMAS', { icon: '/images/cat/XMAS.svg', label: 'Presents' }],
  ['CHILD', { icon: '/images/cat/CHILD.svg', label: 'Noah' }],
  ['PET', { icon: '/images/cat/PET.svg', label: 'Dog' }]
]);

export default categoriesMap;
