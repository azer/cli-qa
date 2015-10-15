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
  { key: "email", title: "E-Mail:", validate: { email: true } },
  { title: "{bold}Favorite foods:{reset}", list: 3 },
  { key: "books", title: "{bold}Favorite books {grey}(Type as much as you want!){reset}{bold}:{reset}", list: true },
  { title: "{yellow}Favorite {green}Fruits{reset}:", commaList: true },
  { key: 'thatsAll', title: "{yellow}{bold}That's all {grey}(yes/no) {yellow}?{reset}", bool: true },
];

QA(questions, function (answers) {
  console.log(answers)
  // => {
  //      "name": "Azer",
  //      "username": "ak",
  //      "email": "azer@roadbeats.com",
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

### Reference

The list of available options for each question:

* key: *The key that will be used in the answers object. If not specified, [it'll be auto-generated](http://github.com/azer/variable-name).*
* title: *Title of the question. [styling](http://github.com/azer/style-format) accepted.*
* list: *Specify "true" if a numerical list is expected as an answer.*
* commaList: *Specify "true" if a comma-separated list is expected as an answer.*
* bool: *Yes/no question? true/false*
* default: *Default value if answer is empty.*
* validate: *Specify [requirements](https://github.com/azer/validate-value#reference) for [validating](https://github.com/azer/validate-value) the user input.*
