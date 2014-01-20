var CoolTag = function() {
  var _wrap, _coolSelectize, _selectize;
  /**
   * @type {{delimiter: string, persist: boolean, maxItems: number, plugins: Array, create: Function, onItemAdd: Function, onItemRemove: Function, render: {item: Function}}}
   * @private
   * selectize对象基本配置
   */
  var _selectizeConfig = {
    delimiter: ' ',
    persist: false,
    maxItems: 10,
    plugins: ['remove_button'],
    create: function(input) {
      return {
        value: input
      };
    },
    onItemAdd: function(value) {
      //增加内容后 回调
      _resetTags(value, true);
    },
    onItemRemove: function(value) {
      //删除内容后 回调
      _resetTags(value, false);
    },
    render: {
      item: function(item) {
        //覆盖默认的标签显示方式
        return _getInputTagTemplate(item.value);
      }
    }
  };

  /**
   * 构造显示在input框中的标签模版
   */
  var _getInputTagTemplate = function(val) {
    return '<div class="cool-tag cool-tag-del clearfix">' +
      '<div class="cool-tag-left"></div>' +
      '<div class="cool-tag-middle">' +
        val +
      '</div>' +
      '<div class="cool-tag-right"></div>' +
    '</div>';
  };

  /**
   * 构造显示在常用标签中的标签模版
   */
  var _getResetTagsTemplate = function(val) {
    return '<div class="cool-tag cool-tag-default clearfix">' +
      '<div class="cool-tag-left"></div>' +
      '<div class="cool-tag-middle"><em>' +
        val +
      '</em></div>' +
      '<div class="cool-tag-right"></div>' +
    '</div>';
  };

  /**
   * 添加选中的标签
   */
  var _addTags = function(values) {
    for(var i = 0; i < values.length; i++) {
      _selectize.addOption({value: values[i]});
      _selectize.addItem(values[i]);
    }
  };

  /**
   * 重置常用标签的点击操作
   */
  var _initNormalClick = function() {
    _wrap.find('.cool-tag-default .cool-tag-middle em').click(function() {
      $(this).parent().parent().removeClass('cool-tag-default').addClass('cool-tag-disabled');
      _addTags([$(this).html()]);
    });
  };

  /**
   * 检查增加或删除的标签与常用标签的对应关系
   * 如果能够对应上 则修改常用标签的选中样式
   */
  var _initTagsRelation = function(values, addFlag) {
    _wrap.find('.cool-tag-middle em').unbind('click').each(function() {
      var clickVal = $(this).html();
      for(var i = 0; i < values.length; i++) {
        if(clickVal == values[i]) {
          $(this).parent().parent().removeClass('cool-tag-default cool-tag-disabled')
            .addClass(addFlag ? 'cool-tag-disabled' : 'cool-tag-default');
        }
      }
    });
  };

  /**
   * 增加或者删除标签后 重置标签的显示状态
   * 增加标签后 设置增加内容
   */
  var _resetTags = function(values, addFlag) {
    values = values.split(' ');
    if(values.length > 0) {
      //添加选中的标签
      if(addFlag) _addTags(values);
      //检查选中标签与常用标签的关系
      _initTagsRelation(values, addFlag);
    }
    //重置常用标签的点击操作
    _initNormalClick();

  };

  /**
   * 初始化常用标签项
   */
  var _initNormalTags = function(values) {
    values = values.split(' ');
    var content = _wrap.find('.cool-tag-for-content');
    for(var i = 0; i < values.length; i++) {
      content.append($(_getResetTagsTemplate(values[i])));
    }
  };
  /**
   * 初始化selectize基本配置
   */
  var _initCoolSelectize = function(find) {
    //初始化最外层的包裹区
    _wrap = $(find);
    //初始化selectize对象
    _coolSelectize = _wrap.find('.selectized').selectize(_selectizeConfig);
    _selectize = _coolSelectize[0].selectize;
    //初始化placeholder提示内容
    _wrap.find('.selectize-input input:first').attr('placeholder', '点击空白处输入标签');
  }
  /**
   * config = {
   *    find: '#travel-tag',
   *    normalTags: '人文 自然 海岛 度假 艺术 摄影 博物馆 历史遗迹',
   *    selTags: '人文 自然'
   *  }
   */
  var init = function(config) {
    //初始化selectize基本配置
    _initCoolSelectize(config.find);
    if(typeof config.normalTags !== 'undefined') {
      //初始化常用标签
      _initNormalTags(config.normalTags);
    }
    if(typeof config.selTags !== 'undefined') {
      //设置已选中的标签
      _resetTags(config.selTags, true);
    }
  };
  return {
    init: init
  }
};