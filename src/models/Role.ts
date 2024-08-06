import mongoose, { Schema } from 'mongoose'
import { RoleRepository } from '../types/role.interface'

const roleSchema = new Schema({
  name: { type: String, required: true, unique: true },
  permissions: [{ type: String, required: true }]
})

const Role = mongoose.model<RoleRepository.IRoleDocument>('Role', roleSchema)

export default Role
