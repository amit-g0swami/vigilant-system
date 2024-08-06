import querySchemas from '../schemas/querySchemas'
import { Router } from 'express'
import { queryMiddleware } from '../middleware/queryMiddleware'
import { QueryRepository } from '../types/query.interface'
import { queryController } from '../controllers/queryController'

class QueryRouter implements QueryRepository.IQueryRouter {
  private router: Router
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
