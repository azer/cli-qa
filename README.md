## cli-qa

Command-line Questions & Answers. Supports color formatting, lists, yes/no confirmations.

![](https://cldup.com/yaS8YF7scZ.png)

## Install

```bash
$ npm install cli-qa
```

## Usage

```js
var QA = require('cli-qa')

var questions = [
  "{bold}Name:{reset}",
  { title: "Username:", default: process.env.USER },
  { title: "{bold}Favorite foods:{reset}", list: 3 },
  { key: "books", title: "{bold}Favorite books {grey}(Type as much as you want!){reset}{bold}:{reset}", list: true },
  "{bold}Additional Thoughts{reset}",
  { title: "{yellow}Favorite {green}Fruits{reset}:", commaList: true },
  { key: 'thatsAll', title: "{yellow}{bold}That's all {grey}(yes/no) {yellow}?{reset}", bool: true },
];

QA(questions, function (answers) {
  console.log(answers)
  // => {
  //      "name": "Azer",
  //      "foods": ["falafel", "babi guling", "kebab"],
  //      "favoriteBooks": ["snow", "white castle"],
  //      "thoughts": "let's go somewhere!",
  //      "thatsAll": true
  //    }
})
```

### Styling

Title and description fields can be styled with [style-format](http://github.com/azer/style-format) interface. Here is an example;

```js
QA([{ title: "{green}Yes{reset}/{red}No{reset}?", bool: true }], function (answers) {
  answers[yesNo]
  // => true or false
})
```
