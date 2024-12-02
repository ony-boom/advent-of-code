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
    if (line === "") continue;

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

};

console.log(getSimilarity());