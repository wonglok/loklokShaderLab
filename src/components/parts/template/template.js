import requireJSStr from '../../worker/requirejs.str.txt'

export function scriptSRC (src) {
  return `<script src="${src}">` + `</script>`
}

export function initToken () {
  return `<!--DO_NOT_REMOVE_ME____AUTO_INIT-->`
}
export function autoRefreshToken () {
  return `<!--DO_NOT_REMOVE_ME____AUTO_REFRESH-->`
}

export function indexHTML ({ author }) {
  return `<!DOCTYPE html>
<html>
  <head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>component</title>
  <meta name="author" content="${author}">
  <meta name="description" content="WebGL Art">
  <meta name="keywords" content="WebGL, Art">

  <!--
  ${scriptSRC('https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.2/vue.min.js')}
  ${scriptSRC('https://cdnjs.cloudflare.com/ajax/libs/vue-router/3.0.1/vue-router.min.js')}
  ${scriptSRC('https://cdnjs.cloudflare.com/ajax/libs/tween.js/16.3.5/Tween.min.js')}
  -->

  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/88/three.min.js" integrity="sha256-6fhm481uY9c152qGWIVgE7KbzaCj5WjCi3BGIpZef2E=" crossorigin="anonymous"></script>
  <script src="https://threejs.org/examples/js/GPUComputationRenderer.js"></script>

  <style type="text/css">
    html, body {
      width: 100%;
      height: 100%;
      margin: 0px;
      padding: 0px;
    }
    html, body, #app {
      box-sizing: border-box;
    }
  </style>
  </head>
  <body>
    <div id="app"></div>
    ${initToken()}
  </body>
</html>`
}

export function newFile ({ path }) {
  return {
    path: path || '@/newFile.js',
    src: ``
  }
}

export function initTokenReplacer ({ html, js }) {
  return html.replace(initToken(), `<script type="text" id="initAPP">` + js + `<` + `/` + `script>` + `<script>` + requireJSStr + `<` + `/` + `script>` + `<script>` + `
  (function(){
    var js = document.getElementById('initAPP').innerHTML;
    var blob = new Blob([js], { type: 'text/html' });
    var url = URL.createObjectURL(blob);

    var scpt = document.createElement('script');
    scpt.src = url;
    document.body.appendChild(scpt);

    var suspendClose = false;

    window.addEventListener('message', ({ data }) => {
      if (data.type === 'suspend-close') {
        suspendClose = true;
        setTimeout(() => {
          suspendClose = false;
        }, 5000);
      }
    })

    window.addEventListener('keydown', (e) => {
      if (
        (e.keyCode === 82 && e.metaKey) ||
        (e.keyCode === 82 && e.ctrlKey)
      ) {
        suspendClose = true;
        setTimeout(() => {
          suspendClose = false;
        }, 5000);
      }
    }, false)

    window.addEventListener('beforeunload', (e) => {
      if (!suspendClose) {
        window.top.postMessage({ type: 'close' }, window.location.origin)
      }
    }, false)

  }())

//` + `</` + `script>`)
}

