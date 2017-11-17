/* AdminJKJ $.skin
 * ==========================
 */
(function($) {
	var my_skins = [
		"skin-blue",
		"skin-black",
		"skin-red",
		"skin-yellow",
		"skin-purple",
		"skin-green",
		"skin-blue-light",
		"skin-black-light",
		"skin-red-light",
		"skin-yellow-light",
		"skin-purple-light",
		"skin-green-light",
		"skin-blue-protect",
		"skin-blue-protect2",
		"skin-dark-gray",
		"skin-dark-gray-protect",
		"skin-dark-gray-protect2"
	];

	setup();

	function setup() {
		var tmp = get('skin');
		if(tmp && $.inArray(tmp, my_skins))
			change_skin(tmp);
		
		var color_num = 0,
			mode_num = 0;
		//Add the change skin listener
		$("[data-skin]").on('click', function(e) {
			// if($(this).hasClass('knob'))
			// 	return;
			//e.preventDefault();
			//change_skin($(this).data('skin'));
			var skin_checked = $("input[name='changeColor']:checked").val(),
				mode_checked = $("input[name='changeMode']:checked").val();
			if(skin_checked=="default"){
				if(mode_checked=="default"){
					change_skin("skin-blue");
				}else if(mode_checked=="yellow"){
					change_skin("skin-blue-protect");
				}else{
					change_skin("skin-blue-protect2");
				}
			}else if(skin_checked=="business") {
				if(mode_checked=="default"){
					change_skin("skin-dark-gray");
				}else if(mode_checked=="yellow"){
					change_skin("skin-dark-gray-protect");
				}else{
					change_skin("skin-dark-gray-protect2");
				}
			}
		});
		//skin control radio
		switch(tmp){
			case "skin-blue":
				color_num = 0;
				mode_num = 0;
				break;
			case "skin-blue-protect":
				color_num = 0;
				mode_num = 1;
				break;
			case "skin-blue-protect2":
				color_num = 0;
				mode_num = 2;
				break;
			case "skin-dark-gray":
				color_num = 1;
				mode_num = 0;
				break;
			case "skin-dark-gray-protect":
				color_num = 1;
				mode_num = 1;
				break;
			case "skin-dark-gray-protect2":
				color_num = 1;
				mode_num = 2;
				break;
		}
		$("input[name='changeColor']").eq(color_num).attr("checked",'checked');
		$("input[name='changeMode']").eq(mode_num).attr("checked",'checked');
	}

	/**
	 * Replaces the old skin with the new skin
	 * @param String cls the new skin class
	 * @returns Boolean false to prevent link's default action
	 */
	function change_skin(cls) {
		$.each(my_skins, function(i) {
			$("body").removeClass(my_skins[i]);
			$("iframe").contents().find("body").removeClass(my_skins[i]);
		});

		$("body").addClass(cls);
		$("iframe").contents().find("body").addClass(cls);
		store('skin', cls);
		return false;
	}

	/**
	 * Store a new settings in the browser
	 *
	 * @param String name Name of the setting
	 * @param String val Value of the setting
	 * @returns void
	 */
	function store(name, val) {
		if(typeof(Storage) !== "undefined") {
			localStorage.setItem(name, val);
		} else {
			window.alert('Please use a modern browser to properly view this template!');
		}
	}

	/**
	 * Get a prestored setting
	 *
	 * @param String name Name of of the setting
	 * @returns String The value of the setting | null
	 */
	function get(name) {
		if(typeof(Storage) !== "undefined") {
			return localStorage.getItem(name);
		} else {
			window.alert('Please use a modern browser to properly view this template!');
		}
	}
})(jQuery);