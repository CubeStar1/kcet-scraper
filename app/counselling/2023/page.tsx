import PaginatedTable from '@/components/PaginatedTable'
import { Suspense } from 'react'
export default function Home() {
  return (
    <main className="container mx-auto p-4 max-h-screen">
      <h1 className="text-2xl font-bold mb-4" >
        Candidate Data: 2023 
      </h1>
      <Suspense fallback={<div>Loading...</div>}>
        <PaginatedTable year="2023" />
      </Suspense>
    </main>
  )
}