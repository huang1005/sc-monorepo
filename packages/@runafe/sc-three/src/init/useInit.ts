import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { Mesh } from 'three/src/Three'
import { addSky } from './useSky'
import { get } from '@runafe/platform-share'
import { model } from '../setting/Model'
function mountedInit({ THREE }: any, type = 'station') {
  const cameraPerspective = get(model, [type, 'camera_perspective'])
  const cameraPosition = get(model, [type, 'camera_postion'])

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x06090d)
  const url = new URL('../assets/venice_sunset_1k.hdr', import.meta.url).href

  scene.environment = new RGBELoader().load(url, () => {})
  scene.environment.mapping = THREE.EquirectangularReflectionMapping
  scene.updateMatrixWorld(true)
  // scene.fog = new THREE.Fog(0x8b919e, 200, 500);
  scene.add(addSky())
  const camera = new THREE.PerspectiveCamera(...cameraPerspective)
  camera.position.set(...cameraPosition)

  // 设置渲染器
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
    logarithmicDepthBuffer: true,
  })

  // 设置控制器
  const control = new OrbitControls(camera, renderer.domElement)

  return {
    scene,
    camera,
    renderer,
    control,
  }
}
export function useInit() {
  return {
    mountedInit,
  }
}
