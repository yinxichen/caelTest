/* AdminJKJ $.jkj.notify
 * ==========================
 * @作者 潘明星
 * @日期 2017-03-02
 * 
 * 修改日志：
 * 
 */
/*! notify 通知
 *  基于bootstrap-notify封装的通知
 * showWindow: self当前页面；parent父页面；top顶级页面；opener打开的页面
 */
$.jkj.notify = {
	_init: function (content, options, showWindow) {
		var myNotify, notify, settings;

		if (!$.notify) {
			throw new Error('$.jkj.notify 依赖 bootstrap-notify');
		}

		settings = {
			offset: {
				x: 15,
				y: 5
			},
			spacing: 2,
			template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0} alert-dismissible" role="alert">' +
			'<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
			'<span data-notify="icon"></span> ' +
			'<span data-notify="title">{1}</span> ' +
			'<span data-notify="message">{2}</span>' +
			'<div class="progress" data-notify="progressbar">' +
			'<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
			'</div>' +
			'<a href="{3}" target="{4}" data-notify="url"></a>' +
			'</div>'
		};
		notify = $.notify;
		if (showWindow !== 'self') {
			if (showWindow === 'parent') {
				if (window.parent !== window.self) {
					notify = window.parent.window.$.notify;
				}
			}
			else if (showWindow === 'top') {
				if (window.top !== window.self) {
					notify = window.top.window.$.notify;
				}
			}
			else if (showWindow === 'opener') {
				if (window.top === window.self && window.opener != null) {
					notify = window.opener.window.$.notify;
				}
			}
		}
		options = $.extend(true, settings, options);
		myNotify = notify(content, options);

		return myNotify;
	},
	showError: function (content, options, showWindow) {
		var myNotify, settings;

		showWindow = showWindow || 'self';
		settings = {
			type: 'danger',
			delay: 0
		};
		options = $.extend(true, settings, options);
		myNotify = this._init(content, options, showWindow);

		return myNotify;
	},
	showInfo: function (content, options, showWindow) {
		var myNotify, settings;

		showWindow = showWindow || 'self';
		settings = {
			type: 'info',
			delay: 3000
		};
		options = $.extend(true, settings, options);
		myNotify = this._init(content, options, showWindow);

		return myNotify;
	},
	showSuccess: function (content, options, showWindow) {
		var myNotify, settings;

		showWindow = showWindow || 'self';
		settings = {
			type: 'success',
			delay: 3000
		};
		options = $.extend(true, settings, options);
		myNotify = this._init(content, options, showWindow);

		return myNotify;
	},
	showWarning: function (content, options, showWindow) {
		var myNotify, settings;

		showWindow = showWindow || 'self';
		settings = {
			type: 'warning'
		};
		options = $.extend(true, settings, options);
		myNotify = this._init(content, options, showWindow);

		return myNotify;
	}
};


/* AdminJKJ $.jkj.cleverNotify
 * ==========================
 * @作者 潘明星
 * @日期 2017-10-13
 * 
 * 修改日志：
 * 
 */
/*! cleverNotify 灵动消息通知、提示
 *  $.jkj.cleverNotify.[error|info|success|warning]调用
 */
