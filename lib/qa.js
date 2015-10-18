var struct = require("new-struct");
var mix = require("mix-objects");
var NewQuestion = require("./question");
var loop = require("serial-loop");
var readInput = require("read-cli-input");
var style = require("style-format");

var QA = struct({
  ask: ask,
  context: context,
  fail: fail,
  start: start,
  write: write,
  read: read
});

module.exports = NewQA;
module.exports.QA = QA;

function NewQA (options) {
  return QA({
    questions: [],
    stdin: options && options.stdin || process.stdin,
    stdout: options && options.stdout || process.stdout,
    customContext: options && options.context
  });
}

function ask (qa, options) {
  qa.questions.push(NewQuestion(qa, options));
}

function context (qa) {
  if (!qa.customContext) return qa.answers;
  return mix({}, [qa.answers, qa.customContext]);
}

function fail (qa, error) {
  qa.stdout.write((qa.errorStyler || styleError)(error));
}

function start (qa, callback) {
  var answers = qa.answers = {};

  loop(qa.questions.length, each, function () {
    callback(answers);
  });

  function each (next, index) {
    qa.questions[index].prompt(function (error, answer) {
      if (error) {
        qa.fail(error);
        return each(next, index);
      }

      answers[qa.questions[index].key] = answer;
      next();
    });
  }
}

function read (qa, question, callback) {
  var options = {
    stdin: qa.stdin,
    lines: question.lines(),
    prefix: question.styleListLineFn()
  };

  readInput(options, callback);
}

function write (qa, question) {
  qa.stdout.write(question.format());
}

function styleError (err) {
  return style('\n  {red}{bold}Error: ' + err.message + '{reset}\n');
}
