import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { HTTP_STATUS_CODE, ERROR_MESSAGE } from '../types/shared.interface'

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization

  if (authHeader) {
    const token = authHeader.split(' ')[1]

    jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
      if (err) {
        return res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
          message: ERROR_MESSAGE.INVALID_TOKEN,
          status: HTTP_STATUS_CODE.FORBIDDEN
        })
      }

      ;(req as any).user = user
      next()
    })
  } else {
    res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
      message: ERROR_MESSAGE.UNAUTHORIZED,
      status: HTTP_STATUS_CODE.UNAUTHORIZED
    })
  }
}
