export const handleServerError = (res: any, err: unknown, context = "Something went wrong") => {
    console.error(`${context}:`, err);
    res.status(500).json({
        message: "Server error",
        error: err instanceof Error ? err.message : "Unknown error"
    });
};

export const notFound = (res: any, resource = "Resource") => {
    res.status(404).json({ message: `${resource} not found` });
};
