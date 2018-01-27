const document = typeof window !== 'undefined' ? window.document : require('domino').createWindow().document

const appendChild = require('./appendChild')

const COMMENT_TAG = '!--'

// filters for attributes
const isNotXMLNSprop = prop => !/^xmlns($|:)/i.test(prop)
const containsOwnProp = props => prop => props.hasOwnProperty(prop)

// map to objects so we know their value
const toObjectList = props => prop => ({key:prop, value:props[prop]})

// transformations for attributes
const normalizeClassName = prop => prop.key.toLowerCase() === 'classname' ? ({key:'class', value:prop.value}) : prop
const htmlForToFor = prop => prop.key === 'htmlFor' ? ({key:'for', value:prop.value}) : prop

// handlers that can be filtered on
// if something gets processed, we return false (using ![])
// otherwise, it returns true, indicating that this thing needs to be processed
const handleOnAttrSetter = element => prop => prop.key.slice(0, 2) === 'on' ? ![element[prop.key] = prop.value] : true
const handleNamespaceAttrSetter = (element, namespace) => prop => namespace ? ![element.setAttributeNS(null, prop.key, prop.value)] : true
const handleAttrSetter = element => prop => element.setAttribute(prop.key, prop.value)

const belitCreateElement = (namespace) => (tag, props, children) => {
  // if the tag is a comment
  if (tag === COMMENT_TAG) {
    return document.createComment(props.comment)
  }

  // Create the element
  const element = namespace ? document.createElementNS(namespace, tag) : document.createElement(tag)

  // Attach the properties
  Object.keys(props)
    .filter(isNotXMLNSprop)
    .filter(containsOwnProp(props))
    .map(toObjectList(props))
    .map(normalizeClassName)
    .map(htmlForToFor)
    .filter(handleOnAttrSetter(element))
    .filter(handleNamespaceAttrSetter(element, namespace))
    .filter(handleAttrSetter(element))

  appendChild(element, children)
  return element
}

module.exports = belitCreateElement
module.exports.html = belitCreateElement()
module.exports.svg = belitCreateElement('http://www.w3.org/2000/svg')
