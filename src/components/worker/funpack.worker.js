import configer from './config'
import webpack from 'webpack'
import path from 'path'
var MemoryFileSystem = require('memory-fs')

var entryBase = '/src'
var outputBase = '/dist'
var configObj = configer({ entryBase, outputBase, fastMini: true })

var complier = webpack(configObj)
var mfs = new MemoryFileSystem()

complier.resolvers.normal.fileSystem = mfs
complier.resolvers.context.fileSystem = mfs
complier.inputFileSystem = mfs
complier.outputFileSystem = mfs

var files = [
  {
    path: '/main.js',
    src: `
      console.log('');
    `
  }
]

files.forEach((src) => {
  mfs.writeFileSync(path.join(entryBase, src.path), src.content)
})

function runCompile ({ compiler }) {
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      // console.log(compiler.outputFileSystem)
      if (err) {
        reject(err)
      } else {
        resolve({ mfs: compiler.outputFileSystem })
      }
    })
  })
}

runCompile().then(() => {
  postMessage('done', { mfs })
})
