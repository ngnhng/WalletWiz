import { Logger } from '@nestjs/common';

export class WwizBaseError extends Error {
  error: WwizErrorType;
  code: number;
  details?: any;
  constructor(error: WwizErrorType, args?: WwizErrorArgs) {
    const { code, message } = generateError(error, args);
    super(message);
    this.error = error;
    this.code = code;
    this.details = args?.details;
  }
}

export class WwizError {
  static apiTokenNotAllowed(args?: WwizErrorArgs) {
    throw new WwizBaseError(WwizErrorType.API_TOKEN_NOT_ALLOWED, args);
  }

  static authenticationRequired(args?: WwizErrorArgs) {
    throw new WwizBaseError(WwizErrorType.AUTHENTICATION_REQUIRED, args);
  }

  static badJson(args?: WwizErrorArgs) {
    throw new WwizBaseError(WwizErrorType.BAD_JSON, args);
  }

  static internalServerError(args?: WwizErrorArgs) {
    throw new WwizBaseError(WwizErrorType.INTERNAL_SERVER_ERROR, args);
  }

  static badRequest(args?: WwizErrorArgs) {
    throw new WwizBaseError(WwizErrorType.BAD_REQUEST, args);
  }

  static forbidden(args?: WwizErrorArgs) {
    throw new WwizBaseError(WwizErrorType.FORBIDDEN, args);
  }

  static notFound(args?: WwizErrorArgs) {
    throw new WwizBaseError(WwizErrorType.NOT_FOUND, args);
  }

  static notImplemented(args?: WwizErrorArgs) {
    throw new WwizBaseError(WwizErrorType.NOT_IMPLEMENTED, args);
  }

  static unauthorized(args?: WwizErrorArgs) {
    throw new WwizBaseError(WwizErrorType.UNAUTHORIZED, args);
  }
}

type WwizErrorArgs = {
  params?: string | string[];
  customMessage?: string | ((...args: string[]) => string);
  details?: any;
};

export enum WwizErrorType {
  API_TOKEN_NOT_ALLOWED = 'API_TOKEN_NOT_ALLOWED',
  AUTHENTICATION_REQUIRED = 'AUTHENTICATION_REQUIRED',
  BAD_JSON = 'BAD_JSON',
  BAD_REQUEST = 'BAD_REQUEST',
  DATABASE_ERROR = 'DATABASE_ERROR',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  INVALID_OFFSET_VALUE = 'INVALID_OFFSET_VALUE',
  NOT_FOUND = 'NOT_FOUND',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
}

const errorHelpers: {
  [key in WwizErrorType]: {
    message: string | ((...params: string[]) => string);
    code: number;
  };
} = {
  [WwizErrorType.UNKNOWN_ERROR]: {
    message: 'Something went wrong',
    code: 500,
  },
  [WwizErrorType.INTERNAL_SERVER_ERROR]: {
    message: (message: string) => message || `Internal server error`,
    code: 500,
  },
  [WwizErrorType.DATABASE_ERROR]: {
    message: (message: string) =>
      message || `There was an error while running the query`,
    code: 500,
  },
  [WwizErrorType.AUTHENTICATION_REQUIRED]: {
    message: 'Authentication required to access this resource',
    code: 401,
  },
  [WwizErrorType.API_TOKEN_NOT_ALLOWED]: {
    message: 'This request is not allowed with API token',
    code: 401,
  },

  [WwizErrorType.USER_NOT_FOUND]: {
    message: (idOrEmail: string) => {
      const isEmail = idOrEmail.includes('@');
      return `User ${
        isEmail ? 'with email' : 'with id'
      } '${idOrEmail}' not found`;
    },
    code: 404,
  },
  [WwizErrorType.INVALID_OFFSET_VALUE]: {
    message: (offset: string) => `Offset value '${offset}' is invalid`,
    code: 422,
  },
  [WwizErrorType.NOT_IMPLEMENTED]: {
    message: (feature: string) => `${feature} is not implemented`,
    code: 501,
  },
  [WwizErrorType.BAD_JSON]: {
    message: 'Invalid JSON in request body',
    code: 400,
  },
  [WwizErrorType.BAD_REQUEST]: {
    message: (message: string) => message || 'Bad request',
    code: 400,
  },

  [WwizErrorType.NOT_FOUND]: {
    message: (message: string) => message || 'Not found',
    code: 404,
  },

  [WwizErrorType.FORBIDDEN]: {
    message: (message: string) => message || 'Forbidden',
    code: 403,
  },

  [WwizErrorType.UNAUTHORIZED]: {
    message: (message: string) => message || 'Unauthorized',
    code: 401,
  },
};

