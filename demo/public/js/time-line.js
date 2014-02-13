var timeLine = (function() {
  var _firstDay = 0, _days = 0, _curDay = 0;
  var _dragging = false, _hasResetCurDay = false;

  //设置当前天
  var _resetDragBtn = function() {
    $('.drag-left').unbind('click').click(function() {
      _dragLeft();
    });
    $('.drag-right').unbind('click').click(function() {
      _dragRight();
    });
    $('.drag-left').css('visibility', (_firstDay == 0 ? 'hidden' : 'visible'));
    $('.drag-right').css('visibility', (_firstDay + 5 >= _days ? 'hidden' : 'visible'));
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
      _baseInit();
    }
  };
  //右侧按钮事件
  var _dragRight = function(step) {
    var step = typeof step === 'undefined' ? 1 : step;
    var len = step * 177;
    if(_firstDay + 5 < _days) {
      if(_dragging) return;
      _dragging = true;
      $('.time-line-inner').animate({
        left: '-=' + len
      }, function() {
          _dragging = false;
      });
      _firstDay++;
      _baseInit();
    }
  };

  //构造一个添加按钮的节点
  var _getAddHtml = function() {
    return ['<div class="time-line-add">',
        '<div class="time-line-add-inner">',
          '<div class="time-line-add-icon"></div>',
          '<div class="time-line-add-content"></div>',
        '</div>',
      '</div>'].join('');
  };

  //构造一个日期html
  //data: { month: 10, day: 1, city: '北京' }
  var _getDayHtml = function(data) {
    var city = data.city.replace(/,/g, '<br/>');
    var month = parseInt(data.month);
    var day = parseInt(data.day);
    day = day > 10 ? day : ('0' + day);
    var showDate = month + '.' + day;
    return ['<div class="time-line-item">',
      '<div class="time-line-name">',
        '<table><tbody><tr><td>',
        city,
        '</td></tr></tbody></table>',
      '</div>',
      '<div class="time-line-circle">',
        '<div class="time-line-date">', showDate, '</div>',
        '<div class="time-line-del"></div>',
      '</div>',
    '</div>',
      _getAddHtml()].join('');
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
    var _cityIndex = index - 1;
    var indexDate = _getDateByShow($('.time-line-date:eq(' + (index > 0 ? index - 1 : index) + ')').text());
    indexDate.setDate(indexDate.getDate() + (index > 0 ? 1 : -1));
    var dayHtml = _getDayHtml({
      month: _getShowMonthByDate(indexDate), day: _getShowDayByDate(indexDate), city: ''
    });
    $('.time-line-add:eq(' + index + ')').after($(dayHtml));
    insertDayCallback(_cityIndex + 1);
    _days++;
    _curDay = index;
    _hasResetCurDay = true;
    if(index > 0) {
      _resetNextItemDate(index);
    }
    _baseInit();
    if(_cityIndex - _firstDay >= 4) {
      _dragRight(_cityIndex - _firstDay - 3);
    }
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
    if(index == _days && _days >= 5) {
      _dragLeft();
    }
    if(_curDay === index) {
      _hasResetCurDay = true;
    }
    _resetNextItemDate(index - 1, true);
    _baseInit();
  };

  //初始化添加一天按钮
  var _initAddFun = function() {
    $('.time-line-add-icon').unbind('click').each(function(index, element) {
      $(element).click(function() {
        _insertDay(index);
      });
    });
    $('.time-line-add').unbind('mousemove').unbind('hover').mousemove(function(e) {
      var contentLeft = e.pageX - $(this).offset().left - 11;
      var addContent = $(this).find('.time-line-add-inner');
      addContent.css('left', contentLeft + 'px');
      var top = e.pageY - $(this).offset().top - 5 - 2 - 11;
      //判断如果贴近城市 或者鼠标划出+图标区域是 隐藏添加一天区域
      if(contentLeft < 0 || contentLeft > 142 - 22 || top > 0) {
        addContent.hide();
      } else {
        addContent.show();
      }
    }).hover(function() {
      $(this).find('.time-line-add-inner').show();
    }, function() {
      $(this).find('.time-line-add-inner').hide();
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
    var htmlAry = [_getAddHtml()];
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
        if(_curDay !== index) {
          _hasResetCurDay = true;
        }
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
    if(_hasResetCurDay) {
      _hasResetCurDay = false;
      setCurDayCallback(_curDay);
    }
  };

  //设置当前城市以及第一个城市的样式 及点击后切换为当前城市
  var _resetCity = function() {
    _resetCurCity();
    //设置第一项的样式
    $('.time-line-add:eq(0)').addClass('time-line-add-first');
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
    if(typeof config.setCurDayCallback === 'function') {
      setCurDayCallback = config.setCurDayCallback;
    }
  };

  //初始化基本页面代码
  var _drawFrame = function() {
    var _frameAry = ['<div class="drag-left"></div>',
      '<div class="time-line-box">',
        '<div class="time-line-inner clearfix"></div>',
      '</div>',
      '<div class="drag-right"></div>'];
    $('.time-line').html(_frameAry.join(''));
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
  var setCurDayCallback = function() {};

  //设置或修改某日的城市名称
  var setCityName = function(index, cityName) {
    cityName = cityName.replace(/,/g, '<br/>');
    if(typeof index === 'undefined' || typeof cityName === 'undefined') return;
    $('.time-line-item:eq(' + index + ')').find('.time-line-name td').html(cityName);
  };

  //时间轴初始化
  var init = function(config) {
    _drawFrame();
    _initConfig(config);
    _baseInit();
  };
  return {
    init: init,
    delDay: delDay,
    setCityName: setCityName,
    insertDay: _insertDay
  }
}).call(this)