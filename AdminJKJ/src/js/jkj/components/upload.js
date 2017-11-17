$.jkj.upload = function (obj, options) {
	"use strict";
	String.prototype.repl = function (from, to) {
		return this.split(from).join(to);
	};
	var id = $(obj).attr('id');
	var aEditBtn = "<a class='btn-edit glyphicon glyphicon-edit' id='" + id + "-file-edit' href='javascript:void(0)'>编辑</a>";
	if (options.permissionCode != '' && options.permissionCode != undefined) {
		aEditBtn = '';
	}
	var PREVIEW_TAB = "<div class='form-title'>{title}<label class='right'>" + aEditBtn + "</label></div>" +
		"<div class='tabbable'><ul class='nav nav-tabs'>{tabItem}</ul><div class='tab-content'>" +
		"<input type='hidden' name='fileIds' value=''>{tabContent}</div></div>",
		UPLOAD_BTN = "<a class='btn-edit glyphicon glyphicon-upload' id='" + id + "-file-upload' href='javascript:void(0)'>上传附件</a>",
		SUBMIT_BTN = "<div class='btn-submit'><button type='button' class='btn btn-cancel btn-font4'>取消</button>" +
			"<button type='button' class='btn btn-primary' style=''>保存</button></div>",
		FILE_ITEM = "<li style='float: left; margin-left: 15px; text-align: center' class='upload'>" +
			"<a href='{downloadUrl}' target='_blank' class='{uploadClass}'>" +
			"<label title='{filename}'>{filename}</label>" +
			"<span data-fileType={fileType} data-fileId={fileId} {styleDisble}></span></a>" +
			"<mark class='bg-green'>传</mark></li>",
		UPLOAD_MODAL = "<div class='modal fade fileupload' id='" + id + "-uploadModal' tabindex='-1' role='dialog' style='z-index:1051' " +
			"aria-labelledby='myModalLabel' aria-hidden='true'><div class='modal-dialog' style='width: 845px;'>" +
			"<div class='modal-content'>" +
			"<div class='modal-header mhd-layer-header'><button class='close' aria-hidden='true' type='button' data-dismiss='modal'>×</button>" +
			"<h4 class='modal-title mhd-layer-title'>上传文件</h4></div><div class='modal-body'><div class='mhd-layer-body'>" +
			"文件类型：<select class='form-control' id='" + id + "-selectFileType'>{selectObj}</select>" +
			"<form enctype='multipart/form-data'><input class='file' name='files' type='file' multiple style='width: 300px;'>" +
			"</form></div></div></div></div></div>",
		defaultSettings = {
			//上传地址
			fileServerUrl: "",
			//总共上传大小单位m
			maxTotalSize: 200,
			//加载已上传文件
			files: {},
			//文件tab页信息
			tabs: null,
			//已上传文件删除事件
			removeFile: function (e) {
				e.preventDefault();
				var fileType = $(this).attr("data-fileType");
				var fileCount = $("#" + id + "-fileCount_" + fileType).html();
				$("#" + id + "-fileCount_" + fileType).html(fileCount - 1);
				var $fileIdInput = $(_obj).find(".tab-content input");
				$fileIdInput.val($fileIdInput.val().repl("," + $(this).attr("data-fileId"), ""));
				$(this).closest("li").remove();
			},
			//保存文件事件
			saveFile: function () {

			},
			//取消保存文件事件
			cancle: function () {

			},
			//上传组件国际化，默认中文
			language: "zh",
			//达到最大限制时是否自动替换
			autoReplace: false,
			layoutTemplates: {
				footer: '<div class="file-thumbnail-footer"><div class="file-footer-caption">{caption}</div>{actions}</div>',
				actions: '<div class="file-actions">\n' +
				'    <div class="file-footer-buttons">\n' +
				'        {upload} {delete} {zoom} {other}' +
				'    </div>\n' +
				'    {drag}\n' +
				'    <div class="file-upload-indicator" title="{indicatorTitle}">{indicator}</div>\n' +
				'    <div class="clearfix"></div>\n' +
				'</div>'
			},
			allowedPreviewTypes: [],
			previewFileIcon: '<div class="upload"><i class="" style="height:auto;"></i></div>',
			//文件预览样式		
			previewFileIconSettings: {
				'pdf': '<div class="upload"><i class="upload-pdf" style="height:auto;"></i></div>',
				'doc': '<div class="upload"><i class="upload-doc" style="height:auto;"></i></div>',
				'docx': '<div class="upload"><i class="upload-doc" style="height:auto;"></i></div>',
				'xls': '<div class="upload"><i class="upload-xls" style="height:auto;"></i></div>',
				'xlsx': '<div class="upload"><i class="upload-xls" style="height:auto;"></i></div>',
				'ppt': '<div class="upload"><i class="upload-ppt" style="height:auto;"></i></div>',
				'jpg': '<div class="upload"><i class="upload-jpg" style="height:auto;"></i></div>',
				'png': '<div class="upload"><i class="upload-png" style="height:auto;"></i></div>'
			},
			fileActionSettings: {
				showUpload: false,
				showZoom: false,
				showDrag: false
			},
			//是否同步上传，默认为异步
			uploadAsync: false,
			//是否显示文件标题，默认为true
			showCaption: true,
			//是否显示预览，默认为true
			showPreview: true,
			//是否显示移除按钮，默认为true
			showRemove: true,
			//是否显示上传按钮，默认为true
			showUpload: true,
			//允许点击窗口选择文件，默认false
			browseOnZoneClick: true,
			//最小上传大小
			minFileSize: 0,
			//最大上传大小
			maxFileSize: 10240,
			//最小上传个数
			minFileCount: 0,
			//最大上传个数
			maxFileCount: 20,
			//100m
			maxFilePreviewSize: 102400,
			//允许上传的文件类型
			allowedFileTypes: ["image", "html", "text", "video", "audio", "flash", "object"],
			//允许上传的文件扩展名
			allowedFileExtensions: [],
			ajaxSettings: {
			},
			//额外参数的关键点
			uploadExtraData: function () {
				var obj = {};
				obj.fileType = $("#" + id + "-selectFileType").val();
				return obj;
			}
		},
		_uploadmodal,
		_obj,
		init = function (obj, options) {
			$.extend(defaultSettings, options);
			_obj = obj;
			var tabItem = "";
			var tabContent = "";
			var selectObj = "";
			$.each(defaultSettings.tabs, function (index, val) {
				var active = index === 0 ? "active" : "";
				var type = val.fileType;
				var name = val.name;
				tabItem += "<li class='" + active + "'><a data-toggle='tab' href='#" + id + "-tab" + type + "' id='" + id + "-tabTitle_" + type + "'> " + name + " (<span class='red' id='" + id + "-fileCount_" + type + "'>0</span>)</a></li>";
				tabContent += "<div id='" + id + "-tab" + type + "' class='tab-pane " + active + "'><ul id='" + id + "-tabContent_" + type +
					"' data-maxCount=" + val.maxCount + " style='list-style: none; margin-left: -40px'></ul><div class='clearfix'></div></div>";
				selectObj += "<option value='" + type + "'>" + name + "</option>";

			});
			$(_obj).append(PREVIEW_TAB.repl('{title}', options.title || '&nbsp;').repl('{tabItem}', tabItem).repl('{tabContent}', tabContent));
			if (_uploadmodal === undefined) {
				$('body').append(UPLOAD_MODAL.repl('{selectObj}', selectObj));
				_uploadmodal = $("#" + id + "-uploadModal");
			}

			var fileIds = "";
			if (defaultSettings.files.length > 0) {
				$.each(defaultSettings.files, function (index, val) {
					fileIds += ',' + val.id;
					var fileType = val.fileType;
					var $tabContent = $("#" + id + "-tabContent_" + fileType);
					var fileCount = $("#" + id + "-fileCount_" + fileType).html();
					var filename = val.filename;
					var extension = '';
					if (filename.indexOf('.') != -1) {
						var index = filename.lastIndexOf('.');
						extension = filename.substr(index + 1);
					}
					$tabContent.append(FILE_ITEM.repl('{downloadUrl}', defaultSettings.fileServerUrl + "/{fileId}/download")
						.repl('{uploadClass}', 'upload-' + extension).repl('{fileId}', val.id).repl('{fileType}', fileType)
						.repl('{filename}', filename).repl('{styleDisble}', "style='display:none !important;'"));
					$("#" + id + "-fileCount_" + fileType).html(parseInt(fileCount) + 1);
					$(_obj).find(".tab-content input").val(fileIds);
					$tabContent.find("span").off('click').on('click', defaultSettings.removeFile);
				});
			}
		},
		listen = function (options) {
			var $btnEdit = $("#" + id + "-file-edit");
			$btnEdit.off('click').on('click', function () {
				$(this).parent().append(UPLOAD_BTN);
				var $btnUpload = $("#" + id + "-file-upload");
				$btnUpload.off('click').on('click', function () {
					var type = $(_obj).find(".active").find("a").attr("href").repl("#" + id + "-tab", "");
					$("#" + id + "-selectFileType").val(type);
					_uploadmodal.modal('show');
				});
				$(_obj).append(SUBMIT_BTN);
				var $cancle = $(_obj).find(".btn-cancel");
				$cancle.off('click').on('click', function () {
					defaultSettings.cancle();
					$(this).parent().remove();
					$("#" + id + "-file-upload").remove();
					$("#" + id + "-file-edit").show();
					$(_obj).find(".tab-content span").attr('style', 'display:none !important');
				});
				var $confirm = $(_obj).find(".btn-primary");
				$confirm.off('click').on('click', function () {
					defaultSettings.saveFile();
					$(this).parent().remove();
					$("#" + id + "-file-upload").remove();
					$("#" + id + "-file-edit").show();
					$(_obj).find(".tab-content span").attr('style', 'display:none !important');
				});
				$(_obj).find("span").show();
				$(this).hide();
			});

			if (_uploadmodal === undefined) {
				$('body').append(UPLOAD_MODAL).trigger('refresh');
				_uploadmodal = $("#" + id + "-uploadModal");
			}

			defaultSettings.uploadUrl = defaultSettings.fileServerUrl + '?appId=' + options.appId + '&moduleId=' + options.moduleId;

			var $fileUploadInput = _uploadmodal.find("input");

			$fileUploadInput.fileinput(defaultSettings);

			_uploadmodal.off("hidden.bs.modal").on("hidden.bs.modal", function (event) {
				$fileUploadInput.fileinput("clear"); //清除已上传文件
				$fileUploadInput.fileinput("clearStack"); //清除文件堆栈
				if ($('body > .modal.in').length > 0) {
					$('body').addClass('modal-open');
				}
				console.log("111");
			});

			//同步上传错误处理
			$fileUploadInput.off("filebatchuploaderror").on('filebatchuploaderror', function (event, data, msg) {
				console.log('event:');
				console.log(event);
				console.log('errorData:');
				console.log(data);
				console.log('errorMsg:' + msg);
			});

			$fileUploadInput.off("fileloaded").on('fileloaded', function (event, file, previewId, index, reader) {
				var res = '';
				var filename = file.name
				if (filename.indexOf(".")) {
					var index = filename.lastIndexOf(".");
					res = filename.substring(0, index).cutString(4) + filename.substr(index);
				} else {
					res = filename.cutString(4);
				}
				$("#" + previewId).find(".file-footer-caption").html(res);
			});

			$fileUploadInput.off("filebatchpreupload").on('filebatchpreupload', function (event, data, previewId, index) {
				var fileType = $("#" + id + "-selectFileType").val();
				var $tabContent = $("#" + id + "-tabContent_" + fileType);
				var count = data.filescount + $tabContent.find("li").length;
				var maxCount = $tabContent.attr("data-maxCount");
				if ($tabContent.attr("data-maxCount") < count) {
					return {
						message: "所上传类型附件个数不能超过：" + maxCount + "个",
						data: {}
					};
				}
				var totalSize = 0;
				$.each(data.files, function (index, item) {
					if (item !== undefined) {
						totalSize += item.size;
					}
				});

				if (totalSize / 1048576 > defaultSettings.maxTotalSize) {
					return {
						message: "所上传附件总大小不能超过：" + defaultSettings.maxTotalSize + "M",
						data: {}
					};
				}
			});

			//同步上传返回结果处理
			$fileUploadInput.off("filebatchuploadsuccess").on("filebatchuploadsuccess", function (event, data, previewId, index) {
				var fileType = $("#" + id + "-selectFileType").val();
				var $tabContent = $("#" + id + "-tabContent_" + fileType);
				var $tabTitle = $("#" + id + "-tabTitle_" + fileType);
				var fileIds = "";
				$.each(data.response.files, function (index, val) {
					fileIds += ',' + val.id;
					var fileCount = $("#" + id + "-fileCount_" + fileType).html();
					$tabContent.append(FILE_ITEM.repl('{downloadUrl}', defaultSettings.fileServerUrl + "/{fileId}/download")
						.repl('{uploadClass}', 'upload-' + val.extension.repl('.', '')).repl('{fileId}', val.id).repl('{fileType}', fileType)
						.repl('{filename}', val.filename).repl('{styleDisble}', ""));
					$("#" + id + "-fileCount_" + fileType).html(parseInt(fileCount) + 1);
				});
				$(_obj).find(".tab-content input").val($(_obj).find(".tab-content input").val() + fileIds);
				$tabContent.find("span").off('click').on('click', defaultSettings.removeFile);
				$tabTitle.click();
				_uploadmodal.modal('hide');
			});
		};
	init(obj, options);
	listen(options);
};
$.fn.upload = function (options) {
	$(this).empty();
	$.jkj.upload(this, options);
};

