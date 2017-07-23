var test = require('tape')
var belCreateElement = require('../')
var hyperx = require('hyperx')
var document = require('global/document')
var morphdom = require('morphdom')

var h = hyperx(belCreateElement, {comments: true})

test('fire onload and unload events', function (t) {
  t.plan(2)
  var element = h`<div onload=${function (el) {
    t.equal(el.textContent, 'hi', 'fired onload')
  }} onunload=${function (el) {
    t.equal(el.textContent, 'hi', 'fired onunload')
    t.end()
  }}>hi</div>`
  var result = h`<div>
    ${element}
  </div>`
  document.body.appendChild(result)
  document.body.removeChild(result)
})

test('onload with nested existing elements', function (t) {
  t.plan(3)
  function render1 () {
    return h`<ul onload=${function () {
      t.ok(true, 'parent fired onload')
    }}><li>hi</li></ul>`
  }
  function render2 () {
    return h`<ul><li onload=${function (el) {
      t.ok(true, 'nested fired onload')
    }} onunload=${function (el) {
      t.ok(true, 'nested fired onunload')
      t.end()
    }}>hi</li></ul>`
  }
  function render3 () {
    return h`<ul><li>hi</li></ul>`
  }
  var root = render1()
  document.body.appendChild(root)
  setTimeout(function () {
    morphdom(root, render2())
    setTimeout(function () {
      morphdom(root, render3())
    }, 10)
  }, 10)
})
