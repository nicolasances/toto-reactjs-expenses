import './ExpenseListItem.css'
import moment from 'moment-timezone';
import TotoListAvatar from './TotoListAvatar';

/**
 * Displays a Toto Transactions in a row-like fashion. 
 * -----------------------------------------------------------------------------
 * Parameters: 
 * 
 * - data           :   (MAND) this is an object that will consider the following fields: 
 *                      - avatar        (MAND) an object that represents the avatar to be displayed. Should contain
 *                                      the following fields: 
 *                                      - size: can have values defined in TotoListAvatar
 *                                      - value: the value as defined in TotoListAvatar
 *                      - date          (MAND) an object with fields: 
 *                                      - date: <a YYYYMMDD-formatted date>
 *                                      - showYear: (OPT, default false) pass true to also show the year of the expense
 *                      - title         (MAND) the description of the transaction
 *                      - monthly       (OPT) a boolean, if the transaction is a monthly transaction
 *                      - amount        (MAND, number) the amount of the tx
 * 
 */
export default function ExpenseListItem(props) {

    let data = props.data;

    // Avatar
    const avatarSize = data.avatar.size ? data.avatar.size : 'm';
    const avatar = (<TotoListAvatar image={data.avatar.value} size={avatarSize} />)

    // Date 
    let date; 
    if (data.date && !data.date.showYear) date = (
        <div className='dayMonth'>
            <div className='day'>{moment(data.date.date, 'YYYYMMDD').format('DD')}</div>
            <div className='month'>{moment(data.date.date, 'YYYYMMDD').format('MMM')}</div>
        </div>
    )
    else if (data.date.showYear === true) date = (
        <div className='dayMonth'>
            <div className='day-month'>{moment(data.date.date, 'YYYYMMDD').format('DD.MM')}</div>
            <div className='year'>{moment(data.date.date, 'YYYYMMDD').format('YYYY')}</div>
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