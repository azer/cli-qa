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
  { key: "name", title: "Hey! What's your name?" },
  { key: "foods", title: "What are your 3 most favorite foods?", list: 3 },
  { title: "Favorite books?", description: "Type as much as you want!", list: true }, // unlimited list input
  "Thoughts?",
  { title: "That's all?", description: "Yes/No", bool: true }
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
