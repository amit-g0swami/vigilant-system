import { Document } from 'mongoose'

export namespace RoleRepository {
  export enum ROLE_MESSAGE {}

  export enum ROLES {
    ADMIN = 'admin',
    MANAGER = 'manager',
    USER = 'user'
  }

  export interface IRole {
    role: ROLES
    permissions?: string[]
  }

  export interface IRoleDocument extends IRole, Document {}
}
