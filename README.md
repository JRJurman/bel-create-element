# belit

[Fork](https://github.com/shama/bel/) of a simple library for composable DOM elements using [tagged template strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).

`belit` is a library for translating template strings into DOM elements on the server and on the client.

## Example
`belit` can be used with other libraries (like `hyperx`) to create DOM trees.
```javascript
const belit = require('belit')
const hyperx = require('hyperx')

const html = hyperx(belit(), {comments: true})
const div = html`
  <div>
    <h1>This is in a DOM tree</h1>
  </div>
`
```

## Namespaces
You can pass in a namespace to properly create namespaced elements (like svg)
```javascript
const belit = require('belit')
const hyperx = require('hyperx')

const html = hyperx(belit('http://www.w3.org/2000/svg'), {comments: true})
const div = html`
  <svg height="200" width="200">
    <rect width="100" height="100" />
  </svg>
`
```

You can use the `belit.html` and `belit.svg` instead of calling the top-level function
```javascript
const belit = require('belit')
const hyperx = require('hyperx')

const html = hyperx(belit.svg, {comments: true})
const div = html`
  <svg height="200" width="200">
    <rect width="100" height="100" />
  </svg>
`
```

# original license
(c) 2016 Kyle Robinson Young. MIT License
