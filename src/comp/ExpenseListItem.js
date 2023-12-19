import './ExpenseListItem.css'
import moment from 'moment-timezone';
import TotoListAvatar from './TotoListAvatar';

export default function ExpenseListItem(props) {

    let data = props.data;

    // Avatar
    const avatarSize = data.avatar.size ? data.avatar.size : 'm';
    const avatar = (<TotoListAvatar image={data.avatar.value} size={avatarSize} />)

    // Date 
    let date = (
        <div className='dayMonth'>
            <div className='day'>{moment(data.date.date, 'YYYYMMDD').format('DD')}</div>
            <div className='month'>{moment(data.date.date, 'YYYYMMDD').format('MMM')}</div>
        </div>
    )

    // Main text of the item
    let title = (<div className='item-title'>{data.title}</div>)

    // Monthly Recurrence
    let monthly;
    if (data.monthly) {
        monthly = (<div className="item-recurrance">M</div>)
    }

    // Amount if any
    let amount = (<div className='item-amount'>kr. {data.amount.toLocaleString("it", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</div>)

    return (
        <div className="expense-list-item">
            {avatar}
            {date}
            {title}
            {monthly}
            {amount}
        </div>
    )
}