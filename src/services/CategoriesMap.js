import {ReactComponent as AUTO} from '../img/cat/AUTO.svg';
import {ReactComponent as CLOTHES} from '../img/cat/CLOTHES.svg';
import {ReactComponent as FOOD} from '../img/cat/FOOD.svg';
import {ReactComponent as FURNITURE} from '../img/cat/FURNITURE.svg';
import {ReactComponent as HOME} from '../img/cat/HOME.svg';
import {ReactComponent as PALESTRA} from '../img/cat/PALESTRA.svg';
import {ReactComponent as SALUTE} from '../img/cat/SALUTE.svg';
import {ReactComponent as SUPERMERCATO} from '../img/cat/SUPERMERCATO.svg';
import {ReactComponent as SVAGO} from '../img/cat/SVAGO.svg';
import {ReactComponent as USCITE} from '../img/cat/USCITE.svg';
import {ReactComponent as VARIE} from '../img/cat/VARIE.svg';
import {ReactComponent as VIAGGI} from '../img/cat/VIAGGI.svg';
import {ReactComponent as XMAS} from '../img/cat/XMAS.svg';
import {ReactComponent as CHILD} from '../img/cat/CHILD.svg';
import {ReactComponent as PET} from '../img/cat/PET.svg';


var categoriesMap = new Map([
  ['AUTO', {image: (<AUTO />), label: 'Transport'}],
  ['CLOTHES', {image: (<CLOTHES/>), label: 'Clothes'}],
  ['FOOD', {image: (<FOOD/>), label: 'Eating out'}],
  ['FURNITURE', {image: (<FURNITURE/>), label: 'Furniture'}],
  ['HOME', {image: (<HOME/>), label: 'Home expenses'}],
  ['PALESTRA', {image: (<PALESTRA/>), label: 'Fitness'}],
  ['SALUTE', {image: (<SALUTE/>), label: 'Health'}],
  ['SUPERMERCATO', {image: (<SUPERMERCATO/>), label: 'Groceries'}],
  ['SVAGO', {image: (<SVAGO/>), label: 'Entertainement'}],
  ['USCITE', {image: (<USCITE/>), label: 'Night out'}],
  ['VARIE', {image: (<VARIE/>), label: 'Other'}],
  ['VIAGGI', {image: (<VIAGGI/>), label: 'Trips'}],
  ['XMAS', {image:(< XMAS/>), label: 'Presents'}], 
  ['CHILD', {image:(< CHILD/>), label: 'Noah'}], 
  ['PET', {image:(< PET/>), label: 'Dog'}]
])

export default categoriesMap;
