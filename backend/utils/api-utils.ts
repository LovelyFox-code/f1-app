import axios from "axios";

interface PaginatedFetchOptions {
    baseUrl: string;
    season: string;
    endpoint: string;
    limitPerPage?: number;
    delayMs?: number;
}

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const fetchWithRetry = async (url: string, retries = 6, delayMs = 1000): Promise<any> => {
    for (let i = 0; i < retries; i++) {
        try {
            return await axios.get(url);
        } catch (err: any) {
            if (err.response?.status === 429) {
                const waitTime = delayMs + Math.random() * 1000;
                console.warn(`429 Too Many Requests – retrying in ${Math.round(waitTime)} ms...`);
                await delay(waitTime);
                delayMs *= 2;
            } else {
                throw err;
            }
        }
    }
    throw new Error(`Max retries reached for: ${url}`);
};

export const runWithDelay = async <T>(
    tasks: (() => Promise<T>)[],
    delayMs: number
): Promise<PromiseSettledResult<T>[]> => {
    const results: PromiseSettledResult<T>[] = [];

    for (const task of tasks) {
        const result = await task().then(
            (value) => ({ status: "fulfilled", value }),
            (reason) => ({ status: "rejected", reason })
        );
        results.push(result as PromiseSettledResult<T>);
        await delay(delayMs);
    }

    return results;
};

export const fetchPaginatedResults = async <T>({
    baseUrl,
    season,
    endpoint,
    limitPerPage = 100,
}: PaginatedFetchOptions): Promise<T[]> => {
    let offset = 0;
    let total = 0;
    let result: T[] = [];

    do {
        const url = `${baseUrl}/${season}/${endpoint}.json?limit=${limitPerPage}&offset=${offset}`;

        const response = await fetchWithRetry(url);
        const data = response.data;

        const fetched = data.MRData.RaceTable.Races as T[];
        total = parseInt(data.MRData.total, 10);

        result.push(...fetched); // Merge fetched results into the main results array

        offset += limitPerPage;
    } while (offset < total);
    return result; // Assuming the endpoint returns
};