import ThreeBase from '../core/threeBase'
import { Ref } from 'vue'
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

// let x = (a: number) => ({ name: 1, test: 2 })
// let y = (b: number, s: string) => ({ name: 1, test: 2 })
// y = x

// let x = (a: number) => ({ name: 1 })
// let y = (b: number) => ({ name: 1, test: 2 })
// x = y

// type parent = string | number | boolean

// type child = string | boolean

// type test = child extends parent ? true : false
// test 的类型是true
// let a: child = true
// let b: parent = 1
// a = b // 报错 Type 'number' is not assignable to type 'child'.
// b = a // 不报错

// interface Named {
//   name: string
// }

// let x: Named
// // y's inferred type is { name: string; location: string; }
// let y = { name: 'Alice', location: 'Seattle' }
// x = y

// let x = (a: number | string) => 0
// let y = (b: number | string | boolean) => 0

// let t = (a: number, b: string) => 0
// let v = (a: number) => 0

// v = t

// t = v

// interface parent {
//   name: string
// }

// interface child {
//   name: string
//   age: number
// }
// let a: parent = { name: '1' }

// let b: child = { name: '1', age: 6 }

// interface child extends parent {}

// type a = number | string
// type b = number | string | boolean

// let x: a = 1
// let y: b = true

// y = x

export function useInit() {
  return {
    useThree,
    useCamera,
    useLoadGLTF,
  }
}
