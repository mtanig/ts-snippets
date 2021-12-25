import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import glob from 'glob';
import {clientErrorHandler} from './middlewares/errorResponseHandler';

export class AppFactory {
    async create() {
        const app = express();

        const extendedApacheLogFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms'
        app.use(morgan(extendedApacheLogFormat));
        app.use(bodyParser.json({ limit: '10mb' }));

        glob.sync(`${__dirname}/routes/**/*.+(ts|js)`).forEach((route: any)=>{
            app.use('/', require(route).default);
        });

        app.use(clientErrorHandler);

        return app;
    }
}

export default AppFactory;
