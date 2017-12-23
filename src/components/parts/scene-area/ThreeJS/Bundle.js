export default {
  Renderer: require('./System/Renderer.vue').default,
  Scene: require('./System/Scene.vue').default,
  PerspectiveCamera: require('./System/PerspectiveCamera.vue').default,

  Points: require('./Element/Points.vue').default,
  PointLight: require('./Element/PointLight.vue').default,

  MeshBasicMaterial: require('./Material/MeshBasicMaterial.vue').default,

  SphereBufferGeometry: require('./Geo/SphereBufferGeometry.vue').default,

  dummy: {}
}