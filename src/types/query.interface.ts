import { ObjectSchema } from 'joi'
import { Document } from 'mongoose'
import { ERROR_MESSAGE, HTTP_STATUS_CODE } from './shared.interface'
import { NextFunction, Request, Response, Router } from 'express'

export namespace QueryRepository {
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

  export interface IQueryRequestBody extends IQueryData {}

  export interface IQueryDataDocument extends IQueryData, Document {}

  type IBaseQueryMessage = string
  type IQueryMeaasge = QUERY_MESSAGE | ERROR_MESSAGE | IBaseQueryMessage

  export interface IQueryResponse {
    message: IQueryMeaasge
    status: HTTP_STATUS_CODE
    query?: IQueryDataDocument | IQueryDataDocument[]
  }

  export interface IQueryService {
    createQuery(queryData: ICreateQueryRequestBody): Promise<IQueryDataDocument>
    getQueries(): Promise<IQueryDataDocument | IQueryDataDocument[]>
  }

  export interface IQueryMiddleware {
    validate(
      schema: ObjectSchema
    ): (
      req: Request<{}, {}, IQueryData>,
      res: Response<IQueryResponse>,
      next: NextFunction
    ) => void
  }

  export interface IQueryController {
    createdQuery(req: Request, res: Response<IQueryResponse>): Promise<void>
    queriesGetController(
      req: Request,
      res: Response<IQueryResponse>
    ): Promise<Response<IQueryResponse> | void>
  }

  export interface IQueryRouter {
    getRouter(): Router
  }

  export enum QUERY_ROUTE {
    QUERY = '/query'
  }
}
