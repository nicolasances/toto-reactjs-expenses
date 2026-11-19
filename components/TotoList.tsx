'use client'

import moment from 'moment';
import TouchableOpacity from '@/components/TouchableOpacity';
import TotoListAvatar, { TotoListAvatarSize } from '@/components/TotoListAvatar';
import { MaskedSvgIcon } from 'toto-react';
import './TotoList.css';

/**
 * The data to display for one row of the list, as returned by the dataExtractor.
 */
export interface TotoListRowData<T> {
  avatar?: {
    type: 'image' | 'text' | 'number' | 'select';   // The type of avatar ('select' is a selectable radio button)
    value?: string | number;                        // The value to display: a public image path for 'image', text otherwise
    size?: TotoListAvatarSize;                      // (OPT, default 'm') the size of the avatar
    selected?: boolean;                             // (OPT, default false) pass true to show as a selected row
  };
  date?: {
    yearMonth?: string;                             // (OPT) a date in a yearMonth format
    date?: string;                                  // (OPT) a date in YYYYMMDD format
  };
  title?: string;                                   // (OPT) the main text of the row
  monthly?: boolean;                                // (OPT) true if the item is a monthly recurring one
  amount?: string | number;                         // (OPT) an amount to display (typically at the end of the row)
  highlights?: {
    image: string;                                  // Public path of the svg image of the action
    onPress?: (item: T) => void;                    // (OPT) called when the highlight is pressed
  }[];                                              // (OPT) actions that can be done on the item
  style?: 'income' | 'payment' | string;            // (OPT) differentiates the style of the single item ("income", "payment")
}

interface TotoListProps<T> {
  data?: T[] | null;                                                        // The items to list
  dataExtractor: (item: T, index: number) => TotoListRowData<T>;            // Extracts the data to display from an item
  onAvatarClick?: (item: T, selected: boolean) => void;                     // (OPT) called when the avatar is clicked, with the item and its new selected state
  onPress?: (item: T) => void;                                              // (OPT) called when the item (row) is clicked
}

/**
 * Displays a list of items.
 *
 * @param {TotoListProps<T>} props the props
 */
export default function TotoList<T>(props: TotoListProps<T>) {

  const items = [];

  if (props.data && props.data.length > 0) {

    for (let i = 0; i < props.data.length; i++) {

      const itemData = props.dataExtractor(props.data[i], i);
      const key = 'TotoListItem-' + i + '-' + Math.random();

      items.push((
        <Item<T>
          key={key}
          data={itemData}
          item={props.data[i]}
          onAvatarClick={props.onAvatarClick}
          onPress={props.onPress}
        />
      ))
    }
  }

  return (
    <div className='toto-list'>
      {items}
    </div>
  )
}

interface ItemProps<T> {
  data: TotoListRowData<T>;                                 // What to display
  item: T;                                                  // The item the row represents
  onAvatarClick?: (item: T, selected: boolean) => void;     // (OPT) called when the avatar is clicked
  onPress?: (item: T) => void;                              // (OPT) called when the row is clicked
}

/**
 * A row of the list.
 *
 * @param {ItemProps<T>} props the props
 */
function Item<T>(props: ItemProps<T>) {

  const data = props.data;

  /**
   * Reacts to the avatar click
   */
  const onItemAvatarClick = () => {

    const itemSelected = (props.item as { selected?: boolean }).selected;
    const selected = !(itemSelected == null ? false : itemSelected);

    // If there's a configured callback
    if (props.onAvatarClick) props.onAvatarClick(props.item, selected);
  }

  /**
   * Reacts to the row click
   */
  const onPress = () => {

    if (props.onPress) props.onPress(props.item);
  }

  // Avatar
  let avatar;
  if (data.avatar) {
    // Avatar size
    const avatarSize = data.avatar.size ? data.avatar.size : 'm';
    // Text or number
    if (data.avatar.type === 'text' || data.avatar.type === 'number') {
      avatar = (<TotoListAvatar text={data.avatar.value} size={avatarSize} />)
    }
    // Image
    else if (data.avatar.type === 'image') {
      avatar = (<TotoListAvatar image={data.avatar.value as string} size={avatarSize} onPress={onItemAvatarClick} selected={data.avatar.selected} />)
    }
    // Select
    else if (data.avatar.type === 'select') {
      avatar = (<TotoListAvatar text='' selected={(props.item as { selected?: boolean }).selected} size={avatarSize} onPress={onItemAvatarClick} />)
    }
  }

  // Date in case any
  let date;
  if (data.date) {
    // In case of a yearMonth
    if (data.date.yearMonth) {
      date = (<div className='yearMonth'>{data.date.yearMonth}</div>)
    }
    // In case of date YYYYMMDD
    else if (data.date.date) {
      date = (
        <div className='dayMonth'>
          <div className='day'>{moment(data.date.date, 'YYYYMMDD').format('DD')}</div>
          <div className='month'>{moment(data.date.date, 'YYYYMMDD').format('MMM')}</div>
        </div>
      )
    }
  }

  // Main text of the item
  let title;
  if (data.title) {
    title = (<div className='item-title'>{data.title}</div>)
  }

  // Monthly Recurrence
  let monthly;
  if (data.monthly) {
    monthly = (<div className="item-recurrance">M</div>)
  }

  // Amount if any
  let amount;
  if (data.amount) {
    amount = (<div className='item-amount'>{data.amount}</div>)
  }

  // Highlights
  let highlights;
  if (data.highlights) {
    highlights = (
      <div className='highlights'>
        {data.highlights.map((highlight) => {
          return (
            <TouchableOpacity key={'TotoList-Highlight-' + Math.random()} onPress={() => { if (highlight.onPress) highlight.onPress(props.item) }}>
              <MaskedSvgIcon src={highlight.image} alt="action" size="w-5 h-5" color="bg-accent" />
            </TouchableOpacity>)
        })}
      </div>
    )
  }

  return (
    <div className={`item ${data.style ? data.style : ""}`} onClick={onPress}>
      {avatar}
      {date}
      {title}
      {monthly}
      {amount}
      {highlights}
    </div>
  )
}
