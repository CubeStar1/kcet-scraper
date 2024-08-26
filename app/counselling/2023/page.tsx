import PaginatedTable from '@/components/PaginatedTable'

export default function Home() {
  return (
    <main className="container mx-auto p-4 max-h-screen">
      <h1 className="text-2xl font-bold mb-4" >
        Candidate Data: 2023 
      </h1>
      <PaginatedTable year="2023" />
    </main>
  )
}