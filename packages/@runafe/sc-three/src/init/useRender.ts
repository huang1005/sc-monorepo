import { useBloom } from './useBloom'
const { bloomRender } = useBloom()
function initRender({
  THREE,
  scene,
  camera,
  renderer,
  control,
  container,
  TWEEN,
}: any) {
  // 设置渲染器
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 2
  renderer.shadowMap.enabled = true
  console.log(container)

  container && container.appendChild(renderer.domElement)

  //更新相机控件
  render({ scene, camera, renderer, control, TWEEN }, render)
  let resultWindow = () => {
    onWindowResize({ camera, renderer })
  }
  window.addEventListener('resize', resultWindow)
}

function render(
  { scene, camera, renderer, control, TWEEN }: any,
  fn: ({ scene, camera, renderer, control, TWEEN }: any, fn: any) => void,
) {
  // 最后的渲染
  let animate = () => {
    //循环调用函数
    const clearAnim = requestAnimationFrame(animate)
    //更新相机控件
    control.update()
    //渲染界面
    renderer.render(scene, camera)
    TWEEN.update()
  }
  animate()
  //  为模型绑定点击事件
}

function onWindowResize({ camera, renderer }: any) {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

export function useRender() {
  return {
    initRender,
  }
}
