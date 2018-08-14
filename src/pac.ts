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
  host  = 'localhost',
  type  = 'PROXY',
  plain = false,
): string {
  const parsed = toml.parse(raw as string) as IDefinition
  const rules  = parsed.rules || []
  debug('Rules: ', rules)

  let text = 'function FindProxyForURL(url,host){host=host.toLowerCase();if(false'

  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i]
    const match = rule.match(/\*/g)
    if (match == null) {
      text += `||dnsDomainIs(host,"${rule}")`
    } else if (match.length > 1) {
      text += `||shExpMatch(url,"${rule}")`
    } else {
      text += `||shExpMatch(host,"${rule}")`
    }
  }

  text += `) {return '${type} ${host}:${port}';}return 'DIRECT';}`

  if (plain) {
    return `(${text})()`
  }

  const base64 = new Buffer(text).toString('base64')

  return `eval(atob('${base64}'))`
}
