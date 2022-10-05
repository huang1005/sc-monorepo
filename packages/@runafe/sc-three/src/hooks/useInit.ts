import ThreeBase from '../core/threeBase'
import { ref, onMounted, Ref } from 'vue'
import { batchEntity, GLTF } from '../../types'

function useThree(element: Ref<HTMLElement>): ThreeBase {
  const threeBase = new ThreeBase(element.value)
  threeBase.render()
  return threeBase
}

function useCamera({ threeBase }: batchEntity, cameraPosition: number[]) {
  threeBase.camera.position.set(...(cameraPosition as [number, number, number]))
}

function useLoadGLTF(
  { threeBase }: batchEntity,
  url: string,
  onProgress = (progress: number) => {},
): Promise<GLTF> {
  return new Promise<GLTF>((resolve) => {
    threeBase.loader.load(
      url,
      (object) => resolve(object),
      (xhr) => onProgress(Number((xhr.loaded / xhr.total) * 100)),
    )
  })
}
export function useInit() {
  return {
    useThree,
    useCamera,
    useLoadGLTF,
  }
}
