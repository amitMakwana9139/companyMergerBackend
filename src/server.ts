import app from './app';
import dotenv from "dotenv";
import "../src/config/database";
import { errorHandler } from './middlewares/errorHandler';

dotenv.config()
const PORT = process.env.PORT || 3000;

// Error Handling Middleware (placed after all routes)
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
