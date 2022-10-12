import * as THREE from 'three'
import TWEEN from 'tween'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default class ThreeBase {
  element: HTMLElement | undefined
  scene: THREE.Scene
  camera: THREE.Camera
  renderer: THREE.Renderer
  control: OrbitControls
  loader: GLTFLoader
  constructor(element: HTMLElement) {
    this.element = element
    this.scene = this._initScene()
    this.camera = this._initCamera()
    this.renderer = this._renderer()
    this.control = this._control()
    this.loader = this._loader()
  }

  private _initScene() {
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x06090d)
    const url = new URL('../assets/venice_sunset_1k.hdr', import.meta.url).href

    scene.environment = new RGBELoader().load(url, (res) => {})
    scene.environment.mapping = THREE.EquirectangularReflectionMapping
    scene.updateMatrixWorld(true)
    return scene
  }

  private _initCamera() {
    // 默认初始化   预留useCamera钩子配置参数
    const camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      1,
      1000,
    )
    camera.position.set(-106.49, 139.5, 198.12)
    return camera
  }

  private _renderer() {
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      logarithmicDepthBuffer: true,
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 2
    renderer.shadowMap.enabled = true
    this.element?.appendChild(renderer.domElement)

    return renderer
  }

  private _control() {
    const control = new OrbitControls(this.camera, this.renderer.domElement)
    return control
  }

  private _loader() {
    const loader = new GLTFLoader()
    return loader
  }

  render() {
    let animate = () => {
      //循环调用函数
      const clearAnim = requestAnimationFrame(animate)
      //更新相机控件
      this.control.update()
      //渲染界面
      this.renderer.render(this.scene, this.camera)
      TWEEN.update()
    }
    animate()
  }
}
