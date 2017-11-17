/* AdminJKJ $.jkj.modal
 * ==========================
 * @作者 李睿
 * @日期 2017-03-08
 * 
 * 修改日志：
 * 
 */
/*! modal 模态框
 *  基于bootstrap modal封装的模态框
 */
$.jkj.modal = function () {

    //默认配置
    var modals = []; //模态框集合
    var settings = {
        id: null, //模态框id
        cssClass: '', //模态框格外class
        header: true, //是否需要header
        footer: true, //是否需要footer
        title: '标题', //标题
        width: null, //模态框宽度
        content: null, //模态框内容可以是,string，function，或者ajax参数对象
        backdrop: 'static', //是否需要背景遮罩层，boolean值，true，false或'static'，如果值为'static'则遮罩层点击不会关闭
        keyboard: true, //是否需要esc键关闭模态框
        buttons: [{
            label: '取消', //按钮文本
            cssClass: 'btn-cancel', //按钮额外class
            hotKey: 'cancel', //按钮逻辑类型，取消逻辑(cancel)，
            action: function (modal) { //按钮点击回调

            }
        },
        {
            label: '确定', //按钮文本
            cssClass: 'btn-primary', //按钮额外class
            action: function (modal) { //按钮点击回调

            }
        }
        ]
    };

    /**
     * 创建模态框
     * @param options
     * @returns {void|Mixed|jQuery|HTMLElement}
     * @private
     */
    var _createModal = function (options) {
        var $modal = $('<div class="modal fade" role="dialog" aria-hidden="true"></div>');
        $modal.addClass(options.cssClass);
        $modal.prop('id', options.id);
        $modal.attr('aria-labelledby', options.id + '_title');
        return $modal;
    };

    /**
     * 创建模态框dialog
     * @param options
     * @returns {void|Mixed|jQuery|HTMLElement}
     * @private
     */
    var _createModalDialog = function (options) {
        var $modalDialog = $('<div class="modal-dialog" role="document"></div>');
        if (options.width) {
            $modalDialog.css('width', options.width);
        }
        return $modalDialog;
    };

    /**
     * 创建模态框content
     * @param options
     * @returns {void|Mixed|jQuery|HTMLElement}
     * @private
     */
    var _createModalContent = function (options) {
        var $content = $('<div class="modal-content"></div>');
        $content.append($('<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
            '<span aria-hidden="true">&times;</span>' +
            '</button>'));
        return $content;
    };

    /**
     * 生成动态内容
     * @returns {*}
     * @param options
     */
    var _createDynamicContent = function (options, $body) {
        var oldContent = options.content,
            newContent = null;

        //ajax默认参数
        var ajaxOptions = {
            type: "GET",
            dataType: "html",
            beforeSend: null,
            async: false,//是否异步加载默认同步
            layer: false,//是否需要进度遮罩层,默认false
            layerMessage: '加载中...',//进度遮罩层默认提示语
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                var errorInfo = '错误信息:' + textStatus + ",捕获的异常对象:" + errorThrown;
                //默认错误处理
                $.jkj.notify.showError(errorInfo, {
                    z_index: 1199
                });
                //关闭遮罩层
                if (ajaxOptions.layer && _layer) {
                    _layer.close();
                }
            }
        };

        $.extend(true, ajaxOptions, oldContent, true);

        var _layer;
        if (ajaxOptions.layer) {
            _layer = $.jkj.layer.loadingZone($('#' + options.id).find('.modal-dialog'), ajaxOptions.layerMessage);
        }

        var _success = oldContent.success; //业务逻辑成功回调
        var _fail = oldContent.fail; //业务逻辑错误回调
        ajaxOptions.success = function (data, textStatus, jqXHR) {

            if (ajaxOptions.async) {//异步

                $body.parents('#' + options.id).on('shown.bs.modal', function () {
                    //默认业务逻辑成功处理
                    newContent = data;

                    //设置模态框内容
                    _setModalBody(options, newContent);

                    //逻辑成功处理回调
                    if (typeof _success === 'function') {
                        _success($('#' + options.id)); //参数为modal对象
                    }

                    //关闭遮罩层
                    if (ajaxOptions.layer && _layer) {
                        _layer.close();
                    }
                });

            } else {//同步
                //默认业务逻辑成功处理
                newContent = data;

                //关闭遮罩层
                if (ajaxOptions.layer && _layer) {
                    _layer.close();
                }
            }
        };

        if (ajaxOptions.beforeSend && !ajaxOptions.beforeSend()) {
            return false;
        }

        $.ajax(ajaxOptions);

        return $(newContent);
    };

    /**
     * 创建模态框header
     * @param options
     * @returns {void|Mixed|jQuery|HTMLElement}
     * @private
     */
    var _createModalHeader = function (options) {
        if (options.header) {
            var $header = $('<div class="modal-header"></div>');
            var $title = $('<h4 class="modal-title"></h4>');
            $title.append(options.title);
            $title.prop('id', options.id + '_title');

            $header.append($title);
            return $header;
        }
    };

    /**
     * 创建模态框body
     * @param options
     * @private
     */
    var _createModalBody = function (options) {
        var $body = $('<div class="modal-body"></div>');
        var $content = '';

        if (typeof options.content === 'function') {
            $content = options.content.call(this);
        } else if (typeof options.content === 'string') {
            $content = options.content;
        } else if (!(options.content instanceof Array) && options.content instanceof Object) {
            $content = _createDynamicContent(options, $body);
        }

        return $body.append($content);
    };

    /**
     * 设置模态框body
     * @param options
     * @param content
     * @private
     */
    var _setModalBody = function (options, content) {
        var $body = $('#' + options.id).find('.modal-body');
        $body.append($(content));
    };

    /**
     * 创建模态框footer
     * @param options
     * @returns {void|Mixed|jQuery|HTMLElement}
     * @private
     */
    var _createModalFooter = function (options) {
        if (!options.footer) {
            return $('');
        }
        var $footer = $('<div class="modal-footer"></div>');

        if (options.buttons === 'false') {
            return $footer;
        } else if (options.buttons instanceof Array) {
            $.each(options.buttons, function (index, item) {
                var $btn = $('<button type="button" class="btn"></button>');
                $btn.html(item.label);
                $btn.addClass(item.cssClass);
                if (item.hotKey === 'cancel') {
                    $btn.attr('data-dismiss', 'modal');
                }
                $btn.click(function () {
                    if (item.action instanceof Function) {
                        item.action($('#' + options.id));
                    }
                });
                $footer.append($btn);
            });
        }

        return $footer;
    };

    /**
     * 弹出模态框
     * @param options
     * @returns {*}
     * @private
     */
    var _show = function (options) {
        var _modal;
        var tempSettings = {};
        tempSettings = $.extend(true, tempSettings, settings); //防止多次调用修改默认参数
        tempSettings.remote = true;
        options = $.extend(tempSettings, options);

        options.id = $.jkj.util.random.getLongDateString(); //生成随机id

        //拼接modal html
        var $content = _createModalContent(options)
            .append(_createModalHeader(options))
            .append(_createModalBody(options))
            .append(_createModalFooter(options));

        var $modal = _createModal(options)
            .append(_createModalDialog(options)
                .append($content));

        _modal = $modal.modal(options);
        modals.push(_modal);

        _handleModalEvents(options, $modal);

        return _modal;
    };

    /**
     * 弹出本地模态框
     * @param element
     * @param options
     * @returns {*|jQuery}
     * @private
     */
    var _showLocalModal = function (element, options) {
        var _modal;
        var tempSettings = {};
        tempSettings = $.extend(true, tempSettings, settings); //防止多次调用修改默认参数
        options = $.extend(tempSettings, options);
        _modal = $(element).modal(options);
        return _modal;
    };

    /**
     * 确认弹出框
     * @param message
     * @param ok
     * @param cancel
     * @private
     */
    function _confirm(message, ok, cancel) {
        return _show({
            title: '操作提示',
            width: '450px',
            content: message,
            buttons: [
                {
                    label: '取消', //按钮文本
                    cssClass: 'btn-cancel', //按钮额外class
                    hotKey: 'cancel', //按钮逻辑类型，取消逻辑(cancel)，
                    action: function (modal) { //按钮点击回调
                        if (cancel instanceof Function) {
                            cancel();
                        }
                    }
                },
                {
                    label: '确定', //按钮文本
                    cssClass: 'btn-primary', //按钮额外class
                    hotKey: 'cancel', //按钮逻辑类型，取消逻辑(cancel)
                    action: function (modal) { //按钮点击回调
                        if (ok instanceof Function) {
                            ok();
                        }
                    }
                }
            ]
        });
    }

    /**
     * 监听modal事件
     * @param modal
     * @param options
     * @private
     */
    var _handleModalEvents = function (options, modal) {

        //监听模态框完全关闭事件
        $(modal).on('hidden.bs.modal', function (event) {
            if ($('body > .modal.in').length == 0) {
                $(modal).remove();
            }
            else {
                $(modal).remove();
                $("body").addClass("modal-open");
            }

        });

        //监听模态框展示完成事件
        $(modal).on('shown.bs.modal', function () {
            if (!options.async) { //同步
                //逻辑成功处理回调
                var _success = options.content.success;
                if (typeof _success === 'function') {
                    _success($('#' + options.id)); //参数为modal对象
                }
            }
        });
    };

    /**
     * 关闭模态框
     * @param element 为空则关闭所有本控件弹出的模态框
     * @private
     */
    var _hide = function (element) {
        if (element === undefined || element == null) {
            //关闭所有模态框
            $.each(modals, function (index, item) {
                $(item).modal('hide');
            });
        } else {
            $(element).modal('hide');
        }

    };

    return {
        show: function (options) {
            return _show(options);
        },
        showLocalModal: function (element, options) {
            return _showLocalModal(element, options);
        },
        confirm: function (message, ok, cancel) {
            return _confirm(message, ok, cancel);
        },
        hide: function (element) {
            _hide(element);
        }
    };
}();


