const fs = require('fs')
const path = require('path')
const loaderUtils = require('loader-utils')
const defaultOptions = {
  placeholder: '{{__content__}}',
  decorator: 'layout'
}

module.exports = function (source) {
  this.cacheable && this.cacheable()
  const options = Object.assign(loaderUtils.getOptions(this), defaultOptions)
  const { placeholder, decorator } = options
  let { layout } = options
  const reg = new RegExp(`(@${decorator}\\()(.*?)\\)`)
  const regResult = reg.exec(source)
  if (regResult) {
    layout = path.resolve(this.resourcePath, '../', path.normalize(regResult[2]))
    source = source.replace(regResult[0], '')
  }
  if (!layout) {
    return source
  }
  try {
    var layoutHtml = fs.readFileSync(layout, 'utf-8')
  } catch (error) {
    return source
  }
  return layoutHtml.replace(placeholder, source)
}
