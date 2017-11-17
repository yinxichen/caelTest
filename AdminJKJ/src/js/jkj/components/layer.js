/* AdminJKJ $.jkj.layer
 * ==========================
 * @作者 潘明星
 * @日期 2017-02-28
 * 
 * 修改日志：
 * 
 */
/*! layer 层 
 *  基于bootstrap模态框样式实现的遮罩层、加载层等
 */
$.jkj.layer = {
	_init: function (id, type) {
		var _layer, newlayer, pageData, util;

		pageData = $.jkj.data.page;
		util = $.jkj.util;
		id = id || ('layer' + util.random.getLongDateString());
		pageData.layers = pageData.layers || [];

		_layer = function () {
			this.id = id;
			//类型：page页面的层，zone区域的层
			this.type = type;
			//区域加载层时有效
			this.$zoneElem = null;
		};
		//模板
		_layer.prototype.templates = {
			//蒙版外壳
			wrapper: function (id) {
				var html;

				html = [];
				html.push('<div id="' + id + '" tabindex="-1" class="modal fade bs-example-modal-lg modal-primary in" ');
				html.push(' 	role="dialog" style="display: block; background-color:rgba(0,0,0,0.2)">');
				html.push('	<div class="modal-dialog modal-lg">');
				html.push('		<div class="modal-content" style="border:none;box-shadow:none;background:none;"></div>');
				html.push('	</div>');
				html.push('</div>');

				return html.join('\n');
			},
			//加载内容
			loadingContent: function (message, imgClass) {
				var html;

				html = [];
				html.push('<div class="modal-body">');
				html.push('	<div style="text-align:center;">');
				html.push('		<div class="' + imgClass + '"></div>');
				html.push('		<br/>');
				html.push('		<span id="loading-message" style="color:white">' + message + '</span>');
				html.push('	</div>');
				html.push('</div>');

				return html.join('\n');
			},
			loadingZoneContent: function (id, message, imgClass, $elem) {
				var html;

				html = [];
				html.push('<div id="' + id + '" style="background-color:rgba(0,0,0,0.2);position:absolute;top:0;left:0;z-index:10;width:100%;height:100%;">');
				html.push('	<div style="text-align:center;padding:20px 0;">');
				html.push('		<div class="' + imgClass + '"></div>');
				html.push('		<br/>');
				html.push('		<span id="loading-message" style="color:white">' + message + '</span>');
				html.push('	</div>');
				html.push('</div>');

				return html.join('\n');
			}
		};
		//关闭层
		_layer.prototype.close = function () {
			var index;

			$('body').find('#' + this.id).remove();
			$(pageData.layers).each(function (i, item) {
				if (item.id === this.id) {
					index = i;
					return false;
				}
			});
			$(pageData.layers).splice(index, 1);
			if (this.type === 'page') {
				var hasOne = false;
				$(pageData.layers).each(function (i, item) {
					if (this.type === 'page') {
						hasOne = true;
						return false;
					}
				});
				if (!hasOne) {
					$('html').css('overflow-y', 'auto');
				}
			}
			else if (this.type === 'zone') {
				this.$zoneElem.css('min-height', this.$zoneElem.data('min-height'));
			}
		};
		//设置加载层的消息
		_layer.prototype.setMessage = function (message) {
			$('body').find('#' + this.id + ' #loading-message').html(message);
		};

		newlayer = new _layer();
		pageData.layers.push(newlayer);

		return newlayer;
	},
	//根据id获取层
	get: function (id) {
		var myLayer, layers;

		myLayer = null;
		layers = $.jkj.data.page.layers || [];
		//在当前页面查找并移除指定层
		$(layers).each(function (i, item) {
			if (item.id === id) {
				myLayer = item;
				return false;
			}
		});
		//如果当前页面没有，到父页面查找并移除
		if (myLayer == null) {
			if (window.parent !== window.self) {
				layers = window.parent.window.$.jkj.data.page.layers || [];
				$(layers).each(function (i, item) {
					if (item.id === id) {
						myLayer = item;
						return false;
					}
				});
			}
			//如果父页面没有，到顶级页面查找并移除
			if (myLayer == null) {
				if (window.top !== window.self && window.top !== window.parent) {
					layers = window.top.window.$.jkj.data.page.layers || [];
					$(layers).each(function (i, item) {
						if (item.id === id) {
							myLayer = item;
							return false;
						}
					});
				}
			}
		}

		return myLayer;
	},
	//创建加载层
	loading: function (message, imgClass, id) {
		var layer, layerHtml;

		message = message || '';
		imgClass = imgClass || 'layer-loading';
		layer = this._init(id, 'page');
		layerHtml = layer.templates.wrapper(layer.id);
		$('body').append(layerHtml);
		$('body').find('#' + layer.id + ' .modal-content').append(layer.templates.loadingContent(message, imgClass));

		return layer;
	},
	//创建区域加载层
	loadingZone: function ($elem, message, imgClass, id) {
		var layer, layerHtml;

		$elem.css('position', 'relative');
		$elem.data('min-height', $elem.css('min-height'));
		$elem.css('min-height', '200px');
		message = message || '';
		imgClass = imgClass || 'layer-loading';
		layer = this._init(id, 'zone');
		layer.$zoneElem = $elem;
		layerHtml = layer.templates.loadingZoneContent(layer.id, message, imgClass, $elem);
		$elem.append(layerHtml);

		return layer;
	},
	//当前页面创建蒙版
	mask: function (id) {
		var layer, layerHtml;

		layer = this._init(id, 'page');
		layerHtml = layer.templates.wrapper(layer.id);
		$('body').append(layerHtml);

		return layer;
	},
	//父页面创建蒙版
	maskParent: function (id) {
		var parent;

		parent = window.parent === window.self ? this : window.parent.window.$.jkj.layer;

		return parent.mask(id);
	},
	//顶级页面创建蒙版
	maskTop: function (id) {
		var top;

		top = window.top === window.self ? this : window.top.window.$.jkj.layer;

		return top.mask(id);
	},
	//移除指定层
	remove: function (id) {
		var myLayer;

		myLayer = this.get(id);
		if (myLayer != null) {
			myLayer.close();
		}
	},
	//移除所有层(蒙版，加载，加载含内容)
	removeAll: function () {
		var layers;

		layers = $.jkj.data.page.layers || [];
		//移除当前页
		$(layers).each(function (i, item) {
			item.close();
		});
		//移除父页面
		if (window.parent !== window.self) {
			layers = window.parent.window.$.jkj.data.page.layers || [];
			$(layers).each(function (i, item) {
				item.close();
			});
		}
		//移除top页面
		if (window.top !== window.self && window.top !== window.parent) {
			layers = window.top.window.$.jkj.data.page.layers || [];
			$(layers).each(function (i, item) {
				item.close();
			});
		}
	},
	//设置加载层消息
	setMessage: function (id, message) {
		var myLayer;

		myLayer = this.get(id);
		myLayer.setMessage(message);
	}
};

