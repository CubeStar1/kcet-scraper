import PaginatedTable from '@/components/PaginatedTable'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Info } from 'lucide-react'
import { Suspense } from 'react'
import TableSkeleton from '@/components/TableSkeleton'

export default function Home() {
  return (
    <main className="container mx-auto p-4 max-h-screen">
      <h1 className="text-2xl font-bold mb-4" >
        Candidate Data: 2024
      </h1>
      <Card>
        <CardContent className='flex items-center mt-4'>
          <Info className="w-4 h-4 mr-2" />
          Note: Data for Round 3 has been fully scraped and uploaded.
        </CardContent>
      </Card>
      <Suspense fallback={<TableSkeleton />}>
        <PaginatedTable initialYear="2024" initialRound="r3" />
      </Suspense>
    </main>
  )
}