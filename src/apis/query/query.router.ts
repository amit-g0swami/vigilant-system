import querySchemas from './query.schema'
import { Router } from 'express'
import { QueryRepository } from './query.interface'
import { queryController } from './query.controller'
import { queryMiddleware } from './middleware'

class QueryRouter implements QueryRepository.IQueryRouter {
  private router: QueryRepository.IQueryBaseRouter
  private queryController: QueryRepository.IQueryController
  private queryMiddleware: QueryRepository.IQueryMiddleware

  constructor() {
    this.router = Router()
    this.queryController = queryController
    this.queryMiddleware = queryMiddleware
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post(
      QueryRepository.QUERY_ROUTE.QUERY,
      this.queryMiddleware.validate(querySchemas.createQuerySchema),
      (req, res) => this.queryController.createdQuery(req, res)
    )

    this.router.get(QueryRepository.QUERY_ROUTE.QUERY, (req, res) =>
      this.queryController.queriesGetController(req, res)
    )
  }

  public getRouter() {
    return this.router
  }
}

export const queryRouter = new QueryRouter()
