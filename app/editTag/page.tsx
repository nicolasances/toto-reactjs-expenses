'use client'

import { Suspense } from 'react';
import EditTagScreen from './EditTagScreen';

/**
 * Edit tag page ("/editTag?tagId=..&currency=.."). Suspense is needed because the screen reads the search params.
 */
export default function EditTagPage() {

  return (
    <Suspense fallback={<div className="screen edit-tag-screen"></div>}>
      <EditTagScreen />
    </Suspense>
  );
}
