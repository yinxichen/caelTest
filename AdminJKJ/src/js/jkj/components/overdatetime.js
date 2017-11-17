/* AdminJKJ $.jkj.overDateTime
 * ==========================
 * @作者 潘明星
 * @日期 2017-11-03
 * 
 * 修改日志：
 * 
 */
/*! overDateTime 日期区间选择
 *  $.fn.jkj('overDateTime',options)调用
 */
$.jkj.overDateTime = function (options, element) {
    this.settings = $.extend(true, {}, $.jkj.overDateTime.defaults, options),
        this.element = element,
        this.datetimepicker = null,
        this.id = null,
        this.init();
};
$.extend($.jkj.overDateTime, {
    // 默认配置信息
    defaults: {
        /** 日期格式
         * p, P, h, hh, i, ii, s, ss, d, dd, m, mm, M, MM, yy, yyyy 的任意组合。
         * p：小写的(am或pm)，基于本地化
         * P：大写的(AM或PM)，基于本地化
         * s：秒，不带前导0
         * ss：秒，带前导0
         * i：分，不带前导0
         * ii：分，带前导0
         * h：时，24小时制，不带前导0
         * hh：时，24小时制，带前导0
         * H：时，12小时制，不带前导0
         * HH：时，12小时制，带前导0
         * d：日，不带前导0
         * dd：日，带前导0
         * m：月，不带前导0
         * mm：月，带前导0
         * M：月，短文本，如jan，mar
         * MM：月，全文本，如January，March
         * yy：年，两位数字
         * yyyy：年，四位数字
         */
        format: 'yyyy-mm-dd',
        // 一周从哪一天开始。0（星期日）到6（星期六）
        weekStart: 1,
        // 最小日期。默认向后50年，类型Date实例或者字符串
        startDate: false,
        // 最大日期。默认向前50年，类型Date实例或者字符串
        endDate: false,
        // 是否启用手动输入功能
        enableInput: false,
        // 启用清除功能
        enableClear: true,
        // 每周哪几天禁选，默认值''或 []，如：'0,6' 或 [0,6]
        daysOfWeekDisabled: '',
        // 选择一个日期之后是否立即关闭此日期时间选择器
        autoclose: true,
        /** 日期时间选择器打开之后首先显示的视图。 
         * 可接受的值：
         * 0 或 'hour' 小时视图
         * 1 或 'day' 日视图
         * 2 或 'month' 月视图，默认
         * 3 或 'year' 年视图
         * 4 或 'decade' 10年视图
         */
        startView: 2,
        // 日期时间选择器所能够提供的最精确的时间选择视图
        minView: 2,
        // 日期时间选择器最高能展示的选择范围视图
        maxView: 4,
        /** 是否显示“今天”按钮，默认false
         * 如果此值为true 或 "linked"，则在日期时间选择器组件的底部显示一个 "今天" 按钮用以选择当前日期。
         * 如果是true的话，"今天" 按钮仅仅将视图转到当天的日期，
         * 如果是"linked"，当天日期将会被选中。
         */
        todayBtn: false,
        // 如果为true, 高亮当前日期。
        todayHighlight: false,
        // 是否允许通过方向键改变日期。
        keyboardNavigation: true,
        // 本地化
        language: 'zh-CN',
        // 当选择器关闭的时候，是否强制解析输入框中的值。
        forceParse: false,
        // 分钟选择时，分钟的间隔数
        minuteStep: 5,
        // 设置选择器放置位置。默认值: 'bottom-right' (还支持 : 'bottom-left')
        pickerPosition: 'bottom-right',
        // 初始选择视图，默认同minView
        viewSelect: false,
        // 日或时视图时启用AM、PM选择
        showMeridian: false,
        // 初始视图选中的日期。默认当天，类型Date实例或者字符串
        initialDate: false
    },
    // 设置默认配置信息
    setDefaults: function (settings) {
        $.extend($.jkj.overDateTime.defaults, settings);
    },
    prototype: {
        // 初始化
        init: function () {
            var _root = (this), settings = (_root.settings), element = (_root.element), util = $.jkj.util;

            _root.__initSettings();
            _root.id = $(element).attr('id');
            if (!_root.id) {
                _root.id = _root.id || 'overDateTime' + util.random.getLongDateString();
                $(element).attr('id', _root.id);
            }
            if (settings.enableClear) {
                $(element).wrap('<div class="input-group overdatetime"></div>');
                $(element).parent().append(
                    '<span class="input-group-addon">' +
                    '	<span id="'+ _root.id +'remove" class="glyphicon glyphicon-remove"></span>' +
                    '</span>'
                );
                $('#' + _root.id + 'remove').on('click', function(e){
                    e.preventDefault();
                    _root.datetimepicker._setDate(null, 'date');
                });
            }

            $(element).datetimepicker(settings);
            _root.datetimepicker = $(element).data('datetimepicker');


        },
        // 移除日期时间选择器。同时移除已经绑定的event、内部绑定的对象和HTML元素。
        remove: function () {
            var _root = (this);

            $(_root.element).datetimepicker('remove');
        },
        // 显示日期时间选择器。
        show: function () {
            var _root = (this);

            $(_root.element).datetimepicker('show');
        },
        // 隐藏日期时间选择器。
        hide: function () {
            var _root = (this);

            $(_root.element).datetimepicker('hide');
        },
        // 使用当前输入框中的值更新日期时间选择器。
        update: function () {
            var _root = (this);

            $(_root.element).datetimepicker('update');
        },
        // 设置开始日期，类型(string)
        setStartDate: function (startDate) {
            var _root = (this);

            $(_root.element).datetimepicker('setStartDate', startDate);
        },
        // 设置结束日期，类型(string)
        setEndDate: function (endDate) {
            var _root = (this);

            $(_root.element).datetimepicker('setEndDate', endDate);
        },
        // 初始化设置
        __initSettings: function() {
            var _root = (this), settings = (_root.settings), element = (_root.element);

            if (!settings.startDate) {
                settings.startDate = moment().subtract(50, 'year').startOf('year').toDate();
            }
            if (!settings.endDate) {
                settings.endDate = moment().add(50, 'year').endOf('year').toDate();
            }
            if (!settings.enableInput) {
                $(element).attr('readonly', 'readonly');
            }
            if (!settings.viewSelect) {
                settings.viewSelect = settings.minView;
            }
            if (!settings.initialDate) {
                settings.initialDate = moment().startOf('day').toDate();
            }
        }
    }
});