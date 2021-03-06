/* eslint-disable no-global-assign */
if (typeof document === 'undefined') {
  document = require('domino').createWindow().document
}

const appendChild = require('./appendChild')

const COMMENT_TAG = '!--'

// filters for attributes
const isNotXMLNSprop = prop => !/^xmlns($|:)/i.test(prop)
const containsOwnProp = props => prop => Object.prototype.hasOwnProperty.call(props, prop)

// map to objects so we know their value
const toObjectList = props => prop => ({key: prop, value: props[prop]})

// transformations for attributes
const normalizeClassName = prop => prop.key.toLowerCase() === 'classname' ? ({key: 'class', value: prop.value}) : prop
const htmlForToFor = prop => prop.key === 'htmlFor' ? ({key: 'for', value: prop.value}) : prop

const addEventToElement = (element, eventKey, eventValue) => {
  element[eventKey] = eventValue
  // add event to element list of events
  element.events = element.events ? element.events.concat(eventKey) : [eventKey]
}

// handlers that can be filtered on
// if something gets processed, we return false
// otherwise, it returns true, indicating that this thing needs to be processed
const handleEventSetter = element => prop => prop.key.slice(0, 2) === 'on' ? addEventToElement(element, prop.key, prop.value) : true
const handleAttrSetter = element => prop => element.setAttributeNS(null, prop.key, prop.value)

const nanoCreateElement = (namespace) => (tag, props, children) => {
  // if the tag is a comment
  if (tag === COMMENT_TAG) {
    return document.createComment(props.comment)
  }

  // create the element
  const element = namespace ? document.createElementNS(namespace, tag) : document.createElement(tag)

  // attach the properties
  Object.keys(props)
    .filter(isNotXMLNSprop)
    .filter(containsOwnProp(props))
    .map(toObjectList(props))
    .map(normalizeClassName)
    .map(htmlForToFor)
    .filter(handleEventSetter(element))
    .filter(handleAttrSetter(element))

  appendChild(element, children)
  return element
}

module.exports = nanoCreateElement
module.exports.html = nanoCreateElement()
module.exports.svg = nanoCreateElement('http://www.w3.org/2000/svg')
