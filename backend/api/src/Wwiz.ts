import path from 'path';
import { NestFactory } from '@nestjs/core';
import clear from 'clear';
import * as express from 'express';
import requestIp from 'request-ip';
import cookieParser from 'cookie-parser';
import { ValidationPipe, type INestApplication } from '@nestjs/common';
import type { Express } from 'express';
import type http from 'http';
import { AppModule } from '~/app.module';
import { WwizConfig } from './interface/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

import dotenv from 'dotenv';
dotenv.config();

export default class Wwiz {
  protected static _this: Wwiz;
  public static readonly env: string = '_wwiz';
  protected static _httpServer: http.Server;
  protected static _server: Express;

  public static get dashboardUrl(): string {
    const siteUrl = `http://localhost:${process.env.PORT || 8080}`;

    return `${siteUrl}${this._this?.config?.dashboardPath}`;
  }

  public static config: WwizConfig;
  public readonly router: express.Router;
  public readonly baseRouter: express.Router;
  public env: string;

  protected config: any;
  protected requestContext: any;

  constructor() {
    process.env.PORT = process.env.PORT || '8080';

    this.router = express.Router();
    this.baseRouter = express.Router();

    clear();
  }

  public getConfig(): any {
    return this.config;
  }

  public getToolDir(): string {
    return this.getConfig()?.toolDir;
  }

  public addToContext(context: any) {
    this.requestContext = context;
  }

  public static getConfig(): WwizConfig {
    return this.config;
  }

  static async init(param: any, httpServer: http.Server, server: Express) {
    const nestApp = await NestFactory.create(AppModule, {
      bufferLogs: true,
    });
    this.initCustomLogger(nestApp);

    nestApp.flushLogs();

    this._httpServer = nestApp.getHttpAdapter().getInstance();
    this._server = server;

    nestApp.use(requestIp.mw());
    //nestApp.use(cookieParser());

    nestApp.use(
      express.json({ limit: process.env.WWIZ_REQUEST_BODY_SIZE || '50mb' }),
    );

    nestApp.useGlobalPipes(new ValidationPipe({ transform: true }));

    //nestApp.setGlobalPrefix(process.env.WWIZ_API_PREFIX || '/api');

    const apiDoc = SwaggerModule.createDocument(
      nestApp,
      new DocumentBuilder()
        .setTitle('Wwiz API')
        .setDescription('API Documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .build(),
    );

    SwaggerModule.setup('api', nestApp, apiDoc);

    nestApp.use(
      '/docs',
      apiReference({
        spec: {
          content: apiDoc,
        },
      }),
    );

    await nestApp.init();

    //const dashboardPath = process.env.WWIZ_DASHBOARD_URL ?? '/dashboard';
    //server.use(express.static(path.join(__dirname, 'public')));

    //if (dashboardPath !== '/' && dashboardPath !== '') {
    //  server.get('/', (_req, res) => res.redirect(dashboardPath));
    //}

    return nestApp.getHttpAdapter().getInstance();
  }

  public static get httpServer(): http.Server {
    return this._httpServer;
  }

  public static get server(): Express {
    return this._server;
  }

  public static async initJwt(): Promise<any> {
    //let secret = (we can get secret from vault or other secret manager)
    // for demo, we will use the env
    if (!process.env.WWIZ_JWT_SECRET) console.warn('WWIZ_JWT_SECRET not set');
    if (!this.config) {
      this.config = { auth: {} };
    } else if (!this.config.auth) {
      this.config.auth = {};
    }
    this.config.auth.jwt = this.config.auth.jwt || {
      secret: process.env.WWIZ_JWT_SECRET,
    };
    this.config.auth.jwt.secret = process.env.WWIZ_JWT_SECRET;
    this.config.auth.jwt.options = this.config.auth.jwt.options || {};
    if (!this.config.auth.jwt.options?.expiresIn) {
      this.config.auth.jwt.options.expiresIn =
        process.env.WWIZ_JWT_EXPIRES_IN ?? '10h';
    }
  }

  protected static initCustomLogger(_nestApp: INestApplication<any>) {
    // setup custom logger for nestjs if needed
  }
}
