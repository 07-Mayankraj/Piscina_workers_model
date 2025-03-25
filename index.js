const Piscina = require('piscina');
const path = require('path');
const os = require('os');
const { POOL_CONFIG } = require('./config');

function createWorkerPool(taskType) {
    if (!POOL_CONFIG[taskType]) {
        throw new Error(`⚠️ Task type "${taskType}" is not configured.`);
    }

    const { maxThreads = os.cpus().length, idleTimeout = 1000 } = POOL_CONFIG[taskType];

    const pool = new Piscina({
        filename: path.resolve(__dirname, `workers/${taskType}Worker.js`),
        maxThreads,
        idleTimeout,
    });
    // Listen for worker messages
    pool.on('message', (msg) => {
        console.log('📩 Message from Worker:', msg);
    });

    return pool;
}

async function processFiles(taskType, files) {

    const pool = createWorkerPool(taskType);
    console.log(`🚀 Starting ${taskType} processing with ${files.length} files...`);
    try {

        const results = await Promise.allSettled(
            files.map(async (file) => {
                try {
                    return await pool.run(file);
                } catch (err) {
                    throw new Error(`Worker crashed for ${file}`); // Properly rejecting
                }
            })
        );

        pool.on('message', (msg) => console.log('📩 Worker Update:', msg));

        console.log('✅ Processing Complete:', results.map((result) => result.status));
    } catch (error) {
        console.error('❌ Error in processing:', error);
    } finally {
        await pool.destroy();
    }
}



// const files = ['./data/1st.csv', './data/2nd.csv'];
const files = ['./data/1st.csv', './data/2nd.csv', './data/crash.csv'];
const logData = [{ data: 'Hello' }, { data: 'World' }]

processFiles('csv', files)
// processFiles('log', logData)

