import getLogger from 'debug'
import * as fs from 'fs'
import * as path from 'path'
import { minify } from 'uglify-js'


const debug = getLogger('pac-generator-server:base64.ts')


export function getBase64Polyfill(): string {
  const source     = fs.readFileSync(path.join(__dirname, '../vendors/base64-js.js'), 'utf8')
  const compressed = minify(source, {
    compress : {
      dead_code: false,
      toplevel : false,
    },
    mangle   : {
      reserved: ['atob'],
    },
    toplevel : true,
    sourceMap: false,
  })
  debug('compressed: ', compressed)
  return compressed.code
}
