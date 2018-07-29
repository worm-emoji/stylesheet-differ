# stylesheet-differ

[![CircleCI](https://circleci.com/gh/lukemiles/stylesheet-differ/tree/master.svg?style=svg)](https://circleci.com/gh/lukemiles/stylesheet-differ/tree/master) [![npm](https://img.shields.io/npm/v/stylesheet-differ.svg)](https://www.npmjs.com/package/stylesheet-differ)

stylesheet-differ is a npm module that outputs the difference of two stylesheets as valid css. 

It works on small and large stylesheets alike, and powers the diffing capabilities of [StyleURL](https://www.styleurl.app).

Generally speaking, it's a wrapper on top of [cssobj](https://github.com/cssobj/cssobj) with some hacks to generate styles.

Removed rules and attributes result in `attr: unset` as an output.

## Usage

```js
import differ from 'stylesheet-differ'

const styleA = `body {
  color: blue;
  background-color: red;
}`;

const styleB = `body {
  color: red;
}`

const changes = differ(styleA, styleB);

//  body {
//    color: red;
//    background-color: unset;
//  }
```
