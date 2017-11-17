$.jkj.daterangepicker = function (id, options) {
	var settings, templates, startDate, endDate, startElementId, endElementId, changedOnce;

	startDate = endDate = $.jkj.util.date.getTodayStr();
	changedOnce = false;
	settings = {
		locale: {
			applyLabel: '选择',
			cancelLabel: '清除',
			fromLabel: '起始时间',
			toLabel: '结束时间',
			weekLabel: '周',
			customRangeLabel: '自定义范围',
			daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
			monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
		},
		startDate: startDate,
		endDate: endDate,
		startElementName: 'beginDate',
		endElementName: 'endDate',
		showDropdowns: true,
		maxDate: '2250-01-01',
		format: 'YYYY-MM-DD',
		callback: function (startDate, endDate) {
			$('#' + startElementId).val(startDate.format(options.format));
			$('#' + endElementId).val(endDate.format(options.format));
			changedOnce = true;
		},
		cancelHanddle: function () {
			$(id).val('');
			$('#' + startElementId).val('');
			$('#' + endElementId).val('');
			$(id).blur();
		},
		applyHanddle: function () {
			if (!changedOnce) {
				var daterangepicker = $(id).data('daterangepicker');
				$('#' + startElementId).val(daterangepicker.startDate.format(options.format));
				$('#' + endElementId).val(daterangepicker.endDate.format(options.format));
				changedOnce = true;
			}
			$(id).blur();
		}
	};
	templates = {
		startElement: function () {
			return '<input type="hidden" id="' + startElementId + '" name="' + options.startElementName + '" value="">';
		},
		endElement: function () {
			return '<input type="hidden" id="' + endElementId + '" name="' + options.endElementName + '" value="">';
		}
	};
	options = $.extend(true, settings, options);
	id = id.trim();
	if (id.indexOf('#') < 0) {
		id = '#' + id;
	}
	startElementId = id.substring(1) + '-' + options.startElementName;
	endElementId = id.substring(1) + '-' + options.endElementName;
	$(id).after(templates.endElement());
	$(id).after(templates.startElement());

	// 控件初始化
	$(id).daterangepicker(options, options.callback)
		.on("cancel.daterangepicker", function (e) {
			options.cancelHanddle.call(this);
		}).on("apply.daterangepicker", function (e) {
			options.applyHanddle.call(this);
		});
	// 清除日期
	$(id).__proto__.clearDate = function () {
		$(id).val('');
		$('#' + startElementId).val('');
		$('#' + endElementId).val('');
		changedOnce = false;
	}
}

/* AdminJKJ $.jkj.superDateRange
 * ==========================
 * @作者 潘明星
 * @日期 2017-11-01
 * 
 * 修改日志：
 * 
 */
/*! superDateRange 日期区间选择
 *  $.fn.jkj('superDateRange',options)调用
 */