$.jkj.cleverNotify = function (options, params, element) {
	if (!$.notify) {
		throw new Error('$.jkj.cleverNotify 初始化失败，未引用bootstrap-notify插件！');
	}
	if (options.page === 'parent') {
		var cleverNotify = window.parent === window.self ? this : window.parent.window.$.jkj.cleverNotify;

		options.page = 'self';
		return new cleverNotify(options, params, element);
	}
	else if (options.page === 'top') {
		var cleverNotify = window.top === window.self ? this : window.top.window.$.jkj.cleverNotify;

		options.page = 'self';
		return new cleverNotify(options, params, element);
	}
	this.settings = $.extend(true, {}, $.jkj.cleverNotify.defaults, options),
	this.params = params,
	this.element = element,
	this.id = null,
	this.notify = null,
	this.init();
};
$.extend($.jkj.cleverNotify, {
	// 默认配置信息
	defaults: {
		// 消息类型。['danger' | 'info' | 'success' | 'warning']
		type: 'info',
		// 是否显示进度条
		showProgressbar: false,
		/**
		 * 消息放置的页面。['self' | 'parent' | 'top']
		 * self： 当前页面
		 * parent：父页面
		 * top：顶级页面
		 */
		page: 'self',
		/**
		 * 显示位置
		 * from：['top' | 'bottom']
		 * align：['left' | 'center' | 'right']
		 */
		placement: {
			from: 'top',
			align: 'right'
		},
		// 消息靠边缘的间隔，居中显示时x轴无效
		offset: {
			x: 15,
			y: 5
		},
		// 消息间上下间隔像素
		spacing: 2,
		// Z轴的值
		z_index: 1031,
		// 实例化方法被调用时回调该方法
		onShow: null,
		// 消息显示到用户界面时回调该方法
		onShowed: null,
		// 消息关闭回调该方法
		onClose: null,
		// 消息关闭完成后回调该方法
		onClosed: null,
		// 消息模板。{0} = type；{1} = title；{2} = message；{3} = url；{4} = target
		template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0} alert-dismissible" role="alert">' +
		'<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
		'<span data-notify="icon"></span> ' +
		'<span data-notify="title">{1}</span> ' +
		'<span data-notify="message">{2}</span>' +
		'<div class="progress" data-notify="progressbar">' +
		'<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
		'</div>' +
		'<a href="{3}" target="{4}" data-notify="url"></a>' +
		'</div>',

	},
	// 设置默认配置信息
	setDefaults: function (settings) {
		$.extend($.jkj.cleverNotify.defaults, settings);
	},
	prototype: {
		// 消息初始化
		init: function () {
			var _root = (this), settings = (_root.settings), element = (_root.element);
			var pageData = $.jkj.data.page, util = $.jkj.util;

			_root.id = 'notify' + util.random.getLongDateString();
			pageData.notifies = pageData.notifies || [];

			_root.notify = $.notify(_root.params, settings);

			pageData.notifies.push(_root);

		},
		// 关闭遮罩层
		close: function () {
			var index, _root = (this), settings = (_root.settings), element = (_root.element);
			var pageData = $.jkj.data.page, util = $.jkj.util;

			_root.notify.close();
			$(pageData.notifies).each(function (i, item) {
				if (item.id === this.id) {
					index = i;
					return false;
				}
			});
			$(pageData.notifies).splice(index, 1);
		},
		// 设置消息的内容
		setContent: function (content) {
			var _root = (this);

			_root.notify.update('message', content);
		}
	},
	// 根据id获取消息
	get: function (id) {
		var notify, notifies;

		notifies = $.jkj.data.page.notifies || [];
		//在当前页面查找
		$(notifies).each(function (i, item) {
			if (item.id === id) {
				notify = item;
				return false;
			}
		});
		//如果当前页面没有，到父页面查找
		if (!notify) {
			if (window.parent !== window.self) {
				notifies = window.parent.window.$.jkj.data.page.notifies || [];
				$(notifies).each(function (i, item) {
					if (item.id === id) {
						notify = item;
						return false;
					}
				});
			}
			//如果父页面没有，到顶级页面查找
			if (!notify) {
				if (window.top !== window.self && window.top !== window.parent) {
					notifies = window.top.window.$.jkj.data.page.notifies || [];
					$(notifies).each(function (i, item) {
						if (item.id === id) {
							notify = item;
							return false;
						}
					});
				}
			}
		}

		return notify;
	},
	// 错误消息
	error: function (message, options, page) {
		var myNotify, settings, params = {};

		settings = {
			type: 'danger',
			page: page || 'self',
			delay: 0
		};
		options = $.extend(true, settings, options);
		params.message = message;
		myNotify = new $.jkj.cleverNotify(options, params);

		return myNotify;
	},
	// 一般消息
	info: function (message, options, page) {
		var myNotify, settings, params = {};

		settings = {
			type: 'info',
			page: page || 'self',
			delay: 3000
		};
		options = $.extend(true, settings, options);
		params.message = message;
		myNotify = new $.jkj.cleverNotify(options, params);

		return myNotify;
	},
	// 成功消息
	success: function (message, options, page) {
		var myNotify, settings, params = {};

		settings = {
			type: 'success',
			page: page || 'self',
			delay: 3000
		};
		options = $.extend(true, settings, options);
		params.message = message;
		myNotify = new $.jkj.cleverNotify(options, params);

		return myNotify;
	},
	// 警告消息
	warning: function (message, options, page) {
		var myNotify, settings, params = {};

		settings = {
			type: 'warning',
			page: page || 'self'
		};
		options = $.extend(true, settings, options);
		params.message = message;
		myNotify = new $.jkj.cleverNotify(options, params);

		return myNotify;
	},
	// 移除指定遮罩层
	remove: function (id) {
		var notify = this.get(id);

		if (notify != null) {
			notify.close();
		}
	},
	// 移除所有遮罩层(遮罩层，动效遮罩层)
	removeAll: function () {
		var notifies = $.jkj.data.page.notifies || [];

		//移除当前页
		$(notifies).each(function (i, item) {
			item.close();
		});
		//移除父页面
		if (window.parent !== window.self) {
			notifies = window.parent.window.$.jkj.data.page.notifies || [];
			$(notifies).each(function (i, item) {
				item.close();
			});
		}
		//移除top页面
		if (window.top !== window.self && window.top !== window.parent) {
			notifies = window.top.window.$.jkj.data.page.notifies || [];
			$(notifies).each(function (i, item) {
				item.close();
			});
		}
	}
});