/* AdminJKJ $.jkj.form
 * ==========================
 * @作者 尹喜晨
 * @日期 2017-10-20
 * 
 * 修改日志：
 * 
 */
/*! 表单联动
 *  $.fn.jkj('cxselect',options)调用
 */
$.jkj.cxselect = function (options, selector) {
	this.settings = $.extend(true, {}, $.jkj.cxselect.defaults, options);
	this.selector = selector;
	this.init();
};
$.extend($.jkj.cxselect, {
	// 默认配置信息
	defaults: {
		// 下拉选框组
		selects: [],
		// 列表数据文件路径，或设为对象			
		url: null,
		// 无数据状态			
		nodata: null,
		// 是否为必选		
		required: false,
		// 第一个选项选项的标题		
		firstTitle: '请选择',
		// 第一个选项的值	
		firstValue: '0'
	},
	prototype: {
        // 初始化
        init: function () {
			var _root = this,  selector = _root.selector;
			$(selector).cxSelect();
        }
    },
});