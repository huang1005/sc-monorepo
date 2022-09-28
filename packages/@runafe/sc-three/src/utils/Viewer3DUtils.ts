import * as THREE from 'three'
import SceneUtils from './SceneUtils'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import TweenUtils from './TweenUtils'
let TWEEN = null
export const Views = {
  Top: 'Top',
  Bottom: 'Bottom',
  Front: 'Front',
  Back: 'Back',
  Left: 'Left',
  Right: 'Right',
}

/**
 * 关于 Viewer3D 的利用方法
 */
export default class Viewer3DUtils {
  /**
   * 计算摄像机位置并按给定场景查看点
   * @param场景
   * @param视图
   * @param看此方法将其传递给调用方
   * @param看，此方法将其传递给调用方
   */
  static getCameraPositionByView(scene: any, view: any, eye: any, look: any) {
    const bbox = SceneUtils.getVisibleObjectBoundingBox(scene)
    Viewer3DUtils.getCameraPositionByBboxAndView(bbox, view, eye, look)
  }

  /**
   * 计算相机位置并通过给定对象uuid查看点
   * @param场景
   * @param objectUuids
   * @param视图
   * @param眼
   * @param外观
   */
  static getCameraPositionByObjectUuids(
    scene: any,
    objectUuids: any[],
    view: string,
    eye: any,
    look: any,
  ) {
    const bbox = SceneUtils.getObjectsBoundingBox(scene, objectUuids)
    Viewer3DUtils.getCameraPositionByBboxAndView(bbox, view, eye, look)
  }

  /**
   * 通过给定的bbox和相机的当前位置获取相机的新位置和目标（lookAt）
   */
  static getCameraPositionByObjects(
    objects: any[],
    camera: any,
    eye: any,
    look: any,
  ) {
    const bbox = new THREE.Box3()
    objects.forEach((object: any) => {
      const box = SceneUtils.getBoundingBox(object)
      bbox.union(box)
    })
    Viewer3DUtils.getCameraPositionByBboxAndCamera(bbox, camera, eye, look)
  }

  /**
   * 通过给定的bbox和相机的当前位置获取相机的新位置和目标（lookAt）
   */
  static getCameraPositionByBboxAndCamera(
    bbox: THREE.Box3,
    camera: { getWorldPosition: (arg0: THREE.Vector3) => void },
    eye: { set: (arg0: number, arg1: number, arg2: number) => void },
    look: THREE.Vector3,
  ) {
    if (bbox.isEmpty()) {
      return
    }
    // 目标物体和相机之间的距离取决于物体的大小，
    // 只需使用对象对 x、y、z 大小的求和，
    // 然后乘以一个因子，它看起来更好
    const DISTANCE_FACTOR = 1.2
    let distance =
      bbox.max.x -
      bbox.min.x +
      (bbox.max.y - bbox.min.y) +
      (bbox.max.z - bbox.min.z)
    distance *= DISTANCE_FACTOR
    // make camera a little farer, it looks better
    const distanceVector = new THREE.Vector3(distance, distance, distance)
    const cx = (bbox.min.x + bbox.max.x) / 2 // bbox's center x
    const cy = (bbox.min.y + bbox.max.y) / 2
    const cz = (bbox.min.z + bbox.max.z) / 2
    look.set(cx, cy, cz)

    const oldPostion = new THREE.Vector3()
    camera.getWorldPosition(oldPostion)
    const dir = oldPostion.sub(look).normalize()
    // 更改相机的方向以首先查看新目标，然后将相机移动到与目标的适当距离
    const pos = dir.multiply(distanceVector).add(look)
    eye.set(pos.x, pos.y, pos.z)
  }

