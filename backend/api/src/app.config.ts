import type { AppConfig } from './interface/config';

const config: AppConfig = {
  throttler: {
    data: {
      ttl: parseInt(process.env.WWIZ_THROTTLER_DATA_TTL) || 60,
      max_apis: parseInt(process.env.WWIZ_THROTTLER_DATA_MAX_APIS) || 10,
    },
    public: {
      ttl: parseInt(process.env.WWIZ_THROTTLER_PUBLIC_TTL) || 60,
      max_apis: parseInt(process.env.WWIZ_THROTTLER_PUBLIC_MAX_APIS) || 10,
    },
    calc_execution_time:
      process.env.WWIZ_THROTTLER_CALC_EXECUTION_TIME === 'true',
  },
  basicAuth: {
    username: process.env.WWIZ_BASIC_AUTH_USERNAME || 'admin',
    password: process.env.WWIZ_BASIC_AUTH_PASSWORD || 'admin',
  },
  auth: {
    emailPattern: process.env.WWIZ_AUTH_EMAIL_PATTERN
      ? new RegExp(process.env.WWIZ_AUTH_EMAIL_PATTERN)
      : null,
    disableEmailAuth: process.env.WWIZ_AUTH_DISABLE_EMAIL_AUTH === 'true',
  },
  mainSubDomain: process.env.WWIZ_MAIN_SUB_DOMAIN || 'api',
  dashboardPath: process.env.WWIZ_DASHBOARD_PATH || '/dashboard',
};

export default config;
