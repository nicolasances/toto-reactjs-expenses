'use client'

import { Suspense } from 'react';
import ExpensesScreen from './ExpensesScreen';

/**
 * Expenses list page ("/expenses"). Suspense is needed because the screen reads the search params.
 */
export default function ExpensesPage() {

  return (
    <Suspense fallback={<div className="screen"></div>}>
      <ExpensesScreen />
    </Suspense>
  );
}
