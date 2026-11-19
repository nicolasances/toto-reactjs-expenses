'use client'

import moment from 'moment-timezone';
import TotoListAvatar, { TotoListAvatarSize } from '@/components/TotoListAvatar';
import './ExpenseListItem.css';

interface ExpenseListItemProps {
    data: {
        avatar: {
            size?: TotoListAvatarSize;      // (OPT, default 'm') size of the avatar
            value: string;                  // Public path of the avatar image
        };                                  // (MAND) the avatar to display
        date: {
            date: string;                   // A YYYYMMDD-formatted date
            showYear?: boolean;             // (OPT, default false) pass true to also show the year of the expense
        };                                  // (MAND) the date of the transaction
        title: string;                      // (MAND) the description of the transaction
        monthly?: boolean;                  // (OPT) true if the transaction is a monthly transaction
        amount: number;                     // (MAND) the amount of the transaction
    };                                      // What to display
}

/**
 * Displays a Toto transaction in a row-like fashion.
 *
 * @param {ExpenseListItemProps} props the props
 */
export default function ExpenseListItem(props: ExpenseListItemProps) {

    const data = props.data;

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
    const title = (<div className='item-title'>{data.title}</div>)

    // Monthly Recurrence
    let monthly;
    if (data.monthly) {
        monthly = (<div className="item-recurrance">M</div>)
    }

    // Amount if any
    const amount = (<div className='item-amount'>kr. {data.amount.toLocaleString("it", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</div>)

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
