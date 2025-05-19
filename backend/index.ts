import app from "./app.ts";

const port = process.env.PORT ?? 5001;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});