  /**
   * 通过给定的 bbox 和视图获取相机的新位置和目标（lookAt）
   */
  static getCameraPositionByBboxAndView(
    bbox: THREE.Box3,
    view: string,
    eye: { x: number; y: any; z: number },
    look: { x: number; y: number; z: number },
  ) {
    if (bbox.isEmpty()) {
      return
    }
    // make camera a little farer, it looks better
    const distance =
      bbox.max.x -
      bbox.min.x +
      (bbox.max.y - bbox.min.y) +
      (bbox.max.z - bbox.min.z)
    // Make delta a number between 0.5 and 1. And delta is smaller as distance grows.
    const delta = (0.5 + 0.5 / Math.pow(Math.E, distance / 100)) * distance
    let x = 0 // bbox.min.x + （bbox.max.x - bbox.min.x） // 默认居中
    let y = bbox.min.y + (bbox.max.y - bbox.min.y) // for front/back/left/right, give y a certain value, thus looks better
    let z = 0 // bbox.min.z + (bbox.max.z - bbox.min.z)
    const cx = (bbox.min.x + bbox.max.x) / 2 // bbox's center x
    const cy = (bbox.min.y + bbox.max.y) / 2
    const cz = (bbox.min.z + bbox.max.z) / 2
    if (view === Views.Top) {
      y = bbox.max.y + delta
    } else if (view === Views.Bottom) {
      y = bbox.min.y - delta
    } else if (view === Views.Front) {
      z = bbox.max.z + delta
      x = cx
      y = bbox.max.y + delta
    } else if (view === Views.Back) {
      z = bbox.min.z - delta
      x = cx
    } else if (view === Views.Left) {
      x = bbox.min.x - delta
      z = cz
    } else if (view === Views.Right) {
      x = bbox.max.x + delta
      z = cz
    }
    x = 116.11
    y = 53.65
    z = 82
    eye.x = x
    eye.y = y
    eye.z = z
    look.x = cx
    look.y = cy
    look.z = cz
  }

  /**
   * 睡一会儿
   */
  static async sleep(ms: number | undefined) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('')
      }, ms)
    })
  }

  // 需要存储正在闪烁的对象，这样做是为了避免一个对象被
  // 闪烁时闪烁，这可能是错误！
  static twinklingObjectUuids = {}

  /**
   * 将物体闪烁几次
   */
  static async twinkle(
    obj: { uuid: string | number; visible: boolean },
    ms = 500,
  ) {
    const uuids: any = Viewer3DUtils.twinklingObjectUuids
    if (uuids[obj.uuid]) {
      return // 避免再次入境
    }
    uuids[obj.uuid] = true

    obj.visible = !obj.visible
    await this.sleep(ms)
    obj.visible = !obj.visible
    await this.sleep(ms)
    obj.visible = !obj.visible
    await this.sleep(ms)
    obj.visible = !obj.visible
    await this.sleep(ms)
    obj.visible = !obj.visible
    await this.sleep(ms)
    obj.visible = !obj.visible

    delete uuids[obj.uuid] // 清除旗帜
  }

  /**
   * 让相机以给定的 lookAt 位置飞向目标位置
   * @param定位摄像机的目标位置
   * @param看相机的新外观位置
   */
  static flyTo(
    position: any,
    lookAt: { set: (arg0: number, arg1: number, arg2: number) => void },
    camera: {
      lookAt: (arg0: any) => any
      position: {
        set: (arg0: any, arg1: any, arg2: any) => any
        clone: () => any
      }
    },
    controls: {
      target: {
        set: (arg0: any, arg1: any, arg2: any) => any
        clone: () => any
      }
      update: () => void
    },
  ) {
    //展示最好的效果
    lookAt.set(15.32, -7.72, -22.42)

    const update = (obj: { t: any; p: any }) => {
      let { t, p } = obj
      t && camera.lookAt(t)
      p && camera.position.set(p.x, p.y, p.z)
      t && controls.target.set(t.x, t.y, t.z)
      controls.update()
    }

    // 有两个步骤
    // 1）更改相机的外观以x毫秒为单位的点
    // 2）以y毫秒为单位更改摄像机的位置

    const t = controls.target.clone() // 必须复制一个，否则TWEEN会破坏传递的对象！
    const p = camera.position.clone()
    TweenUtils.TweenRun(
      p,
      position,
      update,
      { p: p, t: lookAt },
      undefined,
      undefined,
    )
    TweenUtils.TweenRun(
      t,
      lookAt,
      update,
      { p: undefined, t: t },
      undefined,
      undefined,
    )
  }
}
