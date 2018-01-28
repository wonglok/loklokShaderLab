import * as Babel from '@babel/standalone/babel.js'
import * as VueCompo from './vue.processor.js'

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
        resolve({ output })
      } else if (path.split('.').pop() === 'json') {
        // json
        output = Babel.transform(`export default ${JSON.stringify(JSON.parse(src))};`, { presets: ['es2015'], plugins: [...es6], moduleId: path }).code
        resolve({ output })
      } else if (path.split('.').pop() === 'html') {
        // dont include html in the js file
        output = ''
        resolve({ output })
      } else if (path.split('.').pop() === 'css') {
        // text
        let css = JSON.stringify(src)
        let code = `
          var css = ${css};
          var head = document.head || document.getElementsByTagName('head')[0];
          var style = document.createElement('style');
          style.type = 'text/css';
          if (style.styleSheet) {
            style.styleSheet.cssText = css;
          } else {
            style.appendChild(document.createTextNode(css));
          }
          head.appendChild(style);
        `

        output = Babel.transform(code + `export default ` + css, { presets: ['es2015'], plugins: [...es6], moduleId: path }).code
        resolve({ output })
      } else if (path.split('.').pop() === 'vue') {
        // vue file

        let info = VueCompo.getCompoInfo(src)
        var scopeID = 'data-s-' + (Math.ceil(Math.random() * 100000)).toString(36)
        let css = JSON.stringify(info.style)
        info.template = info.template.replace('>', `${scopeID}>`)

        let code = `
          var css = ${css};
          var head = document.head || document.getElementsByTagName('head')[0];
          var style = document.createElement('style');
          style.type = 'text/css';
          if (style.styleSheet) {
            style.styleSheet.cssText = css;
          } else {
            style.appendChild(document.createTextNode(css));
          }

          function addScope (styleElt, scopeName) {

            function process() {

              var sheet = styleElt.sheet;
              var rules = sheet.cssRules;

              for ( var i = 0; i < rules.length; ++i ) {

                var rule = rules[i];
                if ( rule.type !== 1 )
                  continue;

                var scopedSelectors = [];

                rule.selectorText.split(/\s*,\s*/).forEach(function(sel) {

                  scopedSelectors.push(scopeName+' '+sel);
                  var segments = sel.match(/([^ :]+)(.+)?/);
                  scopedSelectors.push(segments[1] + scopeName + (segments[2]||''));
                });

                var scopedRule = scopedSelectors.join(',') + rule.cssText.substr(rule.selectorText.length);
                sheet.deleteRule(i);
                sheet.insertRule(scopedRule, i);
              }
            }

            try {
              // firefox may fail sheet.cssRules with InvalidAccessError
              process();
            } catch (ex) {

              if ( ex instanceof DOMException && ex.code === DOMException.INVALID_ACCESS_ERR ) {

                styleElt.sheet.disabled = true;
                styleElt.addEventListener('load', function onStyleLoaded() {

                  styleElt.removeEventListener('load', onStyleLoaded);

                  // firefox need this timeout otherwise we have to use document.importNode(style, true)
                  setTimeout(function() {

                    process();
                    styleElt.sheet.disabled = false;
                  });
                });
                return;
              }

              throw ex;
            }
          }

          head.appendChild(style);
          if (${info.styleScoped}) {
            addScope(style, '[${scopeID}]');
          }
        `

        // inject template property into the export Object
        info.script = info.script.replace('export default {', `export default { \n\ttemplate: ${JSON.stringify(info.template)},`)

        // console.log(info)

        output = Babel.transform(code + info.script, { presets: ['es2015'], plugins: [...es6], moduleId: path }).code
        resolve({ output })
      } else {
        // text
        output = Babel.transform(`export default ` + '`' + `${src}` + '`', { presets: ['es2015'], plugins: [...es6], moduleId: path }).code
        resolve({ output })
      }
    } catch (e) {
      console.log(e)
      output = `
        console.log(JSON.parse("${JSON.stringify(e)}"));
      `
      resolve({ output })
    }
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
      return accu + '\n\n' + val.output
    }, '')
    var rand = (Math.random() * 100000000000000).toFixed(0)
    var result = `
(function(){
  function OMG_${rand} () {
    var self = this;
    ${entry}
    requireJSRequire(['@/main.js'], function () {
      // setTimeout(() => {
      //   window.top.postMessage({ type: 'requirejs-ready' }, window.location.origin);
      // }, 10);
    });
  }
  new OMG_${rand}();
}());

`

    postMessage({ event: 'done', js: result })
  })
}
