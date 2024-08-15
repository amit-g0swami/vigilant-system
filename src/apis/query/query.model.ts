import mongoose from 'mongoose'
import { QueryRepository } from './query.interface'

const { Schema } = mongoose

const QuerySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: Number
  },
  status: {
    type: String,
    default: QueryRepository.QUERY_STATUS.PENDING
  },
  queryType: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
})

const Query = mongoose.model<QueryRepository.IQueryDataDocument>(
  'query',
  QuerySchema
)

export default Query
