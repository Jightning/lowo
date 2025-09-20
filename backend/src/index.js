const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;

// Initialize the Next.js app
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
    const server = express();

    // Middleware to parse JSON bodies
    server.use(express.json());

    // =================================================================
    //  API ROUTES (Your Express backend logic)
    // =================================================================

    // Example API endpoint
    server.get('/api/data', (req, res) => {
        res.json({
            message: 'Data successfully fetched from Express!',
            timestamp: new Date().toISOString(),
            data: [
                { id: 1, name: 'First Item' },
                { id: 2, name: 'Second Item' },
                { id: 3, name: 'Third Item' },
            ]
        });
    });

    // =================================================================
    //  NEXT.JS PAGE HANDLING (Handles all other routes)
    // =================================================================
    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
}).catch(err => {
    console.error('Error starting server:', err);
    process.exit(1);
});

