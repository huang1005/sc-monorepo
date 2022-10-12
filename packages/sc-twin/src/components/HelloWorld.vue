<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useInit, Views, Viewer3DUtils } from '@runafe/sc-three'
import { batchEntity } from 'packages/@runafe/sc-three/types'
import * as THREE from 'three'
import { insHttp } from '@/api'

console.log(insHttp)
insHttp
  .get({
    url: '/datapage/getRightTop',
    data: {},
  })
  .then((res) => {
    if (res.resultCode == 0) {
      
    }
  })

const threeRef = ref()
const { useThree, useLoadGLTF } = useInit()

const url = new URL('../assets/station.glb', import.meta.url).href
const station = async ({ threeBase }: batchEntity) => {
  const gltf = await useLoadGLTF({ threeBase }, url)
  const { animations } = gltf
  let actions = []
  let loadedModels: any = {}
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
  threeBase.scene.add(gltf.scene)
  loadedModels = gltf.scene
  threeBase.scene.updateMatrixWorld(true)
  const eye = new THREE.Vector3()
  const look = new THREE.Vector3()
  threeBase.camera.position.set(-214.59, 229.8, 96.3)

  Viewer3DUtils.getCameraPositionByObjectUuids(
    threeBase.scene,
    Object.values(gltf.scene).map((obj) => obj.uuid),
    Views.Front,
    eye,
    look,
  )
  Viewer3DUtils.flyTo(eye, look, threeBase.camera, threeBase.control)
}

onMounted(() => {
  const threeBase = useThree(threeRef)
  let batchArgs: batchEntity = {
    threeBase,
  }

  station(batchArgs)
})
</script>

<template>
  <div class="sc-element">
    <div class="sc-element__box" ref="threeRef"></div>
    <div class="sc-element__tool"></div>
  </div>
</template>

<style scoped lang="scss">
@include b(element) {
  height: 100%;
  width: 100%;
  background-color: rgb(228, 212, 212);
}
</style>
