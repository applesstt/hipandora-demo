var timeLine = (function() {
  var _firstDay = 0;
  var _days = 6;

  //设置当前天
  var _setCurDay = function() {};
  var _resetDragBtn = function() {
    $('.drag-left').unbind('click').click(function() {
      _dragLeft();
    });
    $('.drag-right').unbind('click').click(function() {
      _dragRight();
    });
    $('.drag-left').css('visibility', (_firstDay == 0 ? 'hidden' : 'visible'));
    $('.drag-right').css('visibility', (_firstDay + 5 == _days ? 'hidden' : 'visible'));
  };
  //左侧按钮事件
  var _dragLeft = function() {
    if(_firstDay > 0) {
      $('.time-line-inner').animate({
        left: parseFloat($('.time-line-inner').css('left')) + 177
      });
      _firstDay--;
      init();
    }
  };
  //右侧按钮事件
  var _dragRight = function() {
    if(_firstDay + 5 < _days) {
      $('.time-line-inner').animate({
        left: parseFloat($('.time-line-inner').css('left')) - 177
      });
      _firstDay++;
      init();
    }
  };
  //插入一天
  var _insertDay = function(index) {
    var htmlAry = ['<div class="time-line-item">',
      '<div class="time-line-name">new city</div>',
      '<div class="time-line-circle">new date',
        '<div class="time-line-del"></div>',
      '</div>',
    '</div>',
    '<div class="time-line-add">',
      '<div class="time-line-add-content"></div>',
    '</div>'];
    $('.time-line-add:eq(' + index + ')').after($(htmlAry.join('')));
    afterInsertDay(index);
    _days++;
    init();
  };
  //删除一天
  var _delDay = function(index) {
    $('.time-line-item:eq(' + index + ')').remove();
    $('.time-line-add:eq(' + index + ')').remove();
    afterDelDay(index);
    _days--;
    init();
  };

  //初始化添加一天按钮
  var _initAddFun = function() {
    $('.time-line-add').unbind('click').each(function(index, element) {
      $(element).click(function() {
        _insertDay(index);
      })
    });
  };

  //初始化删除按钮
  var _initDelFun = function() {
    $('.time-line-del').each(function(index, element) {
      $(element).unbind('click').click(function() {
        _delDay(index);
      })
    })
  };

  var afterInsertDay = function() {};
  var afterSetCurDay = function() {};
  var afterDelDay = function() {};

  //设置或修改某日的城市名称
  var setCityName = function() {};

  //时间轴初始化
  var init = function() {
    _resetDragBtn();
    _initAddFun();
    _initDelFun();
  };
  return {
    init: init,
    setCityName: setCityName,
    afterInsertDay: afterInsertDay,
    afterSetCurDay: afterSetCurDay,
    afterDelDay: afterDelDay
  }
}).call(this)