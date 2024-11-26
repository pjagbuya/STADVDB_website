import app from './app.mjs';

const PORT = process.env.PORT || 3000;

// Add error handling to app.listen
const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Catch errors like EADDRINUSE
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please free the port or use a different one.`);
    } else {
        console.error('An unexpected error occurred:', err);
    }
});
