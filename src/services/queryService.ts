import Query from '../models/Query'
import { QueryRepository } from '../types/query.interface'

class QueryService implements QueryRepository.IQueryService {
  private _findQueryByStatus(
    status: QueryRepository.QUERY_STATUS
  ): Promise<QueryRepository.IQueryDataDocument[]> {
    return Query.find({ status })
  }

  public createQuery(
    queryData: QueryRepository.ICreateQueryRequestBody
  ): Promise<QueryRepository.IQueryDataDocument> {
    const newQuery = new Query(queryData)
    return newQuery.save()
  }

  public async getQueries(): Promise<
    QueryRepository.IQueryDataDocument | QueryRepository.IQueryDataDocument[]
  > {
    const queries = await this._findQueryByStatus(
      QueryRepository.QUERY_STATUS.PENDING
    )
    return queries
  }
}

export const queryService = new QueryService()
