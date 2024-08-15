import { ObjectSchema } from 'joi'
import { Document } from 'mongoose'
import { NextFunction, Request, Response, Router } from 'express'
import { ERROR_MESSAGE, HTTP_STATUS_CODE } from '../../shared'

export namespace QueryRepository {
  type IBaseQueryMessage = string
  type IQueryMeaasge = QUERY_MESSAGE | ERROR_MESSAGE | IBaseQueryMessage
  type IEmptyObject = {}
  type IGenericControllerType<T, U, W = void, V = void> = (
    req: T,
    res: U,
    next?: V
  ) => Promise<W>

  export type IQueryBaseRouter = Router

  export enum QUERY_MESSAGE {
    QUERY_CREATED = 'Query created successfully',
    QUERIES_FETCHED = 'Queries fetched successfully'
  }

  export enum QUERY_STATUS {
    PENDING = 'pending',
    RESOLVED = 'resolved'
  }

  export interface ICreateQueryRequestBody {
    name: string
    email: string
    queryType: string
    mobileNumber: number
  }

  export interface IQueryData {
    uid: string
    name: string
    email: string
    queryType: string
    mobileNumber: number
    status: QUERY_STATUS
    createdAt: Date
  }

  export interface IQueryDataDocument extends IQueryData, Document {}

  export interface IQueryResponse
    extends Response<{
      message: IQueryMeaasge
      status: HTTP_STATUS_CODE
      query?: IQueryDataDocument | IQueryDataDocument[]
    }> {}

  export interface IQueryRequest
    extends Request<IEmptyObject, IEmptyObject, IQueryData> {}

  export interface IQueryService {
    createQuery(queryData: ICreateQueryRequestBody): Promise<IQueryDataDocument>
    getQueries(): Promise<IQueryDataDocument | IQueryDataDocument[]>
  }

  export interface IQueryMiddleware {
    validate(
      schema: ObjectSchema
    ): (req: IQueryRequest, res: IQueryResponse, next: NextFunction) => void
  }

  export interface IQueryController {
    createdQuery: IGenericControllerType<IQueryRequest, IQueryResponse>
    queriesGetController: IGenericControllerType<
      IQueryRequest,
      IQueryResponse,
      IQueryResponse | void
    >
  }

  export interface IQueryRouter {
    getRouter(): Router
  }

  export enum QUERY_ROUTE {
    QUERY = '/query'
  }
}
