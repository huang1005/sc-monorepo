import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js'
import { TAARenderPass } from 'three/examples/jsm/postprocessing/TAARenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

let bloomComposer
let finalComposer

// 区分辉光与非辉光层
const BLOOM_SCENE = 1
const materials = {}
const darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' })
const bloomLayer = new THREE.Layers()
bloomLayer.set(BLOOM_SCENE)

const bloomParams = {
  exposure: 2,
  bloomThreshold: 0.1,
  bloomStrength: 1.6,
  bloomRadius: 0.15,
}

const bloomVertext = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`

const bloomFragment = `
uniform sampler2D baseTexture;
uniform sampler2D bloomTexture;
varying vec2 vUv;
void main() {
  gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
}
`

const renderBloom = ({ THREE, scene, $, camera, renderer, control, mesh }) => {
  // 添加效果合成器
  console.log(renderer)
  bloomComposer = new EffectComposer(renderer)
  bloomComposer.renderToScreen = false

  const taaRenderPass = new TAARenderPass(scene, camera)
  taaRenderPass.sampleLevel = 1

  // 添加基本的渲染通道
  const renderPass = new RenderPass(scene, camera)

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
  )
  bloomPass.threshold = bloomParams.bloomThreshold
  bloomPass.strength = bloomParams.bloomStrength
  bloomPass.radius = bloomParams.bloomRadius
  const copyPass = new ShaderPass(CopyShader)
  bloomComposer.addPass(renderPass)
  bloomComposer.addPass(taaRenderPass)
  // 把通道加入到组合器
  bloomComposer.addPass(bloomPass)
  bloomComposer.addPass(copyPass)

  const finalPass = new ShaderPass(
    new THREE.ShaderMaterial({
      uniforms: {
        baseTexture: { value: null },
        bloomTexture: { value: bloomComposer.renderTarget2.texture },
      },
      vertexShader: bloomVertext,
      fragmentShader: bloomFragment,
      defines: {},
    }),
    'baseTexture',
  )
  finalPass.needsSwap = true
  // 初始化实际效果合成器
  finalComposer = new EffectComposer(renderer)

  finalComposer.addPass(renderPass)
  // finalComposer.addPass(taaRenderPass);
  finalComposer.addPass(finalPass)
  finalComposer.addPass(copyPass)
  onWindowResize()
}

const renderEffect = (model, arrowOne, arrowTwo) => {
  model.traverse((child) => {
    if (child.isMesh) {
      if (arrowOne.includes(child.material.name)) {
        child.material.emissiveIntensity = arrowOne[0]
        ;+child.layers.toggle(BLOOM_SCENE)
      }
      if (arrowTwo.includes(child.material.name)) {
        child.material.emissiveIntensity = arrowTwo[0]
        ;+child.layers.toggle(BLOOM_SCENE)
      }
    }
  })
}

// 将材质转为黑色材质
const darkenNonBloomed = (obj) => {
  if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
    materials[obj.uuid] = obj.material
    obj.material = darkMaterial
  }
}

// 还原材质
const restoreMaterial = (obj) => {
  if (materials[obj.uuid]) {
    obj.material = materials[obj.uuid]
    delete materials[obj.uuid]
  }
}

const bloomRender = (scene) => {
  scene.traverse((obj) => darkenNonBloomed(obj))
  bloomComposer.render()
  scene.traverse((obj) => restoreMaterial(obj))
  finalComposer.render()
  return { bloomComposer, finalComposer }
}

const onWindowResize = () => {
  bloomComposer.setSize &&
    bloomComposer.setSize(window.innerWidth, window.innerHeight)
  finalComposer.setSize &&
    finalComposer.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener('resize', onWindowResize.bind(this))
// export { renderBloom, bloomRender, renderEffect };
export function useBloom() {
  return {
    renderBloom,
    renderEffect,
    bloomRender,
  }
}

// init();
// render()
// bloomRender();
