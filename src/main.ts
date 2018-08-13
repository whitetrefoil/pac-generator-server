import getLogger from 'debug'
import log from 'fancy-log'
import { load } from './config'
import { serve } from './server'


const debug = getLogger('pac-generator-server:main.ts')


function showHelp() {
  // tslint:disable-next-line:no-console
  console.warn(
    '\nUsage: pac-generator-server <config_file_path>\n\n  If <config_file_path> is not existing, will create an example config file there.')
}

export function main(argv: string[] = process.argv) {
  debug(`argv: ${argv}`)
  const argv2 = argv[2]
  debug(`argv2: ${argv2}`)

  if (argv2 == null) {
    showHelp()
    process.exit(-1)
    return
  }
  if (argv2.indexOf('-') === 0) {
    log.error(`Unknown parameter: ${argv2}`)
    showHelp()
    process.exit(-1)
    return
  }

  const config = load(argv2)
  debug('config: ', config)
  if (config === null) {
    process.exit(-1)
    return
  }

  serve(config)
}

if (require.main === module) {
  main()
}
