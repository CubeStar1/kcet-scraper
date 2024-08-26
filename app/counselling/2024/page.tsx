// // app/page.tsx
import PaginatedTable from '@/components/PaginatedTable'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Info } from 'lucide-react'

async function getInitialData(page: number, pageSize: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/data/2024?page=${page}&pageSize=${pageSize}`)
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export default async function Home({ searchParams }: { searchParams: { page: string } }) {
  const page = Number(searchParams.page) || 1
  const pageSize = 20

  const { data, count } = await getInitialData(page, pageSize)

  return (
    <main className="container mx-auto p-4 max-h-screen">
      <h1 className="text-2xl font-bold mb-4" >
        Candidate Data: 2024
      </h1>
      <Card>
          <CardContent className='flex items-center mt-4'>
            <Info className="w-4 h-4 mr-2" />
            Note: The data for mock round 2 is still being scraped, this is the data for mock round 1
          </CardContent>
      </Card>

      <PaginatedTable initialData={data} initialTotalCount={count} year="2024" />
    </main>
  )
}