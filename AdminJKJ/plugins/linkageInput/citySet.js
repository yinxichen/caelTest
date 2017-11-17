function SelCity(obj, e) {
	var ths = obj;
	var dal = '<div class="_citys"><span title="关闭" id="cColse" >×</span><ul id="_citysheng" class="_citys0"><li class="citySel">省份</li><li>城市</li><li>区县</li></ul><div id="_citys0" class="_citys1"></div><div style="display:none" id="_citys1" class="_citys1"></div><div style="display:none" id="_citys2" class="_citys1"></div></div>';
	Iput.show({
		id: ths,
		event: e,
		content: dal,
		width: "470"
	});
	$("#cColse").click(function() {
		Iput.colse();
	});
	$.ajax({
		url: '../../../data/city.json',
		dataType: 'json',
		success: function(data) {
			var tb_province = [];
			for(var i = 0, len = data.length; i < len; i++) {
				tb_province.push('<a data-level="0" data-id="' + data[i]['id'] + '" data-name="' + data[i]['name'] + '">' + data[i]['name'] + '</a>');
			}
			$("#_citys0").append(tb_province.join(""));

		},
		statusCode: {
			404: function() {
				alert("没有找到相关文件~~");
			}
		}
	});
	/*var tb_province = [];
	var b = province;
	for (var i = 0, len = b.length; i < len; i++) {
	    tb_province.push('<a data-level="0" data-id="' + b[i]['id'] + '" data-name="' + b[i]['name'] + '">' + b[i]['name'] + '</a>');
	}*/

	$("#_citys0").on("click", "a", function() {
		var g = getCity($(this));
		$("#_citys1 a").remove();
		$("#_citys1").append(g);
		$("._citys1").hide();
		$("._citys1:eq(1)").show();
		$("#_citys0 a,#_citys1 a,#_citys2 a").removeClass("AreaS");
		$(this).addClass("AreaS");
		var lev = $(this).data("name");
		ths.value = $(this).data("name");
		var id_ = ths.id;
		if(document.getElementById("c" + id_) == null) {
			var hcitys = $('<input>', {
				type: 'hidden',
				name: "c" + id_,
				"data-id": $(this).data("id"),
				id: "c" + id_,
				val: lev
			});
			$(ths).after(hcitys);
		} else {
			$("#c" + id_).val(lev);
			$("#c" + id_).attr("data-id", $(this).data("id"));
		}
		$("#_citys1 a").click(function() {
			$("#_citys1 a,#_citys2 a").removeClass("AreaS");
			$(this).addClass("AreaS");
			var lev = $(this).data("name");
			if(document.getElementById("p" + id_) == null) {
				var hcitys = $('<input>', {
					type: 'hidden',
					name: "p" + id_,
					"data-id": $(this).data("id"),
					id: "p" + id_,
					val: lev
				});
				$(ths).after(hcitys);
			} else {
				$("#p" + id_).attr("data-id", $(this).data("id"));
				$("#p" + id_).val(lev);
			}
			var bc = $("#c" + id_).val();
			ths.value = bc + "-" + $(this).data("name");

			var ar = getArea($(this));

			$("#_citys2 a").remove();
			$("#_citys2").append(ar);
			$("._citys1").hide();
			$("._citys1:eq(2)").show();

			$("#_citys2 a").click(function() {
				$("#_citys2 a").removeClass("AreaS");
				$(this).addClass("AreaS");
				var lev = $(this).data("name");
				if(document.getElementById("a" + id_) == null) {
					var hcitys = $('<input>', {
						type: 'hidden',
						name: "a" + id_,
						"data-id": $(this).data("id"),
						id: "a" + id_,
						val: lev
					});
					$(ths).after(hcitys);
				} else {
					$("#a" + id_).val(lev);
					$("#a" + id_).attr("data-id", $(this).data("id"));
				}
				var bc = $("#c" + id_).val();
				var bp = $("#p" + id_).val();
				ths.value = bc + "-" + bp + "-" + $(this).data("name");
				Iput.colse();
			});

		});
	});
	$("#_citysheng li").click(function() {
		$("#_citysheng li").removeClass("citySel");
		$(this).addClass("citySel");
		var s = $("#_citysheng li").index(this);
		$("._citys1").hide();
		$("._citys1:eq(" + s + ")").show();
	});

}

function getCity(obj) {
	var c = obj.data('id');
	var f;
	var g = '';
	$.ajax({
		url: '../../../data/city.json',
		dataType: 'json',
		async: false,
		success: function(data) {
			for(var i = 0, plen = data.length; i < plen; i++) {
				if(data[i]['id'] == parseInt(c)) {
					f = data[i]['city'];
					break
				}
			}
			for(var j = 0, clen = f.length; j < clen; j++) {
				g += '<a data-level="1" data-id="' + f[j]['id'] + '" data-name="' + f[j]['name'] + '" title="' + f[j]['name'] + '">' + f[j]['name'] + '</a>'
			}
			$("#_citysheng li").removeClass("citySel");
			$("#_citysheng li:eq(1)").addClass("citySel");
		},
		statusCode: {
			404: function() {
				alert("没有找到相关文件~~");
			}
		}
	});
	return g;
	/*var c = obj.data('id');
	var e = province;
	var f;
	var g = '';
	for (var i = 0, plen = e.length; i < plen; i++) {
	    if (e[i]['id'] == parseInt(c)) {
	        f = e[i]['city'];
	        break
	    }
	}
	for (var j = 0, clen = f.length; j < clen; j++) {
	    g += '<a data-level="1" data-id="' + f[j]['id'] + '" data-name="' + f[j]['name'] + '" title="' + f[j]['name'] + '">' + f[j]['name'] + '</a>'
	}
	$("#_citysheng li").removeClass("citySel");
	$("#_citysheng li:eq(1)").addClass("citySel");
	return g;*/
}

function getArea(obj) {
	var c = obj.data('id');
	var f = [];
	var g = '';
	$.ajax({
		url: '../../../data/area.json',
		dataType: 'json',
		async: false,
		success: function(data) {
			for(var i = 0, plen = data.length; i < plen; i++) {
				if(data[i]['pid'] == parseInt(c)) {
					f.push(data[i]);
				}
			}
			for(var j = 0, clen = f.length; j < clen; j++) {
				g += '<a data-level="1" data-id="' + f[j]['id'] + '" data-name="' + f[j]['name'] + '" title="' + f[j]['name'] + '">' + f[j]['name'] + '</a>'
			}

			$("#_citysheng li").removeClass("citySel");
			$("#_citysheng li:eq(2)").addClass("citySel");
		},
		statusCode: {
			404: function() {
				alert("没有找到相关文件~~");
			}
		}
	});
	return g;
	/*var c = obj.data('id');
	var e = area;
	var f = [];
	var g = '';
	for (var i = 0, plen = e.length; i < plen; i++) {
	    if (e[i]['pid'] == parseInt(c)) {
	        f.push(e[i]);
	    }
	}
	for (var j = 0, clen = f.length; j < clen; j++) {
	    g += '<a data-level="1" data-id="' + f[j]['id'] + '" data-name="' + f[j]['name'] + '" title="' + f[j]['name'] + '">' + f[j]['name'] + '</a>'
	}

	$("#_citysheng li").removeClass("citySel");
	$("#_citysheng li:eq(2)").addClass("citySel");
	return g;*/
}