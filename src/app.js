import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import errorHandler from 'errorhandler';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import routes from './routes';
import { errorMiddleware } from './components/errors';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser());
app.use(cors());
app.use(morgan('dev', {
    skip(req, res) {
        return req.originalUrl === '/healthz' && res.statusCode === 200;
    }
}));

if (app.get('env') === 'development') {
    app.use(errorHandler());
}


app.use('/', routes);
app.use(errorMiddleware);

export default app;
