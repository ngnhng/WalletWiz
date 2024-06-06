import cors from 'cors';
import compression from 'compression';
import express from 'express';
import Wwiz from './Wwiz';

const server = express();
// trust first proxy
server.enable('trust proxy');
// if behind proxy, different servers may generate different etag values for the same content
server.disable('etag');
// remove x-powered-by header, for security reasons
server.disable('x-powered-by');
server.use(
  cors({
    exposedHeaders: 'xc-db-response',
  }),
);

server.use(compression());

//server.set('view engine', 'ejs');

async function bootstrap() {
  const httpServer = server.listen(process.env.PORT || 8080, async () => {
    server.use(await Wwiz.init({}, httpServer, server));
  });
}

bootstrap();