//加载内容(当前元素内显示加载效果)
$.fn.loadWithZoneLayer = function (url, data, callback, autoClose) {
	if ($(this).length === 0) {
		return;
	}
	var myLayer;

	if (typeof autoClose !== 'boolean') {
		autoClose = true;
	}
	myLayer = $.jkj.layer.loadingZone($(this), '数据加载中...');
	if ($(this).find('.layer-content').length == 0) {
		$(this).prepend('<div class="layer-content"></div>');
	}
	return $(this).find('.layer-content').load(url, data, function (response, status, xhr) {
		if (callback) {
			if (autoClose) {
				callback.call(this, response);
				myLayer.close();
			} else {
				callback.call(this, response, myLayer);
			}
		}
		else {
			myLayer.close();
		}
	}).error(function () {
		myLayer.setMessage('系统加载失败...');
	});
};

//加载内容(带加载效果)
$.fn.loadWithPageLayer = function (url, data, callback, autoClose) {
	if ($(this).length === 0) {
		return;
	}
	var myLayer;

	if (typeof autoClose !== 'boolean') {
		autoClose = true;
	}
	myLayer = $.jkj.layer.loading('数据加载中...');
	return $(this).load(url, data, function (response, status, xhr) {
		if (callback) {
			if (autoClose) {
				callback.call(this, response);
				myLayer.close();
			} else {
				callback.call(this, response, myLayer);
			}
		}
		else {
			myLayer.close();
		}
	}).error(function () {
		myLayer.setMessage('系统加载失败...');
	});
};

/* AdminJKJ $.jkj.pureLayer
 * ==========================
 * @作者 潘明星
 * @日期 2017-10-13
 * 
 * 修改日志：
 * 
 */
/*! pureLayer 纯真遮罩层
 *  $.fn.jkj('pureLayer',options)调用
 */
