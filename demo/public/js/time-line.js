var timeLine = (function() {
  var _firstDay = 0;
  var _days = 6;

  //设置当前天
  var _setCurDay = function() {};
  var _resetDragBtn = function() {
    $('.drag-left').css('visibility', (_firstDay == 0 ? 'hidden' : 'visible'));
    $('.drag-right').css('visibility', (_firstDay + 5 == _days ? 'hidden' : 'visible'));
  };
  //左侧按钮事件
  var _dragLeft = function() {
    if(_firstDay > 0) {
      $('.time-line-inner').animate({
        left: parseFloat($('.time-line-inner').css('left')) + 160
      });
      _firstDay--;
      _resetDragBtn();
    }
  };
  //右侧按钮事件
  var _dragRight = function() {
    if(_firstDay + 5 < _days) {
      $('.time-line-inner').animate({
        left: parseFloat($('.time-line-inner').css('left')) - 160
      });
      _firstDay++;
      _resetDragBtn();
    }
  };
  //插入一天
  var _insertDay = function(afterDayIndex) {
    _days++;
    var htmlAry = ['<div class="time-line-item">',
      '<div class="time-line-name">new city</div>',
      '<div class="time-line-circle">new date',
        '<div class="time-line-del"></div>',
      '</div>',
    '</div>',
    '<div class="time-line-add">',
      '<div class="time-line-add-content"></div>',
    '</div>'];
    $('.time-line-add:eq(' + afterDayIndex + ')').after($(htmlAry.join('')));
    _initAddFun();
    afterInsertDay(afterDayIndex);
  };
  //删除一天
  var _delDay = function() {};

  //初始化添加一天按钮
  var _initAddFun = function() {
    $('.time-line-add').unbind('click').each(function(index, element) {
      $(element).click(function() {
        _insertDay(index);
      })
    });
  };

  var afterInsertDay = function() {};
  var afterSetCurDay = function() {};
  var afterDelDay = function() {};

  //设置或修改某日的城市名称
  var setCityName = function() {};

  //时间轴初始化
  var init = function() {
    $('.drag-left').click(function() {
      _dragLeft();
    });
    $('.drag-right').click(function() {
      _dragRight();
    });
    _resetDragBtn();
    _initAddFun();
  };
  return {
    init: init,
    setCityName: setCityName,
    afterInsertDay: afterInsertDay,
    afterSetCurDay: afterSetCurDay,
    afterDelDay: afterDelDay
  }
}).call(this)