var timeLine = (function() {

  //设置当前天
  var _setCurDay = function() {};
  //左侧按钮事件
  var _dragLeft = function() {};
  //右侧按钮事件
  var _dragRight = function() {};
  //插入一天
  var _insertDay = function() {};
  //删除一天
  var _delDay = function() {};

  var afterInsertDay = function() {};
  var afterSetCurDay = function() {};
  var afterDelDay = function() {};

  //设置或修改某日的城市名称
  var setCityName = function() {};

  //时间轴初始化
  var init = function() {};
  return {
    init: init,
    setCityName: setCityName,
    afterInsertDay: afterInsertDay,
    afterSetCurDay: afterSetCurDay,
    afterDelDay: afterDelDay
  }
}).call(this)