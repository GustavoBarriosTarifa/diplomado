import express from 'express';

const app = express();

//import routers
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/users.routes.js';
import tasksRouter from './routes/task.router.js';
import morgan from 'morgan';
import errorHandler from './middlewares/errorHandler.js';
import notFound from './middlewares/notFound.js'
import { authenticateToken } from './middlewares/authenticate.js';

//Middlwares
app.use(morgan('dev'))
app.use(express.json());
//Routes
app.use('/api/login',authRouter);
app.use('/api/users',userRouter);
app.use('/api/tasks',authenticateToken, tasksRouter);

app.use(notFound);
app.use(errorHandler);

export default app;