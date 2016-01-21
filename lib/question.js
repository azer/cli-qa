var struct = require("new-struct");
var style = require("style-format");
var formatText = require("format-text");
var variable = require("variable-name");
var validateValue = require("validate-value");
var parseCommaList = require("comma-list");

var Question = struct({
  format: format,
  normalizeAnswer: normalizeAnswer,
  styleListLine: styleListLine,
  styleListLineFn: styleListLineFn,
  prompt: prompt,
  lines: lines,
  render: render,
  validate: validate
});

module.exports = NewQuestion;

function NewQuestion (QA, options) {
  if (!options) {
    throw new Error('Can not initalize a Question with no options.');
  }

  if (typeof options == 'string') {
    options = { title: options };
  }

  return (this.struct || Question)({
    QA: QA,
    key: options.key || generateKey(options),
    title: options.title,
    list: options.list,
    commaList: !!options.commaList,
    yesno: !!options.yesno,
    default: options.default,
    expect: options.expect,
    validateFn: options.validate
  });
}

function format (question) {
  return '  '
    + style(question.render(question.title))
    + (question.list ? '\n' : ' ');
}

function prompt (question, callback) {
  question.QA.write(question);
  question.QA.read(question, function (answer) {
    answer = question.normalizeAnswer(answer);

    if (isEmpty(answer) && question.default) {
      answer = question.render(question.default);
    }

    question.validate(answer, function (error) {
      if (error) return callback(error);

      callback(undefined, answer);
    });
  });
}

function normalizeAnswer (question, answer) {
  if (!question.list) {
    answer = answer[0] || '';
  }

  if (question.yesno) {
    answer = answer[0] == 'y';
  }

  if (question.commaList) {
    answer = parseCommaList(answer);
  }

  return answer;
}

function render (question, answer) {
  if (typeof answer != 'string') {
    return answer;
  }

  return formatText(answer, question.QA.context());
}

function validate (question, answer, callback) {
  var err;
  if (err = question.expect && validateValue(answer, question.expect)) {
    return callback(err);
  }

  if (question.validateFn) {
    question.validateFn(answer, callback);
  }
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

function styleListLine (question, line) {
  if (question.QA.prefixFn) return question.QA.prefixFn(line);
  return '    ' + (line + 1) + '. ';
}

function styleListLineFn (question) {
  if (!question.list) return;

  return function (line) {
    question.QA.stdout.write(question.styleListLine(line));
  };
}

function generateKey (options) {
  return variable(clearFormatting(options.title));
}

function clearFormatting (text) {
  return text.replace(/\{\w+\}/g, '');
}

function isEmpty (str) {
  return !str || (str.trim && !str.trim()) || (str.length != undefined && str.length == 0);
}
