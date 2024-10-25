# KCET-Scraper

This is a [Next.js](https://nextjs.org/) website for scraping and presenting KCET (Karnataka Common Entrance Test) counselling results.

![Screenshot](https://github.com/CubeStar1/kcet-scraper/blob/main/app/public/kcet-scraper-landing.jpg)

## Project Overview

KCET-Scraper is a tool that:

- Provides quick access to KCET counseling results from 2023 and 2024
- Supports searching by rank, CET number, or college code
- Features comprehensive data:
  - 2023: Approximately 60,000 candidates
  - 2024: Expanded to 72,000 candidates
- Offers a simple, user-friendly interface for fast lookups

## Features

- Data collection from KEA website using a Python-based web scraping script
- Efficient data storage and retrieval using Supabase
- Server-side rendering with Next.js for improved performance

## Tech Stack

- Data Collection: Python with Playwright
- Database: Supabase
- Frontend: Next.js
- Deployment: Vercel
- Language: TypeScript

## Getting Started

First, clone the repository and install the dependencies:

```bash
git clone https://github.com/CubeStar1/kcet-scraper.git
cd kcet-scraper
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
NEXT_PUBLIC_BASE_URL=http://localhost:3000
SUPABAE_ADMIN=<your-supabase-admin-key>

// For sending verification emails, you need to sign up for a resend accoun(https://resend.com) and get the API key and domain

RESEND_API_KEY=<your-resend-api-key>
RESEND_DOMAIN=<your-resend-domain>
```

Replace the placeholder values with your actual credentials.

### Web Scraping to get the data (optional)

1. Clone the [Web Scraping script](https://github.com/CubeStar1/RankPredictor.git)
2. Run the script using the command `python kcet_rank_extraction_v4.py` in the async directory
3. The data will be stored in a CSV file


### Supabase Setup

1. Create a Supabase project at Supabase [https://supabase.com]
2. Set up the necessary table for storing KCET data using the following SQL query in the SQL Editor:

```bash
CREATE TABLE kcet_2024_m1_table (
    id BIGSERIAL PRIMARY KEY,
    cet_no TEXT,
    candidate_nar TEXT,
    verified_categ TEXT,
    category_allot TEXT,
    stream TEXT,
    rank INTEGER,
    course_name TEXT,
    course_code TEXT,
    course_fee TEXT,
    serial_number INTEGER
);

```
3. Upload the CSV file of 2024 counselling results to the Supabase table using the Table Editor
4. Copy the Supabase URL and anon key to the `.env.local` file

### Running the Development Server

Run the development server:

```bash
npm run dev
```


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Resend Documentation](https://resend.com/docs)
- [Web Scraping script](https://github.com/CubeStar1/RankPredictor.git)
## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


