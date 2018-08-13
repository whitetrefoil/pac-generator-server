import getLogger from 'debug'
import log from 'fancy-log'
import * as fs from 'fs'
import mkdirp from 'mkdirp'
import * as path from 'path'
import * as toml from 'toml'


export interface IConfig {
  host: string
  port: number
  pacDir: string
  prefix: string
}


const DEFAULT_CONFIG: IConfig = {
  host  : 'localhost',
  port  : 48332,
  pacDir: 'pac',
  prefix: '/',
}

const debug = getLogger('pac-generator-server:config.ts')


export function generate(fp: string) {
  try {
    mkdirp.sync(path.dirname(fp))
    debug('__dirname: ', __dirname)
    fs.copyFileSync(path.join(__dirname, '../config.example.toml'), fp)
  } catch (e) {
    log.error(`Failed to copy example config file to ${fp}...`)
    debug(e)
  }
}


/**
 * @returns If it returns `null`, means the main process should quit.
 */
export function load(fp: string): IConfig|null {
  let configFile: string
  try {
    configFile = fs.readFileSync(fp, 'utf8')
  } catch (e) {
    if (e.code === 'ENOENT') {
      log.warn(`No config file found at ${fp}, copying an example to there...`)
      generate(fp)
      log.warn('Done, please edit that config file then try to start again. See you soon ;)')
      return null
    }
    log.warn(`Failed to open config file from "${fp}", using default...`)
    debug(e)
    return DEFAULT_CONFIG
  }

  let config: Partial<IConfig>
  try {
    config = toml.parse(configFile) as Partial<IConfig>
  } catch (e) {
    log.warn(`Failed to parse "${fp}" as TOML file, using default...`)
    debug(e)
    return DEFAULT_CONFIG
  }

  return {
    host  : config.host || DEFAULT_CONFIG.host,
    port  : config.port || DEFAULT_CONFIG.port,
    pacDir: config.pacDir || DEFAULT_CONFIG.pacDir,
    prefix: config.prefix || DEFAULT_CONFIG.prefix,
  }
}
