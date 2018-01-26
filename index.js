const document = typeof window !== 'undefined'
  ? window.document
  : require('domino').createWindow().document

const appendChild = require('./appendChild')

const COMMENT_TAG = '!--'

const belitCreateElement = (namespace) => (tag, props, children) => {
  let el
  let ns = namespace

  // if the tag is a comment
  if (tag === COMMENT_TAG) {
    return document.createComment(props.comment)
  }

  // Create the element
  if (ns) {
    el = document.createElementNS(ns, tag)
  } else {
    el = document.createElement(tag)
  }

  // Create the properties
  for (let p in props) {
    if (props.hasOwnProperty(p)) {
      let key = p.toLowerCase()
      const val = props[p]
      // Normalize className
      if (key === 'classname') {
        key = 'class'
        p = 'class'
      }
      // The for attribute gets transformed to htmlFor, but we just set as for
      if (p === 'htmlFor') {
        p = 'for'
      }
      // If a property prefers being set directly vs setAttribute
      if (key.slice(0, 2) === 'on') {
        el[p] = val
      } else if (/^xmlns($|:)/i.test(p)) {
        // skip xmlns definitions
      } else {
        if (ns) {
            el.setAttributeNS(null, p, val)
        } else {
          el.setAttribute(p, val)
        }
      }
    }
  }

  appendChild(el, children)
  return el
}

module.exports = belitCreateElement
module.exports.html = belitCreateElement()
module.exports.svg = belitCreateElement('http://www.w3.org/2000/svg')
