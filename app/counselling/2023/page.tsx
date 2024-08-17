// app/page.tsx
import PaginatedTable from '@/components/PaginatedTable'

async function getInitialData(page: number, pageSize: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/data/2023?page=${page}&pageSize=${pageSize}`, { cache:  'no-store' })
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
        Candidate Data: 2023 
      </h1>
      <PaginatedTable initialData={data} initialTotalCount={count} year="2023" />
    </main>
  )
}