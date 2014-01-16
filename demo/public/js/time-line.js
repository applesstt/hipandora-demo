var timeLine = (function() {
  var _firstDay = 0, _days = 0, _curDay = 0;
  var _dragging = false;

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
      if(_dragging) return;
      _dragging = true;
      $('.time-line-inner').animate({
        left: '+=177'
      }, function() {
          _dragging = false;
      });
      _firstDay--;
      init();
    }
  };
  //右侧按钮事件
  var _dragRight = function() {
    if(_firstDay + 5 < _days) {
      if(_dragging) return;
      _dragging = true;
      $('.time-line-inner').animate({
        left: '-=177'
      }, function() {
          _dragging = false;
      });
      _firstDay++;
      init();
    }
  };

  //构造一个日期html
  //data: { month: 10, day: 1, city: '北京' }
  var _getDayHtml = function(data) {
    var city = data.city;
    var showDate = data.month + '.' + data.day;
    return ['<div class="time-line-item">',
      '<div class="time-line-name">', city, '</div>',
      '<div class="time-line-circle">',
        '<div class="time-line-date">', showDate, '</div>',
        '<div class="time-line-del"></div>',
      '</div>',
    '</div>',
    '<div class="time-line-add">',
      '<div class="time-line-add-content"></div>',
    '</div>'].join('');
  };

  //插入一天
  var _insertDay = function(index) {
    var dayHtml = _getDayHtml({
      month: 10, day: 1, city: ''
    });
    $('.time-line-add:eq(' + index + ')').after($(dayHtml));
    afterInsertDay(index);
    _days++;
    _curDay = index + 1;
    init();
  };
  //删除一天
  var _delDay = function(index) {
    $('.time-line-item:eq(' + index + ')').remove();
    $('.time-line-add:eq(' + index + ')').remove();
    afterDelDay(index);
    _days--;
    _curDay = index > 0 ? index - 1 : 0;
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

  //初始化数据项
  var _initData = function(dataList) {
    _days = dataList.length;
    var htmlAry = [];
    for(var i = 0; i < dataList.length; i++) {
      htmlAry.push(_getDayHtml(dataList[i]));
    }
    $('.time-line-inner').html(htmlAry.join(''));
  };

  //重置内部宽度
  var _resizeInnerWidth = function() {
    $('.time-line-inner').css('width', _days * 177 + 200);
  };

  //设置当前城市以及第一个城市的样式 及点击后切换为当前城市
  var _resetCity = function() {
    $('.time-line-item').removeClass('time-line-current').removeClass('time-line-first');
    $('.time-line-item:eq(' + _curDay + ')').addClass('time-line-current');
    $('.time-line-item:eq(0)').addClass('time-line-first');
    $('.time-line-item').each(function(index, element) {
      $(element).data('index', index + 1).data('date', $(element).find('.time-line-date').text());
      $(element).unbind('click').click(function() {
        _curDay = index;
        _baseInit();
      });
      $(element).hover(function() {
        $(this).find('.time-line-date').text('D' + $(this).data('index'));
      }, function() {
        $(this).find('.time-line-date').text($(this).data('date'));
      });
    });
  };

  //初始化相关配置
  var _initConfig = function(config) {
    if(typeof config === 'undefined') return;
    if(config.data) {
      _initData(config.data);
    }
  };

  //初始化通用的基本设置
  var _baseInit = function() {
    _resizeInnerWidth();
    _resetDragBtn();
    _resetCity();
    _initAddFun();
    _initDelFun();
  };

  var afterInsertDay = function() {};
  var afterSetCurDay = function() {};
  var afterDelDay = function() {};

  //设置或修改某日的城市名称
  var setCityName = function() {};

  //时间轴初始化
  var init = function(config) {
    _initConfig(config);
    _baseInit();
  };
  return {
    init: init,
    setCityName: setCityName,
    afterInsertDay: afterInsertDay,
    afterSetCurDay: afterSetCurDay,
    afterDelDay: afterDelDay
  }
}).call(this)