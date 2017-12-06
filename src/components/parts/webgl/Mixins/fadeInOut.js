import TWEEN from '@tweenjs/tween.js'
export default {
  data () {
    return {
      TWEEN,
      tweening: false
    }
  },
  methods: {
    stopAllTween () {
      TWEEN.removeAll()
    },
    execTween () {
      TWEEN.update()
    },
    fadeOutTween (update, done, attachment) {
      var factor = 1000
      var varying = {
        opacity: 1 * factor
      }

      if (!attachment) {
        attachment = {}
      }
      if (attachment.fadeIn) {
        attachment.fadeIn.stop()
      }
      attachment.fadeOut = new TWEEN.Tween(varying)
                    .to({ opacity: 0 * factor }, 1000)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .onUpdate(() => {
                      update(varying.opacity / factor)
                    })
                    .onStop(() => {
                      done()
                    })
                    .onComplete(() => {
                      done()
                    })
      // if (attachment && attachment.fadeIn) {
      //   attachment.fadeIn.chain(attachment.fadeOut)
      // }
      attachment.fadeOut.start()
      // attachment.fadeOut = attachment.fadeOut
    },
    fadeInTween (update, done, attachment) {
      var factor = 1000
      var varying = {
        opacity: 0 * factor
      }

      if (!attachment) {
        attachment = {}
      }
      if (attachment.fadeOut) {
        attachment.fadeOut.stop()
      }
      attachment.fadeIn = new TWEEN.Tween(varying)
                    .to({ opacity: 1 * factor }, 1000)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .onUpdate(() => {
                      update(varying.opacity / factor)
                    })
                    .onStop(() => {
                      done()
                    })
                    .onComplete(() => {
                      done()
                    })
      // if (attachment && attachment.fadeOut) {
      //   attachment.fadeOut.chain(attachment.fadeIn)
      // }
      attachment.fadeIn.start()
    },

    waitSec (delay) {
      return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, delay)
      })
    },
    sleep (delay) {
      return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, delay)
      })
    },

    pageFadeIn (el, done) {
      var updater = (mesh) => {
        // mesh.visible = true
        // done()
        if (mesh && mesh.material) {
          if (mesh.userData.$component) {
            mesh.visible = mesh.userData.$component.visible
          } else {
            mesh.visible = true
          }
          mesh.material.opacity = 1.0
          if (mesh.material.uniforms) {
            mesh.material.uniforms.opacity.value = 1.0
          }
          done()

          // if (mesh.userData.$component) {
          //   mesh.visible = mesh.userData.$component.visible
          // } else {
          //   mesh.visible = true
          // }
          // this.fadeInTween((v) => {
          //   this.tweening = true
          //   mesh.material.opacity = v
          //   if (mesh.material.uniforms) {
          //     mesh.material.uniforms.opacity.value = v
          //   }
          // }, () => {
          //   done()
          //   if (mesh.material.uniforms) {
          //     mesh.material.uniforms.opacity.value = 1.0
          //   }
          //   if (mesh.userData.$component) {
          //     mesh.visible = mesh.userData.$component.visible
          //   } else {
          //     mesh.visible = true
          //   }
          //   this.tweening = false
          // }, this.mesh)
        } else {
          mesh.visible = true
          done()
        }
      }
      if (this.$refs['page-content']) {
        // this.__add(this.$refs['page-content'].object3d)
        this.$refs['page-content'].object3d.children.forEach(updater)
      }

      if (this.$refs['comics-content']) {
        this.$refs['comics-content'].object3d.children.forEach(updater)
      }

      if (this.$refs['sub-page-content'] && this.$refs['sub-page-content'].object3d) {
        this.$refs['sub-page-content'].object3d.children.forEach(updater)
      }

      if (this.$refs['sub-page-content'] && this.$refs['sub-page-content'].$refs['sub-page-content'] && this.$refs['sub-page-content'].$refs['sub-page-content'].object3d) {
        this.$refs['sub-page-content'].$refs['sub-page-content'].object3d.children.forEach(updater)
      }
    },
    pageFadeOut (el, done) {
      var updater = (mesh) => {
        if (mesh && mesh.material) {
          mesh.material.opacity = 0.0
          if (mesh.material.uniforms) {
            mesh.material.uniforms.opacity.value = 0.0
          }
          mesh.visible = false
          done()

          // if (mesh.material.uniforms) {
          //   mesh.material.userData.__depthTest = mesh.material.depthTest
          //   mesh.material.depthTest = false
          // }
          // this.fadeOutTween((v) => {
          //   this.tweening = true
          //   mesh.material.opacity = v
          //   if (mesh.material.uniforms) {
          //     mesh.material.uniforms.opacity.value = v
          //   }
          // }, () => {
          //   done()
          //   mesh.visible = false
          //   if (mesh.material.uniforms) {
          //     mesh.material.depthTest = mesh.material.userData.__depthTest
          //     mesh.material.uniforms.opacity.value = 0.0
          //   }

          //   this.tweening = false
          //   // this.__remove(this.$refs['page-content'].object3d)
          // }, this.mesh)
        } else {
          mesh.visible = false
          done()
        }
      }
      if (this.$refs['page-content']) {
        // this.__add(this.$refs['page-content'].object3d)
        this.$refs['page-content'].object3d.children.forEach(updater)
      }

      if (this.$refs['comics-content']) {
        this.$refs['comics-content'].object3d.children.forEach(updater)
      }

      if (this.$refs['sub-page-content'] && this.$refs['sub-page-content'].object3d) {
        this.$refs['sub-page-content'].object3d.children.forEach(updater)
      }

      if (this.$refs['sub-page-content'] && this.$refs['sub-page-content'].$refs['sub-page-content'] && this.$refs['sub-page-content'].$refs['sub-page-content'].object3d) {
        this.$refs['sub-page-content'].$refs['sub-page-content'].object3d.children.forEach(updater)
      }
    }
  }
}
