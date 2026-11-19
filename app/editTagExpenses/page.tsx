'use client'

import { Suspense } from 'react';
import EditTagExpensesScreen from './EditTagExpensesScreen';

/**
 * Edit tag expenses page ("/editTagExpenses?tagId=.."). Suspense is needed because the screen reads the search params.
 */
export default function EditTagExpensesPage() {

  return (
    <Suspense fallback={<div className="screen"></div>}>
      <EditTagExpensesScreen />
    </Suspense>
  );
}
