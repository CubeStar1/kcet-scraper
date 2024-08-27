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
          Note: The data for mock round 2 is still being scraped, only partial data has been uploaded.
        </CardContent>
      </Card>
      <Suspense fallback={<TableSkeleton />}>
        <PaginatedTable initialYear="2024" initialRound="m2" />
      </Suspense>
    </main>
  )
}