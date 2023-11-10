import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import './EditTagExpensesScreen.css'
import ExpensesPicker from './comp/TagExpensesPicker';

export default function EditTagExpensesScreen(props) {

    const location = useLocation();
    const history = useHistory();

    const tag = location.state.tag;

    return (
        <ExpensesPicker tagId={tag.id} noDelete={true} />
    )

}