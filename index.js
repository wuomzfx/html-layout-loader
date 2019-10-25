const fs = require('fs')
const path = require('path')
const loaderUtils = require('loader-utils')
const defaultOptions = {
  placeholder: '{{__content__}}',
  decorator: 'layout'
}

const render = (layoutPath, placeholder, source, context) => {
  try {
    var layoutHtml = fs.readFileSync(layoutPath, 'utf-8')
  } catch (error) {
    throw error
  }
  context.addDependency(layoutPath)
  return layoutHtml.replace(placeholder, source)
}

module.exports = function (source) {
  this.cacheable && this.cacheable()
  const options = Object.assign(defaultOptions, loaderUtils.getOptions(this))
  const { placeholder, decorator, layout } = options
  const reg = new RegExp(`(@${decorator}\\()(.*?)\\)`)
  const regResult = reg.exec(source)
  var callback = this.async()
  if (regResult) {
    const request = loaderUtils.urlToRequest(regResult[2])
    this.resolve('/', request, (err, rs) => {
      if (err) {
        rs = path.resolve(this.resourcePath, '../', request)
      }
      source = source.replace(regResult[0], '')
      callback(null, render(rs, placeholder, source, this))
    })
  } else if (layout) {
    callback(null, render(layout, placeholder, source, this))
  } else {
    callback(null, source)
  }
}
