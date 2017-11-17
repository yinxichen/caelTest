/* AdminJKJ $.jkjWidgets.demo
 * ==========================
 * @作者 潘明星
 * @日期 2017-03-23
 * 
 * 修改日志：
 * 
 */
/*! jkj.demo 示例
 *  基于jquery ui 的 widget 实现的一个示例。
 */
+(function($) {
	$.widget("jkjWidgets.demo", {
		// 默认参数
		options: {

			// 模型
			model: null,
			// 放置地方，widgets 部件集， workbench 工作台
			place: 'widgets',
			// 关闭方法
			closeHandle: null
		},
		// 模板
		_templates: {
			header: function(title) {
				var html = [];

				html.push('<div class="workbench-widget-header">');
				html.push('	<h4 class="workbench-widget-title">' + title + '</h4>');
				html.push('</div>');

				return html.join('\n');
			},
			closeButton: function() {
				var html = [];

				html.push('	<button class="workbench-widget-close none">');
				html.push('		<span>×</span>');
				html.push('	</button>');

				return html.join('\n');
			},
			body: function() {
				var html = [];

				html.push('<div class="workbench-widget-body">');
				html.push('</div>');

				return html.join('\n');
			}
		},
		// 初始化
		_init: function() {
			
		},
		// 创建控件，事件绑定
		_create: function() {
			var title = '示例';

			this.element.append(this._templates.header(title));			
			if(this.options.place == 'workbench') {
				this.element.append(this._templates.body());
				this.element.find('.workbench-widget-header').append(this._templates.closeButton());
				this._buildWorkbench();
			} else {
				this._buildWidget();
			}
		},
		// 设置单个参数
		_setOption: function(key, value) {
			//      	if ( key === "width" ) {
			//				this.element.width( value );
			//			}
			//			if ( key === "height" ) {
			//				this.element.height( value );
			//			}
			this._super(key, value);
		},
		// 设置多个参数
		_setOptions: function(options) {
			var that = this;

			$.each(options, function(key, value) {
				that._setOption(key, value);
			});
		},
		// 销毁部件
		_destroy: function() {
			//this.element.removeClass( "progressbar" ).text( "" );
		},
		
		_getUrlFromUrls: function(urls,urlCode){
			for(var i=0;i<urls.length;i++){
				if(urls[i].urlCode == urlCode){
					return urls[i].url;
				}
			}
		},
		_getTitleFromUrls: function(urls,urlCode){
			for(var i=0;i<urls.length;i++){
				if(urls[i].urlCode == urlCode){
					return urls[i].title;
				}
			}
		},
		// 创建工作台
		_buildWorkbench: function() {
			var body = this.element.find('.workbench-widget-body');
			this.options.closeHandle= this._closeHandle;
//			console.log(this.options.extendInfo.url.widgetUrl1);
//			console.log(this.options.extendInfo.title.title1);
			switch(this.options.model) {
				case 'company-privatepool-quicklook:list':
					{
						body.append('<div id="widget1"></div> ');
						body.prev().find(".workbench-widget-title").html(this._getTitleFromUrls(this.options.extendInfo,this.options.model));
						var url = this._getUrlFromUrls(this.options.extendInfo,this.options.model);
						$('#widget1').loadWithZoneLayer(url, null, function (data, myLayer) {
			                $(".workbench-widget-body").height(function(){
								var heightH = $(this).parents(".workbench-widget").height() - 54;
				            	return heightH;
							});
			                myLayer.close();
			            }, false);
					};
					break;
				case 'company-order-num:list':
					{
						body.append('<div id="widget2"></div> ');
						body.prev().find(".workbench-widget-title").html(this._getTitleFromUrls(this.options.extendInfo,this.options.model));
						var url = this._getUrlFromUrls(this.options.extendInfo,this.options.model);
						$('#widget2').loadWithZoneLayer(url, null, function (data, myLayer) {
			                $(".workbench-widget-body").height(function(){
								var heightH = $(this).parents(".workbench-widget").height() - 54;
				            	return heightH;
							});
			                myLayer.close();
			            }, false);
					};
					break;
				case 'body-fund-usage:list':
					{
						body.append('<div id="widget3"></div> ');
						body.prev().find(".workbench-widget-title").html(this._getTitleFromUrls(this.options.extendInfo,this.options.model));
						var url = this._getUrlFromUrls(this.options.extendInfo,this.options.model);
						$('#widget3').loadWithZoneLayer(url, null, function (data, myLayer) {
			                $(".workbench-widget-body").height(function(){
								var heightH = $(this).parents(".workbench-widget").height() - 54;
				            	return heightH;
							});
			                myLayer.close();
			            }, false);
					};
					break;
				case 'company-visitPlan-workbench:list':
					{
						body.append('<div id="widget4"></div> ');
						body.prev().find(".workbench-widget-title").html(this._getTitleFromUrls(this.options.extendInfo,this.options.model));
						var url = this._getUrlFromUrls(this.options.extendInfo,this.options.model);
						$('#widget4').loadWithZoneLayer(url, null, function (data, myLayer) {
			                $(".workbench-widget-body").height(function(){
								var heightH = $(this).parents(".workbench-widget").height() - 54;
				            	return heightH;
							});
			                myLayer.close();
			            }, false);
					};
					break;
				case 'body-export-amount:list':
					{
						body.append('<div id="widget5"></div> ');
						body.prev().find(".workbench-widget-title").html(this._getTitleFromUrls(this.options.extendInfo,this.options.model));
						var url = this._getUrlFromUrls(this.options.extendInfo,this.options.model);
						$('#widget5').loadWithZoneLayer(url, null, function (data, myLayer) {
			                $(".workbench-widget-body").height(function(){
								var heightH = $(this).parents(".workbench-widget").height() - 54;
				            	return heightH;
							});
			                myLayer.close();
			            }, false);
					};
					break;
				case 'sign-ranking-list:list':
					{
						body.append('<div id="widget6"></div> ');
						body.prev().find(".workbench-widget-title").html(this._getTitleFromUrls(this.options.extendInfo,this.options.model));
						var url = this._getUrlFromUrls(this.options.extendInfo,this.options.model);
						$('#widget6').loadWithZoneLayer(url, null, function (data, myLayer) {
			                $(".workbench-widget-body").height(function(){
								var heightH = $(this).parents(".workbench-widget").height() - 54;
				            	return heightH;
							});
			                myLayer.close();
			            }, false);
					};
					break;
				case 'common-tools:list':
					{
						body.append('<div id="widget7"></div> ');
						body.prev().find(".workbench-widget-title").html(this._getTitleFromUrls(this.options.extendInfo,this.options.model));
						var url = this._getUrlFromUrls(this.options.extendInfo,this.options.model);
						$('#widget7').loadWithZoneLayer(url, null, function (data, myLayer) {
			                $(".workbench-widget-body").height(function(){
								var heightH = $(this).parents(".workbench-widget").height() - 54;
				            	return heightH;
							});
			                myLayer.close();
			            }, false);
					};
					break;
				case 'customers-visited:list':
					{
						body.append('<div id="widget8"></div> ');
						body.prev().find(".workbench-widget-title").html(this._getTitleFromUrls(this.options.extendInfo,this.options.model));
						var url = this._getUrlFromUrls(this.options.extendInfo,this.options.model);
						$('#widget8').loadWithZoneLayer(url, null, function (data, myLayer) {
			                $(".workbench-widget-body").height(function(){
								var heightH = $(this).parents(".workbench-widget").height() - 54;
				            	return heightH;
							});
			                myLayer.close();
			            }, false);
					};
					break;
				case 'department-order-num:list':
					{
						body.append('<div id="widget9"></div> ');
						body.prev().find(".workbench-widget-title").html(this._getTitleFromUrls(this.options.extendInfo,this.options.model));
						var url = this._getUrlFromUrls(this.options.extendInfo,this.options.model);
						$('#widget9').loadWithZoneLayer(url, null, function (data, myLayer) {
			                $(".workbench-widget-body").height(function(){
								var heightH = $(this).parents(".workbench-widget").height() - 54;
				            	return heightH;
							});
			                myLayer.close();
			            }, false);
					};
					break;
				case 'department-order-amount:list':
					{
						body.append('<div id="widget10"></div> ');
						body.prev().find(".workbench-widget-title").html(this._getTitleFromUrls(this.options.extendInfo,this.options.model));
						var url = this._getUrlFromUrls(this.options.extendInfo,this.options.model);
						$('#widget10').loadWithZoneLayer(url, null, function (data, myLayer) {
			                $(".workbench-widget-body").height(function(){
								var heightH = $(this).parents(".workbench-widget").height() - 54;
				            	return heightH;
							});
			                myLayer.close();
			            }, false);
					};
					break;
				case 'customers-face-visited:list':
					{
						body.append('<div id="widget11"></div> ');
						body.prev().find(".workbench-widget-title").html(this._getTitleFromUrls(this.options.extendInfo,this.options.model));
						var url = this._getUrlFromUrls(this.options.extendInfo,this.options.model);
						$('#widget11').loadWithZoneLayer(url, null, function (data, myLayer) {
			                $(".workbench-widget-body").height(function(){
								var heightH = $(this).parents(".workbench-widget").height() - 54;
				            	return heightH;
							});
			                myLayer.close();
			            }, false);
					};
					break;
				case 'company-order-amount-ranking:list':
					{
						body.append('<div id="widget12"></div> ');
						body.prev().find(".workbench-widget-title").html(this._getTitleFromUrls(this.options.extendInfo,this.options.model));
						var url = this._getUrlFromUrls(this.options.extendInfo,this.options.model);
						$('#widget12').loadWithZoneLayer(url, null, function (data, myLayer) {
			                $(".workbench-widget-body").height(function(){
								var heightH = $(this).parents(".workbench-widget").height() - 54;
				            	return heightH;
							});
			                myLayer.close();
			            }, false);
					};
					break;
				case 'company-export-amount:list':
					{
						body.append('<div id="widget13"></div> ');
						body.prev().find(".workbench-widget-title").html(this._getTitleFromUrls(this.options.extendInfo,this.options.model));
						var url = this._getUrlFromUrls(this.options.extendInfo,this.options.model);
						$('#widget13').loadWithZoneLayer(url, null, function (data, myLayer) {
			                $(".workbench-widget-body").height(function(){
								var heightH = $(this).parents(".workbench-widget").height() - 54;
				            	return heightH;
							});
			                myLayer.close();
			            }, false);
					};
					break;
				case 'department-export-amount:list':
					{
						body.append('<div id="widget14"></div> ');
						body.prev().find(".workbench-widget-title").html(this._getTitleFromUrls(this.options.extendInfo,this.options.model));
						var url = this._getUrlFromUrls(this.options.extendInfo,this.options.model);
						$('#widget14').loadWithZoneLayer(url, null, function (data, myLayer) {
			                $(".workbench-widget-body").height(function(){
								var heightH = $(this).parents(".workbench-widget").height() - 54;
				            	return heightH;
							});
			                myLayer.close();
			            }, false);
					};
					break;
				case 'sales-export-amount-ranking:list':
					{
						body.append('<div id="widget15"></div> ');
						body.prev().find(".workbench-widget-title").html(this._getTitleFromUrls(this.options.extendInfo,this.options.model));
						var url = this._getUrlFromUrls(this.options.extendInfo,this.options.model);
						$('#widget15').loadWithZoneLayer(url, null, function (data, myLayer) {
			                $(".workbench-widget-body").height(function(){
								var heightH = $(this).parents(".workbench-widget").height() - 54;
				            	return heightH;
							});
			                myLayer.close();
			            }, false);
					};
					break;
				default:
					{
						body.append('参数传递错误啦...');
					}
			}
			
		},
		// 创建小部件
		_buildWidget: function() {
			var header = this.element.find('.workbench-widget-header');
			switch(this.options.model) {
				case 'company-privatepool-quicklook:list':
					{
						header.find(".workbench-widget-title").html(this._getTitleFromUrls(this.options.extendInfo,this.options.model));
						header.find(".workbench-widget-title").prepend("<div style='font-size:30px; color:#c8dcf2;'><i class='glyphicon glyphicon-star'></i></div>");
						this.element.attr('data-gs-width', '12');
						this.element.attr('data-gs-height', '18');
						//body.append(this._getTitleFromUrls(this.options.extendInfo,this.options.model) + '小部件');
					};
					break;
				case 'company-order-num:list':
					{
						header.find(".workbench-widget-title").html(this._getTitleFromUrls(this.options.extendInfo,this.options.model));
						header.find(".workbench-widget-title").prepend("<div style='font-size:30px; color:#c8dcf2;'><i class='glyphicon glyphicon-eur'></i></div>");
						this.element.attr('data-gs-width', '6');
						this.element.attr('data-gs-height', '9');
						//body.append(this._getTitleFromUrls(this.options.extendInfo,this.options.model) + '小部件');
					};
					break;
				case 'body-fund-usage:list':
					{
						header.find(".workbench-widget-title").html(this._getTitleFromUrls(this.options.extendInfo,this.options.model));
						header.find(".workbench-widget-title").prepend("<div style='font-size:30px; color:#c8dcf2;'><i class='glyphicon glyphicon-cloud'></i></div>");
						this.element.attr('data-gs-width', '6');
						this.element.attr('data-gs-height', '9');
						//body.append(this._getTitleFromUrls(this.options.extendInfo,this.options.model) + '小部件');
					};
					break;
				case 'company-visitPlan-workbench:list':
					{
						header.find(".workbench-widget-title").html(this._getTitleFromUrls(this.options.extendInfo,this.options.model));
						header.find(".workbench-widget-title").prepend("<div style='font-size:30px; color:#c8dcf2;'><i class='glyphicon glyphicon-envelope'></i></div>");
						this.element.attr('data-gs-width', '6');
						this.element.attr('data-gs-height', '9');
						//body.append(this._getTitleFromUrls(this.options.extendInfo,this.options.model) + '小部件');
					};
					break;
				case 'body-export-amount:list':
					{
						header.find(".workbench-widget-title").html(this._getTitleFromUrls(this.options.extendInfo,this.options.model));
						header.find(".workbench-widget-title").prepend("<div style='font-size:30px; color:#c8dcf2;'><i class='glyphicon glyphicon-film'></i></div>");
						this.element.attr('data-gs-width', '6');
						this.element.attr('data-gs-height', '9');
						//body.append(this._getTitleFromUrls(this.options.extendInfo,this.options.model) + '小部件');
					};
					break;
				case 'sign-ranking-list:list':
					{
						header.find(".workbench-widget-title").html(this._getTitleFromUrls(this.options.extendInfo,this.options.model));
						header.find(".workbench-widget-title").prepend("<div style='font-size:30px; color:#c8dcf2;'><i class='glyphicon glyphicon-home'></i></div>");
						this.element.attr('data-gs-width', '6');
						this.element.attr('data-gs-height', '9');
						//body.append(this._getTitleFromUrls(this.options.extendInfo,this.options.model) + '小部件');
					};
					break;
				case 'common-tools:list':
					{
						header.find(".workbench-widget-title").html(this._getTitleFromUrls(this.options.extendInfo,this.options.model));
						header.find(".workbench-widget-title").prepend("<div style='font-size:30px; color:#c8dcf2;'><i class='glyphicon glyphicon-lock'></i></div>");
						this.element.attr('data-gs-width', '6');
						this.element.attr('data-gs-height', '9');
						//body.append(this._getTitleFromUrls(this.options.extendInfo,this.options.model) + '小部件');
					};
					break;
				case 'customers-visited:list':
					{
						header.find(".workbench-widget-title").html(this._getTitleFromUrls(this.options.extendInfo,this.options.model));
						header.find(".workbench-widget-title").prepend("<div style='font-size:30px; color:#c8dcf2;'><i class='glyphicon glyphicon-fire'></i></div>");
						this.element.attr('data-gs-width', '6');
						this.element.attr('data-gs-height', '9');
						//body.append(this._getTitleFromUrls(this.options.extendInfo,this.options.model) + '小部件');
					};
					break;
				case 'department-order-num:list':
					{
						header.find(".workbench-widget-title").html(this._getTitleFromUrls(this.options.extendInfo,this.options.model));
						header.find(".workbench-widget-title").prepend("<div style='font-size:30px; color:#c8dcf2;'><i class='glyphicon glyphicon-bullhorn'></i></div>");
						this.element.attr('data-gs-width', '6');
						this.element.attr('data-gs-height', '9');
						//body.append(this._getTitleFromUrls(this.options.extendInfo,this.options.model) + '小部件');
					};
					break;
				case 'department-order-amount:list':
					{
						header.find(".workbench-widget-title").html(this._getTitleFromUrls(this.options.extendInfo,this.options.model));
						header.find(".workbench-widget-title").prepend("<div style='font-size:30px; color:#c8dcf2;'><i class='glyphicon glyphicon-globe'></i></div>");
						this.element.attr('data-gs-width', '6');
						this.element.attr('data-gs-height', '9');
						//body.append(this._getTitleFromUrls(this.options.extendInfo,this.options.model) + '小部件');
					};
					break;
				case 'customers-face-visited:list':
					{
						header.find(".workbench-widget-title").html(this._getTitleFromUrls(this.options.extendInfo,this.options.model));
						header.find(".workbench-widget-title").prepend("<div style='font-size:30px; color:#c8dcf2;'><i class='glyphicon glyphicon-send'></i></div>");
						this.element.attr('data-gs-width', '6');
						this.element.attr('data-gs-height', '9');
						//body.append(this._getTitleFromUrls(this.options.extendInfo,this.options.model) + '小部件');
					};
					break;
				case 'company-order-amount-ranking:list':
					{
						header.find(".workbench-widget-title").html(this._getTitleFromUrls(this.options.extendInfo,this.options.model));
						header.find(".workbench-widget-title").prepend("<div style='font-size:30px; color:#c8dcf2;'><i class='glyphicon glyphicon-tower'></i></div>");
						this.element.attr('data-gs-width', '6');
						this.element.attr('data-gs-height', '9');
						//body.append(this._getTitleFromUrls(this.options.extendInfo,this.options.model) + '小部件');
					};
					break;
				case 'company-export-amount:list':
					{
						header.find(".workbench-widget-title").html(this._getTitleFromUrls(this.options.extendInfo,this.options.model));
						header.find(".workbench-widget-title").prepend("<div style='font-size:30px; color:#c8dcf2;'><i class='glyphicon glyphicon-piggy-bank'></i></div>");
						this.element.attr('data-gs-width', '6');
						this.element.attr('data-gs-height', '9');
						//body.append(this._getTitleFromUrls(this.options.extendInfo,this.options.model) + '小部件');
					};
					break;
				case 'department-export-amount:list':
					{
						header.find(".workbench-widget-title").html(this._getTitleFromUrls(this.options.extendInfo,this.options.model));
						header.find(".workbench-widget-title").prepend("<div style='font-size:30px; color:#c8dcf2;'><i class='glyphicon glyphicon-knight'></i></div>");
						this.element.attr('data-gs-width', '6');
						this.element.attr('data-gs-height', '9');
						//body.append(this._getTitleFromUrls(this.options.extendInfo,this.options.model) + '小部件');
					};
					break;
				case 'sales-export-amount-ranking:list':
					{
						header.find(".workbench-widget-title").html(this._getTitleFromUrls(this.options.extendInfo,this.options.model));
						header.find(".workbench-widget-title").prepend("<div style='font-size:30px; color:#c8dcf2;'><i class='glyphicon glyphicon-tree-deciduous'></i></div>");
						this.element.attr('data-gs-width', '6');
						this.element.attr('data-gs-height', '9');
						//body.append(this._getTitleFromUrls(this.options.extendInfo,this.options.model) + '小部件');
					};
					break;
				default:
					{
						header.append('参数传递错误啦...');
					}
			}
		},
		// 关闭调用的方法
		_closeHandle: function(){
			
		},
		// 获取模型集合
		getModels: function() {
			return ['widget1111', 'widget2222', 'widget3', 'widget4', 'widget5', 'widget6', 'widget7'];
		},
		// 获取拖动拷贝
		getDragClone: function() {
			return this._buildWorkbench();
		},
		// 保存组件
		saveWidget: function(){
			return {
				test: 'test',
				welcome: 'Hello World!'
			}
		}
	});
})(jQuery);