import VueCookies from 'vue-cookies'
import { InstallConf } from '@runafe/platform-share'
export function install(config: InstallConf) {
  const { app } = config  
  app.use(VueCookies)
}
