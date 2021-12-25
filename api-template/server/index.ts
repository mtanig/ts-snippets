import { AppFactory } from './AppFactory';

const SERVER_PORT = process.env.PORT || 80;

(async ()=>{
    const appFactory = new AppFactory();
    const app = await appFactory.create();
    await new Promise((resolve: any)=>{
        const server = app.listen(SERVER_PORT, resolve);
        server.keepAliveTimeout = 0;
    });
    console.log('express app is started.');
})();
