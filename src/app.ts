import express from "express";
import bodyParser from 'body-parser';
import routes from "../src/routes/index"
import cors from 'cors';

const app = express();

// Cors 
app.use(cors());

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', routes);

// Export the app for use in server.ts or tests
export default app;