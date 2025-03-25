# Piscina_workers_model

# Parallel CSV Processing with Piscina

## Overview
This project demonstrates parallel processing of multiple CSV files using the **Piscina** worker thread library in Node.js. It ensures efficient data processing and scalability by leveraging worker threads.

## Features
- Processes multiple CSV files in parallel.
- Uses worker threads to offload heavy operations.
- Fetches data from an Elasticsearch database based on `_id` from CSV rows.
- Ensures scalability by distributing workload among worker threads.

## Project Structure
- `db/db.js` - Handles Elasticsearch connection and data retrieval.
- `worker.js` - Worker function that processes CSV files.
- `index.js` - Main entry point, manages worker execution with Piscina.
- `data/` - Directory containing CSV files to be processed.

## Installation
1. Clone the repository.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Ensure Elasticsearch is running locally or update the connection details in `db.js`.

## Usage
Run the script to process CSV files in parallel:
```sh
node index.js
```

## How It Works
1. The main script (`index.js`) assigns each CSV file to a worker thread using Piscina.
2. Each worker (`worker.js`) reads the CSV file and fetches related data from Elasticsearch.
3. Processed results are returned to the main thread.
4. The main script aggregates and displays results.

## Error Handling
- Ensures files exist before processing.
- Handles Elasticsearch connection errors.
- Logs missing or invalid data during processing.

## Scalability
- Uses worker threads for efficient CPU utilization.
- Can be extended to process a large number of files asynchronously.

## Future Enhancements
- Add support for additional data sources.
- Implement error logging and retry mechanisms.
- Optimize performance using batch queries for Elasticsearch.