function generateError(
  type: WwizErrorType,
  args?: WwizErrorArgs,
): {
  message: string;
  code: number;
  details?: any;
} {
  const errorHelper = errorHelpers[type];
  const { params, customMessage, details } = args || {};

  if (!errorHelper) {
    return {
      message: 'An error occurred',
      code: 500,
      details: details,
    };
  }

  let message: string;
  const messageHelper = customMessage || errorHelper.message;

  if (typeof messageHelper === 'function') {
    message = messageHelper(...(Array.isArray(params) ? params : [params]));
  } else {
    message = messageHelper;
  }

  return {
    message,
    code: errorHelper.code,
    details: details,
  };
}

export enum DBError {
  TABLE_EXIST = 'TABLE_EXIST',
  TABLE_NOT_EXIST = 'TABLE_NOT_EXIST',
  COLUMN_EXIST = 'COLUMN_EXIST',
  COLUMN_NOT_EXIST = 'COLUMN_NOT_EXIST',
  CONSTRAINT_EXIST = 'CONSTRAINT_EXIST',
  CONSTRAINT_NOT_EXIST = 'CONSTRAINT_NOT_EXIST',
  COLUMN_NOT_NULL = 'COLUMN_NOT_NULL',
}

const missingDbErrorLogger = new Logger('MissingDBError');
const dbErrorLogger = new Logger('DBError');

