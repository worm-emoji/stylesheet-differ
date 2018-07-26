const converter = require('cssobj-converter')
const cssobj_core = require('cssobj-core')
const cssobj_plugin_gencss = require('cssobj-plugin-gencss')
const _ = require('lodash')

const cssobj = cssobj_core({
  plugins: [cssobj_plugin_gencss({ indent: '  ', newLine: '\n' })],
})

const stylemapper = d => {
  let key = d.key === '' ? '*' : d.key
  let topKey = null

  if (d.groupText) {
    const firstChild = Object.values(d.children)[0]
    topKey = groupText
    key = firstChild.key
  } else if (d.parentRule) {
    topKey = d.parentRule.groupText
  }

  const map = {
    [key]: d.obj,
  }

  const oldProps = d.prevVal ? Object.keys(d.prevVal) : []

  // Check if rule was deleted and return the old rule but 'unset'
  if (d.__diffType === 'removed' && _.isObject(d.obj)) {
    const unsetObj = { [key]: {} }
    Object.keys(d.obj).forEach(deletedProp => {
      unsetObj[key][deletedProp] = 'unset'
    })
    return cssobj(unsetObj).css
  }

  const newProps = Object.keys(d.obj)

  oldProps.forEach(oldProp => {
    const currentValue = map[key][oldProp]
    const previousValue = d.prevVal[oldProp]
    if (currentValue === previousValue) {
      // Delete properties that are the same
      delete map[key][oldProp]
    } else if (currentValue === undefined && previousValue !== undefined) {
      // Make newly mising properties `unset`
      map[key][oldProp] = 'unset'
    }
  })

  if (topKey !== null) {
    const formattedGroup = {
      [topKey]: map,
    }
    return cssobj(formattedGroup).css
  }

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
    styles = styles.concat(
      diff[dk].map(d => ({ ...d, __diffType: dk })).map(stylemapper)
    )
  })

  return outputStyles(styles)
}
