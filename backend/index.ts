import app from './app.ts';

const PORT = process.env.PORT ?? 5001;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});