var toJSON = function (rows, product_id) {
  var results = { product_id: product_id, results: [] };

  var currentQuestion;

  var currentAnswer;

  var questionObject = {};

  var answers = {};

  var answer = {};

  var images = [];

  for (var i = 0; i < rows.length; i++) {
    var record = rows[i];
    console.log(record.question_id, currentQuestion, currentAnswer);
    if (
      record.question_id !== currentQuestion &&
      currentQuestion !== undefined
    ) {
      var copyAnswers = JSON.parse(JSON.stringify(answers));
      var copyAnswer = JSON.parse(JSON.stringify(answer));
      var copyQuestion = JSON.parse(JSON.stringify(questionObject));
      var copyImages = images.slice();
      copyAnswer["photos"] = copyImages;
      copyAnswers[`${currentAnswer}`] = copyAnswer;
      copyQuestion["answers"] = copyAnswers;
      results.results.push(copyQuestion);
      questionObject = {};
      answers = {};
      answer = {};
      images = [];
    }

    currentQuestion = record.question_id;

    questionObject["question_id"] = record.question_id;
    questionObject["question_body"] = record.question_body;
    questionObject["question_date"] = record.question_date;
    questionObject["asker_name"] = record.asker_name;
    questionObject["question_helpfulness"] = record.question_helpfulness;
    questionObject["reported"] = record.reported;

    if (record.id !== currentAnswer && currentAnswer !== undefined) {
      var copyImages = images.slice();
      var copyAnswer = JSON.parse(JSON.stringify(answer));
      copyAnswer["photos"] = copyImages;
      answers[`${currentAnswer}`] = copyAnswer;
      answer = {};
      images = [];
    }

    currentAnswer = record.id;

    if (record.id !== null) {
      answer["id"] = record.id;

      answer["body"] = record.body;
      answer["date"] = record.date_written;
      answer["answerer_name"] = record.answerer_name;
      answer["helpfulness"] = record.helpful;
    }

    if (record.url !== null) {
      images.push(record.url);
    }
  }

  console.log(results.results);
  return;
};
