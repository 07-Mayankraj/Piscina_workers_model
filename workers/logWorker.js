async function logData(data ) {
    // console.log('📝 Logging data:', data);
    return `Logged: ${JSON.stringify(data)  }`;
}

module.exports = logData;
