## CLI Q&A

Command-line Questions & Answers. Supports color formatting, lists, yes/no confirmations.

![](https://cldup.com/yaS8YF7scZ.png)

## Install

```bash
$ npm install azer/qa
```

## Usage

```js
var NewQA = require('qa')

var QA = NewQA()
QA.ask("{white}Name:{reset}")
QA.ask({ title: "Username:", default: process.env.USER })
QA.ask({ key: "email", title: "E-Mail:", expect: { email: true } })
QA.ask({ title: "{red}Favorite foods:{reset}", list: 3 })
QA.ask({ key: "books", title: "{white}Favorite books:{reset}", list: true })
QA.ask({ title: "{yellow}Favorite {green}Fruits{reset}:", commaList: true })
QA.ask({ key: 'thatsAll', title: "{yellow}That's all, {name}? (yes/no){reset}", yesno: true })

QA.start(function (answers) {
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

### Reference

The list of available options for each question:

##### key
The key that will be used in the answers object. If not specified, [it'll be auto-generated](http://github.com/azer/variable-name)

##### title
Title of the question. [styling](http://github.com/azer/style-format) accepted.

##### list
If a numeric value is passed, user will be prompted to enter a list with expected number of lines. If true passed, the list input won't be limited.

##### commaList
Specify "true" if a comma-separated list is expected as an answer

##### yesno
Yes/no question? true/false

##### default
Default value if answer is empty.

##### expect
Specify [requirements](https://github.com/azer/validate-value#reference) for [validating](https://github.com/azer/validate-value) the user input.

##### validate
Async validation function. See tests for example.
