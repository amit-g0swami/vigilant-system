import Query from '../models/Query'
import { QueryRepository } from '../types/query.interface'

class QueryService implements QueryRepository.IQueryService {
  public createQuery(
    queryData: QueryRepository.ICreateQueryRequestBody
  ): Promise<QueryRepository.IQueryDataDocument> {
    const newQuery = new Query(queryData)
    return newQuery.save()
  }

  public async getQueries(): Promise<
    QueryRepository.IQueryDataDocument | QueryRepository.IQueryDataDocument[]
  > {
    const queries = await Query.find({
      status: QueryRepository.QUERY_STATUS.PENDING
    })
    return queries
  }
}

export const queryService = new QueryService()
