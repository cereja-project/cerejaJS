const range = function (start, stop, step) {
    return Array.from({length: (stop - start) / step}, (_, i) =>
        start + (i * step)
    )
};

const chunk = function (data, batchSize, fillWith = null, isRandom = false,
                        maxBatches = null) {
    if (batchSize === null && maxBatches === null) {
        return [data]
    }
    if (!batchSize || batchSize > data.length || batchSize < 1) {
        if (typeof maxBatches === "number" && maxBatches > 0) {
            batchSize = ((data.length / maxBatches) + data.length % maxBatches) || data.length
        } else {
            batchSize = data.length
        }

    }

    // if isRandom need implement

    if (maxBatches === null) {
        maxBatches = data.length % batchSize === 0 ? data.length / batchSize : data.length / batchSize + 1
    }

    const batches = []

    for (let i of range(0, data.length, batchSize)) {
        let result = data.slice(i, i + batchSize)
        if (fillWith !== null && result.length < batchSize) {
            result = [...result, Array(batchSize - result.length).fill(fillWith)]
        }
        batches.push(result)
        maxBatches -= 1
        if (maxBatches === 0) {
            break
        }
    }
    return batches


}

exports.range = range;
exports.chunk = chunk;