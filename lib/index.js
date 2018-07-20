const converter = require('cssobj-converter')
const cssobj_core = require('cssobj-core')
const cssobj_plugin_gencss = require('cssobj-plugin-gencss')
const _ = require('lodash')

const cssobj = cssobj_core({
  plugins: [cssobj_plugin_gencss({ indent: '  ', newLine: '\n' })],
})

const stylemapper = d => {
  const key = d.key === '' ? '*' : d.key

  const map = {
    [key]: d.obj,
  }

  const oldProps = d.prevVal ? Object.keys(d.prevVal) : []
  const newProps = Object.keys(d.obj)

  oldProps.forEach(oldProp => {
    if (map[key][oldProp] === d.prevVal[oldProp]) {
      delete map[key][oldProp]
    }
  })

  _.difference(oldProps, newProps).forEach(prop => {
    map[key][prop] = 'unset'
  })

  return cssobj(map).css
}

const styleFormatter = s => {
  if (typeof s !== 'string') {
    return ''
  }
  return converter(s)
}

const outputStyles = styles => styles.join(`\n`).trim()

module.exports = (style, change) => {
  const obj = cssobj(styleFormatter(style))
  const diff = obj.update(styleFormatter(change)).diff
  let styles = []

  Object.keys(diff).forEach(dk => {
    styles = styles.concat(diff[dk].map(stylemapper))
  })

  return outputStyles(styles)
}
