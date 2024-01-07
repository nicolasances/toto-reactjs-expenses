import {ReactComponent as SALARY} from '../img/incomescat/salary.svg';
import {ReactComponent as BONUS} from '../img/incomescat/bonus.svg';
import {ReactComponent as CHILD} from '../img/incomescat/child.svg';
import {ReactComponent as REIMBURSEMENT} from '../img/incomescat/reimbursement.svg';
import {ReactComponent as OTHER} from '../img/incomescat/other.svg';


export const incomeCategoriesMap = new Map([
  ['SALARY', {image: (<SALARY />), label: 'Salary'}],
  ['BONUS', {image: (<BONUS/>), label: 'Bonus'}],
  ['CHILD', {image: (<CHILD/>), label: 'Child support'}],
  ['REIMBURSEMENT', {image: (<REIMBURSEMENT/>), label: 'Reimbursement'}],
  ['VARIE', {image: (<OTHER/>), label: 'Other'}],
])

