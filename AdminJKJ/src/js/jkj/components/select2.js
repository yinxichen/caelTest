// 江鹏
$.jkj.select2 = {
	_init: function (element, options) {

		if ($.fn.select2 === undefined || $.fn.select2 == null) {
			throw new Error('$.jkj.select2 init error');
		}

		var select2 = $(element).select2(options);
		return select2;
	},
	local: function (element, settings) {
		var options = {
			placeholder: "请选择",
			allowClear: true,
			language: "zh-CN",
			defaultSelected: false
		};

		$.extend(true, options, settings);
		var select2 = this._init(element, options);

		if (!options.defaultSelected) {
			select2.val(0).trigger("change");
		}

		return select2;
	},
	remote: function (element, settings) {

		var select2 = this._init(element, {});
		var url = settings.ajax.url;
		var extra = settings.ajax.extra;
		var success = settings.ajax.success;
		delete settings.ajax;

		$.getJSON(url, extra, function (data) {
			var options = {
				placeholder: "请选择",
				allowClear: true,
				language: "zh-CN",
				defaultSelected: false
			};

			$.extend(true, options, settings);
			options.data = data.list;
			select2.select2(options);

			if (!options.defaultSelected) {
				select2.val(0).trigger("change");
			}
			if ($.isFunction(success)) {
				success.call(this);
			}
		});

		return select2;
	},
	autocomplete: function (element, settings) {
		var options = {
			ajax: {
				url: "select2.json",
				dataType: 'json',
				delay: 300,
				extra: {},
				data: function (params) {
					var p = {};
					p[options.paramName] = params.term;

					if (options.pageable) {
						p.pageNumber = params.page || 1;
						p.pageSize = options.pageSize;
					}

					return p;
				},
				processResults: function (data, params) {
					var rlts = {};
					rlts.results = data.list;

					if (options.pageable) {
						params.page = params.page || 1;
						rlts.pagination = {};
						rlts.pagination.more = (params.page * data.page.pageSize) < data.page.total;
					}

					return rlts;
				},

				cache: true
			},
			escapeMarkup: function (markup) {
				return markup;
			},
			allowClear: true,
			pageable: false,
			language: "zh-CN",
			placeholder: "请选择",
			pageSize: 20,
			minimumInputLength: 1,
			maximumSelectionLength: 50,
			textFiled: "text",
			paramName: "search",
			formatResult: null,
			formatSelection: null,
			templateResult: function (repo) {
				if (repo.loading) {
					return "正在加载...";
				}

				if (!options.formatResult) {
					return repo[options.textFiled];
				}

				var r1 = options.formatResult.match(/{\w+}/g);
				var markup = options.formatResult;

				for (var i = 0; i < r1.length; i++) {
					markup = markup.replace(r1[i], repo[r1[i].substring(1, r1[i].length - 1)]);
				}

				return markup;
			},
			templateSelection: function (repo) {
				if (repo.id === '') {
					return repo.text;
				}

				if (!options.formatSelection) {
					return repo[options.textFiled];
				}

				var markup = typeof options.formatSelection === 'string' ? options.formatSelection : $.isFunction(options.formatSelection) ? options.formatSelection(repo) : '';
				var r2 = markup.match(/{\w+}/g);

				for (var i = 0; i < r2.length; i++) {
					markup = markup.replace(r2[i], repo[r2[i].substring(1, r2[i].length - 1)]);
				}

				return markup;
			}
		};

		$.extend(true, options, settings);
		var select2 = this._init(element, options);
		return select2;
	}
};

/* AdminJKJ $.jkj.easySelect
 * ==========================
 * @作者 潘明星
 * @日期 2017-10-23
 * 
 * 修改日志：
 * 
 */
/*! easySelect 简化选择
 *  $.fn.jkj('easySelect',options)调用
 *  基于select2开发
 */
