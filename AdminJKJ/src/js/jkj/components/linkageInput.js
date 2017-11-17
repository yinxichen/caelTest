/* AdminJKJ $.jkj.linkageInput()
 * ==========================
 * @作者 尹喜晨
 * @日期 2017-10-23
 * 
 * 修改日志：
 * 
 */
/*! linkageInput 仿jd省市区级联选择
 *  $.fn.jkj('linkageInput',options)调用
 */
$.jkj.linkageInput = function (options, selector) {
    this.settings = $.extend(true, {}, $.jkj.linkageInput.defaults, options);
    this.selector = selector;
    this.init();
};
$.extend($.jkj.linkageInput, {
    defaults: {
        //json路径
        urlcity: "",
        /*
            给省、市、区赋name值
            默认 names : ["provinceName","cityName","districtName"]
        */
        names: ['provinceName','cityName','districtName'],
        /*
            给省、市、区赋id值
            默认 id : ["provinceId","cityId","districtId"]
        */
        id: ['provinceId','cityId','districtId'],
        /*
            初始化城市
        */
        defaultCity: [],
        /**
         * 分隔符,默认'-'
         */
        part: "-",
        /**
         * 启用清除功能
         */
        enableClear: true,
        /**
         * 自定义级联内容
         * linkage: ['省份','城市','区县']
         */
        linkage: []
    },
    // 设置默认配置信息
    setDefaults: function (settings) {
        $.extend($.jkj.linkageInput.defaults, settings);
    },
    prototype: {
        init: function () {
            var _root = this,
                settings = _root.settings,
                selector = _root.selector,
                nameInput = settings.names,
                idInput = settings.id,
                cityDatas = [],
                cityArry = [];
            
            _root.addHidden(this, settings.defaultCity);
            if (settings.enableClear) {
                $(selector).wrap('<div class="input-group overdatetime"></div>');
                $(selector).parent().append(
                    '<span class="input-group-addon">' +
                    '	<span id="'+ selector[0].id +'remove" class="glyphicon glyphicon-remove"></span>' +
                    '</span>'
                );
                $('#' + selector[0].id + 'remove').on('click', function(e){
                    e.preventDefault();
                    _root.remove(this);
                });
            }
            /*点击触发*/
            selector.on("click", function (e) {
                if (cityDatas === undefined || cityDatas.length == 0) {
                    $.ajax({
                        url: settings.urlcity,
                        dataType: 'json',
                        async: false,
                        success: function (data) {
                            if (data.code == 0) {
                                cityDatas = data.data;
                                sessionStorage.setItem("cityJson", JSON.stringify(cityDatas));　
                            }else{
                                $.jkj.cleverNotify.error(data.msg + '操作失败',null,'self');
                            }
                        },
                        statusCode: {
                            404: function () {
                                alert("没有找到相关文件~~");
                            }
                        }
                    });
                    _root.selCity(this, e, cityDatas)
                } else {
                    cityDatas = JSON.parse(sessionStorage.getItem("cityJson"));
                    _root.selCity(this, e, cityDatas)
                }
            })
        },
        /*添加隐藏域 */
        addHidden: function(element, data){
            var that = element,
                _root = this,
                settings = _root.settings,
                selector = _root.selector,
                idInput = settings.id,
                nameInput = settings.names,
                part = settings.part;
            var lev = selector.data("name");
            if (document.getElementsByName(nameInput[0]).length == 0) {
                var hcitys = $('<input>', {
                    type: 'hidden',
                    name: nameInput[0],
                    "data-id": selector.data("id"),
                    val: data[0]
                });
                selector.after(hcitys);
                var bc = data[0];
            } else {
                $("input[name=" + nameInput[0] +"]").val(lev);
                $("input[name=" + nameInput[0] +"]").attr("data-id", selector.data("id"));
            }
            if (document.getElementById(idInput[0]) == null) {
                var icitys = $('<input>', {
                    type: 'hidden',
                    "data-id": selector.data("id"),
                    id: idInput[0],
                    val: data[0]
                });
                selector.after(icitys);
            } else {
                $("#" + idInput[0]).val(lev);
                $("#" + idInput[0]).attr("data-id",selector.data("id"));
            }
            if (document.getElementsByName(nameInput[1]).length == 0) {
                var hcitys = $('<input>', {
                    type: 'hidden',
                    name: nameInput[1],
                    "data-id": selector.data("id"),
                    val: data[1]
                });
                selector.after(hcitys);
                var bp = data[1];
            } else {
                $("input[name=" + nameInput[1] +"]").attr("data-id", selector.data("id"));
                $("input[name=" + nameInput[1] +"]").val(lev);
            }
            if (document.getElementById(idInput[1]) == null) {
                var icitys = $('<input>', {
                    type: 'hidden',
                    "data-id": selector.data("id"),
                    id: idInput[1],
                    val: data[1]
                });
                selector.after(icitys);
            } else {
                $("#" + idInput[1]).attr("data-id", selector.data("id"));
                $("#" + idInput[1]).val(lev);
            }
            if (document.getElementsByName(nameInput[2]).length == 0) {
                var hcitys = $('<input>', {
                    type: 'hidden',
                    name: nameInput[2],
                    "data-id": selector.data("id"),
                    val: data[2]
                });
                selector.after(hcitys);
                var ba = data[2];
            } else {
                $("input[name=" + nameInput[2] +"]").val(lev);
                $("input[name=" + nameInput[2] +"]").attr("data-id", selector.data("id"));
            }
            if (document.getElementById(idInput[2]) == null) {
                var icitys = $('<input>', {
                    type: 'hidden',
                    "data-id": selector.data("id"),
                    id: idInput[2],
                    val: data[2]
                });
                selector.after(icitys);
            } else {
                $("#" + idInput[2]).val(lev);
                $("#" + idInput[2]).attr("data-id", selector.data("id"));
            }
            for(var i = 0; i < data.length; i++){
                if(i == (data.length - 1)){
                    selector[0].value += data[i]
                }else{
                    selector[0].value += data[i] + part
                }
            }
        },
        /**
         * 清除地址
         */
        remove: function(element){
            var that = element,
            _root = this,
            settings = _root.settings,
            selector = _root.selector;
            selector[0].value = "";
            selector.parent().nextAll("[type=hidden]").val("");
        },
        /**
         * 选择省市区
         */
        selCity: function (element, e, data) {
            var that = element,
                _root = this,
                settings = _root.settings,
                selector = _root.selector,
                idInput = settings.id,
                nameInput = settings.names,
                part = settings.part;
            switch(settings.linkage.length){
                case 0: break;
                case 1: var template = '<div class="_citys"><span title="关闭" id="cColse" >×</span><ul id="_citysheng" class="_citys0"><li class="citySel">' + settings.linkage[0] + '</li></ul><div id="_citys0" class="_citys1"></div></div>';
                    break;
                case 2: var template = '<div class="_citys"><span title="关闭" id="cColse" >×</span><ul id="_citysheng" class="_citys0"><li class="citySel">' + settings.linkage[0] + '</li><li>' + settings.linkage[1] + '</li></ul><div id="_citys0" class="_citys1"></div><div style="display:none" id="_citys1" class="_citys1"></div></div>';
                    break;
                case 3: var template = '<div class="_citys"><span title="关闭" id="cColse" >×</span><ul id="_citysheng" class="_citys0"><li class="citySel">' + settings.linkage[0] + '</li><li>' + settings.linkage[1] + '</li><li>' + settings.linkage[2] + '</li></ul><div id="_citys0" class="_citys1"></div><div style="display:none" id="_citys1" class="_citys1"></div><div style="display:none" id="_citys2" class="_citys1"></div></div>';
                    break;
                default: break;
            }
            //var template = '<div class="_citys"><span title="关闭" id="cColse" >×</span><ul id="_citysheng" class="_citys0"><li class="citySel">省份</li><li>城市</li><li>区县</li></ul><div id="_citys0" class="_citys1"></div><div style="display:none" id="_citys1" class="_citys1"></div><div style="display:none" id="_citys2" class="_citys1"></div></div>';
            Iput.show({
                id: that,
                event: e,
                content: template
            });
            $("#cColse").click(function () {
                Iput.colse();
            });
            var tb_province = [];
            for (var i = 0, len = data.length; i < len; i++) {
                tb_province.push('<a data-level="0" data-id="' + data[i]['id'] + '" data-name="' + data[i]['name'] + '">' + data[i]['name'] + '</a>');
            }
            $("#_citys0").append(tb_province.join(""));

            $("#_citys0").on("click", "a", function () {
                var lev = $(this).data("name");
                that.value = $(this).data("name");
                var id_ = that.id;
                $("#" + idInput[0]).val(lev);
                $("#" + idInput[0]).attr("data-id", $(this).data("id"));
                $("input[name=" + nameInput[0] +"]").val(lev);
                $("input[name=" + nameInput[0] +"]").attr("data-id", $(this).data("id"));
                if(settings.linkage.length == 1){
                    Iput.colse();
                    return;
                }
                var gcity = _root.getCity($(this), data);
                $("#_citys1 a").remove();
                $("#_citys1").append(gcity);
                $("._citys1").hide();
                $("._citys1:eq(1)").show();
                $("#_citys0 a,#_citys1 a,#_citys2 a").removeClass("AreaS");
                $(this).addClass("AreaS");
                
                
                $("#_citys1 a").click(function () {
                    $("#_citys1 a,#_citys2 a").removeClass("AreaS");
                    $(this).addClass("AreaS");
                    var lev = $(this).data("name");
                    $("input[name=" + nameInput[1] +"]").attr("data-id", $(this).data("id"));
                    $("input[name=" + nameInput[1] +"]").val(lev);
                    $("#" + idInput[1]).attr("data-id", $(this).data("id"));
                    $("#" + idInput[1]).val(lev);
                    var bc = $("#" + idInput[0]).val();
                    that.value = bc + part + $(this).data("name");
                    if(settings.linkage.length == 2){
                        Iput.colse();
                        return;
                    }

                    var ar = _root.getArea($(this));
                    $("#_citys2 a").remove();
                    $("#_citys2").append(ar);
                    $("._citys1").hide();
                    $("._citys1:eq(2)").show();

                    

                    $("#_citys2 a").click(function () {
                        $("#_citys2 a").removeClass("AreaS");
                        $(this).addClass("AreaS");
                        var lev = $(this).data("name");
                        $("input[name=" + nameInput[2] +"]").val(lev);
                        $("input[name=" + nameInput[2] +"]").attr("data-id", $(this).data("id"));
                        $("#" + idInput[2]).val(lev);
                        $("#" + idInput[2]).attr("data-id", $(this).data("id"));
                        var bc = $("#" + idInput[0]).val();
                        var bp = $("#" + idInput[1]).val();
                        that.value = bc + part + bp + part + $(this).data("name");
                        Iput.colse();
                    });

                });
            });
            $("#_citysheng li").click(function () {
                $("#_citysheng li").removeClass("citySel");
                $(this).addClass("citySel");
                var s = $("#_citysheng li").index(this);
                $("._citys1").hide();
                $("._citys1:eq(" + s + ")").show();
            });
        },
        getCity: function (element, data) {
            var _root = this,
                settings = _root.settings,
                selector = _root.selector;
            var cityData = element.data('id');
            var cityArr;
            var group = '';
            for (var i = 0, plen = data.length; i < plen; i++) {
                if (data[i]['id'] == cityData) {
                    cityArr = data[i]["nodes"];
                    break
                }
            }
            if(cityArr.length == 0){
                Iput.colse();
                return;
            }
            for (var j = 0, clen = cityArr.length; j < clen; j++) {
                group += '<a data-level="1" data-id="' + cityArr[j]['id'] + '" data-name="' + cityArr[j]['name'] + '" title="' + cityArr[j]['name'] + '">' + cityArr[j]['name'] + '</a>'
            }
            $("#_citysheng li").removeClass("citySel");
            $("#_citysheng li:eq(1)").addClass("citySel");
            cityArry = cityArr;
            return group;
        },
        getArea: function (element) {
            var _root = this,
                settings = _root.settings,
                selector = _root.selector;
            var cityData = element.data('id');
            var cityArr = cityArry,
                areaArr = [];
            var group = '';
            
            for (var i = 0, plen = cityArr.length; i < plen; i++) {
                if (cityArr[i]['id'] == cityData) {
                    areaArr = cityArr[i]["nodes"];
                    
                }
            }
            if(areaArr.length == 0){
                Iput.colse();
                return;
            }
            for (var j = 0, clen = areaArr.length; j < clen; j++) {
                group += '<a data-level="1" data-id="' + areaArr[j]['id'] + '" data-name="' + areaArr[j]['name'] + '" title="' + areaArr[j]['name'] + '">' + areaArr[j]['name'] + '</a>'
            }

            $("#_citysheng li").removeClass("citySel");
            $("#_citysheng li:eq(2)").addClass("citySel");
            return group;
        }
    }
});