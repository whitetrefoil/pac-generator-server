import { defer } from '@whitetrefoil/deferred'
import getLogger from 'debug'
import log from 'fancy-log'
import * as fs from 'fs'
import Koa from 'koa'
import helmet from 'koa-helmet'
import * as path from 'path'
import { IConfig } from './config'
import generate from './pac'


const debug = getLogger('pac-generator-server:server.ts')

const endWithPac = /\.pac$/i


function resetBody(): Koa.Middleware {
  return async(ctx, next) => {
    debug('resetBody()')
    ctx.body = ''
    await next()
  }
}

function checkIsPac(): Koa.Middleware {
  return async(ctx, next) => {
    debug('checkIsPac()')
    if (!endWithPac.test(ctx.path)) {
      log(`Getting ${ctx.url} which is not a ".pac" file...`)
      return
    }
    await next()
  }
}

function checkHasProxy(): Koa.Middleware {
  return async(ctx, next) => {
    debug('checkHasProxy()')
    if (ctx.query.p == null) {
      log(`Getting ${ctx.url} which doesn't contain "p" query...`)
      return
    }
    await next()
  }
}

function parsePac(config: IConfig): Koa.Middleware {
  return async(ctx, next) => {
    debug('parsePac')

    const related = path.relative(config.prefix, ctx.path)
    if (related.indexOf('..') === 0) {
      log(`Getting ${ctx.url} which is resolved to ${related}, out of range...`)
      return
    }

    const joined   = path.join(config.pacDir, related).replace(endWithPac, '.toml')
    const deferred = defer<void>()

    fs.readFile(joined, (err, data) => {
      if (err != null) {
        debug('readFile ERROR: ', err)
        if (err.code === 'ENOENT') {
          log.warn(`PAC file "${joined}" not found`)
        } else {
          log.error(`Failed to open PAC file "${joined}"`)
        }
        return deferred.resolve()
      }

      try {
        const generated = generate(data, ctx.query.p, ctx.query.h, ctx.query.t, ctx.query.debug)

        ctx.state = 200
        ctx.set('Content-Type', 'application/x-ns-proxy-autoconfig')
        ctx.body = generated
      } catch (e) {
        log.error(`Failed to generate from PAC definition file ${related}`)
        debug('generate PAC failed by: ', e)
        return deferred.resolve()
      }
      return deferred.resolve()
    })

    return deferred.promise
  }
}


export function serve(config: IConfig) {
  const app = new Koa()

  app.use(helmet())
  app.use(resetBody())
  app.use(checkIsPac())
  app.use(checkHasProxy())
  app.use(parsePac(config))

  app.listen(config.port, config.host, () => {
    log(`Server started at ${config.host}:${config.port}`)
  })
}