export function getNewProject ({ author }) {
  return [
    {
      path: '@/index.html',
      src: indexHTML({ author })
    },
    {
      path: '@/main.js',
      src: `//
import app from '@/src/app.js'
`
    },
    {
      path: '@/src/app.js',
      src: `
import { makeAPI } from '@/src/webgl/particle.js';

var api = makeAPI();
api.setup({ target: document.getElementById('app') });

var clean = () => {
  api.clean()
};

//
`
    },
    {
      path: '@/src/ui/events.js',
      src: `
//
export default ({ target, stack }) => {
  var mod = {};

  mod.sendEvent = (args) => {
      for (var key in stack) {
          stack[key](args)
      }
  }

  var ev = mod.evlt = {
    resizer: () => {
      if (!target) { return }
      mod.rect = target.getBoundingClientRect()
      mod.aspect = mod.rect.width / mod.rect.height
      mod.sendEvent({ type: 'resize', aspect: mod.aspect, rect: mod.rect })
    },
    tsData: false,
    tmData: false,
    emitClick: false,
    onTS: (evt) => {
      evt.preventDefault()
      ev.tsData = { type: 'click', isIn: true, touches: evt.touches, pageX: evt.touches[0].pageX, pageY: evt.touches[0].pageY, rect: mod.rect }
      ev.emitClick = true
      setTimeout(() => {
        ev.emitClick = false
      }, 300)
      mod.sendEvent({ type: 'ts', isIn: true, touches: evt.touches, pageX: evt.touches[0].pageX, pageY: evt.touches[0].pageY, rect: mod.rect })
    },
    onTM: (evt) => {
      evt.preventDefault()
      mod.sendEvent({ type: 'tm', touches: evt.touches, pageX: evt.touches[0].pageX, pageY: evt.touches[0].pageY, rect: mod.rect })
    },
    onTE: (evt) => {
      if (ev.emitClick) {
        ev.emitClick = false
        mod.sendEvent(ev.tsData)
      }
      mod.sendEvent({ type: 'te', isIn: false })
    },
    onMDN: (evt) => {
      mod.sendEvent({ type: 'mdn', pageX: evt.clientX, pageY: evt.clientY, rect: mod.rect })
    },
    onMUP: (evt) => {
      mod.sendEvent({ type: 'mup', pageX: evt.clientX, pageY: evt.clientY, rect: mod.rect })
    },
    onMV: (evt) => {
      evt.preventDefault()
      mod.sendEvent({ type: 'mv', pageX: evt.pageX, pageY: evt.pageY, rect: mod.rect })
    },
    onMO: (evt) => {
      mod.sendEvent({ isIn: true })
    },
    onME: (evt) => {
      mod.sendEvent({ isIn: true })
    },
    onML: (evt) => {
      mod.sendEvent({ isIn: false })
    },
    onCL: (evt) => {
      mod.sendEvent({ type: 'click', pageX: evt.pageX, pageY: evt.pageY, rect: mod.rect })
    },
    onWHL: (evt) => {
      mod.sendEvent({ type: 'wheel', deltaX: evt.deltaX, deltaY: evt.deltaY })
    }
  }

  setTimeout(() => {
    ev.resizer()
  }, 10)

  var container = target
  container.addEventListener('mouseover', ev.onMO, false)
  container.addEventListener('mouseenter', ev.onME, false)
  container.addEventListener('mouseleave', ev.onML, false)

  container.addEventListener('mousemove', ev.onMV, false)
  container.addEventListener('mousedown', ev.onMDN, false)
  container.addEventListener('mouseup', ev.onMUP, false)

  container.addEventListener('click', ev.onCL, false)
  container.addEventListener('wheel', ev.onWHL, false)

  container.addEventListener('touchstart', ev.onTS, false)
  container.addEventListener('touchmove', ev.onTM, false)
  container.addEventListener('touchend', ev.onTE, false)
  container.style['-webkit-tap-highlight-color'] = 'rgba(0,0,0,0)'
  window.addEventListener('resize', ev.resizer, false)
  mod.uninstaller = () => {
    container.removeEventListener('mouseover', ev.onMO)
    container.removeEventListener('mouseenter', ev.onME)
    container.removeEventListener('mouseleave', ev.onML)

    container.removeEventListener('mousemove', ev.onMV)
    container.removeEventListener('mousedown', ev.onMDN)
    container.removeEventListener('mouseup', ev.onMUP)

    container.removeEventListener('click', ev.onCL)
    container.removeEventListener('wheel', ev.onWHL)

    container.removeEventListener('touchstart', ev.onTS)
    container.removeEventListener('touchmove', ev.onTM)
    container.removeEventListener('touchend', ev.onTE)
    window.removeEventListener('resize', ev.resizer)
  }

  return mod;
}
//
`
    },
    {
      path: '@/src/ui/window.js',
      src: `
//

export default function setupWindow ({ stack }) {
  var mod = {}

  mod.sendEvent = (args) => {
      for (var key in stack) {
          stack[key](args)
      }
  }

  window.addEventListener('message', ({ data }) => {
    // console.log(data);
    if (data.type === 'cw.slider') {
      mod.sendEvent({ type: 'cw.slider', data })
    }
  }, false)

  return mod;
}

//
      `
    },
    {
      path: '@/src/webgl/particle.js',
      src: `
//
var THREE = window.THREE;

import setupEvents from '@/src/ui/events.js';
import setupWindow from '@/src/ui/window.js';

export function makeAPI() {
    var api = {}

    var WIDTH = 128

    api.windowStack = {};
    api.eventStack = {};
    api.setup = ({
        target
    }) => {
        var renderer = new THREE.WebGLRenderer({
            alpha: true
        })
        api.compute = setupCompute({
            renderer
        })
        api.render = setupRender({
            renderer,
            target
        })
        api.events = setupEvents({
            target,
            stack: api.eventStack
        })
        api.Window = setupWindow({
            stack: api.windowStack
        })
        api.loop = setupLoop()
    }

    api.clean = () => {
        api.loop.stop()
    }

    var setupLoop = () => {
        var rAF = () => {
            api.rAFID = window.requestAnimationFrame(rAF)

            var result = api.compute.run()
            api.render.run({
                compute: result
            })
        }
        api.rAFID = window.requestAnimationFrame(rAF)
        return {
            stop() {
                window.cancelAnimationFrame(api.rAFID)
            }
        }
    }

    var makeAnimatable = ({
        scene
    }) => {

        var particleV = require('@/src/webgl/particle/particle.vert');
        var particleF = require('@/src/webgl/particle/particle.frag');

        var geometry = new THREE.PlaneBufferGeometry(30, 30, WIDTH - 1, WIDTH - 1);
        var material = new THREE.ShaderMaterial({
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
            vertexShader: particleV.default,
            fragmentShader: particleF.default,
            uniforms: {
                opacity: {
                    value: 0,
                },
                resolution: {
                    value: new THREE.Vector2(window.innerWidth, window.innerHeight),
                },
                picture: {
                    value: new THREE.TextureLoader().load('https://picsum.photos/200/300/?gravity=east')
                },
                pointSize: {
                    value: window.devicePixelRatio || 1.0
                },
                posTex: {
                    value: null
                },
                velTex: {
                    value: null
                }
            }
        })

        api.windowStack.onOpacity = (evt) => {
          var { value } = evt.data.data;
          // console.log('onOpacity', evt, evt.data.type, value / 100)
          material.uniforms.opacity.value = value / 100
        }

        var points = new THREE.Points(geometry, material)
        points.matrixAutoUpdate = false
        points.updateMatrix()

        scene.add(points)

        return {
            material,
            points
        }
    }

    var setupRender = ({
        renderer,
        target
    }) => {
        var mod = {}

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
        camera.position.z = 165;

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio || 1.0)
        target.appendChild(renderer.domElement);

        setTimeout(() => {
            renderer.domElement.style.marginBottom = '-3px'
        }, 10)

        api.eventStack.setSize = ({
            type,
            rect,
            aspect
        }) => {
            if (type === 'resize' && rect) {
                renderer.setSize(rect.width, rect.height + 6)
                camera.aspect = aspect;
                camera.updateProjectionMatrix()
            }
        }

        scene.background = new THREE.Color(0x000000);

        var anim = makeAnimatable({
            scene
        })

        mod.run = () => {
            var {
                velTex,
                posTex
            } = api.compute.getTex()

            anim.material.uniforms.posTex.value = posTex
            anim.material.uniforms.velTex.value = velTex

            renderer.render(scene, camera);
        }

        return mod
    }



    var setupCompute = ({
        renderer
    }) => {
        var mod = {}

        function fillTexture(texture, WIDTH) {

            var pixels = texture.image.data
            var p = 0
            for (var j = 0; j < WIDTH; j++) {
                for (var i = 0; i < WIDTH; i++) {
                    var x = (WIDTH / 2 - i) * 128 / WIDTH
                    var y = (WIDTH / 2 - j) * 128 / WIDTH

                    pixels[p + 0] = x
                    pixels[p + 1] = y

                    pixels[p + 2] = 0 // noise(Math.sin(x), Math.sin(y), 0.0)
                    pixels[p + 3] = 0
                    p += 4
                }
            }
        }

        var gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, renderer);

        // Create initial state float textures
        var pos0 = gpuCompute.createTexture();
        var vel0 = gpuCompute.createTexture();
        // and fill in here the texture data...
        fillTexture(pos0, WIDTH)

        // Add texture variables
        var velTexSD = require('@/src/webgl/particle/velocitySim.frag');
        var posTexSD = require('@/src/webgl/particle/positionSim.frag');

        var velVar = gpuCompute.addVariable('velTex', velTexSD.default, pos0);
        var posVar = gpuCompute.addVariable('posTex', posTexSD.default, vel0);

        // Add variable dependencies
        gpuCompute.setVariableDependencies(velVar, [velVar, posVar]);
        gpuCompute.setVariableDependencies(posVar, [velVar, posVar]);

        // Add custom uniforms
        velVar.material.uniforms = {
            time: {
                value: 0.0
            },
            mouse: {
                value: new THREE.Vector2(0, 0)
            }
        }

        api.eventStack.mousePos = ({
            type,
            pageX,
            pageY,
            rect
        }) => {
            var velocity = velVar.material.uniforms.mouse.value;
            if (type === 'mv' && rect) {
                velocity.x = ((pageX - rect.left) / rect.width) * 2 - 1
                velocity.y = -((pageY - rect.top) / rect.height) * 2 + 1
            } else if (type === 'tm' && rect) {
                velocity.x = ((pageX - rect.left) / rect.width) * 2 - 1
                velocity.y = -((pageY - rect.top) / rect.height) * 2 + 1
            }
        }

        // Check for completeness
        var error = gpuCompute.init();
        if (error !== null) {
            alert(error);
            console.error(error);
        }
        mod.getTex = () => {
            return {
                velTex: gpuCompute.getCurrentRenderTarget(velVar).texture,
                posTex: gpuCompute.getCurrentRenderTarget(posVar).texture
            }
        };

        mod.run = () => {
            velVar.material.uniforms.time.value = window.performance.now() / 1000
            gpuCompute.compute();
        }
        return mod
    }

    return api;
}


`
    },
    {
      path: '@/src/webgl/particle/particle.vert',
      src: `

uniform sampler2D posTex;
uniform sampler2D velTex;

uniform float pointSize;

varying vec4 parVel;
varying vec2 vUv;

void main() {
    vec4 pos = texture2D(posTex, uv);
    vec4 vel = texture2D(velTex, uv);

    vec4 mvPosition = modelViewMatrix * vec4( pos.xyz, 1.0 );
    vec4 outputPos = projectionMatrix * mvPosition;

    vUv = uv;
    parVel = vel;
    gl_Position = outputPos;
    gl_PointSize = pointSize * 1.0;
}


      `
    },
    {
      path: '@/src/webgl/particle/particle.frag',
      src: `

varying vec4 parVel;
varying vec2 vUv;
uniform sampler2D picture;
uniform float opacity;

void main() {

    vec4 rainbow = parVel;

// vec4 outputColor = vec4(
//         (rainbow.x + 0.6),
//         (rainbow.y * rainbow.x + 0.6),
//         (rainbow.y + 0.6),
//         0.25
//     );
// outputColor.xyz = clamp(outputColor.xyz, vec3(0.0), vec3(1.0));
    vec4 imgColor = texture2D(picture, vUv);

    vec4 outputColor = vec4(0.5, 0.5, 0.5, opacity) * imgColor;

    gl_FragColor = outputColor;
}

`
    },
    {
      path: '@/src/webgl/particle/velocitySim.frag',
      src: `

uniform float time;
uniform vec2 mouse;
float constrain(float val, float min, float max) {
    if (val < min) {
        return min;
    } else if (val > max) {
        return max;
    } else {
        return val;
    }
}

vec3 getDiff (in vec3 lastPos, in vec3 mousePos) {
  vec3 diff = lastPos.xyz / 33.3 - mousePos;
  float distance = constrain(length(diff), 5.0, 100.0);
  float strength = 0.35 / (distance * distance);

  diff = normalize(diff);
  diff = diff * strength * -2.0;

  return diff;
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec4 lastVel = texture2D( velTex, uv );
    vec4 lastPos = texture2D( posTex, uv );

    vec3 diff = getDiff( lastPos.xyz, vec3(mouse, 0.1) );
    lastVel.xyz += diff * 15.0;

    gl_FragColor = lastVel;
}
`
    },
    {
      path: '@/src/webgl/particle/positionSim.frag',
      src: `

#include <common>

//  Classic Perlin 3D Noise
//  by Stefan Gustavson
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 *
      vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

#define M_PI 3.1415926535897932384626433832795
float atan2(in float y, in float x) {
  bool xgty = (abs(x) > abs(y));
  return mix(M_PI/2.0 - atan(x,y), atan(y,x), float(xgty));
}
vec3 fromBall(float r, float az, float el) {
  return vec3(
    r * cos(el) * cos(az),
    r * cos(el) * sin(az),
    r * sin(el)
  );
}
void toBall(vec3 pos, out float az, out float el) {
  az = atan2(pos.y, pos.x);
  el = atan2(pos.z, sqrt(pos.x * pos.x + pos.y * pos.y));
}

// float az = 0.0;
// float el = 0.0;
// vec3 noiser = vec3(lastVel);
// toBall(noiser, az, el);
// lastVel.xyz = fromBall(1.0, az, el);

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec4 lastVel = texture2D( velTex, uv );
    vec4 lastPos = texture2D( posTex, uv );

    float az = 0.0;
    float el = 0.0;
    vec3 noiser = vec3(lastPos);

    noiser += rand(lastVel.xy) * 0.0000001;

    // noiser += cnoise(lastPos.xy) * 2.5;
    // noiser += sin(lastPos.x * 0.3) * 2.5;
    // noiser += sin(lastPos.y * 0.3) * 2.5;

    toBall(noiser, az, el);
    lastPos.xyz = fromBall(65.0, az, el);
    lastPos.xyz += lastVel.xyz;

    gl_FragColor = lastPos;
}


`
    }
  ]
}
