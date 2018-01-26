const document = typeof window !== 'undefined'
  ? window.document
  : require('domino').createWindow().document

const appendChild = (el, childs) => {
  if (!Array.isArray(childs)) return
  for (let i = 0; i < childs.length; i++) {
    let node = childs[i]
    if (Array.isArray(node)) {
      appendChild(el, node)
      continue
    }

    if (typeof node === 'number' ||
      typeof node === 'boolean' ||
      typeof node === 'function' ||
      node instanceof Date ||
      node instanceof RegExp) {
      node = node.toString()
    }

    if (typeof node === 'string') {
      if (/^[\n\r\s]+$/.test(node)) continue
      if (el.lastChild && el.lastChild.nodeName === '#text') {
        el.lastChild.nodeValue += node
        continue
      }
      node = document.createTextNode(node)
    }

    if (node && node.nodeType) {
      el.appendChild(node)
    }
  }
}

module.exports = appendChild
