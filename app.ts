import express, {
  Request,
  Response,
  NextFunction,
  Application,
  RequestHandler,
} from 'express';

import { MONGO_DB_URL } from './api-keys';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import HttpError from './models/http-error';
import userRouter from './routes/users-routes';
import markerRouter from './routes/markers-routes';
import photoRouter from './routes/photos-routes';

const app: Application = express();

app.use(bodyParser.json());

app.use<RequestHandler>((req, res, next): void => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use('/users', userRouter);
app.use('/markers', markerRouter);
app.use('/photos', photoRouter);

app.use<RequestHandler>((req, res, next): void => {
  const error = new HttpError('Could not find this route', 404);
  throw error;
});

app.use(
  (error: HttpError, req: Request, res: Response, next: NextFunction): void => {
    if (res.headersSent) {
      return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occured' });
  }
);

mongoose
  .connect(MONGO_DB_URL)
  .then(() => {
    app.listen(5000);
    console.log('connected to db');
  })
  .catch((err) => {
    console.log(err);
  });