/* AdminJKJ $.jkj.beeModal
 * ==========================
 * @作者 潘明星
 * @日期 2017-11-04
 * 
 * 修改日志：
 * 
 */
/*! beeModal 小蜜蜂模态框
 *  $.fn.jkj('beeModal',options)调用
 */
$.jkj.beeModal = function (options, selector) {
    this.settings = $.extend(true, {}, $.jkj.beeModal.defaults, options),
        this.selector = selector,
        this.modal = null,
        this.layer = this.settings.url ? $.jkj.pureLayer.loading() : null,
        this.init();
};
$.extend($.jkj.beeModal, {
    // 默认配置信息
    defaults: {
        // 模态框id
        id: null,
        // 模态框自定义class
        class: '',
        // 模态框内容。可以是,string，function
        content: null,
        // 启用关闭
        enableCloser: true,
        // 启用头部
        enableHeader: true,
        // 启用脚部
        enableFooter: true,
        // 启用淡入淡出
        fade: true,
        // 标题。启用header时有效
        title: '标题',
        // 模态框宽度
        width: null,
        // 远程。字符串或者function
        url: null,
        // 是否需要背景遮罩层，boolean值，true，false或'static'，如果值为'static'则遮罩层点击不会关闭
        backdrop: 'static',
        // 是否需要esc键关闭模态框
        keyboard: true,
        // 脚部按钮集
        buttons: [
            {
                // 按钮文本
                label: '取消',
                // 按钮class
                class: 'btn-cancel',
                // 按钮逻辑类型，取消逻辑(cancel)
                hotKey: 'cancel',
                // 按钮点击回调
                click: function (e, context) {

                }
            },
            {
                // 按钮文本
                label: '确定', //按钮文本
                // 按钮class
                class: 'btn-primary',
                // 按钮点击回调
                click: function (e, context) {

                }
            }
        ],
        // 模板
        templates: {
            // 模态框外壳
            modal: function (context) {
                var $modal = $('<div id="" class="modal" tabindex="-1" role="dialog" aria-labelledby=""></div>');

                $modal.prop('id', context.id);
                $modal.attr('aria-labelledby', context.id + '-title');
                if (context.settings.fade) {
                    $modal.addClass('fade');
                }
                if (context.settings.class && context.settings.class.length > 0) {
                    $modal.addClass(context.settings.class);
                }

                return $modal;
            },
            // 对话框外壳
            dialog: function (context) {
                var $dialog = $('<div class="modal-dialog" role="document"></div>');

                $dialog.prop('id', context.id + '-dialog');
                if (context.settings.width) {
                    $dialog.css('width', context.settings.width);
                }

                return $dialog;
            },
            // 内容
            content: function (context) {
                var $content = $('<div class="modal-content"></div>');

                $content.prop('id', context.id + '-content');
                if (context.settings.enableCloser) {
                    $content.append(
                        '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                        '    <span aria-hidden="true">&times;</span>' +
                        '</button>');
                }

                return $content;
            },
            // 内容头部
            header: function (context) {
                var $header = $('<div class="modal-header"></div>'),
                    $title = $('<h4 class="modal-title"></h4>');

                $title.html(context.settings.title);
                $header.append($title);
                $header.prop('id', context.id + '-header');

                return $header;
            },
            // 内容体
            body: function (context) {
                var $body = $('<div class="modal-body"></div>');

                $body.prop('id', context.id + '-body');
                if ($.isFunction(context.settings.content)) {
                    $body.append(context.settings.content.call(context));
                } else {
                    $body.append(context.settings.content);
                }

                return $body;
            },
            // 内容脚部
            footer: function (context) {
                var $footer = $('<div class="modal-footer"></div>');

                $footer.prop('id', context.id + '-footer');
                if (context.settings.buttons instanceof Array) {
                    $.each(context.settings.buttons, function (index, item) {
                        var $btn = $('<button type="button" class="btn"></button>');
                        $btn.html(item.label || '未定义');
                        $btn.addClass(item.class || '');
                        if (item.hotKey === 'cancel') {
                            $btn.attr('data-dismiss', 'modal');
                        }
                        if ($.isFunction(item.click)) {
                            $btn.on('click', function (e) {
                                e.preventDefault();
                                item.click.call(this, e, context);
                            });
                        }
                        $footer.append($btn);
                    });
                }

                return $footer;
            }
        }
    },
    // 设置默认配置信息
    setDefaults: function (settings) {
        $.extend($.jkj.beeModal.defaults, settings);
    },
    prototype: {
        // 初始化
        init: function () {
            var _root = this, settings = _root.settings, selector = _root.selector, options, jkjUtil = $.jkj.util;

            _root.id = settings.id || ('beeModal' + jkjUtil.random.getLongDateString());
            settings.url = settings.url ? ($.isFunction(settings.url) ? settings.url() : settings.url) : false;
            _root.__build();
            options = {
                backdrop: settings.backdrop,
                keyboard: settings.keyboard,
                remote: false,
                show: true
            };

            $('body').append(_root.$modal);

            $('#' + _root.id).on('hidden.bs.modal', function (e) {
                e.preventDefault();
                $('#' + _root.id).remove();

                if ($('body > .modal.in').length > 0) {
                    $('body').addClass('modal-open');
                }
            });

            if (settings.url) {
                $('#' + _root.id).find('.modal-body').load(settings.url, function () {
                    _root.layer.close();
                    _root.modal = _root.$modal.modal(options);
                });
            }
            else{
                _root.modal = _root.$modal.modal(options);
            }

        },
        // 移除
        hide: function () {
            var _root = this;

            $('#' + _root.id).modal('hide');
        },
        // 构建模态框
        __build: function () {
            var _root = this, settings = _root.settings, $modal, $dialog, $content;

            $modal = settings.templates.modal(_root);
            $dialog = settings.templates.dialog(_root);
            $content = settings.templates.content(_root);
            if (settings.enableHeader) {
                $content.append(settings.templates.header(_root));
            }
            $content.append(settings.templates.body(_root));
            if (settings.enableFooter) {
                $content.append(settings.templates.footer(_root));
            }
            $modal.append($dialog.append($content));

            _root.$modal = $modal;
        }
    },
    confirm: function (message, ok, cancel) {
        var options = {
            title: '操作提示',
            width: '450px',
            content: message,
            buttons: [
                {
                    label: '取消',
                    cssClass: 'btn-cancel',
                    hotKey: 'cancel',
                    click: cancel
                },
                {
                    label: '确定',
                    hotKey: 'cancel',
                    cssClass: 'btn-primary',
                    click: ok
                }
            ]
        }

        return new $.jkj.beeModal(options);
    },
    show: function (options) {
        return new $.jkj.beeModal(options);
    }
});