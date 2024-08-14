import React from 'react'

const AboutPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">KCET Data Scraping Project</h1>
      
      <div className="space-y-4 text-lg">
        <p>
          In 2023, I started a data collection project focused on the KCET mock counselling results. 
          The project was to gather data from the KEA website, which used a 
          5-character roll number system for result access.
        </p>

        <p>
          Using Python, I made a web scraping script that successfully collected data for 
          approximately 60,000 candidates.
        </p>

        <p>
          In 2024, the project has been expanded and refined. The current iteration includes 
          improvements in data collection methodology and a better data presentation system.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Tech Stack</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Data Collection: Python-based web scraping script using Playwright</li>
          <li>Database: Supabase for efficient data storage and retrieval</li>
          <li>Frontend: Next.js for server-side rendering and Vercel for deployment</li>
          <li>Language: TypeScript for type safety</li>
        </ul>

      </div>
    </div>
  )
}

export default AboutPage