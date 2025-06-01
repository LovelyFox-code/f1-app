import axios from "axios";

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const fetchWithRetry = async (url: string, retries = 3, delayMs = 1000): Promise<any> => {
    for (let i = 0; i < retries; i++) {
        try {
            return await axios.get(url);
        } catch (err: any) {
            if (err.response?.status === 429) {
                console.warn(`429 Too Many Requests – retrying in ${delayMs}ms...`);
                await delay(delayMs + Math.random() * 300);
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