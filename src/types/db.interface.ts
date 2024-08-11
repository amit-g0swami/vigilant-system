export namespace DatabaseConnectorInterface {
  export enum DATABASE_MESSAGE {
    CONNECTION_SUCCESS = 'Connected to MongoDB'
  }

  export interface IDatabaseConnector {
    connect(): Promise<void>
  }
}
