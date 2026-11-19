'use client'

import { useSearchParams } from 'next/navigation';

import ExpensesPicker from '@/components/tag/TagExpensesPicker';

import './EditTagExpensesScreen.css';

/**
 * Screen to change which expenses are attached to a tag (the "tagId" query param).
 */
export default function EditTagExpensesScreen() {

    const searchParams = useSearchParams();

    const tagId = searchParams.get('tagId');

    if (!tagId) return <div className="screen"></div>

    return (
        <ExpensesPicker tagId={tagId} noDelete={true} />
    )
}
