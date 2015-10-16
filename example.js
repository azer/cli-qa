var NewQA = require('./');

var QA = NewQA();
QA.ask("{white}Name:{reset}");
QA.ask({ title: "Username:", default: process.env.USER });
QA.ask({ title: "E-Mail:", expect: { email: true } });
QA.ask({ title: "{red}Favorite foods:{reset}", list: 3 });
QA.ask({ key: "books", title: "{white}Favorite books:{reset}", list: true });
QA.ask("{white}Additional Thoughts{reset}");
QA.ask({ title: "{yellow}Favorite {green}Fruits{reset}:", commaList: true });
QA.ask({ key: 'thatsAll', title: "{yellow}That's all, {name}? (yes/no){reset}", yesno: true });

QA.start(function (answers) {
  console.log(answers);
});
