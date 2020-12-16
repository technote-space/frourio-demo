import { Task } from '$prisma/client';

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
    resBody: Task
  }
}
