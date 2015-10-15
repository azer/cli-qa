var read = require("read-cli-input");
var loop = require("serial-loop");
var style = require("style-format");
var variable = require("variable-name");
var leftpad = require("left-pad");
var validate = require("validate-value");
var format = require("format-text");

module.exports = QA;
module.exports.normalizeQuestion = normalizeQuestion;

function QA (questions, options, callback) {
  if (arguments.length == 2) {
    callback = options;
    options = {
      stdin: process.stdin,
      stdout: process.stdout
    };
  }

  questions = questions.map(normalizeQuestion);
  var answers = {};
  options.answers = answers;

  loop(questions.length, each, function () {
    callback(answers);
  });

  function each (next, i) {
    ask(questions[i], options, function (answer) {
      answers[questions[i].key] = answer;
      next();
    });
  }
}

function ask (question, options, callback) {
  options.stdout.write(format(styleQuestion(question), options.answers));

  var readOptions = {
    stdin: options.stdin,
    lines: lines(question),
    prefix: prefixFn(question, options)
  };

  read(readOptions, function (answer) {
    if (!question.list) {
      answer = answer[0] || '';
    }

    if (question.bool) {
      answer = answer[0] == 'y';
    }

    if (question.commaList) {
      answer = commaList(answer);
    }

    var err;
    if (question.validate && (err = validate(answer, question.validate))) {
      options.stdout.write(styleError(err));
      return ask(question, options, callback);
    }

    if (question.default && isEmpty(answer)) {
      answer = question.default;
    }

    callback(answer);
  });
}

function prefixFn (question, options) {
  if (!question.list) return;

  return function (line) {
    options.stdout.write(stylePrefix(line, options));
  };
}

function lines (question) {
  if (question.list === true) {
    return 999;
  }

  if (question.list) {
    return question.list;
  }

  return 1;
}

function commaList (input) {
  return input
    .trim()
    .split(/\s*,\s*/)
    .map(function (col) {
      return col.trim();
    })
    .filter(function (col) {
      return col && col.length;
    });
}

function normalizeQuestion (question) {
  if (typeof question == "string") {
    question = { title: question };
  }

  if (!question.key) {
    question.key = variable(clearFormatting(question.title));
  }

  return question;
}

function styleQuestion (question) {
  return '  '
    + style(question.title)
    + (question.list ? '\n' : ' ');
}

function stylePrefix (line, options) {
  if (options.prefix) return options.prefix(line);
  return '    ' + (line + 1) + '. ';
}

function clearFormatting (text) {
  return text.replace(/\{\w+\}/g, '');
}

function isEmpty (str) {
  return !str && (!str.trim || !str.trim());
}

function styleError (err) {
  return style('\n  {red}{bold}Error: ' + err.message + '{reset}\n');
}