/* AdminJKJ $.jkj.doveUpload
 * ==========================
 * @作者 潘明星
 * @日期 2017-11-10
 * 
 * 修改日志：
 * 
 */
/*! doveUpload 飞鸽(德芙)上传
 *  $.fn.jkj('doveUpload',options)调用
 */
$.jkj.doveUpload = function (options, selector) {
	var _doveUpload = this;

	_doveUpload.settings = $.extend(true, {}, $.jkj.doveUpload.defaults, options);
	if (selector.length > 1) {
		_doveUpload.uploads = [];
		$(selector).each(function () {
			_doveUpload.uploads.push(new $.jkj.doveUpload(_doveUpload.settings, this));
		});
	}
	else if (selector.length === 1) {
		_doveUpload.element = selector;
		_doveUpload.id = null;
		_doveUpload.init();
	}
};
$.extend($.jkj.doveUpload, {
	// 默认配置信息
	defaults: {
		jkj: {
			// 标题
			title: '&nbsp;',
			// 应用 id
			appId: 0,
			// 模块 id
			moduleId: 0,
			// 启用编辑
			enableEdit: true,
			// 文件服务中心链接
			fileServerUrl: '',
			// 上传的扩展数据。类型 Object 或 Function，如 {id: 100, value: '100 Details'}
			uploadExtraData: function (id) {
				var obj = {
					jkjtest: true
				};

				return obj;
			},
			/** 文件类型。类型对象数组
			 * 对象属性：
			 * id 类型id
			 * name 类型名称
			 * maxCount 最大上传数量
			 */
			fileTypes: [],
			/** 初始显示的文件集合。类型对象数组
			 * 对象属性：
			 * id 文件id
			 * name 文件名称
			 * typeId 文件类型
			 * extension 文件扩展名
			 * source 文件来源（1传、2生、其他不显示）
			 */
			files: [],
			// 移除事件
			delete: null,
			// 取消事件
			cancel: null,
			// 保存事件
			save: null,
		},
		// 是否异步上传
		uploadAsync: false,
		// 异步提交设置
		ajaxSettings: {
			xhrFields: {
				withCredentials: true
			}
		},
		// 最大总的文件大小，单位 mb
		maxTotalSize: 200,
		// 最小上传文件大小。单位 kb
		minFileSize: 0,
		// 最大上传文件大小。单位 kb
		maxFileSize: 10240,
		// 最小上传文件个数。
		minFileCount: 0,
		// 最大上传文件个数。
		maxFileCount: 20,
		// 最大文件预览大小。单位 kb
		maxFilePreviewSize: 102400,
		//上传组件国际化，默认中文
		language: 'zh',
		// 提交表单是否必须选择一个文件
		required: false,
		// Right-To-Left (RTL)模式
		rtl: false,
		// 是否隐藏缩略的预览内容
		hiddenThumbnailContent: false,
		// 是否显示标题
		showCaption: true,
		// 是否显示文件预览
		showPreview: true,
		// 是否显示文件隐藏/清除按钮
		showRemove: true,
		// 是否显示文件上传按钮
		showUpload: true,
		// 是否显示文件上传取消按钮
		showCancel: true,
		// 预览中是否显示关闭图标
		showClose: true,
		// 异步上传时是否总是显示之前上传完毕的文件缩略预览；如果设为false，上传下一批图片时将清除之前的缩略图
		showUploadedThumbs: false,
		// 是否显示文件浏览按钮
		showBrowse: true,
		// 点击预览区域时是否文件浏览或选中
		browseOnZoneClick: true,
		// 超出上传数量限制之后是否自动替换被选中的文件，只有在 maxFileCount 设置之后才有效
		autoReplace: false,
		// 是否自动定位图像基于EXIF方向显示
		autoOrientImage: true,
		// 额外添加标题的 css class 
		captionClass: '',
		// 额外添加预览的 css class
		previewClass: '',
		// 额外添加主插件容器的css class
		mainClass: '',
		// css class 将被添加到每一个缩略框架上面
		frameClass: 'krajee-default',
		// 是否在预览中显示净化后的html内容
		purifyHtml: true,
		// 回调方法，生成对大众友好的文件大小表示
		fileSizeGetter: false,
		// 初始化将被显示的预览内容，类型字符串或者字符串数组
		initialPreview: [],
		// initialPreview 设为字符串时，根据定义的分隔符把多个预览文件分隔开
		initialPreviewDelimiter: '*$$*',
		// 是否把初始化内容转化为数据而不是行内容
		initialPreviewAsData: true,
		// 在 previewSettings 中定义的文件模板类型之一
		initialPreviewFileType: 'generic',
		// 为  initialPreview 中定义的每一项设置重要的属性
		initialPreviewConfig: [],
		// 发生错误时是否将文件缩略从预览中移除
		removeFromPreviewOnError: false,
		// 替换缩略图模板中使用的标记列表
		previewThumbTags: {},
		// 这个是对 previewThumbTags 的扩展，主要针对初始化预览的内容
		initialPreviewThumbTags: [],
		// 初始化预览标题内容显示，如果没有设置值并且 initialPreview 设为 true 将默认显示多少个文件被上传
		initialCaption: '',
		// 是否期望重写初始化预览内容和标题配置
		overwriteInitial: true,
		// 布局模板
		layoutTemplates: {
			// 脚部
			footer: ''
			+ '<div class="file-thumbnail-footer"> \n'
			+ '    <div class="file-footer-caption" title="{caption}">{caption}<br>{size}</div> \n'
			+ '    {actions} \n'
			+ '</div>',
			// 操作
			actions: ''
			+ '<div class="file-actions"> \n'
			+ '    <div class="file-footer-buttons"> \n'
			+ '        {upload} {delete} {zoom} {other} \n'
			+ '    </div> \n'
			+ '    {drag} \n'
			+ '    <div class="file-upload-indicator" title="{indicatorTitle}">{indicator}</div> \n'
			+ '    <div class="clearfix"></div> \n'
			+ '</div>'
		},
		// 重构每一个文件类型预览的模板定义
		previewTemplates: {},
		// 预览文件类型的 css 设置
		previewSettings: {
			image: { width: "213px", height: "160px" },
			html: { width: "213px", height: "160px" },
			text: { width: "213px", height: "160px" },
			video: { width: "213px", height: "160px" },
			audio: { width: "213px", height: "160px" },
			flash: { width: "213px", height: "160px" },
			object: { width: "213px", height: "160px" },
			pdf: { width: "213px", height: "160px" },
			other: { width: "213px", height: "160px" }
		},
		// 适应小屏
		previewSettingsSmall: {
			image: { width: "auto", height: "auto", 'max-width': "100%", 'max-height': "100%" },
			html: { width: "100%", height: "160px" },
			text: { width: "100%", height: "160px" },
			office: { width: "100%", height: "160px" },
			video: { width: "100%", height: "auto" },
			audio: { width: "100%", height: "30px" },
			flash: { width: "100%", height: "auto" },
			object: { width: "100%", height: "auto" },
			pdf: { width: "100%", height: "160px" },
			other: { width: "100%", height: "160px" }
		},
		// 允许上传的文件类型
		allowedFileTypes: ['image', 'html', 'text', 'video', 'audio', 'flash', 'object'],
		// 允许上传的文件后缀名
		allowedFileExtensions: [],
		// 允许预览的文件类型
		allowedPreviewTypes: [],
		// 预览文件图标默认设置
		previewFileIcon: '<div class="upload"><i class="" style="height:auto;"></i></div>',
		// 预览文件图标设置
		previewFileIconSettings: {
			'pdf': '<div class="upload"><i class="upload-pdf" style="height:auto;"></i></div>',
			'doc': '<div class="upload"><i class="upload-doc" style="height:auto;"></i></div>',
			'xls': '<div class="upload"><i class="upload-xls" style="height:auto;"></i></div>',
			'ppt': '<div class="upload"><i class="upload-ppt" style="height:auto;"></i></div>',
			'jpg': '<div class="upload"><i class="upload-jpg" style="height:auto;"></i></div>',
			'png': '<div class="upload"><i class="upload-png" style="height:auto;"></i></div>'
		},
		// 预览文件图标扩展设置
		previewFileExtSettings: {
			'doc': function (ext) {
				return ext.match(/(doc|docx)$/i);
			},
			'xls': function (ext) {
				return ext.match(/(xls|xlsx)$/i);
			},
			'ppt': function (ext) {
				return ext.match(/(ppt|pptx)$/i);
			}
		},
		fileActionSettings: {
			showUpload: false,
			showZoom: false,
			showDrag: false
		},
		// 模板
		templates: {
			uploadFrame: '' +
			'<div class="page-containers"> \n' +
			'    <div class="form-title">{{title}}' +
			'        <label class="right"> \n' +
			'        <a id="{{id}}-edit" class="btn-edit glyphicon glyphicon-edit {{editClass}}" href="javascript:void(0)">编辑</a> \n' +
			'        <a id="{{id}}-upload" class="btn-edit glyphicon glyphicon-upload hide" href="javascript:void(0)">上传附件</a> \n' +
			'    </div> \n' +
			'    <div class="tabbable"> \n' +
			'        <ul class="nav nav-tabs"> \n' +
			'            {{tabItems}}' +
			'        </ul> \n' +
			'        <div class="tab-content"> \n' +
			'            {{tabPanes}}' +
			'       </div> \n' +
			'    </div> \n' +
			'    <input id="{{id}}-fileIds" type="hidden" name="fileIds" value="" /> \n' +
			'    <div id="{{id}}-btnSubmit" class="btn-submit hide"> \n' +
			'        <button type="button" id="{{id}}-cancel" class="btn btn-cancel btn-font4">取消</button> \n' +
			'        <button type="button" id="{{id}}-save" class="btn btn-primary">保存</button> \n' +
			'    </div> \n' +
			'</div> \n',
			tabItem: '' +
			'<li class="{{tabActive}}" data-fileTypeId="{{fileTypeId}}" > \n' +
			'    <a data-toggle="tab" href="#{{id}}-tabPane{{fileTypeId}}" id="{{id}}-tab{{fileTypeId}}">{{fileTypeName}} ( <span class="red" id="{{id}}-fileCount{{fileTypeId}}" >0</span> )</a> \n' +
			'</li> \n',
			tabPane: '' +
			'<div id="{{id}}-tabPane{{fileTypeId}}" class="tab-pane {{tabActive}}"> \n' +
			'    <ul id="{{id}}-tabBody{{fileTypeId}}" data-maxCount="{{fileTypeMaxCount}}" style="list-style: none; margin-left: -40px"></ul> \n' +
			'    <div class="clearfix"></div> \n' +
			'</div> \n',
			fileTypeOption: '<option value="{{fileTypeId}}">{{fileTypeName}}</option> \n',
			fileItem: '' +
			'<li class="upload" data-fileType="{{fileTypeId}}" data-fileId="{{fileId}}" style="float: left; margin-left: 15px; text-align: center"> \n' +
			'    <a href="{{downloadUrl}}" target="_blank" class="{{uploadClass}}"> \n' +
			'        <label title="{{fileName}}">{{fileName}}</label> \n' +
			'        <span class="file-delete" {{fileDeleteStyle}} ></span> \n' +
			'    </a> \n' +
			'    <mark class="{{fileMarkClass}}">{{fileMarkContent}}</mark> \n' +
			'</li> \n',
			uploadModal: '' +
			'    <div id="{{id}}-modal" class="modal fade fileupload" tabindex="-1" role="dialog" aria-labelledby="{{id}}-modal-title" aria-hidden="true" > \n' +
			'        <div class="modal-dialog" role="document" style="width: 845px;"> \n' +
			'            <div class="modal-content"> \n' +
			'                <button type="button" class="close" data-dismiss="modal" aria-label="Close"> \n' +
			'                     <span aria-hidden="true">&times;</span> \n' +
			'                 </button> \n' +
			'                 <div class="modal-header"> \n' +
			'                     <h4 class="modal-title">上传文件</h4> \n' +
			'                 </div> \n' +
			'                 <div class="modal-body"> \n' +
			'                     <form enctype="multipart/form-data"> \n' +
			'                         <div class="row"> \n' +
			'                             <div class="col-xs-12 row-void row-form"> \n' +
			'                                 <div class="col-xs-2 text-right">文件类型：</div> \n' +
			'                                 <div class="col-xs-10"> \n' +
			'                                     <select id="{{id}}-modal-sltFileType" name="typeId" class="form-control" >{{fileTypeOptions}}</select> \n' +
			'                                 </div> \n' +
			'                             </div> \n' +
			'                         </div> \n' +
			'                         <div class="row"> \n' +
			'                             <div class="col-xs-12 row-void row-form"> \n' +
			'                                 <input type="file" id="{{id}}-inputFile" name="files" class="file" multiple style="width: 300px;" /> \n' +
			'                             </div> \n' +
			'                         </div> \n' +
			'                     </form> \n' +
			'                 </div> \n' +
			'            </div> \n' +
			'        </div> \n' +
			'    </div> \n'
		}
	},
	// 设置默认配置信息
	setDefaults: function (settings) {
		$.extend($.jkj.doveUpload.defaults, settings);
	},
	prototype: {
		// 初始化
		init: function () {
			var _root = this, settings = _root.settings, element = _root.element, jkjUtil = $.jkj.util;

			_root.id = $(element).attr('id') || ('doveUpload' + jkjUtil.random.getLongDateString());
			_root.__build();
			_root.__events();

			settings.uploadUrl = settings.jkj.fileServerUrl + '/files';
			settings.uploadExtraData = function () {
				var obj = {
					appId: settings.jkj.appId,
					moduleId: settings.jkj.moduleId,
					typeId: $('#' + _root.id + '-modal-sltFileType').val()
				}, extraData;

				if (settings.jkj.uploadExtraData) {
					if ($.isFunction(settings.jkj.uploadExtraData)) {
						extraData = settings.jkj.uploadExtraData();
					} else {
						extraData = settings.jkj.uploadExtraData;
					}
				}

				return $.extend(true, {}, obj, extraData);
			};


			_root.fileinput = $('#' + _root.id + '-inputFile').fileinput(settings);
			_root.modal = $('#' + _root.id + '-modal').modal({
				backdrop: 'static',
				keyboard: true,
				remote: false,
				show: false
			});

		},
		// 构建
		__build: function () {
			var _root = this, settings = _root.settings, element = _root.element, templates = settings.templates;
			var context = {}, html = '', fileIds = '', $fileIds;
			var idSelector = '#' + _root.id;

			context.id = _root.id;
			context.title = settings.jkj.title;
			context.appId = settings.jkj.appId;
			context.moduleId = settings.jkj.moduleId;
			context.editClass = settings.jkj.enableEdit ? '' : ' hide';
			context.tabItems = '';
			context.tabPanes = '';
			context.fileTypeOptions = '';

			// 初始化 tab 标签切换内容
			$.each(settings.jkj.fileTypes, function (index, fileType) {
				context.fileTypeId = fileType.id;
				context.fileTypeName = fileType.name;
				context.fileTypeMaxCount = fileType.maxCount;
				context.tabActive = '';

				if (index === 0) {
					context.tabActive = 'active';
				}
				context.tabItems += templates.tabItem.replace(/{{(\w*?)}}/g, function (fullReg, word) {
					return context[word];
				});
				context.tabPanes += templates.tabPane.replace(/{{(\w*?)}}/g, function (fullReg, word) {
					return context[word];
				});
				context.fileTypeOptions += templates.fileTypeOption.replace(/{{(\w*?)}}/g, function (fullReg, word) {
					return context[word];
				});
			});
			// 初始化上传整体框架
			$(element).html(templates.uploadFrame.replace(/{{(\w*?)}}/g, function (fullReg, word) {
				return context[word];
			}));
			// 向 body 添加上传弹出层
			$('body').append(templates.uploadModal.replace(/{{(\w*?)}}/g, function (fullReg, word) {
				return context[word];
			}));
			// 文件 id 集隐藏域控件
			$fileIds = $(idSelector + '-fileIds');
			// 向 tab 内容区填充文件
			$.each(settings.jkj.files, function (index, file) {
				var fileCount, $fileCount, $tabBody;

				$fileCount = $('#' + context.id + '-fileCount' + file.typeId);
				fileCount = parseInt($fileCount.text());
				$tabBody = $('#' + context.id + '-tabBody' + file.typeId);
				_root.__fileContext(context, file);
				context.fileDeleteStyle = ' style="display:none !important;"';

				$tabBody.append(templates.fileItem.replace(/{{(\w*?)}}/g, function (fullReg, word) {
					return context[word];
				}));
				$fileCount.text(++fileCount);
				if (fileIds === '') {
					fileIds += file.id;
				} else {
					fileIds += ',' + file.id;
				}
				$fileIds.val(fileIds);
			});
		},
		__events: function () {
			var _root = this, settings = _root.settings, element = _root.element, templates = settings.templates;
			var idSelector = '#' + _root.id;

			// 点击编辑事件
			$(idSelector + '-edit').on('click', function (e) {
				e.preventDefault();
				$(idSelector + '-upload').removeClass('hide');
				$(idSelector + '-btnSubmit').removeClass('hide');
				$(idSelector + '-upload').show();
				$(idSelector + '-btnSubmit').show();
				$(idSelector).find('.file-delete').show();
				$(this).hide();
			});
			// 点击文件右上角删除事件
			$(idSelector).on('click', '.file-delete', function (e) {
				e.preventDefault();
				var fileTypeId = $(this).closest("li").attr("data-fileType"),
					fileId = $(this).closest("li").attr("data-fileId"),
					$fileCount = $(idSelector + '-fileCount' + fileTypeId),
					fileCount = parseInt($fileCount.text()),
					$fileIds = $(idSelector + '-fileIds'),
					fileIds = $fileIds.val(),
					newFileIds = (',' + fileIds + ',').replace((',' + fileId + ','), ',');

				settings.jkj.delete && settings.jkj.delete.call(this, e);
				$fileCount.text(--fileCount);
				$fileIds.val(newFileIds.substr(1, newFileIds.length - 2));
				$(this).closest("li").addClass('doveUpload-file-deleted').hide();
			});
			// 点击上传事件
			$(idSelector + '-upload').on('click', function (e) {
				e.preventDefault();
				$(idSelector + '-modal-sltFileType').val($(idSelector).find('.nav-tabs .active').attr('data-fileTypeId'));
				$(idSelector + '-modal').modal('show');
			});
			// 点击取消事件
			$(idSelector + '-cancel').on('click', function (e) {
				e.preventDefault();
				settings.jkj.cancel && settings.jkj.cancel.call(this, e);
				$(idSelector).find('.file-delete').attr('style', 'display:none !important');
				$(idSelector + '-edit').show();
				$(idSelector + '-upload').hide();
				$(idSelector + '-btnSubmit').hide();
				$(idSelector).find('.doveUpload-file-deleted').each(function(){
					var fileTypeId = $(this).attr("data-fileType"),
					fileId = $(this).attr("data-fileId"),
					$fileCount = $(idSelector + '-fileCount' + fileTypeId),
					fileCount = parseInt($fileCount.text()),
					$fileIds = $(idSelector + '-fileIds'),
					fileIds = $fileIds.val();
					
					if (fileIds === '') {
						fileIds += fileId;
					} else {
						fileIds += ',' + fileId;
					}
					$fileCount.text(++fileCount);
					$fileIds.val(fileIds);
					$(this).removeClass('doveUpload-file-deleted');
					$(this).show();
				});
			});
			// 点击保存事件
			$(idSelector + '-save').on('click', function (e) {
				e.preventDefault();
				settings.jkj.save && settings.jkj.save.call(this, e);
				$(idSelector).find('.file-delete').attr('style', 'display:none !important');
				$(idSelector + '-edit').show();
				$(idSelector + '-upload').hide();
				$(idSelector + '-btnSubmit').hide();
				$(idSelector).find('.doveUpload-file-deleted').remove();
			});
			// 模态框完全消失后回调
			$(idSelector + '-modal').on('hidden.bs.modal', function (e) {
				e.preventDefault();
				// 清除已上传文件
				$(idSelector + '-inputFile').fileinput("clear");
				// 清除文件堆栈
				$(idSelector + '-inputFile').fileinput("clearStack");
			});
			// 文件上传失败后回调
			$(idSelector + '-inputFile').on('filebatchuploaderror', function (e, data, msg) {
				e.preventDefault();
				if (window.console) {
					console.log('event:');
					console.log(e);
					console.log('errorData:');
					console.log(data);
					console.log('errorMsg:' + msg);
				}
			});
			// 文件加载完成之后回调
			$(idSelector + '-inputFile').on('fileloaded', function (e, file, previewId, index, reader) {
				var newName = '', fileName = file.name;

				if (fileName.indexOf('.') >= 0) {
					var index = fileName.lastIndexOf('.');
					newName = fileName.substring(0, index).cutString(4) + fileName.substr(index);
				} else {
					newName = fileName.cutString(4);
				}
				$('#' + previewId).find('.file-footer-caption').html(newName);
			});
			// 文件上传前验证
			$(idSelector + '-inputFile').on('filebatchpreupload', function (e, data, previewId, index) {
				var fileTypeId = $(idSelector + '-modal-sltFileType').val(),
					$tabBody = $(idSelector + '-tabBody' + fileTypeId),
					count = data.filescount + $tabBody.find('li').length,
					maxCount = $tabBody.attr('data-maxCount') || 1,
					totalSize = 0;

				if (maxCount < count) {
					return {
						message: "所上传类型附件个数不能超过：" + maxCount + "个",
						data: {}
					};
				}
				$.each(data.files, function (index, item) {
					if (item) {
						totalSize += item.size;
					}
				});
				if (totalSize / 1048576 > settings.maxTotalSize) {
					return {
						message: "所上传附件总大小不能超过：" + settings.maxTotalSize + "M",
						data: {}
					};
				}
			});
			// 文件上传成功之后回调
			$(idSelector + '-inputFile').on('filebatchuploadsuccess', function (e, data, previewId, index) {
				var fileTypeId = $(idSelector + '-modal-sltFileType').val(),
					$tabBody = $(idSelector + '-tabBody' + fileTypeId),
					$tab = $(idSelector + '-tab' + fileTypeId),
					$fileIds = $(idSelector + '-fileIds'),
					fileIds = $fileIds.val();

				$.each(data.response.data, function (index, file) {
					var $fileCount = $(idSelector + '-fileCount' + fileTypeId),
						fileCount = parseInt($fileCount.text()),
						context = {};

					file.source = 1;
					_root.__fileContext(context, file);
					context.fileDeleteStyle = '';
					$tabBody.append(templates.fileItem.replace(/{{(\w*?)}}/g, function (fullReg, word) {
						return context[word];
					}));
					if (fileIds === '') {
						fileIds += file.id;
					} else {
						fileIds += ',' + file.id;
					}
					$fileCount.text(++fileCount);
				});
				$fileIds.val(fileIds);
				$tab.click();
				$(idSelector + '-modal').modal('hide');
			});
		},
		__fileContext: function (context, file) {
			var _root = this, settings = _root.settings;

			context.fileId = file.id;
			context.fileName = file.name;
			context.fileTypeId = file.typeId;
			context.extension = file.extension || '';
			if (context.extension.length === 0 && context.fileName.indexOf('.') != -1) {
				context.extension = context.fileName.substr(context.fileName.lastIndexOf('.') + 1);
			}
			context.uploadClass = 'upload-' + context.extension;
			context.downloadUrl = settings.jkj.fileServerUrl + '/file/' + file.id;
			if (file.source) {
				if (file.source == 2) {
					context.fileMarkClass = 'bg-red';
					context.fileMarkContent = '生';
				}
				else if (file.source == 1) {
					context.fileMarkClass = 'bg-green';
					context.fileMarkContent = '传';
				}
				else {
					context.fileMarkClass = ' hide';
					context.fileMarkContent = '';
				}
			}
			else {
				context.fileMarkClass = ' hide';
				context.fileMarkContent = '';
			}
		}
	}
});