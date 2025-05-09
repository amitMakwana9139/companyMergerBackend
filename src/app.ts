import express from "express";
import bodyParser from 'body-parser';
import routes from "../src/routes/index"

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', routes);

// Export the app for use in server.ts or tests
export default app;