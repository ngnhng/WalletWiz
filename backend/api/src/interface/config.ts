import type { Knex } from 'knex';

export interface AppConfig {
  throttler: {
    data?: {
      ttl: number;
      max_apis: number;
    };
    meta?: {
      ttl: number;
      max_apis: number;
    };
    public?: {
      ttl: number;
      max_apis: number;
    };
    calc_execution_time: boolean;
  };
  basicAuth: {
    username: string;
    password: string;
  };
  auth: {
    emailPattern?: RegExp | null;
    disableEmailAuth: boolean;
  };
  mainSubDomain: string;
  dashboardPath: string;
}

type InflectionTypes =
  | 'pluralize'
  | 'singularize'
  | 'inflect'
  | 'camelize'
  | 'underscore'
  | 'humanize'
  | 'capitalize'
  | 'dasherize'
  | 'titleize'
  | 'demodulize'
  | 'tableize'
  | 'classify'
  | 'foreign_key'
  | 'ordinalize'
  | 'transform'
  | 'none';

export interface DbConfig extends Knex.Config {
  client: string;

  connection: Knex.StaticConnectionConfig | Knex.Config | any;

  meta: {
    dbAlias: string;

    metaTables?: 'db' | 'file';
    tn?: string;
    models?: {
      disabled: boolean;
    };

    routes?: {
      disabled: boolean;
    };

    hooks?: {
      disabled: boolean;
    };

    migrations?: {
      disabled: boolean;
      name: 'wwiz_evolutions';
    };

    api: {
      type: 'rest' | 'graphql' | 'grpc';
      prefix: string;
      swagger?: boolean;
      graphiql?: boolean;
      graphqlDepthLimit?: number;
    };

    allSchemas?: boolean;

    ignoreTables?: string[];
    readonly?: boolean;

    query?: {
      print?: boolean;
      explain?: boolean;
      measure?: boolean;
    };
    reset?: boolean;
    dbtype?: 'vitess' | string;
    pluralize?: boolean;
    inflection?: {
      tn?: InflectionTypes;
      cn?: InflectionTypes;
    };
  };
}

export interface WwizConfig {
  title?: string;
  version?: string;

  db?: DbConfig;

  auth?: AuthConfig;
  middleware?: MiddlewareConfig[];
  //  acl?: ACLConfig;
  cluster?: number;

  //  mailer?: MailerConfig;
  make?: () => WwizConfig;
  //  serverless?: ServerlessConfig;

  env?: 'production' | 'dev' | 'test' | string;

  seedsFolder?: string | string[];
  queriesFolder?: string | string[];
  apisFolder?: string | string[];
  baseType?: 'rest' | 'graphql' | 'grpc';
  type?: 'mvc' | 'package' | 'docker';
  language?: 'ts' | 'js';
}

export interface AuthConfig {
  jwt?: {
    secret: string;
    [key: string]: any;
    dbAlias?: string;
    options?: JwtOptions;
  };
  masterKey?: {
    secret: string;
  };
  middleware?: {
    url: string;
  };
  disabled?: boolean;
}

// Refer : https://www.npmjs.com/package/jsonwebtoken
interface JwtOptions {
  algorithm?: string;
  expiresIn?: string | number;
  notBefore?: string | number;
  audience?: string;
  issuer?: string;
  jwtid?: any;
  subject?: string;
  noTimestamp?: any;
  header?: any;
  keyid?: any;
}

export interface MiddlewareConfig {
  handler?: (...args: any[]) => any;
}
