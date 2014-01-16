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
    var month = parseInt(data.month);
    var day = parseInt(data.day);
    day = day > 10 ? day : ('0' + day);
    var showDate = month + '.' + day;
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

  //重置某节点后的显示日期
  var _resetNextItemDate = function(index, isDel) {
    var addNum = isDel ? -1 : 1;
    $('.time-line-date:gt(' + index + ')').each(function() {
      var showDate = $(this).text();
      var date = _getDateByShow(showDate);
      date.setDate(date.getDate() + addNum);
      $(this).text(_getShowByDate(date));
    });
  };

  //插入一天
  var _insertDay = function(index) {
    var indexDate = _getDateByShow($('.time-line-date:eq(' + index + ')').text());
    indexDate.setDate(indexDate.getDate() + 1);
    var dayHtml = _getDayHtml({
      month: _getShowMonthByDate(indexDate), day: _getShowDayByDate(indexDate), city: ''
    });
    $('.time-line-add:eq(' + index + ')').after($(dayHtml));
    insertDayCallback(index + 1);
    _days++;
    _curDay = index + 1;
    _resetNextItemDate(index + 1);
    init();
  };
  //删除一天
  var delDay = function(index) {
    $('.time-line-item:eq(' + index + ')').remove();
    $('.time-line-add:eq(' + index + ')').remove();
    delDayCallback(index);
    _days--;
    //如果当前选中时间是最後一天 删除一个时间点后 调整选中时间前移
    if(_curDay + 1 > _days) {
      _curDay = _days == 0 ? 0 : (_days - 1);
    }
    _resetNextItemDate(index - 1, true);
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

  //删除确认框
  var _delDayDialog = function(index) {
    //在此添加删除确认框代码 确认成功后回调下面的删除代码
    timeLine.delDay(index);
  };

  //初始化删除按钮
  var _initDelFun = function() {
    $('.time-line-del').each(function(index, element) {
      $(element).unbind('click').click(function() {
        _delDayDialog(index);
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

  //根据月份 日期 返回对应的Date对象
  var _getDateByMonthAndDay = function(month, day) {
    month = parseInt(month);
    day = parseInt(day);
    var date = new Date();
    date.setMonth(month - 1);
    date.setDate(day);
    return date;
  };

  //根据Date对象 返回对应的月份
  var _getShowMonthByDate = function(date) {
    return date.getMonth() + 1;
  };

  //根据Date对象 返回对应的日期
  var _getShowDayByDate = function(date) {
    var day = date.getDate();
    return day > 10 ? day : ('0' + day);
  };

  //根据Date对象 返回显示的日期
  var _getShowByDate = function(date) {
    return _getShowMonthByDate(date) + '.' + _getShowDayByDate(date);
  };

  //根据显示的日期 返回Date对象
  var _getDateByShow = function(showDate) {
    var dates = showDate.split('.');
    if(dates.length === 2) {
      return _getDateByMonthAndDay(dates[0], dates[1]);
    }
    return new Date();
  };

  //绑定每一个时间点的相关功能
  var _bandItem = function() {
    $('.time-line-item').each(function(index) {
      var _item = this;
      //为item绑定data数据 方便以后使用
      var _showDate = $(_item).find('.time-line-date').text();
      var _date = _getDateByShow(_showDate);
      $(_item).data('index', index + 1).data('showDate', _showDate).data('date', _date);
      //绑定item的click事件 click后切换为选中的item
      $(_item).unbind('click').click(function() {
        _curDay = index;
        _resetCurCity();
      });
      //绑定item中日期的hover事件 鼠标划过显示Dx天 划出显示原有的日期
      $(_item).find('.time-line-date').hover(function() {
        $(this).text('D' + $(_item).data('index'));
      }, function() {
        $(this).text($(_item).data('showDate'));
      });
    });
  };

  //切换当前城市
  var _resetCurCity = function() {
    //清除已有的选中样式
    $('.time-line-item').removeClass('time-line-current');
    //设置新的选中日期
    $('.time-line-item:eq(' + _curDay + ')').addClass('time-line-current');
  };

  //设置当前城市以及第一个城市的样式 及点击后切换为当前城市
  var _resetCity = function() {
    _resetCurCity();
    //设置第一项的样式
    $('.time-line-item:eq(0)').addClass('time-line-first');
    _bandItem();
  };

  //初始化相关配置
  var _initConfig = function(config) {
    if(typeof config === 'undefined') return;
    if(config.data) {
      _initData(config.data);
    }
    if(typeof config.insertDayCallback === 'function') {
      insertDayCallback = config.insertDayCallback;
    }
    if(typeof config.delDayCallback === 'function') {
      delDayCallback = config.delDayCallback;
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

  var insertDayCallback = function() {};
  var delDayCallback = function() {};

  //设置或修改某日的城市名称
  var setCityName = function(index, cityName) {
    if(typeof index === 'undefined' || typeof cityName === 'undefined') return;
    $('.time-line-item:eq(' + index + ')').find('.time-line-name').text(cityName);
  };

  //时间轴初始化
  var init = function(config) {
    _initConfig(config);
    _baseInit();
  };
  return {
    init: init,
    delDay: delDay,
    setCityName: setCityName
  }
}).call(this)