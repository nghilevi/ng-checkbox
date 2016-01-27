[![NPM](https://nodei.co/npm/ng-checkbox.png?compact=true)](https://www.npmjs.com/package/ng-checkbox)

## What is ng-checkbox?

A checkbox Angular directive provides user selected data and its statistics. This component is still on development and finalizing. Any contributions are welcomed!

## [`Demo`](http://vinhnghi223.github.io/ng-checkbox/)

## Installation

```
npm install --save ng-checkbox
```

Include the file in your html

```html
<script src="node_modules/ng-checkbox/dist/ngCheckbox.js"></script>
```
Add `ngCheckbox` to your module's dependencies

```js
angular.module('MyApp', ['ngCheckbox']);
```

## Sample Usage

Inject the `ngCheckboxStatistics` factory into your controllers. Add callback(s) to `ngCheckboxStatistics`

```js
angular.module('MyApp')
.controller('myController', function($scope, ngCheckboxStatistics) {
    var onCheckboxClick = functio(stats){
        console.log('Stats object contain all the information everytime you select/unselect a checkbox: ',stats);
    }
    ngCheckboxStatistics.addListener(onCheckboxClick);
});
```

Use it in your templates, there are many variations depending on your needs (also check the Documentation, and Demo, when use right, it can be powerful), here is one small workable simple example:

```html
  <ng-checkbox groups="['luxury','fast']" count="2" sum="20000" unit="USD">Car A</ng-checkbox>
  <ng-checkbox groups="['cheap','fast']" count="2" sum="20000" unit="USD">Car B</ng-checkbox>
  ...
```

## Documentation

(To be updated)

## Want to contribute?

Anyone can help make this project better, fork it, do your changes and make a pull request!