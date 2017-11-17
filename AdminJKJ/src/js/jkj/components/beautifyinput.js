/* AdminJKJ $.jkj.beautifyInput
 * ==========================
 * @作者 潘明星
 * @日期 2017-10-13
 * 
 * 修改日志：
 * 
 */
/*! beautifyInput 美化输入，用于扩展输入框功能
 *  $.fn.jkj('beautifyInput',options)调用
 */
$.jkj.beautifyInput = function (options, selector) {
    this.settings = $.extend(true, {}, $.jkj.beautifyInput.defaults, options),
        this.selector = selector,
        this.init();
};
$.extend($.jkj.beautifyInput, {
    // 默认配置信息
    defaults: {
        // 元素类型，['parent', 'self']
        type: 'parent',
        // 搜索的类，元素类型为'parent'时有效
        class: '.beautify-input',
        /**
         * 美化模式
         * 两种定义方式：
         * 1. data-beautify-models='money' 无特殊配置，多个用“,”间隔
         * 2. data-beautify-models='{money:{hasMinus: true}}' 有特殊配置
         */
        beautifyModels: 'data-beautify-models',
        // 模型参数信息
        modelInfos: {
            number: {
                // 是否有负号，默认为true
                hasMinus: true,
                // round(四舍五入)，floor(下舍入)，ceil(上舍入)，bank(银行家舍入)，默认为'round'
                roundingMode: 'round',
                // 精度
                scale: 2,
                // 千分位
                thousands: ',',
                // 启用弹出框
                enablePopover: false,
                // 显示模式，可以多个组合显示，按数组顺序自上而下显示，['number','chinese','english']
                displayModel: ['number'],
                // popover弹出框参数集，同Bootstrap弹出框（Popover）插件
                popover: {}
            },
            money: {
                // 是否有负号，默认为false
                hasMinus: false,
                // round(四舍五入)，floor(下舍入)，ceil(上舍入)，bank(银行家舍入)
                roundingMode: 'round',
                // 精度
                scale: 2,
                // 千分位
                thousands: ',',
                // 启用弹出框
                enablePopover: true,
                // 显示模式，可以多个组合显示，启用弹出框位true时有效，按数组顺序自上而下显示['number','chinese','english']
                displayModel: ['number'],
                // popover弹出框参数集，启用弹出框位true时有效，同Bootstrap弹出框（Popover）插件
                popover: {}
            },
            rate: {
                // round(四舍五入)，floor(下舍入)，ceil(上舍入)，bank(银行家舍入)
                roundingMode: 'round',
                // 精度
                scale: 4,
                // 启用弹出框
                enablePopover: false,
                // 显示模式，可以多个组合显示，启用弹出框位true时有效，按数组顺序自上而下显示['number','chinese','english']
                displayModel: ['number'],
                // popover弹出框参数集，启用弹出框位true时有效，同Bootstrap弹出框（Popover）插件
                popover: {}
            }
        }
    },
    // 设置默认配置信息
    setDefaults: function (settings) {
        $.extend($.jkj.beautifyInput.defaults, settings);
    },
    prototype: {
        // 初始化beautifyInput
        init: function () {
            var _root = this, settings = _root.settings, selector = _root.selector;

            // 循环初始化元素
            if (settings.type === 'parent') {
                $(selector).find(settings.class).each(function () {
                    _root.element(this);
                });
            }
            else {
                $(selector).each(function () {
                    _root.element(this);
                });
            }
        },
        /** 
         * 初始化元素
         * 两种定义方式：
         * 1. data-beautify-models='money' 无特殊配置，多个用“,”间隔
         * 2. data-beautify-models='{money:{hasMinus: true}}' 有特殊配置
         */
        element: function (element) {
            var _root = this, settings = _root.settings, beautifyModels, models;
            var beautifyInputInited = $(element).data('beautifyInput-inited');

            // 如果该元素初始化过，则直接跳过
            if(beautifyInputInited){
                return;
            }
            else{
                beautifyModels = $.trim($(element).attr(settings.beautifyModels));
    
                if (beautifyModels && beautifyModels[0] === '{') {
                    models = eval('(' + beautifyModels + ')');
                    $.each(models, function (model, value) {
                        var options = $.extend(true, {}, settings.modelInfos[model], value);
    
                        $.jkj.beautifyInput.models[model](element, options);
                    });
                }
                else {
                    models = beautifyModels.split(',');
                    $.each(models, function (index, model) {
                        var options;
    
                        model = $.trim(model);
                        options = $.extend(true, {}, settings.modelInfos[model]);
    
                        $.jkj.beautifyInput.models[model](element, options);
                    });
                }

                $(element).data('beautifyInput-inited', true);
            }
        }
    },
    // 添加模型
    addModel: function (name, model, options) {
        $.jkj.beautifyInput.models[name] = model;
        $.jkj.beautifyInput.defaults.modelInfos[name] = options;
    },
    // 模型对象集
    models: {
        money: function (element, options) {
            $.jkj.beautifyInput.models.number(element, options);
        },
        number: function (element, options) {
            if (options.enablePopover) {
                $.jkj.beautifyInput.popover(element, options.popover);
            }
            $(element).on('focus', { options: options }, function beautifyInput(e) {
                e.preventDefault();
                var options = (e.data.options), value = ($.trim($(this).val()));

                $(this).attr('data-lastValue', value);
                if (options.enablePopover) {
                    if (value !== '') {
                        var strNumber = value.formatNumber(options.roundingMode, options.scale, options.thousands);

                        $(this).attr('data-beautify-input', strNumber);
                    }
                    else {
                        $(this).attr('data-beautify-input', '');
                    }
                    $(this).popover('show');
                }
            }).on('blur', { options: options }, function beautifyInput(e) {
                e.preventDefault();
                var options = (e.data.options), value = ($.trim($(this).val()));

                if (value !== '') {
                    if (value === '-') {
                        $(this).val('');
                    }
                    else {
                        var strNumber = value.formatNumber(options.roundingMode, options.scale);

                        $(this).val(strNumber);
                    }
                }
                if (options.enablePopover) {
                    $(this).popover('hide');
                }

            }).on('input', { options: options }, function beautifyInput(e) {
                e.preventDefault();
                var options = (e.data.options), value = ($.trim($(this).val())), lastValue = $(this).attr('data-lastValue'), newValue;
                // 验证数值是否符合格式
                var reg = new RegExp('^(' + (options.hasMinus ? '(\\-)?' : '') + '(([1-9]\\d*)|\\d))?' + (options.scale > 0 ? '(\\.\\d{0,' + options.scale + '})?' : '') + '$');
                // 过滤非数值的符号
                newValue = value.replace(new RegExp('[^' + (options.hasMinus ? '\\-' : '') + '\\d\\.]', 'g'), '');
                newValue = newValue[0] + newValue.substring(1).replace(/-/g, '');
                // 只获取第一个有效数值部分
                if (newValue !== '' && newValue !== '-') {
                    newValue = newValue.match(new RegExp('(' + (options.hasMinus ? '(\\-)?' : '') + '(([1-9]\\d*)|\\d))?' + (options.scale > 0 ? '(\\.\\d{0,' + options.scale + '})?' : '')))[0];
                }
                // 验证是否是数值
                if (newValue === '' || (options.hasMinus && newValue === '-') || reg.test(newValue)) {
                    $(this).attr('data-lastValue', newValue);
                    if (value !== newValue) {
                        $(this).val(newValue);
                    }
                }
                else {
                    newValue = lastValue;
                    $(this).val(lastValue);
                }
                if (options.enablePopover) {
                    if (newValue !== '') {
                        if (options.hasMinus && newValue === '-') {
                            $(this).attr('data-beautify-input', '-');
                        }
                        else {
                            var strNumber = newValue.formatNumber(options.roundingMode, options.scale, options.thousands);
                            $(this).attr('data-beautify-input', strNumber);
                        }
                    }
                    else {
                        $(this).attr('data-beautify-input', '');
                        $(this).popover('hide');
                    }
                    $(this).popover('show');
                }
            });
        },
        rate: function (element, options) {
            options.hasMinus = false;
            options.thousands = '';
            $.jkj.beautifyInput.models.number(element, options);
        }
    },
    popover: function (element, options) {
        var settings;
        var defaults = {
            animation: false,
            placement: 'auto top',
            content: function () {
                return $(element).attr('data-beautify-input');
            },
            trigger: 'manual'
            //container: 'body'
        };

        settings = $.extend(true, {}, defaults, options);
        $(element).popover(settings);
    }
});