$.jkj.superDateRange = function (options, element) {
	this.settings = $.extend(true, {}, $.jkj.superDateRange.defaults, options),
		this.element = element,
		this.daterangepicker = null,
		this.id = null,
		this.hiddenIds = [],
		this.init();
};
$.extend($.jkj.superDateRange, {
	// 默认配置信息
	defaults: {
		// 本地化
		locale: {
			// 文本方向
			direction: 'ltr',
			// 格式化。常用格式YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]
			format: 'YYYY-MM-DD',
			// 双日期之间的间隔
			separator: ' 至 ',
			// 选择按钮标签
			applyLabel: '选择',
			// 清除按钮标签
			cancelLabel: '清除',
			// 周标签
			weekLabel: '周',
			// 自定义范围标签
			customRangeLabel: '自定义范围',
			// 星期本地化
			daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
			// 月份本地化
			monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
			// 每周是从周几开始
			firstDay: 1
		},
		// 开始日期，默认今天，类型 Date，moment实例，字符串
		startDate: false,
		// 结束日期，默认今天，类型 Date，moment实例，字符串
		endDate: false,
		// 是否启用默认值
		enableDefaultValues: false,
		// 是否启用手动输入功能
		enableInput: false,
		// 启用输入框清除
		enableClear: true,
		// 隐藏控件元素名称。默认双日期选择，用字符串数组；单日期时无效
		hiddenNames: ['beginDate', 'endDate'],
		// 最小日期。默认向后50年，类型 Date，moment实例，字符串
		minDate: false,
		// 最大日期。默认向前50年，类型 Date，moment实例，字符串
		maxDate: false,
		// 选择范围，选择开始日期后可以选择的结束日期间隔天数
		dateLimit: false,
		// 年、月选择是否改为下拉列表
		showDropdowns: true,
		// 每周前面是否显示周数
		showWeekNumbers: false,
		// 每周前面是否显示ISO周数
		showISOWeekNumbers: false,
		// 是否显示时、分选择
		timePicker: false,
		// 是否启用24小时制
		timePicker24Hour: true,
		// 分钟选择增长量
		timePickerIncrement: 5,
		// 是否显示秒
		timePickerSeconds: false,
		/** 预定义范围选择
		 * 默认：
		 * {
		 *		'今天': [
		 *			moment().startOf('day'),
		 *			moment().endOf('day')
		 *		],
		 *		'昨天': [
		 *			moment().subtract(1, 'days').startOf('day'),
		 *			moment().endOf('day').subtract(1, 'days')
		 *		],
		 *		'最近7天': [
		 *			moment().subtract(6, 'days').startOf('day'),
		 *			moment().endOf('day')
		 *		],
		 *		'最近30天': [
		 *			moment().subtract(29, 'days').startOf('day'),
		 *			moment().endOf('day')
		 *		],
		 *		'当月': [
		 *			moment().startOf('month'),
		 *			moment().endOf('month')
		 *		],
		 *		'上个月': [
		 *			moment().subtract(1, 'month').startOf('month'),
		 *			moment().subtract(1, 'month').endOf('month')
		 *		]
		 * }
		 */
		ranges: false,
		// 是否启用范围选择
		enableDefaultRanges: false,
		// 显示自定义范围标签
		showCustomRangeLabel: false,
		// 总是显示日历。如果false，在显示范围选择的时候，后隐藏日历
		alwaysShowCalendars: true,
		// 展开方向。['left' | 'right' | 'center']
		opens: 'right',
		// 显示方向。['down' | 'up']
		drops: 'down',
		// 按钮class
		buttonClasses: ['btn'],
		// 选择按钮class
		applyClass: 'btn-primary',
		// 取消按钮样式
		cancelClass: 'btn-cancel',
		// 是否单日期
		singleDatePicker: false,
		// 自动选择
		autoApply: false,
		// 日历联动。true的话是显示连续月份，false是自由显示
		linkedCalendars: false,
		// 自动更新日期输入框。
		autoUpdateInput: false,
		// 日期控件插入的容器
		parentEl: 'body',
		callback: function (startDate, endDate, chosenLabel) {
		},
		applyHanddle: function (e, picker, context) {
			var strDates = [picker.startDate.format(context.settings.locale.format), picker.endDate.format(context.settings.locale.format)];

			for (x in context.hiddenIds) {
				$('#' + context.hiddenIds[x]).val(strDates[x]);
			}
			if (context.settings.singleDatePicker) {
				$(this).val(strDates[0]);
			}
			else {
				$(this).val(strDates.join(' ' + context.settings.locale.separator + ' '));
			}
		},
		cancelHanddle: function (e, picker, context) {
			$(this).val('');
			for (x in context.hiddenIds) {
				$('#' + context.hiddenIds[x]).val('');
			}
		},
		// 模板
		templates: {
			hidden: function (id, name) {
				return '<input type="hidden" id="' + id + '" name="' + name + '" value="">';
			}
		}
	},
	// 设置默认配置信息
	setDefaults: function (settings) {
		$.extend($.jkj.superDateRange.defaults, settings);
	},
	prototype: {
		// 初始化
		init: function () {
			var _root = (this), settings = (_root.settings), element = (_root.element), jkjUtil = $.jkj.util;

			_root.__initSettings();

			_root.id = $(element).attr('id');
			if (!_root.id) {
				_root.id = _root.id || 'superDateRange' + jkjUtil.random.getLongDateString();
				$(element).attr('id', _root.id);
			}
            if (settings.enableClear) {
				settings.autoApply = true;
                $(element).wrap('<div class="input-group overdatetime"></div>');
                $(element).parent().append(
                    '<span class="input-group-addon">' +
                    '	<span id="'+ _root.id +'remove" class="glyphicon glyphicon-remove"></span>' +
                    '</span>'
                );
                $('#' + _root.id + 'remove').on('click', function(e){
                    e.preventDefault();
                    _root.clearValue();
                });
            }
			if (!settings.singleDatePicker) {
				for (x in settings.hiddenNames) {
					var hiddenId = _root.id + '-' + settings.hiddenNames[x];

					_root.hiddenIds.push(hiddenId);
					$(element).after(settings.templates.hidden(hiddenId, settings.hiddenNames[x]));
				}
			}

			$(element).daterangepicker(settings, settings.callback);
			_root.daterangepicker = $(element).data('daterangepicker');

			$(element).on('apply.daterangepicker', function (e, picker) {
				settings.applyHanddle.call(this, e, picker, _root);
			}).on('cancel.daterangepicker', function (e, picker) {
				settings.cancelHanddle.call(this, e, picker, _root);
			});

			if (settings.enableDefaultValues) {
				var strDates = [settings.startDate, settings.endDate];

				for (x in _root.hiddenIds) {
					$('#' + _root.hiddenIds[x]).val(strDates[x]);
				}
				if (settings.singleDatePicker) {
					$(element).val(strDates[0]);
				}
				else {
					$(element).val(strDates.join(' ' + settings.locale.separator + ' '));
				}
			}
			if (!settings.enableClear && settings.singleDatePicker) {
				_root.daterangepicker.container.find('.ranges').show();
				_root.daterangepicker.container.find('.applyBtn').hide();
			}
		},
		// 清除值
		clearValue: function () {
			var _root = (this);

			$(_root.element).val('');
			for (x in _root.hiddenIds) {
				$('#' + _root.hiddenIds[x]).val('');
			}
		},
		// 设置开始日期，类型(Date/moment/string)
		setStartDate: function (startDate) {
			var _root = (this);

			_root.daterangepicker.setStartDate(startDate);
		},
		// 设置结束日期，类型(Date/moment/string)
		setEndDate: function (endDate) {
			var _root = (this);

			_root.daterangepicker.setEndDate(startDate);
		},
		// 初始化设置
		__initSettings: function() {
			var _root = (this), settings = (_root.settings), element = (_root.element);

			if (!settings.startDate) {
				settings.startDate = moment().startOf('day');
			}
			if (!settings.endDate) {
				settings.endDate = moment().endOf('day');
			}
			if (!settings.enableInput) {
				$(element).attr('readonly', 'readonly');
			}
			if (!settings.ranges) {
				delete settings.ranges;
			}
			if (settings.enableDefaultRanges) {
				var ranges = {
					'今天': [
						moment().startOf('day'),
						moment().endOf('day')
					],
					'昨天': [
						moment().subtract(1, 'days').startOf('day'),
						moment().endOf('day').subtract(1, 'days')
					],
					'最近7天': [
						moment().subtract(6, 'days').startOf('day'),
						moment().endOf('day')
					],
					'最近30天': [
						moment().subtract(29, 'days').startOf('day'),
						moment().endOf('day')
					],
					'当月': [
						moment().startOf('month'),
						moment().endOf('month')
					],
					'上个月': [
						moment().subtract(1, 'month').startOf('month'),
						moment().subtract(1, 'month').endOf('month')
					]
				};

				settings.ranges = ranges;
				settings.showCustomRangeLabel = true;
			}
			if (!settings.minDate) {
				settings.minDate = moment().subtract(50, 'year').startOf('year');
			}
			if (!settings.maxDate) {
				settings.maxDate = moment().add(50, 'year').endOf('year');
			}
		}
	}
});