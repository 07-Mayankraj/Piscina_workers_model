const fs = require('fs');
const fastcsv = require('fast-csv');
const { getDataById } = require('../db/db');

const { parentPort } = require('worker_threads');

async function processCSV(filePath) {
    if (filePath.includes('crash')) {
        // console.log('🚨 Simulating worker crash for:', filePath);
        parentPort.postMessage({ status: 'error', file: filePath, message: 'Worker crashed' });
        process.exit(1); // Force crash
    }

    if (!fs.existsSync(filePath)) {
        // console.error(`Error: File not found -> ${filePath}`);
        parentPort.postMessage({ status: 'error', file: filePath, message: 'File not found' });
        return [];
    }

    const results = [];
    const fetchPromises = []; 

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(fastcsv.parse({ headers: true }))
            .on('data', async (row) => {
                // parentPort.postMessage({ status: 'processing', file: filePath, rowId: row._id });

                fetchPromises.push(
                    getDataById(row._id)
                        .then((userData) => {
                            results.push(userData._source);
                        })
                        .catch((err) => {
                            // console.error(`⚠️ Error fetching ID ${row._id}`);
                            parentPort.postMessage({ status: 'error', file: filePath, rowId: row._id, message: 'Data fetch failed' });
                        })
                );
            })
            .on('end', async () => {
                await Promise.all(fetchPromises);
                parentPort.postMessage({ status: 'completed', file: filePath, totalRows: results.length });
                resolve(results);
            })
            .on('error', (err) => {
                parentPort.postMessage({ status: 'error', file: filePath, message: err.message });
                reject(err);
            });
    });
}

// Export worker function for Piscina
module.exports = processCSV;

// Export as a default worker function for Piscina
module.exports = processCSV;
