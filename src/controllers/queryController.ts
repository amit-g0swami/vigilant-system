import { Request, Response } from 'express'
import { queryService } from '../services/queryService'
import { QueryRepository } from '../types/query.interface'
import { ERROR_MESSAGE, HTTP_STATUS_CODE } from '../types/shared.interface'

class QueryController implements QueryRepository.IQueryController {
  private queryService: QueryRepository.IQueryService

  constructor(queryService: QueryRepository.IQueryService) {
    this.queryService = queryService
  }

  public createdQuery = async (
    req: Request,
    res: Response<QueryRepository.IQueryResponse>
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
    req: Request,
    res: Response<QueryRepository.IQueryResponse>
  ): Promise<Response<QueryRepository.IQueryResponse> | void> => {
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
