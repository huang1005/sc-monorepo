import { InstallConf, InstallModule } from '@runafe/platform-share'

const modules = import.meta.glob<InstallModule>('./*.ts', {
  eager: true
})
export default function (config: InstallConf) {
  for (const path in modules) {
    const mod = modules[path]
    console.log(mod.install)

    mod.install && mod.install(config)
  }
}
