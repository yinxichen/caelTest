//初始化待提交的表单
$.jkj.initForm = function (element) {
	//表单禁用回车
	$(element).find(':text').keydown(function (e) {
		var code = e.keyCode | e.charCode;
		if (code == 13) {
			e.preventDefault();
		}
	});
	//初始化输入验证
	$.jkj.validate(element, {
		submitHandler: function (form) {

		}
	});
};

$.jkj.submit = function (options) {
	var formLayer, settings, submitContext;
	var $btn, $form;
	var beforeSend, renew;

	$btn = $(options.btn);
	$btn.button('loading');
	if ($btn.attr("data-loading-text") === undefined) {
		$btn.attr("data-loading-text", $btn.text() + "中");
	}
	formLayer = $.jkj.layer.loading("页面处理中...");

	$form = $(options.form);
	beforeSend = options.beforeSend;
	renew = function () {
		if (formLayer) {
			formLayer.close();
		}
		if ($btn) {
			$btn.button('reset');
		}
	};
	settings = {
		//请求url
		url: $form.attr("action"),
		//请求类型，默认为post
		type: 'post',
		//传参
		data: $form.serializeArray(),
		//回调中制定this的Object
		context: options.btn,
		//成功回调
		success: function (data, textStatus, jqXHR) {
			var $context = $(this);
		},
		error: function () {
			$.jkj.notify.showError("服务器错误，请联系管理员", null, "self");
		},
		//请求完成事件，无论失败
		complete: function (XMLHttpRequest, textStatus) {
			renew();
		}
	};
	submitContext = {
		options: options,
		settings: settings,
		formLayer: formLayer
	};

	//验证
	if (options.validate && !$form.valid()) {
		renew();
		return false;
	}
	if (options.callback) {
		settings.success = options.callback;
	}
	if (beforeSend && beforeSend(submitContext) === false) {
		renew();
		return false;
	}
	formLayer.setMessage("保存中...");

	//请求处理
	$.ajax(settings);
};

$.fn.jkjSubmit = function (options) {
	options.form = this;
	$.jkj.submit(options);
};

/* AdminJKJ $.jkj.wonderForm
 * ==========================
 * @作者 潘明星
 * @日期 2017-10-13
 * 
 * 修改日志：
 * 
 */
/*! wonderForm 美妙表单，用于表单初始化、表单内控件初始化、表单提交
 *  $.fn.jkj('wonderForm',options)调用
 */
