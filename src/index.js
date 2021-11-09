const range = function (start, stop, step = 1) {
    if (start > 0) {
        stop = start
        start = 0
    }
    return Array.from({length: (stop - start) / step}, (_, i) =>
        start + (i * step)
    )
};

const shuffle = function (array) {
    let currentIndex = array.length, randomIndex;


    while (currentIndex !== 0) {


        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;


        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

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
    if (isRandom) {
        shuffle(data)
    }

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

const sample = function (values, k = null, isRandom = false) {
    return chunk(values, k, null, isRandom, 1)[0]
}

exports.range = range;
exports.chunk = chunk;
exports.shuffle = shuffle;
exports.sample = sample;