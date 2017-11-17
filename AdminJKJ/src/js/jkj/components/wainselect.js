/* AdminJKJ $.jkj.wainSelect
 * ==========================
 * @作者 潘明星
 * @日期 2017-10-26
 * 
 * 修改日志：
 * 
 */
/*! wainSelect 北斗级联选择
 *  $.fn.jkj('wainSelect',options)调用
 */
$.jkj.wainSelect = function (options, selector) {
    this.settings = $.extend(true, {}, $.jkj.wainSelect.defaults, options),
        this.selector = selector,
        this.contexts = [],
        this.init();
};
$.extend($.jkj.wainSelect, {
    // 默认配置信息
    defaults: {
        /**
         * 列表总是包含的额外数据，可以object或者[object,...]
         * object：级联控件每个都包含一样的初始数据
         * [object,...]：自定义每个控件包含的初始数据
         */
        alwaysData: null,
        // 本地数据，{level1:[{id,text}...],level2:{pid:[{id, text},...],...},level3:{pid:[{id, text},...]},...}}
        data: null,
        /**
         * 初始值，字符串、数字或者数组，数组是自定义每一项的值
         */
        defaultValues: null,
        // 隐藏控件属性信息定义，data-wainSelect-hidden="{id: '', name: ''}"，在select元素上定义，会覆盖hiddenInfos定义
        wainSelectHidden: 'data-wainSelect-hidden',
        /**
         * 隐藏控件对象数组，[{ id: '', name: ''},...]
         * id：未定义会根据name生成
         * name：未定义会根据select生成
         */
        hiddenInfos: [],
        // 远程配置
        remote: {
            // 远程url
            url: null,
            // 发送的参数
            data: null
        },
        /**
         * select2控件配置定义，可以{options}或者[{options},...]
         * {options}：级联控件所有配置一样
         * [{options},...]：自定义每个控件配置
         */
        select2Config: {}
    },
    // 设置默认配置信息
    setDefaults: function (settings) {
        $.extend($.jkj.wainSelect.defaults, settings);
    },
    prototype: {
        // 初始化wainSelect
        init: function () {
            var _root = this, settings = _root.settings, selector = _root.selector;
            var sort = 0, initElementsDeferred = $.Deferred(), parent = null;

            initElementsDeferred.done(function () {
                $(selector).each(function () {
                    var context = _root.__initContext(sort);

                    context.select = this;
                    _root.element(context);
                    _root.contexts.push(context, parent);
                    parent && (parent.child = context);
                    parent = context;
                    sort++;
                    _root.__initEvents(this);
                });
                _root.maxLevel = sort;
                $(_root.contexts[0].select).trigger('select2:select');
            });
            if (settings.remote && settings.remote.url) {
                $.getJSON(settings.remote.url, settings.remote.data, function (data) {
                    settings.data = data;
                    initElementsDeferred.resolve();
                });
            }
            else {
                initElementsDeferred.resolve();
            }
        },
        // 初始化下拉选择控件
        element: function (context, parent) {
            var _root = this;
            var select = (context.select), hiddenInfo, selectId, selectName, jkjUtil = ($.jkj.util), select2;

            selectId = $(select).attr('id');
            if (!selectId) {
                selectId = 'wainSelect' + util.random.getLongDateString();
                $(select).attr('id', selectId);
            }
            selectName = $(select).prop('name');
            // select元素id
            context.id = selectId;
            // select元素name
            context.name = selectName;
            // 父级上下文对象
            context.parent = parent;
            hiddenInfo = $(select).attr(context.wainSelectHidden);
            // 隐藏域信息
            context.hiddenInfo = (hiddenInfo ? eval('(' + hiddenInfo + ')') : context.hiddenInfo) || {};
            context.hiddenInfo.name = context.hiddenInfo.name || selectName + '_hidden';
            context.hiddenInfo.id = context.hiddenInfo.id || (context.hiddenInfo.name + jkjUtil.random.getLongDateString());
            context.hiddenInfo.value = '';

            if (context.level === 1) {
                context.select2Config.extraData = context.alwaysData;
                context.select2Config.data = context.data;
                context.select2Config.defaultValues = context.defaultValue || (context.alwaysData && context.alwaysData.length > 0 && context.alwaysData[0].id);
            }
            _root.__createHiddenElement(select, context.hiddenInfo);
            select2 = $(select).jkj('easySelect', context.select2Config);

            context.$hidden = $('#' + context.hiddenInfo.id);
            context.select2 = select2;

            $(select).data('wainSelect', context);
        },
        // 创建隐藏控件
        __createHiddenElement: function (element, hiddenInfo) {
            var hiddenHtml = '<input type="hidden" id="' + hiddenInfo.id + '" name="' + hiddenInfo.name + '" value="' + (hiddenInfo.value || '') + '" />';

            $(element).before(hiddenHtml);
        },
        // 初始化上下文
        __initContext: function (sort) {
            var _root = this, settings = _root.settings;
            var context = {};

            // 单组控件默认值
            context.defaultValue = $.isArray(settings.defaultValues) ? settings.defaultValues[sort] : settings.defaultValues;
            // 第一次加载
            context.firstLoad = true;
            // 隐藏控件信息
            context.hiddenInfo = settings.hiddenInfos && settings.hiddenInfos[sort];
            // 层级
            context.level = sort + 1;
            // 附属隐藏控件信息属性定义
            context.wainSelectHidden = settings.wainSelectHidden;
            // select2配置信息，深度拷贝防止数据窜访
            context.select2Config = ($.isArray(settings.select2Config) ? settings.select2Config[sort] : settings.select2Config) || {};
            context.select2Config = $.extend(true, {}, context.select2Config);
            // 初始化顺序
            context.sort = sort;
            // 下拉列表数据
            context.data = settings.data && settings.data[context.level];
            // 下拉列表总是显示的数据
            context.alwaysData = $.isArray(settings.alwaysData) ? settings.alwaysData[context.sort] : settings.alwaysData;
            context.alwaysData = context.alwaysData ? [context.alwaysData] : [];

            return context;
        },
        // 事件初始化
        __initEvents: function (element) {
            $(element).on('select2:select', function (e) {
                e.preventDefault();
                var wainSelect = $(this).data('wainSelect'), hiddenValue;

                // 获取下拉选择文本值并设置隐藏域值
                wainSelect.value = $(this).val();
                hiddenValue = $(this).find('[value="' + wainSelect.value + '"]').text();
                wainSelect.$hidden.val(hiddenValue);
                wainSelect.hiddenInfo.value = hiddenValue;
                // 判断是否有下级，如果有的话，加载下级选择列表数据并赋初始值
                if (wainSelect.child) {
                    var child = wainSelect.child,
                        childSelect2 = child.select2,
                        childData = child.data[(wainSelect.value || -789)] || [],
                        childAlwaysData = child.alwaysData,
                        childNewData = (childAlwaysData || []).concat(childData),
                        childFirstLoad = child.firstLoad,
                        childDefaultValue = ((childFirstLoad && child.defaultValue) || (childAlwaysData && childAlwaysData.length > 0 && childAlwaysData[0].id));

                    // 加载新数据
                    childSelect2.loadData(childNewData, true, (typeof childDefaultValue === 'undefined') ? null : childDefaultValue);
                    child.firstLoad = false;
                    $(child.select).trigger('select2:select');
                }
            });
        }
    }
});