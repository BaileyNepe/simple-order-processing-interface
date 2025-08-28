import { createTRPCClient, TRPCClientError, type TRPCLink } from '@trpc/client'
import type { AnyTRPCRouter, inferRouterError } from '@trpc/server'
import { observable } from '@trpc/server/observable'
import request from 'supertest'
import app from '@/index'
import type { AppRouter } from '@/routers'

type App = Parameters<typeof request>[0]

interface SupertestLinkOptions {
  headers?: Record<string, string>
  trpcPath: string
}

export function supertestLink<TRouter extends AnyTRPCRouter>(
  a: App,
  options: SupertestLinkOptions
): TRPCLink<TRouter> {
  return () =>
    ({ op }) =>
      observable((observer) => {
        const input = op.input as unknown as string | object | undefined

        const method = op.type === 'query' ? 'get' : 'post'
        const headers = {
          accept: 'application/json',
          ...options.headers
        }
        const url =
          method === 'get'
            ? `${options.trpcPath}/${op.path}?input=${encodeURIComponent(JSON.stringify(input))}`
            : `${options.trpcPath}/${op.path}`

        request(a)
          [method](url)
          .send(input)
          .set(headers)
          .then(async (res) => {
            const meta = { response: { json: () => res.body }, responseJSON: res.body }

            if ('error' in res.body) {
              const error = res.body.error as inferRouterError<TRouter>

              observer.error(
                TRPCClientError.from(
                  {
                    ...res.body,
                    error
                  },
                  {
                    meta
                  }
                )
              )
              return
            }
            observer.next({
              context: meta,
              result: { data: res.body.result.data, type: 'data' }
            })
            observer.complete()
          })
          .catch((err) => observer.error(TRPCClientError.from(err, {})))

        return () => {}
      })
}

export const createTrpcTestClient = () =>
  createTRPCClient<AppRouter>({
    links: [
      supertestLink(app, {
        trpcPath: '/trpc'
      })
    ]
  })
