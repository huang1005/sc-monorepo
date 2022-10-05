<template>
  <div class="sc-element">
    <div class="sc-element__box" ref="rcThree"></div>
    <div class="sc-element__tool"></div>
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import TWEEN from 'tween'
import { useInit, useRender, useLoadModel } from './src/init'

import './src/style/index.scss'
import { ref, onMounted, defineComponent } from 'vue'
const rcThree = ref('')
const { mountedInit } = useInit()
const { initRender } = useRender()
const { loadGltfModel } = useLoadModel()

const initResult = mountedInit({ THREE }, 'station')
const { scene, camera, renderer, control } = initResult
let batchArgs = {}

onMounted(() => {
  batchArgs = {
    THREE,
    scene,
    camera,
    renderer,
    control,
    TWEEN,
    container: rcThree.value,
  }
  initRender(batchArgs)
  loadGltfModel(batchArgs)
})
</script>
<style scoped lang="scss"></style>
