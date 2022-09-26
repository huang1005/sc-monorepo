import * as THREE from "three"; // 加载three核心依赖
import { Sky } from "three/examples/jsm/objects/Sky.js";

const sky = new Sky();
const effectController = {
  turbidity: 0,
  rayleigh: 0.012,
  mieCoefficient: 0,
  mieDirectionalG: 0,
  elevation: 0.4,
  azimuth: 0,
  exposure: 0.1,
};
const sun = new THREE.Vector3();
export const guiChanged = (effectController: any) => {
  const { uniforms } = sky.material;
  uniforms.turbidity.value = effectController.turbidity;
  uniforms.rayleigh.value = effectController.rayleigh;
  uniforms.mieCoefficient.value = effectController.mieCoefficient;
  uniforms.mieDirectionalG.value = effectController.mieDirectionalG;

  const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
  const theta = THREE.MathUtils.degToRad(effectController.azimuth);

  sun.setFromSphericalCoords(1, phi, theta);

  uniforms.sunPosition.value.copy(sun);
};

export const addSky = () => {
  // Add Sky

  sky.scale.setScalar(10000);
  guiChanged(effectController);

  return sky;
};
