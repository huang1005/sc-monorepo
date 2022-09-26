const MODEL_TYPE = {
  S: "station",
  H: "house",
};
const model = {
  station: {
    type: MODEL_TYPE.S,
    camera_postion: [-106.49, 139.5, 198.12],
    camera_perspective: [40, window.innerWidth / window.innerHeight, 1, 1000],
  },
  house: {
    type: MODEL_TYPE.H,
    camera_postion: [-214.59, 229.8, 96.3],
    camera_perspective: [40, window.innerWidth / window.innerHeight, 1, 1000],
  },
};

export { model };
