import { getInputLines } from "@utils";

const lines = await getInputLines(2024, 1);

const group1: number[] = [];
const group2: number[] = [];

function pushSort(array: number[], value: number) {
    let left = 0;
    let right = array.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (array[mid] === value) {
            array.splice(mid, 0, value);
            return;
        } else if (array[mid] < value) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    array.splice(left, 0, value);
}

for (const line of lines) {
    const [group1Id, group2Id] = line.split("   ").map(Number);

    pushSort(group1, group1Id);
    pushSort(group2, group2Id);
}

export const getSum = () => {
    let sum = 0;

    for (let i = 0; i < group1.length; i++) {
        const group1Id = group1[i];
        const group2Id = group2[i];

        sum += Math.abs(group1Id - group2Id);
    }

    return sum;
};

export const getSimilarity = () => {
    const frequencyMap = new Map<number, number>();
    const frequencyCache = new Map<number, number>();

    for (const number of group2) {
        frequencyMap.set(number, (frequencyMap.get(number) || 0) + 1);
    }

    let sum = 0;

    for (const number of group1) {
        if (frequencyCache.has(number)) {
            sum += frequencyCache.get(number)!;
            continue;
        }
        // compute similarity
        const frequency = frequencyMap.get(number) || 0;
        const similarity = frequency * number;
        frequencyCache.set(number, similarity);
        sum += similarity;
    }
    return sum;
};
