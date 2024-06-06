import { Injectable } from '@nestjs/common';
import knex from 'knex';
import { WwizConfig } from '../interface/config';

@Injectable()
export class RepositoryService {
  private _knex: knex.Knex;
  private _config: WwizConfig;

  constructor(config: WwizConfig) {
    this._config = config;
    this._knex = knex({
      ...this._config.db,
    });
  }

  /***
   * Get single record from table
   * @param target - Table name
   * @param idOrCondition - If string, will get the record with the given id. If object, will get the record with the given condition.
   * @param fields - Fields to be selected
   */
  public async get(
    target: string,
    idOrCondition: string | { [p: string]: any },
    fields?: string[],
    // xcCondition?
  ): Promise<any> {
    const query = this.connection(target);

    if (fields?.length) {
      query.select(...fields);
    }

    if (!idOrCondition) {
      return query.first();
    }

    if (typeof idOrCondition !== 'object') {
      query.where('id', idOrCondition);
    } else {
      query.where(idOrCondition);
    }

    return query.first();
  }

  public get connection() {
    return this._knex;
  }
}
