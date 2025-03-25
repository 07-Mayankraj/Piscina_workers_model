const os = require('os');

module.exports.POOL_CONFIG = {
    csv: {
        maxThreads: Math.max(2, os.cpus().length - 4), // Use available cores, leaving 2 for system
        idleTimeout: 60000, // 60 sec
    },
    log: {
        maxThreads: 1, // Logging needs fewer resources
        idleTimeout: 30000, // 30 sec
    },
};
