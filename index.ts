import express from 'express';
import dbConnection from './services/Database';
import ExpressApp from './services/ExpressApp';
import { PORT } from './configs';


const startServer = async () => {

    const app = express();

    await dbConnection();

    await ExpressApp(app)

    app.listen(PORT, () => {
        console.clear();
        console.log(`Server is running on port ${PORT}`);
    }
    );
}

startServer();