$.jkj.pureLayer = function (options, element) {
	if (options.page === 'parent') {
		var pureLayer = window.parent === window.self ? this : window.parent.window.$.jkj.pureLayer;

		options.page = 'self';
		return new pureLayer(options, element);
	}
	else if (options.page === 'top') {
		var pureLayer = window.top === window.self ? this : window.top.window.$.jkj.pureLayer;

		options.page = 'self';
		return new pureLayer(options, element);
	}
	this.settings = $.extend(true, {}, $.jkj.pureLayer.defaults, options),
	this.element = element,
	this.id = null,
	this.init();
};
$.extend($.jkj.pureLayer, {
	// 默认配置信息
	defaults: {
		/**
		 * 遮罩层类型，['mask' | 'loading' | 'loadingZone' | 'loadingData' | 'loadingDataZone']
		 * mask：遮罩层
		 * loading：全屏动效遮罩层
		 * loadingZone: 区域动效遮罩层
		 * loadingData: 数据加载全屏动效遮罩层
		 * loadingDataZone：数据加载区域动效遮罩层
		 */
		type: 'mask',
		/**
		 * 遮罩层放置的页面，['self' | 'parent' | 'top']
		 * self： 当前页面
		 * parent：父页面
		 * top：顶级页面
		 */
		page: 'self',
		// 显示内容
		content: '加载中...',
		// 图片class，动效遮罩层有效
		imgClass: 'layer-loading',
		// 数据加载结合遮罩层，动效遮罩层有效
		load: {
			// 远程url
			url: null,
			// 发送的数据
			data: null,
			// 加载成功后回调的方法
			successCallBack: function (data, layer) {
				layer.close();
			},
			// 加载不成功后回调的方法
			errorCallBack: function (data, layer, status) {
				layer.setContent('系统异常...');
				setTimeout(function () {
					layer.close();
				}, 5000);
			}
		}
	},
	// 设置默认配置信息
	setDefaults: function (settings) {
		$.extend($.jkj.pureLayer.defaults, settings);
	},
	prototype: {
		// 遮罩层初始化
		init: function () {
			var _root = (this), settings = (_root.settings), element = (_root.element);
			var templates = $.jkj.pureLayer.__templates;
			var pageData = $.jkj.data.page, util = $.jkj.util;

			_root.id = 'layer' + util.random.getLongDateString();
			pageData.layers = pageData.layers || [];

			_root['__'+ settings.type]();

			pageData.layers.push(_root);

		},
		// 关闭遮罩层
		close: function () {
			var index, _root = (this), pageData = $.jkj.data.page;

			$('#' + _root.id).remove();
			$(pageData.layers).each(function (i, item) {
				if (item.id === this.id) {
					index = i;
					return false;
				}
			});
			$(pageData.layers).splice(index, 1);

			if (_root.type === 'zone') {
				_root.$zoneElem.css('min-height', _root.$zoneElem.data('min-height'));
			}
			else if (_root.type === 'mask' || _root.type === 'loading') {
				var hasOne = false;

				$(pageData.layers).each(function (i, item) {
					if (_root.type === 'mask' || _root.type === 'loading' || _root.type === 'page') {
						hasOne = true;
						return false;
					}
				});
				if (!hasOne) {
					$('html').css('overflow-y', 'auto');
				}
			}
		},
		// 设置遮罩层的消息
		setContent: function (content) {
			var _root = (this);

			$('body').find('#' + _root.id + ' #loading-content').html(content);
		},
		__mask: function(){
			var _root = (this), settings = (_root.settings), element = (_root.element);
			var templates = $.jkj.pureLayer.__templates;
			var maskHtml = templates.mask(_root.id);

			$('body').append(maskHtml);
		},
		__loading: function(){
			var _root = (this), settings = (_root.settings), element = (_root.element);
			var templates = $.jkj.pureLayer.__templates;
			var loadingHtml = templates.loading(_root.id, settings.content, settings.imgClass);

			$('body').append(loadingHtml);
		},
		__loadingZone: function(){
			var _root = (this), settings = (_root.settings), element = (_root.element);
			var templates = $.jkj.pureLayer.__templates;
			var zoneHtml = templates.zone(_root.id, settings.content, settings.imgClass);

			$(element).css('position', 'relative');
			$(element).data('min-height', $(element).css('min-height'));
			$(element).css('min-height', '200px');
			$(element).append(zoneHtml);
		},
		__loadingData: function(){
			var _root = (this), settings = (_root.settings), element = (_root.element);
			var templates = $.jkj.pureLayer.__templates;
			var loadingHtml = templates.loading(_root.id, settings.content, settings.imgClass);

			$('body').append(loadingHtml);
			$(element).load(settings.load.url, settings.load.data, function (response, status, xhr) {
				if (status === 'success') {
					if (settings.load.successCallBack) {
						settings.load.successCallBack.call(this, response, _root);
					}
				}
				else {
					if (settings.load.errorCallBack) {
						settings.load.errorCallBack.call(this, response, _root, status);
					}
				}
			});
		},
		__loadingDataZone: function(){
			var _root = (this), settings = (_root.settings), element = (_root.element);
			var templates = $.jkj.pureLayer.__templates;

			_root.__loadingZone();
			if ($(element).find('.layer-content').length == 0) {
				$(element).prepend('<div class="layer-content"></div>');
			}
			$(element).find('.layer-content').load(settings.load.url, settings.load.data, function (response, status, xhr) {
				if (status == 'success') {
					if (settings.load.successCallBack) {
						settings.load.successCallBack.call(this, response, _root);
					}
				}
				else {
					if (settings.load.errorCallBack) {
						settings.load.errorCallBack.call(this, response, _root, status);
					}
				}
			});
		}
	},
	// 根据id获取遮罩层
	get: function (id) {
		var layer, layers;

		layers = $.jkj.data.page.layers || [];
		//在当前页面查找
		$(layers).each(function (i, item) {
			if (item.id === id) {
				layer = item;
				return false;
			}
		});
		//如果当前页面没有，到父页面查找
		if (!layer) {
			if (window.parent !== window.self) {
				layers = window.parent.window.$.jkj.data.page.layers || [];
				$(layers).each(function (i, item) {
					if (item.id === id) {
						layer = item;
						return false;
					}
				});
			}
			//如果父页面没有，到顶级页面查找
			if (!layer) {
				if (window.top !== window.self && window.top !== window.parent) {
					layers = window.top.window.$.jkj.data.page.layers || [];
					$(layers).each(function (i, item) {
						if (item.id === id) {
							layer = item;
							return false;
						}
					});
				}
			}
		}

		return layer;
	},
	// 当前页面动效遮罩层
	loading: function (content, page) {
		page = page || 'self';

		return new $.jkj.pureLayer({ type: 'loading', page: page, content: content});
	},
	// 当前页面遮罩层
	mask: function (page) {
		page = page || 'self';

		return new $.jkj.pureLayer({ type: 'mask', page: page });
	},
	// 移除指定遮罩层
	remove: function (id) {
		var layer = this.get(id);

		if (layer != null) {
			layer.close();
		}
	},
	// 移除所有遮罩层(遮罩层，动效遮罩层)
	removeAll: function () {
		var layers = $.jkj.data.page.layers || [];

		//移除当前页
		$(layers).each(function (i, item) {
			item.close();
		});
		//移除父页面
		if (window.parent !== window.self) {
			layers = window.parent.window.$.jkj.data.page.layers || [];
			$(layers).each(function (i, item) {
				item.close();
			});
		}
		//移除top页面
		if (window.top !== window.self && window.top !== window.parent) {
			layers = window.top.window.$.jkj.data.page.layers || [];
			$(layers).each(function (i, item) {
				item.close();
			});
		}
	},
	// 设置加载层消息
	setContent: function (id, content) {
		var layer = this.get(id);

		layer.setMessage(content);
	},
	// 模板
	__templates: {
		// 遮罩层
		mask: function (id) {
			var html;

			html = [];
			html.push('<div id="' + id + '" tabindex="-1" class="modal fade bs-example-modal-lg modal-primary in" ');
			html.push(' role="dialog" style="display: block; background-color:rgba(0,0,0,0.2)">');
			html.push('    <div class="modal-dialog modal-lg">');
			html.push('        <div class="modal-content" style="border:none;box-shadow:none;background:none;"></div>');
			html.push('    </div>');
			html.push('</div>');

			return html.join('\n');
		},
		// 全屏动效遮罩层
		loading: function (id, content, imgClass) {
			var html;

			html = [];
			html.push('<div id="' + id + '" tabindex="-1" class="modal fade bs-example-modal-lg modal-primary in" ');
			html.push(' role="dialog" style="display: block; background-color:rgba(0,0,0,0.2)">');
			html.push('    <div class="modal-dialog modal-lg">');
			html.push('        <div class="modal-content" style="border:none;box-shadow:none;background:none;">');
			html.push('            <div class="modal-body">');
			html.push('                <div style="text-align:center;">');
			html.push('                    <div class="' + imgClass + '"></div>');
			html.push('                    <br/>');
			html.push('                    <span id="loading-content" style="color:white">' + content + '</span>');
			html.push('                </div>');
			html.push('            </div>');
			html.push('        </div>');
			html.push('    </div>');
			html.push('</div>');

			return html.join('\n');
		},
		// 区域动效遮罩层
		zone: function (id, content, imgClass) {
			var html;

			html = [];
			html.push('<div id="' + id + '" style="background-color:rgba(0,0,0,0.2);position:absolute;top:0;left:0;z-index:10;width:100%;height:100%;">');
			html.push('    <div style="text-align:center;padding:20px 0;">');
			html.push('        <div class="' + imgClass + '"></div>');
			html.push('        <br/>');
			html.push('        <span id="loading-content" style="color:white">' + content + '</span>');
			html.push('    </div>');
			html.push('</div>');

			return html.join('\n');
		}
	}
});