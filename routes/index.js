
/*
 * GET home page.
 */

exports.feedback = function(req, res){
  res.render('feedback');
};

exports.notice = function(req, res) {
  res.render('notice');
};

exports.timeLine = function(req, res) {
  res.render('time-line');
};