import { ERROR_MESSAGE, HTTP_STATUS_CODE } from '../../shared'
import { QueryRepository } from './query.interface'
import { queryService } from './query.service'

class QueryController implements QueryRepository.IQueryController {
  private queryService: QueryRepository.IQueryService

  constructor(queryService: QueryRepository.IQueryService) {
    this.queryService = queryService
  }

  public createdQuery = async (
    req: QueryRepository.IQueryRequest,
    res: QueryRepository.IQueryResponse
  ): Promise<void> => {
    try {
      const { name, email, queryType, mobileNumber } = req.body
      const createdQuery = await this.queryService.createQuery({
        name,
        email,
        queryType,
        mobileNumber
      })
      res.status(HTTP_STATUS_CODE.CREATED).json({
        message: QueryRepository.QUERY_MESSAGE.QUERY_CREATED,
        status: HTTP_STATUS_CODE.CREATED,
        query: createdQuery
      })
    } catch (error) {
      res.status(HTTP_STATUS_CODE.OK).json({
        message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
        status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
      })
    }
  }

  public queriesGetController = async (
    req: QueryRepository.IQueryRequest,
    res: QueryRepository.IQueryResponse
  ): Promise<QueryRepository.IQueryResponse | void> => {
    try {
      const queries = await this.queryService.getQueries()

      return res.status(HTTP_STATUS_CODE.OK).json({
        message: QueryRepository.QUERY_MESSAGE.QUERIES_FETCHED,
        status: HTTP_STATUS_CODE.OK,
        query: queries
      })
    } catch (error) {
      res.status(HTTP_STATUS_CODE.OK).json({
        message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
        status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
      })
    }
  }
}

export const queryController = new QueryController(queryService)
