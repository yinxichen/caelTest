//公共方法：前置jkj.js、core.js，用于jkj的扩展插件和页面自定义方法
$.jkj.util = {
	// 日期
	date: {
		init: function () {
			/*! 将 Date 格式化为指定格式的String 
			 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q)、周或星期(E) 可以用 1-2 个占位符，
			 * 默认格式：yyyy-MM-dd hh:mm:ss 
			 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
			 * 例子： 
			 * (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
			 * (new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
			 * (new Date()).format("E")      ==> 周x 
			 * (new Date()).format("EE")      ==> 星期x 
			 */
			Date.prototype.format = function (formatDateStr) {
				var o = {
					"M+": this.getMonth() + 1, //月份           
					"d+": this.getDate(), //日           
					"h+": this.getHours() % 12 === 0 ? 12 : this.getHours() % 12, //小时           
					"H+": this.getHours(), //小时           
					"m+": this.getMinutes(), //分           
					"s+": this.getSeconds(), //秒           
					"q+": Math.floor((this.getMonth() + 3) / 3), //季度           
					"S": this.getMilliseconds() //毫秒           
				};
				var week = {
					"0": "/u65e5",
					"1": "/u4e00",
					"2": "/u4e8c",
					"3": "/u4e09",
					"4": "/u56db",
					"5": "/u4e94",
					"6": "/u516d"
				};

				formatDateStr = formatDateStr || 'yyyy-MM-dd hh:mm:ss';
				if (/(y+)/.test(formatDateStr)) {
					formatDateStr = formatDateStr.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
				}
				if (/(E+)/.test(formatDateStr)) {
					formatDateStr = formatDateStr.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
				}
				for (var k in o) {
					if (new RegExp("(" + k + ")").test(formatDateStr)) {
						formatDateStr = formatDateStr.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
					}
				}

				return formatDateStr;
			};

			return true;
		},
		//根据字符串获取日期对象，建议使用字符串扩展方法toDate()
		getDate: function (dateStr) {
			return dateStr.toDate();
		},
		//获取今天
		getTodayStr: function (formatDateStr) {
			formatDateStr = formatDateStr || 'yyyy-MM-dd';

			return (new Date()).format(formatDateStr);
		}
	},
	// 特殊ascii码字符转换集
	diacritics: {
		'\u24B6': 'A',
		'\uFF21': 'A',
		'\u00C0': 'A',
		'\u00C1': 'A',
		'\u00C2': 'A',
		'\u1EA6': 'A',
		'\u1EA4': 'A',
		'\u1EAA': 'A',
		'\u1EA8': 'A',
		'\u00C3': 'A',
		'\u0100': 'A',
		'\u0102': 'A',
		'\u1EB0': 'A',
		'\u1EAE': 'A',
		'\u1EB4': 'A',
		'\u1EB2': 'A',
		'\u0226': 'A',
		'\u01E0': 'A',
		'\u00C4': 'A',
		'\u01DE': 'A',
		'\u1EA2': 'A',
		'\u00C5': 'A',
		'\u01FA': 'A',
		'\u01CD': 'A',
		'\u0200': 'A',
		'\u0202': 'A',
		'\u1EA0': 'A',
		'\u1EAC': 'A',
		'\u1EB6': 'A',
		'\u1E00': 'A',
		'\u0104': 'A',
		'\u023A': 'A',
		'\u2C6F': 'A',
		'\uA732': 'AA',
		'\u00C6': 'AE',
		'\u01FC': 'AE',
		'\u01E2': 'AE',
		'\uA734': 'AO',
		'\uA736': 'AU',
		'\uA738': 'AV',
		'\uA73A': 'AV',
		'\uA73C': 'AY',
		'\u24B7': 'B',
		'\uFF22': 'B',
		'\u1E02': 'B',
		'\u1E04': 'B',
		'\u1E06': 'B',
		'\u0243': 'B',
		'\u0182': 'B',
		'\u0181': 'B',
		'\u24B8': 'C',
		'\uFF23': 'C',
		'\u0106': 'C',
		'\u0108': 'C',
		'\u010A': 'C',
		'\u010C': 'C',
		'\u00C7': 'C',
		'\u1E08': 'C',
		'\u0187': 'C',
		'\u023B': 'C',
		'\uA73E': 'C',
		'\u24B9': 'D',
		'\uFF24': 'D',
		'\u1E0A': 'D',
		'\u010E': 'D',
		'\u1E0C': 'D',
		'\u1E10': 'D',
		'\u1E12': 'D',
		'\u1E0E': 'D',
		'\u0110': 'D',
		'\u018B': 'D',
		'\u018A': 'D',
		'\u0189': 'D',
		'\uA779': 'D',
		'\u01F1': 'DZ',
		'\u01C4': 'DZ',
		'\u01F2': 'Dz',
		'\u01C5': 'Dz',
		'\u24BA': 'E',
		'\uFF25': 'E',
		'\u00C8': 'E',
		'\u00C9': 'E',
		'\u00CA': 'E',
		'\u1EC0': 'E',
		'\u1EBE': 'E',
		'\u1EC4': 'E',
		'\u1EC2': 'E',
		'\u1EBC': 'E',
		'\u0112': 'E',
		'\u1E14': 'E',
		'\u1E16': 'E',
		'\u0114': 'E',
		'\u0116': 'E',
		'\u00CB': 'E',
		'\u1EBA': 'E',
		'\u011A': 'E',
		'\u0204': 'E',
		'\u0206': 'E',
		'\u1EB8': 'E',
		'\u1EC6': 'E',
		'\u0228': 'E',
		'\u1E1C': 'E',
		'\u0118': 'E',
		'\u1E18': 'E',
		'\u1E1A': 'E',
		'\u0190': 'E',
		'\u018E': 'E',
		'\u24BB': 'F',
		'\uFF26': 'F',
		'\u1E1E': 'F',
		'\u0191': 'F',
		'\uA77B': 'F',
		'\u24BC': 'G',
		'\uFF27': 'G',
		'\u01F4': 'G',
		'\u011C': 'G',
		'\u1E20': 'G',
		'\u011E': 'G',
		'\u0120': 'G',
		'\u01E6': 'G',
		'\u0122': 'G',
		'\u01E4': 'G',
		'\u0193': 'G',
		'\uA7A0': 'G',
		'\uA77D': 'G',
		'\uA77E': 'G',
		'\u24BD': 'H',
		'\uFF28': 'H',
		'\u0124': 'H',
		'\u1E22': 'H',
		'\u1E26': 'H',
		'\u021E': 'H',
		'\u1E24': 'H',
		'\u1E28': 'H',
		'\u1E2A': 'H',
		'\u0126': 'H',
		'\u2C67': 'H',
		'\u2C75': 'H',
		'\uA78D': 'H',
		'\u24BE': 'I',
		'\uFF29': 'I',
		'\u00CC': 'I',
		'\u00CD': 'I',
		'\u00CE': 'I',
		'\u0128': 'I',
		'\u012A': 'I',
		'\u012C': 'I',
		'\u0130': 'I',
		'\u00CF': 'I',
		'\u1E2E': 'I',
		'\u1EC8': 'I',
		'\u01CF': 'I',
		'\u0208': 'I',
		'\u020A': 'I',
		'\u1ECA': 'I',
		'\u012E': 'I',
		'\u1E2C': 'I',
		'\u0197': 'I',
		'\u24BF': 'J',
		'\uFF2A': 'J',
		'\u0134': 'J',
		'\u0248': 'J',
		'\u24C0': 'K',
		'\uFF2B': 'K',
		'\u1E30': 'K',
		'\u01E8': 'K',
		'\u1E32': 'K',
		'\u0136': 'K',
		'\u1E34': 'K',
		'\u0198': 'K',
		'\u2C69': 'K',
		'\uA740': 'K',
		'\uA742': 'K',
		'\uA744': 'K',
		'\uA7A2': 'K',
		'\u24C1': 'L',
		'\uFF2C': 'L',
		'\u013F': 'L',
		'\u0139': 'L',
		'\u013D': 'L',
		'\u1E36': 'L',
		'\u1E38': 'L',
		'\u013B': 'L',
		'\u1E3C': 'L',
		'\u1E3A': 'L',
		'\u0141': 'L',
		'\u023D': 'L',
		'\u2C62': 'L',
		'\u2C60': 'L',
		'\uA748': 'L',
		'\uA746': 'L',
		'\uA780': 'L',
		'\u01C7': 'LJ',
		'\u01C8': 'Lj',
		'\u24C2': 'M',
		'\uFF2D': 'M',
		'\u1E3E': 'M',
		'\u1E40': 'M',
		'\u1E42': 'M',
		'\u2C6E': 'M',
		'\u019C': 'M',
		'\u24C3': 'N',
		'\uFF2E': 'N',
		'\u01F8': 'N',
		'\u0143': 'N',
		'\u00D1': 'N',
		'\u1E44': 'N',
		'\u0147': 'N',
		'\u1E46': 'N',
		'\u0145': 'N',
		'\u1E4A': 'N',
		'\u1E48': 'N',
		'\u0220': 'N',
		'\u019D': 'N',
		'\uA790': 'N',
		'\uA7A4': 'N',
		'\u01CA': 'NJ',
		'\u01CB': 'Nj',
		'\u24C4': 'O',
		'\uFF2F': 'O',
		'\u00D2': 'O',
		'\u00D3': 'O',
		'\u00D4': 'O',
		'\u1ED2': 'O',
		'\u1ED0': 'O',
		'\u1ED6': 'O',
		'\u1ED4': 'O',
		'\u00D5': 'O',
		'\u1E4C': 'O',
		'\u022C': 'O',
		'\u1E4E': 'O',
		'\u014C': 'O',
		'\u1E50': 'O',
		'\u1E52': 'O',
		'\u014E': 'O',
		'\u022E': 'O',
		'\u0230': 'O',
		'\u00D6': 'O',
		'\u022A': 'O',
		'\u1ECE': 'O',
		'\u0150': 'O',
		'\u01D1': 'O',
		'\u020C': 'O',
		'\u020E': 'O',
		'\u01A0': 'O',
		'\u1EDC': 'O',
		'\u1EDA': 'O',
		'\u1EE0': 'O',
		'\u1EDE': 'O',
		'\u1EE2': 'O',
		'\u1ECC': 'O',
		'\u1ED8': 'O',
		'\u01EA': 'O',
		'\u01EC': 'O',
		'\u00D8': 'O',
		'\u01FE': 'O',
		'\u0186': 'O',
		'\u019F': 'O',
		'\uA74A': 'O',
		'\uA74C': 'O',
		'\u01A2': 'OI',
		'\uA74E': 'OO',
		'\u0222': 'OU',
		'\u24C5': 'P',
		'\uFF30': 'P',
		'\u1E54': 'P',
		'\u1E56': 'P',
		'\u01A4': 'P',
		'\u2C63': 'P',
		'\uA750': 'P',
		'\uA752': 'P',
		'\uA754': 'P',
		'\u24C6': 'Q',
		'\uFF31': 'Q',
		'\uA756': 'Q',
		'\uA758': 'Q',
		'\u024A': 'Q',
		'\u24C7': 'R',
		'\uFF32': 'R',
		'\u0154': 'R',
		'\u1E58': 'R',
		'\u0158': 'R',
		'\u0210': 'R',
		'\u0212': 'R',
		'\u1E5A': 'R',
		'\u1E5C': 'R',
		'\u0156': 'R',
		'\u1E5E': 'R',
		'\u024C': 'R',
		'\u2C64': 'R',
		'\uA75A': 'R',
		'\uA7A6': 'R',
		'\uA782': 'R',
		'\u24C8': 'S',
		'\uFF33': 'S',
		'\u1E9E': 'S',
		'\u015A': 'S',
		'\u1E64': 'S',
		'\u015C': 'S',
		'\u1E60': 'S',
		'\u0160': 'S',
		'\u1E66': 'S',
		'\u1E62': 'S',
		'\u1E68': 'S',
		'\u0218': 'S',
		'\u015E': 'S',
		'\u2C7E': 'S',
		'\uA7A8': 'S',
		'\uA784': 'S',
		'\u24C9': 'T',
		'\uFF34': 'T',
		'\u1E6A': 'T',
		'\u0164': 'T',
		'\u1E6C': 'T',
		'\u021A': 'T',
		'\u0162': 'T',
		'\u1E70': 'T',
		'\u1E6E': 'T',
		'\u0166': 'T',
		'\u01AC': 'T',
		'\u01AE': 'T',
		'\u023E': 'T',
		'\uA786': 'T',
		'\uA728': 'TZ',
		'\u24CA': 'U',
		'\uFF35': 'U',
		'\u00D9': 'U',
		'\u00DA': 'U',
		'\u00DB': 'U',
		'\u0168': 'U',
		'\u1E78': 'U',
		'\u016A': 'U',
		'\u1E7A': 'U',
		'\u016C': 'U',
		'\u00DC': 'U',
		'\u01DB': 'U',
		'\u01D7': 'U',
		'\u01D5': 'U',
		'\u01D9': 'U',
		'\u1EE6': 'U',
		'\u016E': 'U',
		'\u0170': 'U',
		'\u01D3': 'U',
		'\u0214': 'U',
		'\u0216': 'U',
		'\u01AF': 'U',
		'\u1EEA': 'U',
		'\u1EE8': 'U',
		'\u1EEE': 'U',
		'\u1EEC': 'U',
		'\u1EF0': 'U',
		'\u1EE4': 'U',
		'\u1E72': 'U',
		'\u0172': 'U',
		'\u1E76': 'U',
		'\u1E74': 'U',
		'\u0244': 'U',
		'\u24CB': 'V',
		'\uFF36': 'V',
		'\u1E7C': 'V',
		'\u1E7E': 'V',
		'\u01B2': 'V',
		'\uA75E': 'V',
		'\u0245': 'V',
		'\uA760': 'VY',
		'\u24CC': 'W',
		'\uFF37': 'W',
		'\u1E80': 'W',
		'\u1E82': 'W',
		'\u0174': 'W',
		'\u1E86': 'W',
		'\u1E84': 'W',
		'\u1E88': 'W',
		'\u2C72': 'W',
		'\u24CD': 'X',
		'\uFF38': 'X',
		'\u1E8A': 'X',
		'\u1E8C': 'X',
		'\u24CE': 'Y',
		'\uFF39': 'Y',
		'\u1EF2': 'Y',
		'\u00DD': 'Y',
		'\u0176': 'Y',
		'\u1EF8': 'Y',
		'\u0232': 'Y',
		'\u1E8E': 'Y',
		'\u0178': 'Y',
		'\u1EF6': 'Y',
		'\u1EF4': 'Y',
		'\u01B3': 'Y',
		'\u024E': 'Y',
		'\u1EFE': 'Y',
		'\u24CF': 'Z',
		'\uFF3A': 'Z',
		'\u0179': 'Z',
		'\u1E90': 'Z',
		'\u017B': 'Z',
		'\u017D': 'Z',
		'\u1E92': 'Z',
		'\u1E94': 'Z',
		'\u01B5': 'Z',
		'\u0224': 'Z',
		'\u2C7F': 'Z',
		'\u2C6B': 'Z',
		'\uA762': 'Z',
		'\u24D0': 'a',
		'\uFF41': 'a',
		'\u1E9A': 'a',
		'\u00E0': 'a',
		'\u00E1': 'a',
		'\u00E2': 'a',
		'\u1EA7': 'a',
		'\u1EA5': 'a',
		'\u1EAB': 'a',
		'\u1EA9': 'a',
		'\u00E3': 'a',
		'\u0101': 'a',
		'\u0103': 'a',
		'\u1EB1': 'a',
		'\u1EAF': 'a',
		'\u1EB5': 'a',
		'\u1EB3': 'a',
		'\u0227': 'a',
		'\u01E1': 'a',
		'\u00E4': 'a',
		'\u01DF': 'a',
		'\u1EA3': 'a',
		'\u00E5': 'a',
		'\u01FB': 'a',
		'\u01CE': 'a',
		'\u0201': 'a',
		'\u0203': 'a',
		'\u1EA1': 'a',
		'\u1EAD': 'a',
		'\u1EB7': 'a',
		'\u1E01': 'a',
		'\u0105': 'a',
		'\u2C65': 'a',
		'\u0250': 'a',
		'\uA733': 'aa',
		'\u00E6': 'ae',
		'\u01FD': 'ae',
		'\u01E3': 'ae',
		'\uA735': 'ao',
		'\uA737': 'au',
		'\uA739': 'av',
		'\uA73B': 'av',
		'\uA73D': 'ay',
		'\u24D1': 'b',
		'\uFF42': 'b',
		'\u1E03': 'b',
		'\u1E05': 'b',
		'\u1E07': 'b',
		'\u0180': 'b',
		'\u0183': 'b',
		'\u0253': 'b',
		'\u24D2': 'c',
		'\uFF43': 'c',
		'\u0107': 'c',
		'\u0109': 'c',
		'\u010B': 'c',
		'\u010D': 'c',
		'\u00E7': 'c',
		'\u1E09': 'c',
		'\u0188': 'c',
		'\u023C': 'c',
		'\uA73F': 'c',
		'\u2184': 'c',
		'\u24D3': 'd',
		'\uFF44': 'd',
		'\u1E0B': 'd',
		'\u010F': 'd',
		'\u1E0D': 'd',
		'\u1E11': 'd',
		'\u1E13': 'd',
		'\u1E0F': 'd',
		'\u0111': 'd',
		'\u018C': 'd',
		'\u0256': 'd',
		'\u0257': 'd',
		'\uA77A': 'd',
		'\u01F3': 'dz',
		'\u01C6': 'dz',
		'\u24D4': 'e',
		'\uFF45': 'e',
		'\u00E8': 'e',
		'\u00E9': 'e',
		'\u00EA': 'e',
		'\u1EC1': 'e',
		'\u1EBF': 'e',
		'\u1EC5': 'e',
		'\u1EC3': 'e',
		'\u1EBD': 'e',
		'\u0113': 'e',
		'\u1E15': 'e',
		'\u1E17': 'e',
		'\u0115': 'e',
		'\u0117': 'e',
		'\u00EB': 'e',
		'\u1EBB': 'e',
		'\u011B': 'e',
		'\u0205': 'e',
		'\u0207': 'e',
		'\u1EB9': 'e',
		'\u1EC7': 'e',
		'\u0229': 'e',
		'\u1E1D': 'e',
		'\u0119': 'e',
		'\u1E19': 'e',
		'\u1E1B': 'e',
		'\u0247': 'e',
		'\u025B': 'e',
		'\u01DD': 'e',
		'\u24D5': 'f',
		'\uFF46': 'f',
		'\u1E1F': 'f',
		'\u0192': 'f',
		'\uA77C': 'f',
		'\u24D6': 'g',
		'\uFF47': 'g',
		'\u01F5': 'g',
		'\u011D': 'g',
		'\u1E21': 'g',
		'\u011F': 'g',
		'\u0121': 'g',
		'\u01E7': 'g',
		'\u0123': 'g',
		'\u01E5': 'g',
		'\u0260': 'g',
		'\uA7A1': 'g',
		'\u1D79': 'g',
		'\uA77F': 'g',
		'\u24D7': 'h',
		'\uFF48': 'h',
		'\u0125': 'h',
		'\u1E23': 'h',
		'\u1E27': 'h',
		'\u021F': 'h',
		'\u1E25': 'h',
		'\u1E29': 'h',
		'\u1E2B': 'h',
		'\u1E96': 'h',
		'\u0127': 'h',
		'\u2C68': 'h',
		'\u2C76': 'h',
		'\u0265': 'h',
		'\u0195': 'hv',
		'\u24D8': 'i',
		'\uFF49': 'i',
		'\u00EC': 'i',
		'\u00ED': 'i',
		'\u00EE': 'i',
		'\u0129': 'i',
		'\u012B': 'i',
		'\u012D': 'i',
		'\u00EF': 'i',
		'\u1E2F': 'i',
		'\u1EC9': 'i',
		'\u01D0': 'i',
		'\u0209': 'i',
		'\u020B': 'i',
		'\u1ECB': 'i',
		'\u012F': 'i',
		'\u1E2D': 'i',
		'\u0268': 'i',
		'\u0131': 'i',
		'\u24D9': 'j',
		'\uFF4A': 'j',
		'\u0135': 'j',
		'\u01F0': 'j',
		'\u0249': 'j',
		'\u24DA': 'k',
		'\uFF4B': 'k',
		'\u1E31': 'k',
		'\u01E9': 'k',
		'\u1E33': 'k',
		'\u0137': 'k',
		'\u1E35': 'k',
		'\u0199': 'k',
		'\u2C6A': 'k',
		'\uA741': 'k',
		'\uA743': 'k',
		'\uA745': 'k',
		'\uA7A3': 'k',
		'\u24DB': 'l',
		'\uFF4C': 'l',
		'\u0140': 'l',
		'\u013A': 'l',
		'\u013E': 'l',
		'\u1E37': 'l',
		'\u1E39': 'l',
		'\u013C': 'l',
		'\u1E3D': 'l',
		'\u1E3B': 'l',
		'\u017F': 'l',
		'\u0142': 'l',
		'\u019A': 'l',
		'\u026B': 'l',
		'\u2C61': 'l',
		'\uA749': 'l',
		'\uA781': 'l',
		'\uA747': 'l',
		'\u01C9': 'lj',
		'\u24DC': 'm',
		'\uFF4D': 'm',
		'\u1E3F': 'm',
		'\u1E41': 'm',
		'\u1E43': 'm',
		'\u0271': 'm',
		'\u026F': 'm',
		'\u24DD': 'n',
		'\uFF4E': 'n',
		'\u01F9': 'n',
		'\u0144': 'n',
		'\u00F1': 'n',
		'\u1E45': 'n',
		'\u0148': 'n',
		'\u1E47': 'n',
		'\u0146': 'n',
		'\u1E4B': 'n',
		'\u1E49': 'n',
		'\u019E': 'n',
		'\u0272': 'n',
		'\u0149': 'n',
		'\uA791': 'n',
		'\uA7A5': 'n',
		'\u01CC': 'nj',
		'\u24DE': 'o',
		'\uFF4F': 'o',
		'\u00F2': 'o',
		'\u00F3': 'o',
		'\u00F4': 'o',
		'\u1ED3': 'o',
		'\u1ED1': 'o',
		'\u1ED7': 'o',
		'\u1ED5': 'o',
		'\u00F5': 'o',
		'\u1E4D': 'o',
		'\u022D': 'o',
		'\u1E4F': 'o',
		'\u014D': 'o',
		'\u1E51': 'o',
		'\u1E53': 'o',
		'\u014F': 'o',
		'\u022F': 'o',
		'\u0231': 'o',
		'\u00F6': 'o',
		'\u022B': 'o',
		'\u1ECF': 'o',
		'\u0151': 'o',
		'\u01D2': 'o',
		'\u020D': 'o',
		'\u020F': 'o',
		'\u01A1': 'o',
		'\u1EDD': 'o',
		'\u1EDB': 'o',
		'\u1EE1': 'o',
		'\u1EDF': 'o',
		'\u1EE3': 'o',
		'\u1ECD': 'o',
		'\u1ED9': 'o',
		'\u01EB': 'o',
		'\u01ED': 'o',
		'\u00F8': 'o',
		'\u01FF': 'o',
		'\u0254': 'o',
		'\uA74B': 'o',
		'\uA74D': 'o',
		'\u0275': 'o',
		'\u01A3': 'oi',
		'\u0223': 'ou',
		'\uA74F': 'oo',
		'\u24DF': 'p',
		'\uFF50': 'p',
		'\u1E55': 'p',
		'\u1E57': 'p',
		'\u01A5': 'p',
		'\u1D7D': 'p',
		'\uA751': 'p',
		'\uA753': 'p',
		'\uA755': 'p',
		'\u24E0': 'q',
		'\uFF51': 'q',
		'\u024B': 'q',
		'\uA757': 'q',
		'\uA759': 'q',
		'\u24E1': 'r',
		'\uFF52': 'r',
		'\u0155': 'r',
		'\u1E59': 'r',
		'\u0159': 'r',
		'\u0211': 'r',
		'\u0213': 'r',
		'\u1E5B': 'r',
		'\u1E5D': 'r',
		'\u0157': 'r',
		'\u1E5F': 'r',
		'\u024D': 'r',
		'\u027D': 'r',
		'\uA75B': 'r',
		'\uA7A7': 'r',
		'\uA783': 'r',
		'\u24E2': 's',
		'\uFF53': 's',
		'\u00DF': 's',
		'\u015B': 's',
		'\u1E65': 's',
		'\u015D': 's',
		'\u1E61': 's',
		'\u0161': 's',
		'\u1E67': 's',
		'\u1E63': 's',
		'\u1E69': 's',
		'\u0219': 's',
		'\u015F': 's',
		'\u023F': 's',
		'\uA7A9': 's',
		'\uA785': 's',
		'\u1E9B': 's',
		'\u24E3': 't',
		'\uFF54': 't',
		'\u1E6B': 't',
		'\u1E97': 't',
		'\u0165': 't',
		'\u1E6D': 't',
		'\u021B': 't',
		'\u0163': 't',
		'\u1E71': 't',
		'\u1E6F': 't',
		'\u0167': 't',
		'\u01AD': 't',
		'\u0288': 't',
		'\u2C66': 't',
		'\uA787': 't',
		'\uA729': 'tz',
		'\u24E4': 'u',
		'\uFF55': 'u',
		'\u00F9': 'u',
		'\u00FA': 'u',
		'\u00FB': 'u',
		'\u0169': 'u',
		'\u1E79': 'u',
		'\u016B': 'u',
		'\u1E7B': 'u',
		'\u016D': 'u',
		'\u00FC': 'u',
		'\u01DC': 'u',
		'\u01D8': 'u',
		'\u01D6': 'u',
		'\u01DA': 'u',
		'\u1EE7': 'u',
		'\u016F': 'u',
		'\u0171': 'u',
		'\u01D4': 'u',
		'\u0215': 'u',
		'\u0217': 'u',
		'\u01B0': 'u',
		'\u1EEB': 'u',
		'\u1EE9': 'u',
		'\u1EEF': 'u',
		'\u1EED': 'u',
		'\u1EF1': 'u',
		'\u1EE5': 'u',
		'\u1E73': 'u',
		'\u0173': 'u',
		'\u1E77': 'u',
		'\u1E75': 'u',
		'\u0289': 'u',
		'\u24E5': 'v',
		'\uFF56': 'v',
		'\u1E7D': 'v',
		'\u1E7F': 'v',
		'\u028B': 'v',
		'\uA75F': 'v',
		'\u028C': 'v',
		'\uA761': 'vy',
		'\u24E6': 'w',
		'\uFF57': 'w',
		'\u1E81': 'w',
		'\u1E83': 'w',
		'\u0175': 'w',
		'\u1E87': 'w',
		'\u1E85': 'w',
		'\u1E98': 'w',
		'\u1E89': 'w',
		'\u2C73': 'w',
		'\u24E7': 'x',
		'\uFF58': 'x',
		'\u1E8B': 'x',
		'\u1E8D': 'x',
		'\u24E8': 'y',
		'\uFF59': 'y',
		'\u1EF3': 'y',
		'\u00FD': 'y',
		'\u0177': 'y',
		'\u1EF9': 'y',
		'\u0233': 'y',
		'\u1E8F': 'y',
		'\u00FF': 'y',
		'\u1EF7': 'y',
		'\u1E99': 'y',
		'\u1EF5': 'y',
		'\u01B4': 'y',
		'\u024F': 'y',
		'\u1EFF': 'y',
		'\u24E9': 'z',
		'\uFF5A': 'z',
		'\u017A': 'z',
		'\u1E91': 'z',
		'\u017C': 'z',
		'\u017E': 'z',
		'\u1E93': 'z',
		'\u1E95': 'z',
		'\u01B6': 'z',
		'\u0225': 'z',
		'\u0240': 'z',
		'\u2C6C': 'z',
		'\uA763': 'z',
		'\u0386': '\u0391',
		'\u0388': '\u0395',
		'\u0389': '\u0397',
		'\u038A': '\u0399',
		'\u03AA': '\u0399',
		'\u038C': '\u039F',
		'\u038E': '\u03A5',
		'\u03AB': '\u03A5',
		'\u038F': '\u03A9',
		'\u03AC': '\u03B1',
		'\u03AD': '\u03B5',
		'\u03AE': '\u03B7',
		'\u03AF': '\u03B9',
		'\u03CA': '\u03B9',
		'\u0390': '\u03B9',
		'\u03CC': '\u03BF',
		'\u03CD': '\u03C5',
		'\u03CB': '\u03C5',
		'\u03B0': '\u03C5',
		'\u03C9': '\u03C9',
		'\u03C2': '\u03C3'
	},
	// 数字
	number: {
		init: function () {
			//银行家舍入算法（四舍六入五取偶，五后不为零则进位）
			Number.prototype.bankRound = function (n) {
				var power, signal, newNumber, temp1, temp2;

				n = Math.abs(n || 0);
				power = Math.pow(10, n);

				temp1 = Math.floor(this * power * 100) % 10;
				temp2 = Math.floor(this * power * 10) % 100;
				//与运算，前面表示五后面为零，中间表示能被5整除，后面表示十位为偶数
				signal = temp1 === 0 && ((temp2 / 5) % 2 === 1) && (Math.floor(temp2 / 10) % 2 === 0);

				newNumber = Math.round(this * power) / power;
				if (signal) {
					newNumber = (Math.round(this * power) - 1) / power;
				}

				return newNumber;
			};
			//上舍入，返回数值
			Number.prototype.ceil = function (n) {
				var power, newNumber;

				n = Math.abs(n || 0);
				power = Math.pow(10, n);
				newNumber = Math.ceil(this * power) / power;

				return newNumber;
			};
			//下舍入，返回数值
			Number.prototype.floor = function (n) {
				var power, newNumber;

				n = Math.abs(n || 0);
				power = Math.pow(10, n);
				newNumber = Math.floor(this * power) / power;

				return newNumber;
			};
			//四舍五入，返回数值。如果需要返回字符串，直接使用原生的toFixed
			Number.prototype.round = function (n) {
				var power;

				n = Math.abs(n || 0);
				power = Math.pow(10, n);

				return Math.round(this * power) / power;
			};

			return true;
		}
	},
	// 字符串
	string: {
		init: function () {
			// 返回字符串的长度，一个汉字算2个长度 
			String.prototype.cnLength = function () {
				return this.replace(/[^\x00-\xff]/g, "**").length;
			};
			// 字符串超出长度添加省略号
			String.prototype.cutString = function (n) {
				n = n || 10;
				if (this.length > n) {
					return this.substr(0, n) + "...";
				}
				else {
					return this.toString();
				}
			};
			/*! 获取数值信息
			 * 参数：
			 * n： 精度
			 * roundWay：round(四舍五入)，floor(下舍入)，ceil(上舍入)，bank(银行家舍入)
			 * 返回：对象
			 * lNumber： 小数点左边的数
			 * rNumber： 小数点右边的数
			 * stringValue： 经过加工的字符串值
			 */
			String.prototype.getNumberInfo = function (n, roundWay) {
				var str, strNumber, lNumber, rNumber, numberInfo;

				if (isNaN(Number(this))) {
					throw new Error('字符串内容不是数值！');
				}

				n = Math.abs(n || 0);
				if (n > 0) {
					roundWay = roundWay || 'floor';
				}
				str = this.toString();
				numberInfo = {};
				if (str.indexOf('.') >= 0) {
					if (str.indexOf('.') === 0) {
						str = '0' + str;
					}
					lNumber = str.split('.')[0];
					rNumber = '0.' + str.split('.')[1];
				} else {
					lNumber = str;
					rNumber = '0.0';
				}
				if (roundWay === 'round') {
					rNumber = Number(rNumber).toFixed(n);
				} else if (roundWay === 'floor') {
					rNumber = Number(rNumber).floor(n).toFixed(n);
				} else if (roundWay === 'ceil') {
					rNumber = Number(rNumber).ceil(n).toFixed(n);
				} else if (roundWay === 'bank') {
					rNumber = Number(rNumber).bankRound(n).toFixed(n);
				}
				strNumber = lNumber;
				if (rNumber !== undefined) {
					lNumber = (Number(lNumber) + Number(rNumber[0])).toString();
					strNumber = (Number(this) < 0 && Number(lNumber) === 0 ? '-' : '') + lNumber;
					rNumber = rNumber.substring(2);
					strNumber += '.' + rNumber;
				}

				numberInfo.lNumber = lNumber;
				numberInfo.rNumber = rNumber;
				numberInfo.stringValue = strNumber;

				return numberInfo;
			};
			// 获取浏览器地址栏参数
			String.prototype.getURLParameter = function (name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
				var matchedArray = this.substr(this.indexOf("/?") + 1).match(reg);
				if (matchedArray != null) {
					return unescape(matchedArray[2]);
				}
				return null;
			};
			// 替换全部
			String.prototype.replaceAll = function (subString, replaceString, ignoreCase) {
				return this.replace(new RegExp(subString, ignoreCase ? "gim" : "gm"), replaceString);
			};
			/*! 数值字符串转为中文大写
			 * roundWay：round(四舍五入)，floor(下舍入)，ceil(上舍入)，bank(银行家舍入)
			 */
			String.prototype.toChineseNumber = function (n, roundWay) {
				var str, units, chineseNumber, strNumber, tempArr, numberInfo;

				str = this.toString();
				numberInfo = str.getNumberInfo(n, roundWay);
				units = ['', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '兆', '十', '百', '千'];
				chineseNumber = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
				tempArr = [];

				$.each(numberInfo.lNumber.split('').reverse(), function (i, item) {
					tempArr.push(chineseNumber[item] + units[i]);
				});
				tempArr = tempArr.reverse();
				if (tempArr.length > 1) {
					var temp;

					temp = tempArr.pop();
					if (temp != '零') {
						tempArr.push(temp);
					}
				}
				if (numberInfo.rNumber !== undefined) {
					tempArr.push('点');
					numberInfo.rNumber = Number(numberInfo.rNumber).toString();
					$.each(numberInfo.rNumber.split(''), function (i, item) {
						tempArr.push(chineseNumber[item]);
					});
				}

				strNumber = tempArr.join('');
				strNumber = strNumber.replace(/零[千百十]/g, '零')
					.replace(/零([兆|亿|万])/g, '$1')
					.replace(/零{2,}/g, '零')
					.replace(/([兆|亿])零/g, '$1')
					.replace(/亿万/, '亿')
					.replace(/兆亿/, '兆');

				return strNumber;
			};
			/*! 数值字符串转为中文金额
			 * roundWay：round(四舍五入)，floor(下舍入)，ceil(上舍入)，bank(银行家舍入)
			 */
			String.prototype.toCapitalMoney = function (roundWay) {
				var str, units, chineseNumber, strNumber, tempArr, numberInfo;

				str = this.toString();
				numberInfo = str.getNumberInfo(2, roundWay);
				units = ['分', '角', '元', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿', '拾', '佰', '仟', '兆', '拾', '佰', '仟'];
				chineseNumber = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
				tempArr = [];

				$.each(numberInfo.stringValue.replace('.', '').split('').reverse(), function (i, item) {
					tempArr.push(chineseNumber[item] + units[i]);
				});
				tempArr = tempArr.reverse();

				strNumber = tempArr.join('');
				strNumber = strNumber.replace(/零角零分$/g, '整')
					.replace(/零[仟佰拾角分]/g, '零')
					.replace(/零+/g, '零')
					.replace(/零([兆|亿|万|元])/g, '$1')
					.replace(/([兆|亿])零/g, '$1')
					.replace(/亿万/, '亿')
					.replace(/兆亿/, '兆')
					.replace(/零$/, '')
					.replace(/^元/, '零元');

				return strNumber;
			};
			//字符串日期转为日期对象
			String.prototype.toDate = function () {
				return new Date(Date.parse(this.replace(/-/g, "/")));
			};
			/*! 数值字符串转为金额字符串
			 * roundWay：round(四舍五入)，floor(下舍入)，ceil(上舍入)，bank(银行家舍入)
			 * n: 精度
			 * thousands: 千分位符号
			 */
			String.prototype.toMoney = function (roundWay, n, thousands) {
				var numberInfo;

				n = n || 2;
				numberInfo = this.getNumberInfo(n, roundWay);
				if (typeof thousands === 'string' && thousands.length > 0) {
					var regMoney = /(\d{1,3})(?=(\d{3})+(?:\.))/g;

					numberInfo.stringValue = numberInfo.stringValue.replace(regMoney, '$1,');
				}

				return numberInfo.stringValue;
			};
			/*! 格式化数值字符串
			 * roundWay：round(四舍五入)，floor(下舍入)，ceil(上舍入)，bank(银行家舍入)
			 * n: 精度
			 * thousands: 千分位符号
			 */
			String.prototype.formatNumber = function (roundWay, n, thousands) {
				var numberInfo;

				n = n || 0;
				numberInfo = this.getNumberInfo(n, roundWay);
				if (typeof thousands === 'string' && thousands.length > 0) {
					var regMoney = /(\d{1,3})(?=(\d{3})+(?:\.))/g;

					numberInfo.stringValue = numberInfo.stringValue.replace(regMoney, '$1,');
				}

				return numberInfo.stringValue;
			};
			// 字符串去除开始和结尾的空格  
			String.prototype.trim = function () {
				return this.replace(/(^\s*)|(\s*$)/g, "");
			};
			// 字符串去除所有的空格 
			String.prototype.trimAll = function () {
				return this.replace(/\s+/g, "");
			};
			// 字符串去除开始的空格
			String.prototype.trimLeft = function () {
				return this.replace(/(^\s*)/g, "");
			};
			// 字符串去除结尾的空格
			String.prototype.trimRight = function () {
				return this.replace(/(\s*$)/g, "");
			};

			return true;
		}

	},
	// 随机数
	random: {
		// 获取随机数基础方法
		basic: function (length, chars) {
			var charsLength, randomString;

			length = length || 4;
			charsLength = chars.length;
			randomString = '';
			for (var i = 0; i < length; i++) {
				randomString += chars[Math.floor(Math.random() * charsLength)];
			}

			return randomString;
		},
		// 获取当前时间加随机数拼接的字符串
		getLongDateString: function () {
			return (new Date()).format('yyyyMMddHHmmss') + this.getString(8);
		},
		// 获取随机字符串
		getString: function (length) {
			var chars;

			chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';

			return this.basic(length, chars);
		},
		// 获取随机字符串，去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
		getSimpleString: function (length) {
			var chars;

			chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';

			return this.basic(length, chars);
		}
	},
	// 加入收藏夹
	addFavorite: function (url, title) {
		try {
			window.external.addFavorite(url, title);
		} catch (e) {
			try {
				window.sidebar.addPanel(title, url, "");
			} catch (e) {
				alert("加入收藏失败，请使用Ctrl+D进行添加");
			}
		}
	},
	// 设为首页
	setHomepage: function (homeurl) {
		if (document.all) {
			document.body.style.behavior = 'url(#default#homepage)';
			document.body.setHomePage(homeurl);
		} else if (window.sidebar) {
			if (window.netscape) {
				try {
					netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
				} catch (e) {
					alert("该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入about:config，然后将项 signed.applets.codebase_principal_support 值该为true");
				}
			}
			var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
			prefs.setCharPref('browser.startup.homepage', homeurl);
		}
	}
};