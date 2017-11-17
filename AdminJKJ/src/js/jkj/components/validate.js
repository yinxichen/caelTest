/* AdminJKJ $.jkj.validate
 * ==========================
 * @作者 李睿
 * @日期 2017-03-09
 *
 * 修改日志：
 *
 */
/*! validate 表单验证
 *  基于jquery-validation封装的表单验证
 */
$.jkj.validate = function (element, options) {
	var validator, settings, _submitHandler;

	if ($.validator === undefined || $.validator == null) {
		throw new Error('$.jkj.validate 依赖 jquery-validation');
	}

	settings = {
		errorElement: "span",
		errorClass: "help-block help-block-error",
		focusInvalid: false, //提交表单后，未通过验证的表单（第一个或提交之前获得焦点的未通过验证的表单）会获得焦点。
		ignore: "", //忽略某些元素不验证
		rules: {}, //验证规则
		messages: {}, //提示信息
		onkeyup: false, //在 keyup 时验证。
		tooltipOptions: {
			tooltip: true, //错误提示使用tooltip样式
			placement: 'top' //错误提示位置 top|bottom|left|right|auto
		},
		highlight: function (element) {
			$(element).closest(".form-group").addClass("has-error");
		},
		unhighlight: function (element) {
			$(element).closest(".form-group").removeClass("has-error");
		},
		success: function (element) {
			$(element).closest(".form-group").removeClass("has-error");
		},
		errorPlacement: function (error, element) {
			var _element = element;
			if ($(element).is(":checkbox")) {
				_element = $(element).parents('.checkbox-list');
			} else if ($(element).is(":radio")) {
				_element = $(element).parents('.radio-list');
			} else {
				_element = element.parent();
			}
			error.appendTo(_element);
		},
		/*重写校验元素获得焦点后的执行函数--增加[1.光标移入元素时的帮助提示,2.校验元素的高亮显示]两个功能点*/
		onfocusin: function (element) {
			this.lastActive = element;

			/*1.帮助提示功能*/
			this.addWrapper(this.errorsFor(element)).hide();
			var tip = $(element).attr('tip');
			if (tip && $(element).parent().children(".tip").length === 0) {
				$(element).parent().append("<label class='tip'>" + tip + "</label>");
			}

			/*2.校验元素的高亮显示*/
			$(element).addClass('highlight');

			// Hide error label and remove error class on focus if enabled
			if (this.settings.focusCleanup) {
				if (this.settings.unhighlight) {
					this.settings.unhighlight.call(this, element, this.settings.errorClass, this.settings.validClass);
				}
				this.hideThese(this.errorsFor(element));
			}
		},
		/*重写校验元素焦点离开时的执行函数--移除[1.添加的帮助提示,2.校验元素的高亮显示]*/
		onfocusout: function (element) {
			/*1.帮助提示信息移除*/
			$(element).parent().children(".tip").remove();

			/*2.校验元素高亮样式移除*/
			$(element).removeClass('highlight');
			var that = this;
			setTimeout(function () {
				that.element(element);
			}, 300);

			//if ( !this.checkable( element ) && ( element.name in this.submitted || !this.optional( element ) ) ) {
			//    this.element( element );
			//}
		},
		submitHandler: function (form) {

		}
	};

	_submitHandler = options.submitHandler;
	settings.submitHandler = function (form) {
		_submitHandler(form);
		return false;
	};

	options = $.extend(true, settings, options);

	//使用tooltip样式
	if (options.tooltipOptions.tooltip) {
		$.extend(true, options, {
			unhighlight: function (element) {
				$(element).closest(".form-group").removeClass("has-error");

				var _element = element;
				if ($(element).is(":checkbox")) {
					_element = $(element).parents('.checkbox-list');
				} else if ($(element).is(":radio")) {
					_element = $(element).parents('.radio-list');
				} else {
					_element = $(element).parent();
				}
				$(_element).tooltip('hide');
			},
			errorPlacement: function (error, element) {
				var _element = element;
				if ($(element).is(":checkbox")) {
					_element = $(element).parents('.checkbox-list');
				} else if ($(element).is(":radio")) {
					_element = $(element).parents('.radio-list');
				} else if ($(element).parents().hasClass("tip-parent")) {
					_element = $(element).parent();
				} else {
					_element = $(element).wrapAll("<div class='tip-parent'></div>").parent();
				}
				_element.attr("data-original-title", error.text())
					.attr('data-trigger', 'manual')
					.attr('data-placement', options.tooltipOptions.placement)
					.tooltip('show');
			},
			invalidHandler: function (event, validator) { //display error alert on form submit
				if (validator.numberOfInvalids() > 0) {
					// scroll to error element
					var el = $(validator.errorList[0].element);
					var offeset = -50;
					var pos = (el && el.size() > 0) ? el.offset().top : 0;

					if (el) {
						pos = pos + (offeset ? offeset : -1 * el.height());
					}

					if (el.parents('.modal').length > 0) { //form in modal
						$(el).parents('.modal').animate({
							scrollTop: pos
						}, 'slow');
					} else {
						$('html,body').animate({ //normal
							scrollTop: pos
						}, 'slow');
					}
				}
			}
		});
	}

	validator = $(element).validate(options);
	return validator;
};

