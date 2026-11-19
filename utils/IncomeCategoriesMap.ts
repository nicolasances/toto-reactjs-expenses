import { CategoryInfo } from './CategoriesMap';

/**
 * Income categories, by category code.
 */
export const incomeCategoriesMap = new Map<string, CategoryInfo>([
  ['SALARY', { icon: '/images/incomescat/salary.svg', label: 'Salary' }],
  ['BONUS', { icon: '/images/incomescat/bonus.svg', label: 'Bonus' }],
  ['CHILD', { icon: '/images/incomescat/child.svg', label: 'Child support' }],
  ['REIMBURSEMENT', { icon: '/images/incomescat/reimbursement.svg', label: 'Reimbursement' }],
  ['INVESTMENTS', { icon: '/images/incomescat/investments.svg', label: 'Investments' }],
  ['VARIE', { icon: '/images/incomescat/other.svg', label: 'Other' }]
]);
