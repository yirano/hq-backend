import { Request, Response, Router } from 'express'

export default function (router: Router) {
  router.get('/ping', (_req: Request, res: Response) => {
    res.json({
      message: 'pong',
    })
  })
}

