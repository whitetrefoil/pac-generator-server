import getLogger from 'debug'
import * as toml from 'toml'


interface IDefinition {
  rules: string[]
}


const debug = getLogger('pac-generator-server:pac.ts')

/** @returns Return `null` means no valid proxy, should cause a 404 */
export default function generate(
  raw: Buffer|string,
  port: string,
  host: string = 'localhost',
  type: string = 'PROXY',
): string {
  const parsed = toml.parse(raw as string) as IDefinition
  const rules  = parsed.rules || []
  debug('Rules: ', rules)

  let text = 'function FindProxyForURL(url,host){host=host.toLowerCase();if(false'

  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i]
    if (rule.indexOf('*') >= 0) {
      text += `||shExpMatch(url,"${rule}")`
    } else {
      text += `||dnsDomainIs(host,"${rule}")`
    }
  }

  text += `) {return '${type} ${host}:${port}';}return 'DIRECT';}`

  const base64 = new Buffer(text).toString('base64')

  return `eval(atob('${base64}'))`
}
