var test = require("prova");
var NewQA = require("../");
var NewQuestion = require('../lib/question');

test('Creating new QA', function (t) {
  var defaults = NewQA();
  var ctx = NewQA({
    context: { yo: 'lo' }
  });

  var customIO = NewQA({
    stdin: 3.14,
    stdout: 156
  });

  t.plan(4);
  t.equal(defaults.questions.length, 0);
  t.equal(defaults.stdin, process.stdin);
  t.equal(defaults.stdout, process.stdout);
  t.equal(ctx.customContext.yo, 'lo');
});

test('Simple questions', function (t) {
  var simple = NewQA();
  simple.ask('Username');
  simple.ask('Password');
  simple.ask('Password (repeat)');
  simple.ask({
    key: 'yo',
    title: 'lo',
    default: '3.14',
    expect: { len: [2] }
  });

  t.plan(15);
  t.equal(simple.questions.length, 4);
  t.equal(simple.questions[0].key, 'username');
  t.equal(simple.questions[0].title, 'Username');
  t.notOk(simple.questions[0].list);
  t.equal(simple.questions[0].commaList, false);
  t.equal(simple.questions[0].yesno, false);
  t.notOk(simple.questions[0].default);
  t.notOk(simple.questions[0].expect);
  t.notOk(simple.questions[0].styleListLineFn());

  t.equal(simple.questions[1].key, 'password');
  t.equal(simple.questions[2].key, 'passwordRepeat');
  t.equal(simple.questions[3].key, 'yo');
  t.equal(simple.questions[3].title, 'lo');
  t.equal(simple.questions[3].default, '3.14');
  t.deepEqual(simple.questions[3].expect, { len: [2] });
});

test('List questions', function (t) {
  var qa = NewQA();
  qa.ask({
    title: 'Favorite authors',
    list: true
  });

  t.plan(2);
  t.equal(qa.questions[0].list, true);
  t.ok(qa.questions[0].styleListLineFn());
});

test('Normalizing answers', function (t) {
  var qa = NewQA();

  qa.ask('Yo');
  qa.ask({ title: 'yolo', yesno: true });
  qa.ask({
    title: 'Favorite authors',
    list: true
  });

  t.plan(3);
  t.equal(qa.questions[0].normalizeAnswer(['foo']), 'foo');
  t.equal(qa.questions[1].normalizeAnswer(['yea']), true);
  t.deepEqual(qa.questions[2].normalizeAnswer(['yo', 'lo']), ['yo', 'lo']);
});

test('Mixing contexts', function (t) {
  var qa = NewQA({
    context: { yo: 'lo' }
  });

  qa.answers = {
    user: 'azer',
    passwd: '123'
  };

  var ctx = qa.context();
  t.plan(1);
  t.deepEqual(qa.context(), {
    yo: 'lo',
    user: 'azer',
    passwd: '123'
  });
});

test('Using NewQuestion with custom struct', function (t) {
  var QA = { foo: 1 };
  var options = { title: 'yolo' };
  NewQuestion.call({ struct: custom }, QA, options);

  function custom (ctx) {
    t.equal(ctx.QA, QA);
    t.equal(ctx.key, 'yolo');
    t.end();
  }
});