$.jkj.wonderForm = function (options, form) {
	this.settings = $.extend(true, {}, $.jkj.wonderForm.defaults, options),
		this.form = form,
		this.lastValidationModel = '',
		this.beautifyInput = null,
		this.antValidate = null,
		this.validator = null,
		this.init();
};
$.extend($.jkj.wonderForm, {
	// 默认配置信息
	defaults: {
		// 启用美化输入
		enableBeautifyInput: false,
		// 文本框上启用回车键提交表单
		enableEnterKey: false,
		// 初始化表单验证
		enableValidate: true,
		// 去掉文本前后空格或指定字符
		enableTrim: true,
		// 启用动态验证规则
		enableDynamicRules: false,
		// 定义获取动态验证规则的属性名，值为对象，如：{ required: true, minlength: 2}（适用场景：提交的时候需要验证，保存草稿的时候不需要验证）
		dynamicRules: 'data-rules',
		// 验证模式，【'draft','submit'】，默认'submit'，加在form元素上面
		validationModel: 'data-validation-model',
		// 表单验证的参数信息
		validate: {},
		// 表单提交的相关参数
		submit: {
			// 表单提交url，默认为form的action值
			url: null,
			// 表单方法类型，默认为'post'
			type: 'post',
			// 发送前回调方法
			beforeSend: null,
			successCallBack: null,
			errorCallBack: null,
			completeCallBack: null
		}
	},
	// 设置默认配置信息
	setDefaults: function (settings) {
		$.extend($.jkj.wonderForm.defaults, settings);
	},
	prototype: {
		// 表单初始化
		init: function () {
			var _root = (this), settings = (_root.settings), form = (_root.form);

			if (!settings.enableEnterKey) {
				$(form).find(':text').keydown(function (e) {
					var code = e.keyCode | e.charCode;
					if (code == 13) {
						e.preventDefault();
					}
				});
			}
			if (settings.enableTrim) {
				$(form).find(':text, textarea').blur(function (e) {
					e.preventDefault();
					$(this).val($.trim($(this).val()));
				});
			}
			if (settings.enableBeautifyInput) {
				_root.beautifyInput = new $.jkj.beautifyInput({}, form);
			}
			if (settings.enableValidate) {
				_root.antValidate = $(form).jkj('antValidate', settings.validate);
				_root.validator = _root.antValidate.validator;
			}
		},
		// 表单提交方法 
		submit: function (submitButton) {
			var _root = (this), form = (_root.form), settings = (_root.settings);
			var ajaxData, formLayer, submitContext, validationModel;
			var addRules, renew;

			if (submitButton) {
				$(submitButton).attr('disabled', 'disabled');
			}
			formLayer = $.jkj.pureLayer.loading("页面处理中...");
			validationModel = $(form).attr(settings.validationModel) || 'submit';
			// 还原表单
			renew = function () {
				// 移除按钮禁用状态
				if (submitButton) {
					$(submitButton).removeAttr('disabled');
				}
				// 移除动态验证规则
				if (settings.enableDynamicRules && validationModel === 'submit') {
					$(form).find('[' + settings.dynamicRules + ']').each(function () {
						var rules = $.trim($(this).attr(settings.dynamicRules)), removeRules = '';

						if (rules.indexOf('{') === 0) {
							$.each(eval('(' + rules + ')'), function (key, value) {
								if (key !== 'messages') {
									removeRules += key + ' ';
								}
							});
						}
						$(this).rules('remove', $.trim(removeRules));
					});
				}
				// 移除遮罩层
				if (formLayer) {
					formLayer.close();
				}
			};
			// 清除动态验证规则的消息提示
			if (settings.enableDynamicRules && _root.lastValidationModel === 'submit') {
				$(form).find('[' + settings.dynamicRules + ']').each(function () {
					var ariaDescribedby = $(this).parent().attr('aria-describedby');
					if (ariaDescribedby) {
						$('#' + ariaDescribedby).remove();
					}
					$(this).removeAttr('aria-invalid').removeAttr('aria-describedby');
				});
			}
			_root.lastValidationModel = validationModel;
			// 如果开启动态验证并是提交模式
			if (settings.enableDynamicRules && validationModel === 'submit') {
				$(form).find('[' + settings.dynamicRules + ']').each(function () {
					var rules = $.trim($(this).attr(settings.dynamicRules));
					if (rules.indexOf('{') === 0) {
						$(this).rules('add', eval('(' + rules + ')'));
					}
				});
			}
			//验证
			if (settings.enableValidate && !$(form).valid()) {
				renew();
				return false;
			}
			ajaxData = $(form).serializeArray();
			submitContext = {
				// 表单提交数据
				ajaxData: ajaxData,
				// 表单提交时遮罩层
				formLayer: formLayer,
				// wonderForm表单参数信息
				settings: settings,
				// 提交时的按钮
				submitButton: submitButton,
				// 还原表单
				renew: renew
			};

			if (settings.submit.beforeSend && settings.submit.beforeSend(submitContext) === false) {
				renew();
				return false;
			}

			formLayer.setContent("发送请求中...");
			//请求处理
			$.ajax({
				//请求url
				url: settings.submit.url || $(form).prop("action"),
				//请求类型，默认为post
				type: settings.submit.type,
				//传参
				data: ajaxData,
				//成功回调
				success: function (data, status, xhr) {
					var successCallBack = settings.submit.successCallBack;
					if (successCallBack) {
						successCallBack.call(submitContext, data, status, xhr);
					}
				},
				error: function (xhr, status, error) {
					var errorCallBack = settings.submit.errorCallBack;
					if (errorCallBack) {
						errorCallBack.call(submitContext, status, xhr, error);
					}
					else {
						$.jkj.cleverNotify.error("服务器错误，请联系管理员", null, "self");
					}
				},
				//请求完成事件，无论失败
				complete: function (xhr, status) {
					var completeCallBack = settings.submit.completeCallBack;
					if (completeCallBack) {
						completeCallBack.call();
					}
					else {
						renew();
					}
				}
			});
		}
	}
});