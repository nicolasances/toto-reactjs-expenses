'use client'

import { Suspense } from 'react';
import ExpenseDetailScreen from './ExpenseDetailScreen';

/**
 * Expense / income detail page ("/expenses/[id]", plus "?income=true" for incomes). Suspense is needed because the screen reads the search params.
 */
export default function ExpenseDetailPage() {

  return (
    <Suspense fallback={<div className="screen expense-detail-screen"></div>}>
      <ExpenseDetailScreen />
    </Suspense>
  );
}
