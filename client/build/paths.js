var appRoot = 'src/';
var outputRoot = 'dist/';
var exporSrvtRoot = 'export/'

module.exports = {
  root: appRoot,
  source: appRoot + '**/**/*.ts',
  html: appRoot + '**/**/*.html',
  css: appRoot + '**/*.css',
  style: 'styles/**/*.css',
  output: outputRoot,
  exportSrv: exporSrvtRoot,
  doc: appRoot + 'doc/generated/',
  jsonDoc: appRoot + 'doc/doc.json',
  mustacheDoc: appRoot + 'doc/mustache/',
  htmlDoc: appRoot + 'doc/html/',
  //api: appRoot + 'lib/*.ts',
  api: appRoot + 'lib/test/*.ts',
  e2eSpecsSrc: 'test/e2e/src/**/*.ts',
  e2eSpecsDist: 'test/e2e/dist/',
  dtsSrc: [
    './typings/**/*.d.ts',
    './custom_typings/**/*.d.ts'
  ]
}
