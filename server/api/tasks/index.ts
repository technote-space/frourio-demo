import { Task } from '$/types';

export type Methods = {
  get: {
    query?: {
      limit?: number
      message?: string
    }

    resBody: Task[]
  }
  post: {
    reqBody: Pick<Task, 'label'>
    status: 201
    resBody: Task
  }
}