$.jkj.easySelect = function (options, element) {
	if ($.fn.select2 === undefined || $.fn.select2 == null) {
		throw new Error('$.jkj.easySelect 初始化失败，未引用select2插件！');
	}
	this.settings = $.extend(true, {}, $.jkj.easySelect.defaults, options),
		this.element = element,
		// select2初始化后返回的对象
		this.select2 = null,
		// select2保存在元素data中的对象
		this.Select2 = null,
		this.init();
};
$.extend($.jkj.easySelect, {
	/**
	 * 默认配置信息
	 */
	defaults: {
		/**
		 * 初始化select2类型，['local' | 'remote' | 'suggest']
		 * local：数据本地一次性加载
		 * remote：数据通过url一次性加载
		 * suggest：数据通过url动态加载
		 */
		type: 'local',
		// 默认是否选中第一项
		defaultSelected: false,
		// 扩展数据，用于加载初始可选选项
		extraData: [],
		// 扩展数据是否总是在下拉列表显示
		alwaysDisplayExtraData: false,
		// 设置默认值，在defaultSelected后面初始化。类型可以为数值、字符串、数组（多选），默认为null。type为suggest时，只需要extraData赋值就可以
		defaultValues: null,
		// 本地搜索的字段集，多个用“,”间隔
		searchKeys: ['text'],
		// 数据通过url一次性加载，type为“remote”时有效
		remote: {
			// 请求url
			url: null,
			// 请求数据
			data: null,
			// 请求成功回调方法，this是当前easySelect对象
			success: function (data) {

			},
			// 初始化完成回调方法，this是当前easySelect对象
			completed: function () {

			}
		},
		// 数据通过url动态加载数据，type为“suggest”时有效
		suggest: {
			// 请求url，字符串或者方法函数
			url: '',
			// 预期返回数据类型
			dataType: 'json',
			// 发送请求前等待用户停止输入内容时间，单位毫秒
			delay: 300,
			// 自定义请求参数名
			paramName: 'search',
			// 是否分页
			pageable: false,
			// 每页记录数
			pageSize: 20,
			// 发送数据处理，默认实现详见私有方法__suggest内部代码
			data: null,
			// 返回结果处理，默认实现详见私有方法__suggest内部代码
			processResults: null,
			cache: false
		},
		// 显示清除值按钮
		allowClear: true,
		// 选择值之后收缩下拉列表
		closeOnSelect: true,
		/**
		 * 初始化加载数据，对象数组
		 * 1、没有子集的，[{id: id, text: text,...}...]
		 * id：必须；text：必须；disabled：可选；selected：可选；title：可选
         * 2、有子集的，[{text: text, children: [], tile: title,...}...]
         *  text：必须；children：数组，必须，嵌套包含没有子集或有子集的对象；title：可选
		 */
		data: null,
		// 启用调试信息在浏览器console里面显示
		debug: false,
		// 是否禁用选择
		disabled: false,
		// 下拉列表自动长度
		dropdownAutoWidth: false,
		// 下拉列表依附的元素，值为jquery选择器或者dom元素
		//dropdownParent: $(document.body),
		// 自动转义由自定义模板渲染的内容，默认实现详见__escapeMarkup方法
		escapeMarkup: null,
		// 国际化语言
		language: 'zh-CN',
		// 用于返回匹配查询值的结果集，默认实现详见__matcher方法
		matcher: null,
		// 最大输入长度，0为不限制
		maximumInputLength: 0,
		// 最大选择长度
		maximumSelectionLength: 50,
		// 最小输入长度触发请求
		minimumInputLength: 0,
		// 最少结果集用于搜索，设为Infinity则只能下拉选不含搜索框
		minimumResultsForSearch: 0,
		// 启用多选
		multiple: false,
		// 默认显示的内容
		placeholder: '请选择',
		// 下拉列表收缩后是否自动选择
		selectOnClose: false,
		// 查询结果集排序，默认实现详见__sorter方法
		sorter: null,
		// 启用自由输入内容，boolean / array of objects
		tags: false,
		// 自定义渲染查询结果集，默认实现详见__templateResult方法
		templateResult: null,
		// 自定义渲染选中项文本内容，默认实现详见__templateSelection方法
		templateSelection: null,
		tokenSeparators: [','],
		// 自定义容器宽度
		width: 'resolve'
	},
	// 设置默认配置信息
	setDefaults: function (settings) {
		$.extend($.jkj.easySelect.defaults, settings);
	},
	prototype: {
		// 初始化
		init: function () {
			var _root = (this), settings = (_root.settings), element = (_root.element);

			settings.escapeMarkup = settings.escapeMarkup || _root.__escapeMarkup();
			settings.matcher = settings.matcher || _root.__matcher();
			settings.sorter = settings.sorter || _root.__sorter();
			settings.templateResult = settings.templateResult || _root.__templateResult();
			settings.templateSelection = settings.templateSelection || _root.__templateSelection();

			_root['__' + settings.type]();
		},
		// 清除选中的值
		clear: function () {
			var index, _root = (this), settings = (_root.settings), element = (_root.element);

			$(element).val(null).trigger('change');
		},
		// 清除选中的值和下拉选项等
		clearAll: function(){
			var index, _root = (this), settings = (_root.settings), element = (_root.element);

			$(element).val(null).trigger('change');
			_root.Select2.$selection.find('.select2-selection__rendered').prop('title', settings.placeholder);
			_root.Select2.dataAdapter.destroy();
			$(element).empty();
		},
		/**
		 * 加载新的数据
		 * data：加载的数据
		 * clear：boolean类型，是否清除老数据
		 * defaultValue：默认值。undefined保持原来不变，null清空值，其他为字符串、数值、数组（多选）
		 */ 
		loadData: function(data, clear, defaultValue){
			var index, _root = (this), settings = (_root.settings), element = (_root.element), $option, value;

			if(clear){
				_root.clearAll();
			}
			$option = _root.Select2.dataAdapter.convertToOptions(data);
			_root.Select2.dataAdapter.addOptions($option);
			if(!(typeof defaultValue === 'undefined')){
				if(clear && (defaultValue==null)){
					_root.Select2.$selection.find('.select2-selection__rendered').prop('title', settings.placeholder);
				}
				$(element).val(defaultValue).trigger('change');
			}
		},
		// 初始化本地数据加载的select2
		__local: function () {
			var _root = (this), settings = (_root.settings), element = (_root.element);
			var data = settings.extraData.concat(settings.data);

			settings.data = data;
			_root.select2 = $(element).select2(settings);
			_root.Select2 = _root.select2.data().select2;

			if (!settings.defaultSelected) {
				$(_root.element).val(0).trigger("change");
			}
			if (settings.defaultValues) {

				$(_root.element).val(settings.defaultValues).trigger("change");
			}
		},
		// 初始化远程数据一次加载的select2
		__remote: function () {
			var _root = (this), settings = (_root.settings), element = (_root.element);

			$.getJSON(settings.remote.url, settings.remote.data, function (data) {
				if (settings.remote.success) {
					settings.remote.success.call(_root, data);
				}

				settings.data = settings.extraData.concat(data.data);
				_root.select2 = $(element).select2(settings);
				_root.Select2 = _root.select2.data().select2;

				if (!settings.defaultSelected) {
					$(_root.element).val(0).trigger("change");
				}
				if (settings.defaultValues) {
					$(_root.element).val(settings.defaultValues).trigger("change");
				}
				if (settings.remote.completed) {
					settings.remote.completed.call(_root);
				}
			});
		},
		// 初始化远程数据动态加载的select2
		__suggest: function () {
			var _root = (this), settings = (_root.settings), element = (_root.element);

			settings.minimumInputLength = 1;
			// 发送数据处理
			settings.suggest.data = settings.suggest.data || function (params) {
				var queryParameters = {};

				queryParameters[settings.suggest.paramName] = params.term;

				if (settings.suggest.pageable) {
					queryParameters.pageNumber = params.page || 1;
					queryParameters.pageSize = settings.suggest.pageSize;
				}

				return queryParameters;
			};
			// 返回结果处理
			settings.suggest.processResults = settings.suggest.processResults || function (data, params) {
				var selectData = {};

				params.page = params.page || 1;
				selectData.results = settings.alwaysDisplayExtraData ? settings.extraData.concat(data.data) : data.data;
				if (settings.suggest.pageable) {
					selectData.pagination = {};
					selectData.pagination.more = (params.page * settings.suggest.pageSize) < data.page.total;
				}

				return selectData;
			};
			settings.ajax = $.extend(true, {}, settings.suggest);
			_root.select2 = $(element).select2(settings);
			_root.Select2 = _root.select2.data().select2;
			if (settings.extraData && settings.extraData.length > 0) {
				var $option;

				$(settings.extraData).each(function (i, data) {
					data.selected = (typeof data.selected === 'undefined' || data.selected == null) ? true : data.selected;
				});
				$option = _root.Select2.dataAdapter.convertToOptions(settings.extraData);
				_root.Select2.dataAdapter.addOptions($option);
			}
		},
		// 自动转义由自定义模板渲染的内容
		__escapeMarkup: function () {
			// var _root = (this), settings = (_root.settings), element = (_root.element);
			var escapeMarkup;

			escapeMarkup = function (markup) {
				return markup;
			};

			return escapeMarkup;
		},
		// 用于返回匹配查询值的结果集
		__matcher: function () {
			var _root = (this), settings = (_root.settings), element = (_root.element);
			var matcher;

			matcher = function (params, data) {
				// 如果没有查询值，就返回原数据
				if ($.trim(params.term) === '') {
					return data;
				}

				// 对有子集的数据执行一个递归检查
				if (data.children && data.children.length > 0) {
					// 如果有子集则深度拷贝数据
					// 这就需要我们把没有匹配到的数据从对象中剔除
					var match = $.extend(true, {}, data);

					// 检查子集的每一项匹配情况
					for (var c = data.children.length - 1; c >= 0; c--) {
						var child = data.children[c];

						var matches = matcher(params, child);

						// 如果没有匹配到，从对象数组中移除该项
						if (matches == null) {
							match.children.splice(c, 1);
						}
					}

					// 如果有一项匹配，返回新的对象
					if (match.children.length > 0) {
						return match;
					}

					// 如果没有匹配的子集，检查自身
					return matcher(params, match);
				}
				var stripDiacritics = function (text) {
					function match(a) {
						return $.jkj.util.diacritics[a] || a;
					}

					return text.replace(/[^\u0000-\u007E]/g, match);
				}
				var original = (function () {
					var str = '';

					if (settings.searchKeys && settings.searchKeys.length > 0) {
						$(settings.searchKeys).each(function (index, value) {
							str += stripDiacritics(data[value]).toUpperCase() + ',';
						});
					}

					return str;
				})();
				var term = stripDiacritics(params.term).toUpperCase();

				// 检查是否包含查询内容
				if (original.indexOf(term) > -1) {
					return data;
				}

				// 如果没有包含查询内容，返回 null
				return null;
			};

			return matcher;
		},
		// 查询结果集排序
		__sorter: function () {
			// var _root = (this), settings = (_root.settings), element = (_root.element);
			var sorter;

			sorter = function (data) {
				return data;
			};

			return sorter;
		},
		// 自定义渲染查询结果集
		__templateResult: function (repo) {
			// var _root = (this), settings = (_root.settings), element = (_root.element);
			var templateResult;

			templateResult = function (repo) {
				if (repo.loading) {
					return "正在加载...";
				}

				return repo.text;
			};

			return templateResult;
		},
		// 自定义渲染选中项文本内容
		__templateSelection: function (repo) {
			// var _root = (this), settings = (_root.settings), element = (_root.element);
			var templateSelection;

			templateSelection = function (repo) {
				return repo.text;
			};

			return templateSelection;
		}
	}
});