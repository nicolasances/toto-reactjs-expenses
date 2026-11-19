'use client'

import { Suspense } from 'react';
import NewExpenseScreen from './NewExpenseScreen';

/**
 * New expense / income page ("/newExpense"). Suspense is needed because the screen reads the search params.
 */
export default function NewExpensePage() {

  return (
    <Suspense fallback={<div className="screen new-expense"></div>}>
      <NewExpenseScreen />
    </Suspense>
  );
}
