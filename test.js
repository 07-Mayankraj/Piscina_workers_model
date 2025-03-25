
function readCSV1(path) {
    const data = fs.readFileSync(path, 'utf-8')

    const parsedData = papaparse.parse(data, { header: true })
    console.log({ X: parsedData.data })

}

