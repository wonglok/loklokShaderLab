import * as Babel from '@babel/standalone/babel.js'

var umd = require('babel-plugin-transform-es2015-modules-umd')
Babel.registerPlugin('transform-es2015-modules-umd', umd)

var es6 = [
  [
    'transform-es2015-modules-umd',
    {
      exactGlobals: true
    }
  ]
]

var compile = ({ path, src }) => {
  return new Promise((resolve, reject) => {
    var output

    try {
      if (path.split('.').pop() === 'js') {
        // js
        output = Babel.transform(src, { presets: ['es2015'], plugins: [...es6], moduleId: path }).code
      } else if (path.split('.').pop() === 'json') {
        // json
        output = Babel.transform(`export default ${JSON.stringify(JSON.parse(src))};`, { presets: ['es2015'], plugins: [...es6], moduleId: path }).code
      } else if (path.split('.').pop() === 'html') {
        output = ''
      } else {
        // text
        output = Babel.transform(`export default ` + '`' + `${src}` + '`', { presets: ['es2015'], plugins: [...es6], moduleId: path }).code
      }
    } catch (e) {
      console.log(e)
      output = `
        console.log(JSON.parse("${JSON.stringify(e)}"));
      `
    }
    setTimeout(() => {
      resolve({ output })
    }, 0)
  })
}

// default files
var files = [
  {
    path: '@/main.js',
    src: `
      import app from '@/src/app.js'
      import fun from '@/src/fun.js'
      console.log(app())
      console.log(fun())
    `
  },
  {
    path: '@/src/app.vert',
    src: `
      uniform vec2 resolution;
      main () {
      }
    `
  },
  {
    path: '@/src/app.js',
    src: `
      import srcVert from '@/src/app.vert'
      console.log(srcVert);
      const getMessage = () => "Cannot read files. lol";
      export default getMessage;
    `
  },
  {
    path: '@/src/fun.js',
    src: `
      const fun = () => "Hello Fun fun World";
      export default fun;
    `
  }
]

self.onmessage = ({ data }) => {
  files = data.files || files

  Promise.all(files.map((file) => {
    return compile(file)
  })).then((all) => {
    var entry = all.reduce((accu, val, key) => {
      return accu + '\n' + val.output
    }, '')
    var rand = (Math.random() * 100000000000000).toFixed(0)
    var result = `
function OMG_${rand} () {
  var self = this;
  ${entry}
  requireJSRequire(['@/main.js'], function () {
    setTimeout(() => {
      window.top.postMessage({ type: 'requirejs-ready' }, window.location.origin);
    }, 10)
  });
}
new OMG_${rand}();
`

    postMessage({ event: 'done', js: result })
  })
}