// extract db errors using database error code
export function extractDBError(error): {
  message: string;
  error: string;
  details?: any;
} | void {
  if (!error.code) return;

  let message: string;
  let _extra: Record<string, any>;
  let _type: DBError;

  dbErrorLogger.error('code:', error.code);
  // todo: handle not null constraint error for all databases
  switch (error.code) {
    // sqlite errors
    case 'SQLITE_BUSY':
      message = 'The database is locked by another process or transaction.';
      break;
    case 'SQLITE_CONSTRAINT':
      {
        const constraint = /FOREIGN KEY|UNIQUE/.test(error.message)
          ? error.message.match(/FOREIGN KEY|UNIQUE/gi)?.join(' ')
          : 'constraint';
        message = `A ${constraint} constraint was violated: ${error.message}`;
        _extra = {
          constraint,
        };
      }
      break;
    case 'SQLITE_CORRUPT':
      message = 'The database file is corrupt.';
      break;
    case 'SQLITE_ERROR':
      message = 'A SQL error occurred.';

      if (error.message) {
        const noSuchTableMatch = error.message.match(/no such table: (\w+)/);
        const tableAlreadyExistsMatch = error.message.match(
          /SQLITE_ERROR: table `?(\w+)`? already exists/,
        );

        const duplicateColumnExistsMatch = error.message.match(
          /SQLITE_ERROR: duplicate column name: (\w+)/,
        );
        const unrecognizedTokenMatch = error.message.match(
          /SQLITE_ERROR: unrecognized token: "(\w+)"/,
        );
        const columnDoesNotExistMatch = error.message.match(
          /SQLITE_ERROR: no such column: (\w+)/,
        );
        const constraintFailedMatch = error.message.match(
          /SQLITE_ERROR: constraint failed: (\w+)/,
        );

        if (noSuchTableMatch && noSuchTableMatch[1]) {
          message = `The table '${noSuchTableMatch[1]}' does not exist.`;
          _type = DBError.TABLE_NOT_EXIST;
          _extra = {
            table: noSuchTableMatch[1],
          };
        } else if (tableAlreadyExistsMatch && tableAlreadyExistsMatch[1]) {
          message = `The table '${tableAlreadyExistsMatch[1]}' already exists.`;
          _type = DBError.TABLE_EXIST;
          _extra = {
            table: tableAlreadyExistsMatch[1],
          };
        } else if (unrecognizedTokenMatch && unrecognizedTokenMatch[1]) {
          message = `Unrecognized token: ${unrecognizedTokenMatch[1]}`;
          _extra = {
            token: unrecognizedTokenMatch[1],
          };
        } else if (columnDoesNotExistMatch && columnDoesNotExistMatch[1]) {
          message = `The column ${columnDoesNotExistMatch[1]} does not exist.`;
          _type = DBError.COLUMN_NOT_EXIST;
          _extra = {
            column: columnDoesNotExistMatch[1],
          };
        } else if (constraintFailedMatch && constraintFailedMatch[1]) {
          message = `A constraint failed: ${constraintFailedMatch[1]}`;
        } else if (
          duplicateColumnExistsMatch &&
          duplicateColumnExistsMatch[1]
        ) {
          message = `The column '${duplicateColumnExistsMatch[1]}' already exists.`;
          _type = DBError.COLUMN_EXIST;
          _extra = {
            column: duplicateColumnExistsMatch[1],
          };
        } else {
          const match = error.message.match(/SQLITE_ERROR:\s*(\w+)/);
          if (match && match[1]) {
            message = match[1];
          }
        }
      }
      break;
    case 'SQLITE_RANGE':
      message = 'A column index is out of range.';
      break;
    case 'SQLITE_SCHEMA':
      message = 'The database schema has changed.';
      break;

    // mysql errors
    case 'ER_TABLE_EXISTS_ERROR':
      message = 'The table already exists.';

      if (error.message) {
        const extractTableNameMatch = error.message.match(
          / Table '?(\w+)'? already exists/i,
        );
        if (extractTableNameMatch && extractTableNameMatch[1]) {
          message = `The table '${extractTableNameMatch[1]}' already exists.`;
          _type = DBError.TABLE_EXIST;
          _extra = {
            table: extractTableNameMatch[1],
          };
        }
      }
      break;
    case 'ER_DUP_FIELDNAME':
      message = 'The column already exists.';

      if (error.message) {
        const extractColumnNameMatch = error.message.match(
          / Duplicate column name '(\w+)'/i,
        );
        if (extractColumnNameMatch && extractColumnNameMatch[1]) {
          message = `The column '${extractColumnNameMatch[1]}' already exists.`;
          _type = DBError.COLUMN_EXIST;
          _extra = {
            column: extractColumnNameMatch[1],
          };
        }
      }

      break;
    case 'ER_NO_SUCH_TABLE':
      message = 'The table does not exist.';

      if (error.message) {
        const missingTableMatch = error.message.match(
          / Table '(?:\w+\.)?(\w+)' doesn't exist/i,
        );
        if (missingTableMatch && missingTableMatch[1]) {
          message = `The table '${missingTableMatch[1]}' does not exist`;
          _type = DBError.TABLE_NOT_EXIST;
          _extra = {
            table: missingTableMatch[1],
          };
        }
      }

      break;
    case 'ER_DUP_ENTRY':
      message = 'This record already exists.';
      break;
    case 'ER_PARSE_ERROR':
      message = 'There was a syntax error in your SQL query.';
      break;
    case 'ER_NO_DEFAULT_FOR_FIELD':
      message = 'A value is required for this field.';
      break;
    case 'ER_BAD_NULL_ERROR':
      message = 'A null value is not allowed for this field.';
      {
        const extractColNameMatch = error.message.match(
          /Column '(\w+)' cannot be null/i,
        );
        if (extractColNameMatch && extractColNameMatch[1]) {
          message = `The column '${extractColNameMatch[1]}' cannot be null.`;
          _type = DBError.COLUMN_NOT_NULL;
          _extra = {
            column: extractColNameMatch[1],
          };
        }
      }

      break;
    case 'ER_DATA_TOO_LONG':
      message = 'The data entered is too long for this field.';
      break;
    case 'ER_BAD_FIELD_ERROR':
      {
        message = 'The field you are trying to access does not exist.';
        const extractColNameMatch = error.message.match(
          / Unknown column '(\w+)' in 'field list'/i,
        );
        if (extractColNameMatch && extractColNameMatch[1]) {
          message = `The column '${extractColNameMatch[1]}' does not exist.`;
          _type = DBError.COLUMN_NOT_EXIST;
          _extra = {
            column: extractColNameMatch[1],
          };
        }
      }
      break;
    case 'ER_ACCESS_DENIED_ERROR':
      message = 'You do not have permission to perform this action.';
      break;
    case 'ER_LOCK_WAIT_TIMEOUT':
      message = 'A timeout occurred while waiting for a table lock.';
      break;
    case 'ER_NO_REFERENCED_ROW':
      message = 'The referenced record does not exist.';
      break;
    case 'ER_ROW_IS_REFERENCED':
      message = 'This record is being referenced by other records.';
      break;

    // postgres errors
    case '23505':
      message = 'This record already exists.';
      break;
    case '42601':
      message = 'There was a syntax error in your SQL query.';
      break;
    case '23502':
      message = 'A value is required for this field.';
      break;
    case '23503':
      message = 'The referenced record does not exist.';
      break;
    case '23514':
      message = 'A null value is not allowed for this field.';
      break;
    case '22001':
      message = 'The data entered is too long for this field.';
      break;
    case '28000':
      message = 'You do not have permission to perform this action.';
      break;
    case '40P01':
      message = 'A timeout occurred while waiting for a table lock.';
      break;
    case '23506':
      message = 'This record is being referenced by other records.';
      break;
    case '3D000':
      message = 'The database does not exist.';
      break;
    case '42P07':
      message = 'The table already exists.';
      if (error.message) {
        const extractTableNameMatch = error.message.match(
          / relation "?(\w+)"? already exists/i,
        );
        if (extractTableNameMatch && extractTableNameMatch[1]) {
          message = `The table '${extractTableNameMatch[1]}' already exists.`;
          _type = DBError.TABLE_EXIST;
          _extra = {
            table: extractTableNameMatch[1],
          };
        }
      }
      break;
    case '42701':
      message = 'The column already exists.';
      if (error.message) {
        const extractTableNameMatch = error.message.match(
          / column "(\w+)" of relation "(\w+)" already exists/i,
        );
        if (extractTableNameMatch && extractTableNameMatch[1]) {
          message = `The column '${extractTableNameMatch[1]}' already exists.`;
          _type = DBError.COLUMN_EXIST;
          _extra = {
            column: extractTableNameMatch[1],
          };
        }
      }
      break;
    case '42P01':
      message = 'The table does not exist.';
      if (error.message) {
        const extractTableNameMatch = error.message.match(
          / relation "(\w+)" does not exist/i,
        );
        if (extractTableNameMatch && extractTableNameMatch[1]) {
          message = `The table '${extractTableNameMatch[1]}' does not exist.`;
          _type = DBError.TABLE_NOT_EXIST;
          _extra = {
            table: extractTableNameMatch[1],
          };
        }
      }
      break;
    case '42703':
      message = 'The column does not exist.';
      if (error.message) {
        const extractTableNameMatch = error.message.match(
          / column "(\w+)" does not exist/i,
        );
        if (extractTableNameMatch && extractTableNameMatch[1]) {
          message = `The column '${extractTableNameMatch[1]}' does not exist.`;
          _type = DBError.COLUMN_NOT_EXIST;
          _extra = {
            column: extractTableNameMatch[1],
          };
        }
      }
      break;
    // mssql errors
    case 'EREQUEST':
      message = 'There was a syntax error in your SQL query.';
      if (error.message) {
        const extractTableNameMatch = error.message.match(
          / There is already an object named '(\w+)' in the database/i,
        );
        const extractDupColMatch = error.message.match(
          / Column name '(\w+)' in table '(\w+)' is specified more than once/i,
        );
        const extractMissingTableMatch = error.message.match(
          / Invalid object name '(\w+)'./i,
        );
        const extractMissingColMatch = error.message.match(
          / Invalid field: (\w+)./i,
        );

        if (extractTableNameMatch && extractTableNameMatch[1]) {
          message = `The table '${extractTableNameMatch[1]}' already exists.`;
          _type = DBError.TABLE_EXIST;
          _extra = {
            table: extractTableNameMatch[1],
          };
        } else if (extractDupColMatch && extractDupColMatch[1]) {
          message = `The column '${extractDupColMatch[1]}' already exists.`;
          _type = DBError.COLUMN_EXIST;
          _extra = {
            column: extractDupColMatch[1],
          };
        } else if (extractMissingTableMatch && extractMissingTableMatch[1]) {
          message = `The table '${extractMissingTableMatch[1]}' does not exist`;
          _type = DBError.TABLE_NOT_EXIST;
          _extra = {
            table: extractMissingTableMatch[1],
          };
        } else if (extractMissingColMatch && extractMissingColMatch[1]) {
          message = `The column '${extractMissingColMatch[1]}' does not exist`;
          _type = DBError.COLUMN_NOT_EXIST;
          _extra = {
            column: extractMissingColMatch[1],
          };
        }
      }
      break;
    case 'ELOGIN':
      message = 'You do not have permission to perform this action.';
      break;
    case 'ETIMEOUT':
      message = 'A timeout occurred while waiting for a table lock.';
      break;
    case 'ECONNRESET':
      message = 'The connection was reset.';
      break;
    case 'ECONNREFUSED':
      message = 'The connection was refused.';
      break;
    case 'EHOSTUNREACH':
      message = 'The host is unreachable.';
      break;
    case 'EHOSTDOWN':
      message = 'The host is down.';
      break;
    default:
      // log error for unknown error code
      dbErrorLogger.error(error);

      // if error message contains -- then extract message after --
      if (error.message && error.message.includes('--')) {
        message = error.message.split('--')[1];
      }
      break;
  }

  if (message) {
    return {
      error: WwizErrorType.DATABASE_ERROR,
      message,
    };
  }
}