$(function () {
	if ($.validator !== undefined && $.validator != null && $.validator.addMethod !== undefined && $.validator.addMethod != null) {
		validateAddMethod();
	}
});

function validateAddMethod() {
	//中等强度密码
	jQuery.validator.addMethod("password2", function (value, element) {
		return this.optional(element) || /^(?:(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])).{6,}$/.test(value);
	}, "请输入不少于6位且包含数字、小写字母和大写字母");

	jQuery.validator.addMethod("ip", function (value, element) {
		return this.optional(element) || (/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/.test(value) && (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256));
	}, "请输入合法的IP地址");

	jQuery.validator.addMethod("abc", function (value, element) {
		return this.optional(element) || /^[a-zA-Z0-9_@.]*$/.test(value);
	}, "请输入字母数字或下划线");

	// 不等于验证
	jQuery.validator.addMethod("noEqualTo", function (value, element, param) {
		return value != $(param).val();
	}, "请再次输入不同的值");

	// 中文
	jQuery.validator.addMethod("chinese", function (value, element) {
		return this.optional(element) || /^[\u4e00-\u9fa5]*$/.test(value);
	}, "请填写中文");

	// 中文或英文
	jQuery.validator.addMethod("ch-en", function (value, element) {
		return this.optional(element) || /^([\u4e00-\u9fa5]|[a-zA-Z])*$/.test(value);
	}, "请填写中文或英文字符");

	// 真实姓名验证
	jQuery.validator.addMethod("realName", function (value, element) {
		return this.optional(element) || /^[\u4e00-\u9fa5]{2,30}$/.test(value);
	}, "姓名只能为2-30个汉字");

	// 手机号码验证
	jQuery.validator.addMethod("mobile", function (value, element) {
		return this.optional(element) || (/^1\d{10}$/.test(value));
	}, "请正确填写手机号码");

	// 电话号码验证
	jQuery.validator.addMethod("phone", function (value, element) {
		var reg = /^(\d{3,4}-?)?\d{7,9}$/g;
		return this.optional(element) || (reg.test(value));
	}, "请正确填写电话号码");

	// 传真验证
	jQuery.validator.addMethod("fax", function (value, element) {
		var reg = /^([+]{0,1}((\d){1,6})([ ]?))?([-]?[0-9]{1,12})+$/g;
		return this.optional(element) || (reg.test(value));
	}, "请正确填写传真号码");

	// 邮政编码验证
	jQuery.validator.addMethod("zipCode", function (value, element) {
		var reg = /^[0-9]{6}$/;
		return this.optional(element) || (reg.test(value));
	}, "请正确填写邮政编码");

	//QQ号码验证
	jQuery.validator.addMethod("qq", function (value, element) {
		var reg = /^[1-9][0-9]{4,}$/;
		return this.optional(element) || (reg.test(value));
	}, "请正确填写QQ号码");

	//金额验证
	jQuery.validator.addMethod("money", function (value, element) {
		var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
		return this.optional(element) || (reg.test(value));
	}, "请正确填写金额数");

	//验证身份证号码
	jQuery.validator.addMethod("idCardNo", function (value, element) {
		var checheckIdCardNo = function (idcard) {
			idcard = idcard.toString();
			//var Errors=new Array("验证通过!","身份证号码位数不对!","身份证号码出生日期超出范围或含有非法字符!","身份证号码校验错误!","身份证地区非法!");
			var Errors = [true, false, false, false, false];
			var area = {
				11: "北京",
				12: "天津",
				13: "河北",
				14: "山西",
				15: "内蒙古",
				21: "辽宁",
				22: "吉林",
				23: "黑龙江",
				31: "上海",
				32: "江苏",
				33: "浙江",
				34: "安徽",
				35: "福建",
				36: "江西",
				37: "山东",
				41: "河南",
				42: "湖北",
				43: "湖南",
				44: "广东",
				45: "广西",
				46: "海南",
				50: "重庆",
				51: "四川",
				52: "贵州",
				53: "云南",
				54: "西藏",
				61: "陕西",
				62: "甘肃",
				63: "青海",
				64: "宁夏",
				65: "新疆",
				71: "台湾",
				81: "香港",
				82: "澳门",
				91: "国外"
			};
			var Y, JYM;
			var S, M;
			var idcard_array = [];
			var ereg;
			idcard_array = idcard.split("");
			//地区检验
			if (area[parseInt(idcard.substr(0, 2))] == null) {
				return Errors[4];
			}
			//身份号码位数及格式检验
			switch (idcard.length) {
				case 15:
					if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 === 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 === 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 === 0)) {
						ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/; //测试出生日期的合法性
					} else {
						ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/; //测试出生日期的合法性
					}
					if (ereg.test(idcard)) {
						return Errors[0];
					} else {
						return Errors[2];
					}
					break;
				case 18:
					//18 位身份号码检测
					//出生日期的合法性检查
					//闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
					//平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
					if (parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 === 0 && parseInt(idcard.substr(6, 4)) % 4 === 0)) {
						ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/; //闰年出生日期的合法性正则表达式
					} else {
						ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/; //平年出生日期的合法性正则表达式
					}
					if (ereg.test(idcard)) { //测试出生日期的合法性
						//计算校验位
						S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 +
							(parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 +
							(parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 +
							(parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 +
							(parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 +
							(parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 +
							(parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 +
							parseInt(idcard_array[7]) +
							parseInt(idcard_array[8]) * 6 +
							parseInt(idcard_array[9]) * 3;
						Y = S % 11;
						M = "F";
						JYM = "10X98765432";
						M = JYM.substr(Y, 1); //判断校验位
						if (M === idcard_array[17]) { //检测ID的校验位
							return Errors[0];
						} else {
							return Errors[3];
						}
					} else {
						return Errors[2];
					}
					break;
				default:
					return Errors[1];
			}
		};
		return this.optional(element) || checheckIdCardNo(value);
	}, "请正确填写身份证号码");
}

/* AdminJKJ $.jkj.antValidate
 * ==========================
 * @作者 潘明星
 * @日期 2017-11-06
 * 
 * 修改日志：
 * 
 */
/*! antValidate 小蜜蜂模态框
 *  $.fn.jkj('antValidate',options)调用
 */
$.jkj.antValidate = function (options, form) {
	if (!$.validator) {
		throw new Error('$.jkj.antValidate 初始化失败，未引用 jquery validate 等插件！');
	}
	this.settings = $.extend(true, {}, $.jkj.antValidate.defaults, options),
		this.form = form,
		this.validator = null,
		this.init();
};
$.extend($.jkj.antValidate, {
	// 默认配置信息
	defaults: {
		// 启用调试模式，表单提交的时候不会真的提交到服务端
		debug: false,
		// 自定义的提示信息，key:value 的形式，key 是要验证的元素，value 可以是字符串或函数。
		messages: {},
		// 对一组元素的验证，用一个错误提示，用 errorPlacement 控制把出错信息放在哪里。
		groups: {},
		// 自定义规则，key:value 的形式，key 是要验证的元素，value 可以是字符串或对象。
		rules: {},
		// 指定错误提示的 css 类名，可以自定义错误提示的样式。类型 String，默认 "error"。
		errorClass: "help-block help-block-error",
		// 元素经过验证之后添加到元素上的class
		validClass: "valid",
		// 指定使用什么标签标记错误。类型 String，默认 "label"。
		errorElement: "span",
		// 指定使用什么标签再把上边的 errorELement 包起来。类型 String。
		wrapper: "li",
		// 当未通过验证的元素获得焦点时，移除错误提示。类型 Boolean，默认 false。
		focusCleanup: false,
		// 提交表单后，未通过验证的表单（第一个或提交之前获得焦点的未通过验证的表单）会获得焦点。
		focusInvalid: false,
		// 显示或者隐藏验证信息，可以自动实现有错误信息出现时把容器属性变为显示，无错误时隐藏，用处不大。
		errorContainer: $([]),
		// 类型 Selector，把错误信息统一放在一个容器里面。
		errorLabelContainer: $([]),
		// 指定是否在敲击键盘时验证。类型Boolean 或者 Function(element, event)
		onkeyup: false,
		// 指定是否提交时验证。类型 Boolean，默认 true
		onsubmit: true,
		// 验证提示，tooltip样式参数配置
		tooltipOptions: {
			// 错误提示启用tooltip样式
			tooltip: true,
			// 错误提示位置 top|bottom|left|right|auto
			placement: 'top'
		},
		// 对某些元素不进行验证。
		ignore: "",
		ignoreTitle: false,
		// 跟一个函数，可以自定义错误放到哪里。
		errorPlacement: function (error, element) {
			var _element = element;
			if ($(element).is(":checkbox")) {
				_element = $(element).parents('.checkbox-list');
			} else if ($(element).is(":radio")) {
				_element = $(element).parents('.radio-list');
			} else {
				_element = element.parent();
			}
			error.appendTo(_element);
		},
		/** 重写校验元素获得焦点后的执行函数
		 * 增加：
		 * 1.光标移入元素时的帮助提示
		 * 2.校验元素的高亮显示
		 */
		onfocusin: function (element) {
			this.lastActive = element;

			// 1.帮助提示功能
			this.addWrapper(this.errorsFor(element)).hide();
			var tip = $(element).attr('tip');
			if (tip && $(element).parent().children(".tip").length === 0) {
				$(element).parent().append("<label class='tip'>" + tip + "</label>");
			}

			// 2.校验元素的高亮显示
			$(element).addClass('highlight');

			// 如果启用focusCleanup则获取焦点时隐藏错误提示标签和类
			if (this.settings.focusCleanup) {
				if (this.settings.unhighlight) {
					this.settings.unhighlight.call(this, element, this.settings.errorClass, this.settings.validClass);
				}
				this.hideThese(this.errorsFor(element));
			}
		},
		/** 重写校验元素焦点离开时的执行函数
		 * 移除：
		 * 1.添加的帮助提示
		 * 2.校验元素的高亮显示
		 */
		onfocusout: function (element) {
			var that = this;
			// 1.帮助提示信息移除
			$(element).parent().children(".tip").remove();
			// 2.校验元素高亮样式移除
			$(element).removeClass('highlight');
			setTimeout(function () {
				that.element(element);
			}, 300);
		},
		// 指定是否在鼠标点击时验证。类型 Boolean，默认 true
		onclick: function (element) {
			// click on selects, radiobuttons and checkboxes
			if (element.name in this.submitted) {
				this.element(element);

				// or option elements, check parent select in that case
			} else if (element.parentNode.name in this.submitted) {
				this.element(element.parentNode);
			}
		},
		// 可以给未通过验证的元素加效果、闪烁等。
		highlight: function (element, errorClass, validClass) {
			$(element).closest(".form-group").addClass("has-error");
		},
		// 可以给通过验证的元素移除效果、闪烁等。
		unhighlight: function (element, errorClass, validClass) {
			$(element).closest(".form-group").removeClass("has-error");
		},
		// 要验证的元素通过验证后的动作，如果跟一个字符串，会当作一个 css 类，也可跟一个函数。
		success: function (element) {
			$(element).closest(".form-group").removeClass("has-error");
		},
		// 通过验证后运行的函数，里面要加上表单提交的函数，否则表单不会提交。
		submitHandler: function (form) {

		}
	},
	// 设置默认配置信息
	setDefaults: function (settings) {
		$.extend($.jkj.antValidate.defaults, settings);
	},
	prototype: {
		// 初始化
		init: function () {
			var _root = this, settings = _root.settings, form = _root.form;

			_root.__initSettings();
			_root.__reformValidate();
			_root.validator = $(form).validate(settings);

		},
		// 初始化配置
		__initSettings: function () {
			var _root = this, settings = _root.settings;

			//使用tooltip样式
			if (settings.tooltipOptions.tooltip) {
				settings.unhighlight = function (element) {
					var _element;

					$(element).closest(".form-group").removeClass("has-error");
					if ($(element).is(":checkbox")) {
						_element = $(element).parents('.checkbox-list');
					} else if ($(element).is(":radio")) {
						_element = $(element).parents('.radio-list');
					} else {
						_element = $(element).parent();
					}
					$(_element).tooltip('hide');
				};
				settings.errorPlacement = function (error, element) {
					var _element;

					if ($(element).is(":checkbox")) {
						_element = $(element).parents('.checkbox-list');
					} else if ($(element).is(":radio")) {
						_element = $(element).parents('.radio-list');
					} else if ($(element).parents().hasClass("tip-parent")) {
						_element = $(element).parent();
					} else {
						_element = $(element).wrapAll("<div class='tip-parent'></div>").parent();
					}
					_element.attr("data-original-title", error.text())
						.attr('data-trigger', 'manual')
						.attr('data-placement', settings.tooltipOptions.placement)
						.tooltip('show');
				};
				settings.invalidHandler = function (event, validator) {
					// 当表单提交时显示错误提示
					if (validator.numberOfInvalids() > 0) {
						// 滚动到错误元素
						var el = $(validator.errorList[0].element);
						var offeset = -50;
						var pos = (el && el.size() > 0) ? el.offset().top : 0;

						if (el) {
							pos = pos + (offeset ? offeset : -1 * el.height());
						}
						// 模态框和页面区分处理
						if (el.parents('.modal').length > 0) {
							$(el).parents('.modal').animate({
								scrollTop: pos
							}, 'slow');
						} else {
							$('html,body').animate({
								scrollTop: pos
							}, 'slow');
						}
					}
				};
			}
		},
		// 改造 validate
		__reformValidate: function () {
			$.validator.prototype.elements = function () {
				var validator = this,
					rulesCache = {};

				// 处理表单中所有待验证的输入控件（排除提交和重置按钮、图片控件、禁用的控件）
				return $(this.currentForm)
					.find("input, select, textarea")
					.not(":submit, :reset, :image, :disabled")
					.not(this.settings.ignore)
					.filter(function () {
						if (!this.name && validator.settings.debug && window.console) {
							console.error("%o has no name assigned", this);
						}

						// 过滤已经在rulesCache中存在的check、radio元素  
						if (validator.checkable(this) && this.name in rulesCache) {
							return false;
						}
						// 处理已经在rulesCache中存在的非check、radio元素
						if (this.name in rulesCache) {
							// 如果该元素上没有添加规则标识（类、属性等），则把已经存在相同名称的元素的规则添加到该元素上
							if (!validator.objectLength($(this).rules())) {
								$(this).rules('add', rulesCache[this.name]);
							}
							return true;
						}
						// 只验证那些添加过规则的元素
						if (!validator.objectLength($(this).rules())) {
							return false;
						}
						rulesCache[this.name] = $(this).rules();
						return true;
					});
			};
		}
	}
});