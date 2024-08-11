import { createClient, RedisClientType } from 'redis'
import { Logger } from '../logger/logger.lib'
import { CONSTANTS } from '../types/shared.interface'
import { RedisConnectorInterface } from '../types/redisClient.interface'

const REDIS_CONNECTION_URL = process.env.REDIS_URL!

class RedisConnector implements RedisConnectorInterface.IRedisConnector {
  private redisUrl: string
  private client: RedisClientType

  constructor(redisUrl: string) {
    this.redisUrl = redisUrl
    this.client = createClient({ url: this.redisUrl })
  }

  public async connect() {
    this.client.on('error', (err) => Logger.error('Redis Client Error:', err))

    try {
      await this.client.connect()
      Logger.info(RedisConnectorInterface.REDIS_MESSAGE.CONNECTION_SUCCESS)
    } catch (error) {
      Logger.error('Error connecting to Redis:', error)
      process.exit(CONSTANTS.ONE)
    }
  }

  public getClient(): RedisClientType {
    return this.client
  }
}

export const redisConnector = new RedisConnector(REDIS_CONNECTION_URL)
