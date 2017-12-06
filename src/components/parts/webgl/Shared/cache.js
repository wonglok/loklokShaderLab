import * as THREE from 'three'
import axios from 'axios'
export const textureCache = {
  image: {},
  cache: {},
  setCache (link) {
    var cachedItem = textureCache.cache[link]
    if (!cachedItem) {
      textureCache.cache[link] = new THREE.TextureLoader().load(link, (texture) => {
        textureCache.cache[link].needsUpdate = true
      })
    }
  },
  getTexture (link) {
    textureCache.setCache(link)
    return textureCache.cache[link]
  }
}

export const preLoad = (links, progress) => {
  return new Promise((resolve, reject) => {
    var loaded = 0
    links.map((link) => {
      // if (textureCache.cache[link]) {
      //   loaded++
      //   var currentVal = loaded / links.length
      //   if (progress) {
      //     progress(currentVal)
      //   }
      //   if (currentVal === 1) {
      //     resolve()
      //   }
      //   return {
      //     texture: textureCache.cache[link],
      //     link
      //   }
      // }

      function makePowerOfTwo (image) {
        var _Math = THREE.Math
        var canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas')
        canvas.width = _Math.nearestPowerOfTwo(image.width)
        canvas.height = _Math.nearestPowerOfTwo(image.height)
        var context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        console.info('Preprocess:: THREE.WebGLRenderer: image is not power of two (' + image.width + 'x' + image.height + '). Resized to ' + canvas.width + 'x' + canvas.height, image)
        return canvas
      }

      var image = new Image()
      textureCache.image[link] = image
      image.onload = () => {
        textureCache.cache[link] = new THREE.CanvasTexture(makePowerOfTwo(image))
        textureCache.cache[link].needsUpdate = true

        loaded++
        var currentVal = loaded / links.length
        if (progress) {
          progress(currentVal)
        }
        if (currentVal === 1) {
          resolve()
          // window.requestAnimationFrame(done)
        }
      }
      image.src = link

      // textureCache.cache[link] = new THREE.TextureLoader().load(link, (texture) => {
      //   textureCache.cache[link].needsUpdate = true
      //   loaded++
      //   var currentVal = loaded / links.length
      //   if (progress) {
      //     progress(currentVal)
      //   }
      //   if (currentVal === 1) {
      //     resolve()
      //     // window.requestAnimationFrame(done)
      //   }
      // })
      // return {
      //   texture: textureCache.cache[link],
      //   link
      // }
    })
  })
}

export function getFonts () {
  return fontLinks.map((link) => {
    return axios.get(link)
  })
}

export const fontLinks = [
  require('@/components/NikeWebGL/Fonts/DinCondense/regular.otf'),
  require('@/components/NikeWebGL/Fonts/DinCondense/medium.otf'),
  require('@/components/NikeWebGL/Fonts/Futura/condensed-medium.ttf')
]

export const startAnimationLinks = [
  require('@/components/NikeWebGL/Pages/Play/img/start/white-ball.png'),
  require('@/components/NikeWebGL/Pages/Play/img/start/white-ball-text.png'),
  require('@/components/NikeWebGL/Pages/Play/img/start/hider-reverse.png'),
  require('@/components/NikeWebGL/Pages/Play/img/start/start-icon.png')
]

export const homeLinks = [
  require('@/components/NikeWebGL/Pages/BoxingCamp/img/bg/boxing.jpg'),
  require('@/components/NikeWebGL/Pages/BoxingCamp/img/button-area/button-area.png'),
  require('@/components/NikeWebGL/Pages/BoxingCamp/img/button-area/enter-now.png'),
  require('@/components/NikeWebGL/Pages/BoxingCamp/img/button-area/watch-comics.png'),
  require('@/components/NikeWebGL/Pages/BoxingCamp/img/hero/camp.png'),
  require('@/components/NikeWebGL/Pages/BoxingCamp/img/hero/nike-boxing.png')
]

export const menuLinks = [
  require('@/components/NikeWebGL/element/Menu/img/items/boxing-camp.png'),
  require('@/components/NikeWebGL/element/Menu/img/items/comics.png'),
  require('@/components/NikeWebGL/element/Menu/img/items/home.png'),
  require('@/components/NikeWebGL/element/Menu/img/items/rewards.png'),
  require('@/components/NikeWebGL/element/Menu/img/items/rules.png')
]

export const agreePageLinks = [
  require('@/components/NikeWebGL/Pages/Agree/img/header/title.png'),
  require('@/components/NikeWebGL/Pages/Agree/img/bg/rex.png'),
  require('@/components/NikeWebGL/Pages/Agree/img/tagline/title.png'),
  require('@/components/NikeWebGL/Pages/Agree/img/desc/punch-icon.png'),
  require('@/components/NikeWebGL/Pages/Agree/img/desc/punch-about.png'),
  require('@/components/NikeWebGL/Pages/Agree/img/enter.png'),
  require('@/components/NikeWebGL/Pages/Agree/img/agree/box-unchecked.png'),
  require('@/components/NikeWebGL/Pages/Agree/img/agree/box-checked.png'),
  require('@/components/NikeWebGL/Pages/Agree/img/agree/agree-rule.png')
]

export const recordPageLinks = [
  require('@/components/NikeWebGL/Pages/Play/img/record/punch-num-desc.png'),
  require('@/components/NikeWebGL/Pages/Play/img/record/time-remain-desc.png')
]

export const resultPageLinks = [
  require('@/components/NikeWebGL/Pages/Play/img/result/hider-reverse.png'),
  require('@/components/NikeWebGL/Pages/Play/img/result/coupon-box-text.png'),
  require('@/components/NikeWebGL/Pages/Play/img/result/coupon-box-btn-rule.png'),
  require('@/components/NikeWebGL/Pages/Play/img/result/coupon-box-btn-nike.png'),
  require('@/components/NikeWebGL/Pages/Play/img/result/try-again.png'),
  require('@/components/NikeWebGL/Pages/Play/img/result/check-coupon.png'),
  require('@/components/NikeWebGL/Pages/Play/img/result-2/share-txt.png'),
  require('@/components/NikeWebGL/Pages/Play/img/result-2/share-rule-txt.png'),
  require('@/components/NikeWebGL/Pages/Play/img/result-2/share-btn.png'),
  require('@/components/NikeWebGL/Pages/Play/img/result/daily-task-box.png'),
  require('@/components/NikeWebGL/Pages/Play/img/result/punch-number-desc.png')
]

export const loginPageLinks = [
  require('@/components/NikeWebGL/Pages/Login/img/form/login-start-game.png'),
  require('@/components/NikeWebGL/Pages/Login/img/bg/hider.png'),
  require('@/components/NikeWebGL/Pages/Login/img/form/login-facebook.png'),
  require('@/components/NikeWebGL/Pages/Login/img/form/login-field-desc.png'),
  require('@/components/NikeWebGL/Pages/Login/img/form/login-email-text.png'),
  require('@/components/NikeWebGL/Pages/Login/img/form/login-submit.png')
]

export const preloadBundle = [
  ...loginPageLinks,
  ...resultPageLinks,
  ...recordPageLinks,
  ...startAnimationLinks,
  ...agreePageLinks
]
