import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Viewer3DUtils, { Views } from '../utils/Viewer3DUtils'
import { ref } from 'vue'

let loading = ref(false)
let Scene: any = null
window.requestAnimationId = null
let loadedModels: any = {}
function loadGltfModel({ THREE, scene, camera, control, app }: any) {
  const loader = new GLTFLoader()
  const url = new URL('../assets/station.glb', import.meta.url).href
  loading.value = true
  loader.load(
    url,
    (gltf) => {
      const { animations } = gltf
      let actions = []
      const mixerCold = new THREE.AnimationMixer(gltf.scene)
      for (let i = 0; i < animations.length; i++) {
        actions[i] = mixerCold.clipAction(animations[i])
        actions[i].timeScale = 5
        actions[i].play()
      }
      const clock = new THREE.Clock()

      const tick = () => {
        const dt = clock.getDelta()
        mixerCold.update(dt)
        window.requestAnimationId = window.requestAnimationFrame(tick)
      }
      tick()
      gltf.scene.scale.set(5, 5, 5)
      gltf.scene.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
          child.material.side = 0

          if (child.material.name == '_.007') {
            child.material.transparent = true
            child.material.opacity = 0.5
          }
        }
      })
      scene.add(gltf.scene)
      Scene = scene
      loadedModels = gltf.scene
      scene.updateMatrixWorld(true)
      const eye = new THREE.Vector3()
      const look = new THREE.Vector3()
      camera.position.set(-214.59, 229.8, 96.3)
      Viewer3DUtils.getCameraPositionByObjectUuids(
        scene,
        Object.values(gltf.scene).map((obj) => obj.uuid),
        Views.Front,
        eye,
        look,
      )
      Viewer3DUtils.flyTo(eye, look, camera, control)
    },
    (xhr) => {
      // console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      if ((xhr.loaded / xhr.total) * 100 === 100) {
        loading.value = false
      }
    },
    (error) => {
      console.error(error)
    },
  )
}
function dispose() {
  // 递归遍历组对象group释放所有后代网格模型绑定几何体占用内存
  // console.log(loadedModels);
  loadedModels.traverse(function (obj: any) {
    if (obj.type === 'Mesh') {
      obj.geometry.dispose()
      obj.material.dispose()
    }
  })
  Scene.remove(loadedModels)
  loadedModels = null
  cancelAnimationFrame(window.requestAnimationId)
  // 删除场景对象scene的子对象group
}
export function useLoadModel() {
  return {
    loadGltfModel,
    loading,
    dispose,
  }
}
