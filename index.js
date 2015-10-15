var read = require("read-cli-input");
var loop = require("serial-loop");
var format = require("style-format");
var variable = require("variable-name");
var leftpad = require("left-pad");

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
  options.stdout.write(formatQuestion(question));

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

    if (question.default && !answer && (!answer.trim || !answer.trim())) {
      answer = question.default;
    }

    callback(answer);
  });
}

function prefixFn (question, options) {
  if (!question.list) return;

  return function (line) {
    options.stdout.write(formatPrefix(line, options));
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
    question.key = variable(clearFormat(question.title));
  }

  return question;
}

function formatQuestion (question) {
  return '  '
    + format(question.title)
    + (question.list ? '\n' : ' ');
}

function formatPrefix (line, options) {
  if (options.prefix) return options.prefix(line);
  return '    ' + (line + 1) + '. ';
}

function clearFormat (text) {
  return text.replace(/\{\w+\}/g, '');
}
