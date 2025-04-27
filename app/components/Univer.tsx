'use client'

import React, { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

// Move the actual component to a separate dynamically imported component
const UniverSheetComponent = dynamic(
  () => import('./UniverSheetComponent'),
  { ssr: false } // This prevents the component from being rendered on the server
)

const UniverSheet = function () {
  return <UniverSheetComponent />
};

export default UniverSheet;
