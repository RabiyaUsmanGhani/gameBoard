const Scores = require("../models/Scores");

exports.getScores = async (req, res) => {
  var allScores = await Scores.find();
  res.send(allScores);
};

exports.addScore = async (req, res) => {
  try {
    var { name, duration, score } = req.body;
    console.log(req.body);
    var score = Scores({
      name,
      duration,
      score,
    });

    score.save();
    var allScores = await Scores.find();
    res.send(allScores);
  } catch (e) {
    res.send(e);
  }
};
