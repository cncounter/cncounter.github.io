function HeadPullDownApp() {
	var $menubox = $("#appList");
	var $contact = $("#apply");
	var t = null;
	$contact.hover(function() {
		if ($menubox.is(":hidden"))
			$menubox.fadeIn();
		$contact.addClass("hover")
	}, function() {
		$menubox.fadeOut();
		$contact.removeClass("hover")
	})
}

window.HeadPDA = new HeadPullDownApp;
function tipMenuHead() {
	var button = $("#account");
	var list = button.find(".list_mh");
	button.unbind();
	button.bind("mouseover", function() {
		list.show()
	}).bind("mouseout", function() {
		list.hide()
	});
	$("#logOutTita").bind("click", function() {
		if (bs_tita && bs_tita.GoKuaiToken != null) {
			goukuaiLogout = bs_tita.GoKuaiToken.GoKuiUrl + "/logout";
			var HTML = '<img src="' + goukuaiLogout + '" alt="" />';
			$(HTML).appendTo("body")
		}
	})
}

window.TMH = new tipMenuHead;
function SpeedyPubMenuHead() {
	var button = $(".speedy_mh");
	var list = button.find(".list_mh");
	button.unbind();
	button.bind("mouseover", function() {
		list.show()
	}).bind("mouseout", function() {
		list.hide()
	})
}

window.SPMH = new SpeedyPubMenuHead;
function LogoAnimate() {
	var browser_ver = $.browser.version;
	var accurate_value = browser_ver.substr(0, 1);
	var obj = $("#logoTita");
	if (obj.length == 0) {
		return
	}
	var logo = "logo_bs_test";
	var logo_hover = "logo_bs_back";
	var fileName = "luotro";
	var num = "?ver=5";
	if ($.browser.msie && accurate_value == "6") {
		obj.attr("src", "http://st.tita.com/titacn/tita/common/headfoot/" + fileName + "/img/" + logo + ".gif" + num)
	}
	obj.mouseover(function() {
		$(this).attr("src", "http://st.tita.com/titacn/tita/common/headfoot/" + fileName + "/img/" + logo_hover + ".gif" + num);
		if ($.browser.msie && accurate_value == "6") {
			$(this).attr("src", "http://st.tita.com/titacn/tita/common/headfoot/" + fileName + "/img/" + logo_hover + ".gif" + num)
		}
	});
	obj.mouseout(function() {
		$(this).attr("src", "http://st.tita.com/titacn/tita/common/headfoot/" + fileName + "/img/" + logo + ".gif" + num);
		if ($.browser.msie && accurate_value == "6") {
			$(this).attr("src", "http://st.tita.com/titacn/tita/common/headfoot/" + fileName + "/img/" + logo + ".gif" + num)
		}
	})
}

window.LogoAnimate = new LogoAnimate;
function HeadSeach() {
	this.init()
}

HeadSeach.prototype = {
	define : function() {
		this.iptpra = $("#txtSearchHead");
		this.btn = $("#btntSearchHead");
		this.input = this.iptpra.find("input");
		this.initVal = this.input.attr("initval");
		this.focusClass = this.input.attr("focusclass");
		this.max = 50
	},
	init : function() {
		this.define();
		this._init();
		this.addEvent()
	},
	addEvent : function() {
		this._bindInput();
		this._bindButton()
	},
	_init : function() {
		var input = this.input, val = input.val();
		if (val != this.initVal) {
			input.val(this.initVal)
		}
	},
	_bindInput : function() {
		var that = this, initVal = this.initVal, focusClass = this.focusClass;
		this.input.bind("focus", function() {
			var self = $(this);
			var val = that._trimall(self.val());
			if (val == initVal) {
				self.val("").addClass(focusClass);
				self.parents(".searchhead").addClass("divfocus_ish")
			}
		}).bind("blur", function() {
			var self = $(this);
			var val = that._trimall(self.val());
			if (val == "") {
				self.val(initVal).removeClass(focusClass);
				self.parents(".searchhead").removeClass("divfocus_ish")
			}
		}).bind("keyup", function() {
			var self = $(this);
			var val = that._trimall(self.val());
			if (self.val().length > that.max) {
				self.val(that._substrFun(val))
			}
		}).bind("keydown", function(event) {
			var code = event.keyCode;
			if (code == 13) {
				var self = $(this);
				var val = that._trimall(self.val());
				if (val != "")
					that.btn.trigger("click")
			}
		})
	},
	_bindButton : function() {
		var that = this;
		this.btn.bind("click", function() {
			var val = $.trim(that.input.val());
			var encodeval = encodeURIComponent(that.encodeScript(that.input.val()));
			if (val != "" && val != that.initVal) {
				window.location.href = G_HeadInfo.searchUlr + "?search=" + encodeval
			}
		})
	},
	_trimall : function(str) {
		return str.replace(/^[\s　]+/, "").replace(/[\s　]+$/, "")
	},
	_substrFun : function(str) {
		if (str.length > this.max) {
			return str.substring(0, this.max)
		}
	},
	encodeScript : function(str) {
		var s = "";
		if (str.length == 0)
			return "";
		s = str.replace(/&/g, "&amp;");
		s = s.replace(/</g, "&lt;");
		s = s.replace(/>/g, "&gt;");
		s = s.replace(/    /g, "&nbsp;");
		s = s.replace(/\'/g, "&apos;");
		s = s.replace(/\"/g, "&quot;");
		s = s.replace(/\n/g, "");
		return s
	}
};
window.headSearch = new HeadSeach;
function VideoShow() {
	this.init()
}

VideoShow.prototype = {
	init : function() {
		this.define();
		this.videoContainer = $("#videoShowContainer");
		if (!this.videoContainer.length) {
			$(this.HTML).appendTo("body");
			this.videoContainer = $("#videoShowContainer")
		}
		this.addEvent()
	},
	define : function() {
		this.showVideoBtn = $("#showVideo");
		this.HTML = '<div id="videoShowContainer" class="videoContainer" style="position:absolute;z-index:30000;display:none;"></div>';
		this.videoContainer = null
	},
	addEvent : function() {
		var that = this;
		var $showVideoBtn = this.showVideoBtn;
		$showVideoBtn.bind("click", function() {
			$(".videoContainer").addClass("middleContainer");
			that.videoShow()
		})
	},
	videoShow : function() {
		var that = this;
		$("#videoShowContainer").fadeIn();
		$("body").overlay({
			effect : "none",
			opacity : .5,
			triOnClick : "#closeVideo",
			closeOnClick : false,
			scroll : true,
			color : "#fff",
			onHide : function() {
				$("#videoShowContainer").hide();
				$(".showvideo").remove()
			}
		});
		if ($(".showvideo").length == 0) {
			var arr = ['<div class="showvideo">', '<div class="close_sv clearfix">', '<a href="javascript:void(0)" id="closeVideo">关闭</a>', "</div>", '<div class="wrap_sv clearfix">', '<ul class="paly_wsv">', '<li class="first_pwsv">', '<embed src="http://www.tudou.com/v/jjjFnxjXPtw/&resourceId=0_05_05_99&bid=05/&autoPlay=true/v.swf" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" wmode="opaque"></embed></embed>', "</li>", "</ul>", '<div class="tab_wsv">', "<ul>", '<li class="current_twsv">', '<a href="javascript:void(0)" class="tita_twsv">企业社交网络</a>', "</li>", "<li>", '<a href="javascript:void(0)" class="work_twsv">项目</a>', "</li>", "<li>", '<a href="javascript:void(0)" class="colleague_twsv">同事</a>', "</li>", "<li>", '<a href="javascript:void(0)" class="app_twsv">应用</a>', "</li>", "</ul>", "</div>", "</div>", "</div>"];
			var html = arr.join("");
			this.videoContainer.append(html);
			window.CV = new choiceVideo;
			var scrollH = $(window).scrollTop();
			var clientH = $(window).height();
			var popupH = $(".showvideo").outerHeight();
			$("#videoShowContainer").css({
				top : scrollH + clientH / 2 - popupH / 2
			})
		} else {
			$("#videoShowContainer").fadeIn();
			$(".overlay").fadeIn()
		}
	}
};
function choiceVideo() {
	window.CV = new choiceVideo
}

function choiceVideo() {
	this.define = defineCV;
	this.addEvent = addEventCV;
	this.init = initCV;
	this.init()
}

function initCV() {
	this.define();
	this.addEvent()
}

function defineCV() {
	this.dom = [];
	this.dom.choice = $(".tab_wsv li");
	this.dom.play = $(".paly_wsv");
	this.dom.tita = $(".tita_twsv");
	this.dom.work = $(".work_twsv");
	this.dom.colleague = $(".colleague_twsv");
	this.dom.app = $(".app_twsv");
	this.eFun = this;
	this.eFun.addCurrentIco = addCurrentIcoCV;
	this.eFun.tabVideo = tabVideoCV
}

function addEventCV() {
	var that = this;
	that.eFun.addCurrentIco();
	that.eFun.tabVideo()
}

function addCurrentIcoCV() {
	var $choice = this.dom.choice;
	var that = this;
	$choice.click(function() {
		$(this).addClass("current_twsv").siblings().removeClass("current_twsv")
	})
}

function tabVideoCV() {
	var $play = this.dom.play;
	var $tita = this.dom.tita;
	var $work = this.dom.work;
	var $team = this.dom.team;
	var $app = this.dom.app;
	var $colleague = this.dom.colleague;
	$tita.click(function() {
		$play.empty();
		$(".tita_pwsv").siblings().remove();
		var videoHtml = '<li class="tita_pwsv"><embed src="http://www.tudou.com/v/jjjFnxjXPtw/&resourceId=0_05_05_99&bid=05/&autoPlay=true/v.swf" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" wmode="opaque"></embed></li>';
		$(videoHtml).prependTo($play)
	});
	$work.click(function() {
		$play.empty();
		$(".work_pwsv").siblings().remove();
		var videoHtml = '<li class="work_pwsv"><embed src="http://www.tudou.com/v/5w5olfPj3-Q/&resourceId=0_05_05_99&bid=05/&autoPlay=true/v.swf" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" wmode="opaque"></embed></li>';
		$(videoHtml).prependTo($play)
	});
	$app.click(function() {
		$play.empty();
		$(".app_pwsv").siblings().remove();
		var videoHtml = '<li class="app_pwsv"><embed src="http://www.tudou.com/v/JzAUlubKyu0/&resourceId=0_05_05_99&bid=05/&autoPlay=true/v.swf" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" wmode="opaque"></embed></li>';
		$(videoHtml).prependTo($play)
	});
	$colleague.click(function() {
		$play.empty();
		$(".colleague_pwsv").siblings().remove();
		var videoHtml = '<li class="colleague_pwsv"><embed src="http://www.tudou.com/v/qU1Adq_pzJo/&resourceId=0_05_05_99&bid=05/&autoPlay=true/v.swf" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" wmode="opaque"></embed></li>';
		$(videoHtml).prependTo($play)
	})
}


$(document).ready(function() {
	window.videoshow = new VideoShow
});
function ShowHeaderTip() {
	$(".useravatar_mh").bind("mouseover", function() {
		var self = $(this);
		window.TipT && TipT.tip("修改头像", self, {
			delayTime : -1,
			pos : {
				rel : true,
				top : 70,
				left : 0
			},
			direction : "up",
			extraCss : {
				"z-index" : 1e4
			}
		})
	}).bind("mouseout", function() {
		var self = $(this);
		window.TipT && TipT.tip("修改头像", self, {
			delayTime : -1,
			hide : "true"
		})
	});
	$(".msg_mh").bind("mouseover", function() {
		var self = $(this);
		window.TipT && TipT.tip("系统通知", self, {
			delayTime : -1,
			pos : {
				rel : true,
				top : 70,
				left : 0
			},
			direction : "up",
			extraCss : {
				"z-index" : 1e4
			}
		})
	}).bind("mouseout", function() {
		var self = $(this);
		window.TipT && TipT.tip("系统通知", self, {
			delayTime : -1,
			hide : "true"
		})
	});
	$(".invite_mh").bind("mouseover", function() {
		var self = $(this);
		window.TipT && TipT.tip("邀请同事", self, {
			delayTime : -1,
			pos : {
				rel : true,
				top : 70,
				left : 0
			},
			direction : "up",
			extraCss : {
				"z-index" : 1e4
			}
		})
	}).bind("mouseout", function() {
		var self = $(this);
		window.TipT && TipT.tip("邀请同事", self, {
			delayTime : -1,
			hide : "true"
		})
	})
}

window.showHeaderTip = new ShowHeaderTip;
function HeaderScrollFixed() {
	$(window).bind("scroll", function() {
		var scrollTop = $(window).scrollTop();
		if (scrollTop > $(".loginheaderwrap").height()) {
			$(".loginheaderwrap").addClass("headerscrollfixed")
		} else {
			$(".loginheaderwrap").removeClass("headerscrollfixed")
		}
	})
}

window.headerScrollFixed = new HeaderScrollFixed;
$(function() {
	if (!window.PIdE) {
		var setting = {};
		if (!($.browser.msie && $.browser.version == 6)) {
			setting = {
				relative : true,
				relativeWrap : $("div.header:first")
			};
			var menuhead = $("ul.menuhead");
			var header = $("div.header:first");
			if (menuhead.length) {
				var notiA = menuhead.find("a.msg_mh");
				var reX = notiA.offset().left - menuhead.offset().left;
				setting.calOffset = function() {
					var reX = notiA.offset().left - header.offset().left;
					var riX = -reX;
					return {
						offsetX : -riX - 8,
						offsetY : 0
					}
				}
			}
		}
		window.PIdE = new PositionIndicatorElement(setting)
	}
});
(function(d) {
	var b = ["DOMMouseScroll", "mousewheel"];
	if (d.event.fixHooks) {
		for (var a = b.length; a; ) {
			d.event.fixHooks[b[--a]] = d.event.mouseHooks
		}
	}
	d.event.special.mousewheel = {
		setup : function() {
			if (this.addEventListener) {
				for (var e = b.length; e; ) {
					this.addEventListener(b[--e], c, false)
				}
			} else {
				this.onmousewheel = c
			}
		},
		teardown : function() {
			if (this.removeEventListener) {
				for (var e = b.length; e; ) {
					this.removeEventListener(b[--e], c, false)
				}
			} else {
				this.onmousewheel = null
			}
		}
	};
	d.fn.extend({
		mousewheel : function(e) {
			return e ? this.bind("mousewheel", e) : this.trigger("mousewheel")
		},
		unmousewheel : function(e) {
			return this.unbind("mousewheel", e)
		}
	});
	function c(j) {
		var h = j || window.event, g = [].slice.call(arguments, 1), k = 0, i = true, f = 0, e = 0;
		j = d.event.fix(h);
		j.type = "mousewheel";
		if (h.wheelDelta) {
			k = h.wheelDelta / 120
		}
		if (h.detail) {
			k = -h.detail / 3
		}
		e = k;
		if (h.axis !== undefined && h.axis === h.HORIZONTAL_AXIS) {
			e = 0;
			f = -1 * k
		}
		if (h.wheelDeltaY !== undefined) {
			e = h.wheelDeltaY / 120
		}
		if (h.wheelDeltaX !== undefined) {
			f = -1 * h.wheelDeltaX / 120
		}
		g.unshift(j, k, f, e);
		return (d.event.dispatch || d.event.handle).apply(this, g)
	}

})(jQuery);
function DataForOrgchartBS(aoConf, context) {
	this.conf = aoConf;
	this.context = context;
	this.init()
}

DataForOrgchartBS.prototype = {
	define : function() {
		this.tempData = [];
		this.tempPids = {};
		this.adapter = {};
		this.formatedData = [];
		this.source
	},
	redefine : function() {
		this.tempData = [];
		this.tempPids = {};
		this.formatedData = [];
		if (this.source) {
			$.each(this.source, function(idx, v) {
				v["used"] = false
			})
		}
		return this
	},
	init : function() {
		this.define();
		this.adaptDataFormat()
	},
	formatForRank : function(data) {
		this.tempData = data;
		this.tempPids = {};
		var pid = this.adapter.pid;
		var id = this.adapter.id;
		if (data.constructor == Array) {
			var tempIds = {};
			for (var i in data) {
				tempIds[data[i][id]] = true
			}
			for (var i in data) {
				var t = data[i];
				if (tempIds[t[pid]] && t[pid] != t[id]) {
					t.rtype = "sub"
				} else {
					t.rtype = "root";
					this.tempPids[t[pid]] = true
				}
			}
			var rank = this.formatedData.length;
			var fd = {};
			var tids = {};
			for (var i in data) {
				var t = data[i];
				if (this.tempPids[t[pid]]) {
					t.rank = rank;
					t.used = true;
					tids[t[id]] = true;
					if (!fd[t[pid]]) {
						fd[t[pid]] = []
					}
					fd[t[pid]].push(t)
				}
			}
			this.formatedData[rank] = fd;
			this.tempPids = tids;
			this._traverseDataForRank()
		}
		return this.formatedData
	},
	_traverseDataForRank : function() {
		var pid = this.adapter.pid;
		var id = this.adapter.id;
		var rank = this.formatedData.length;
		var fd = {};
		var tids = {};
		for (var i in this.tempData) {
			var t = this.tempData[i];
			if (!t.used && this.tempPids[t[pid]]) {
				t.rank = rank;
				t.used = true;
				tids[t[id]] = true;
				if (!fd[t[pid]]) {
					fd[t[pid]] = []
				}
				fd[t[pid]].push(t)
			}
		}
		var isnull = false;
		for (var p in tids) {
			isnull = p
		}
		if (!isnull)
			return;
		this.formatedData[rank] = fd;
		this.tempPids = tids;
		arguments.callee.call(this);
		return
	},
	addData : function(data, type) {
		var id = this.adapter.id;
		var src = this.source;
		if (!type || type == "rank") {
			if (!src) {
				src = []
			}
			src = src.concat(data);
			var tempIds = {};
			for (var i = 0; i < src.length; i++) {
				src[i].used = false;
				if (!tempIds[src[i][id]]) {
					tempIds[src[i][id]] = true
				} else {
					src.splice(i, 1);
					i--
				}
			}
		}
		this.source = src
	},
	appendData : function(nid, npid) {
		var id = this.adapter.id;
		var pid = this.adapter.pid;
		for (var p in this.source) {
			if (this.source[p][id] == nid) {
				this.source[p][pid] = npid;
				break
			}
		}
	},
	deleteData : function(nid) {
		if (!nid)
			return;
		this.searchDataGroup(nid, delCallback);
		function delCallback(i, source) {
			source[i].del = 1
		}

		var src = this.source;
		for (var i = 0; i < src.length; i++) {
			var t = src[i];
			if (t.del == 1) {
				src.splice(i, 1);
				i--
			}
		}
	},
	searchData : function(nid) {
		var id = this.adapter.id;
		for (var p in this.source) {
			if (this.source[p][id] == nid) {
				return this.source[p]
			}
		}
	},
	searchDataGroup : function(nid, callback) {
		var o = this.source;
		for (var i = 0; i < o.length; i++) {
			if (o[i] && o[i][this.adapter.id] == nid) {
				this.tempData.push(o[i]);
				if ( typeof callback == "function") {
					callback(i, this.source)
				}
				for (var j = 0; j < o.length; j++) {
					if (o[j] && o[j][this.adapter.pid] == nid) {
						arguments.callee.call(this, o[j][this.adapter.id], callback)
					}
				}
			}
		}
		return this.tempData
	},
	adaptDataFormat : function() {
		var fm = {};
		this.adapter = this.conf.adapter || {
			id : fm["id"] || "id",
			pid : fm["pid"] || "pid",
			logo : fm["logo"] || "logo"
		}
	}
};
function CreateOrgchartBaseBS(aoConf, context) {
	this.conf = aoConf;
	this.context = context;
	this.init()
}

CreateOrgchartBaseBS.prototype = {
	subunitTree : ['<td class="org_td" id="org_td_{id}" nid="{id}" rank="{r}">', '	<div class="org_group" id="org_group_{id}" nid="{id}"></div>', "</td>"],
	subunitColumn : ['<tr class="org_tr org_tr_col"><td class="org_td org_td_col" id="org_td_{id}" nid="{id}" rank="{r}">', '	<div class="org_group org_group_col" id="org_group_{id}" nid="{id}"></div>', "</td></tr>"],
	define : function() {
		this.dom = {};
		this.data = {};
		this.html = {};
		this.dom.wrap = this.conf.wrap;
		this.data.source = this.conf.data;
		this.data.orgType = this.conf.orgType;
		this.data.tempOrgType = this.conf.orgType;
		this.onCreateGroupTreeCallback = this.conf.onCreateGroupTreeCallback;
		this.onCreateRankTreeCallback = this.conf.onCreateRankTreeCallback;
		this.onCreateAllTreeCallback = this.conf.onCreateAllTreeCallback;
		this.onStartCreateAllTreeCallback = this.conf.onStartCreateAllTreeCallback
	},
	init : function() {
		this.define()
	},
	createByRank : function(data, orgType) {
		var pid = this.context.DataObject.adapter.pid;
		var id = this.context.DataObject.adapter.id;
		if ( typeof this.onStartCreateAllTreeCallback == "function") {
			this.onStartCreateAllTreeCallback(data)
		}
		this.data.tempOrgType = this.data.orgType;
		this.data.orgType = orgType || this.data.orgType;
		var isExec0 = false;
		for (var i in data) {
			var o = data[i];
			var isExec1 = false;
			for (var p in o) {
				var isExec2 = false;
				for (var n in o[p]) {
					var tp = o[p][n];
					if ($("#org_td_" + tp[id]).length)
						continue;
					if (!isExec2) {
						isExec2 = true
					}
					if (!isExec1) {
						isExec1 = true
					}
					if (!isExec0) {
						isExec0 = true
					}
					var subunit = [];
					if (this.data.orgType == "column") {
						$.each(this.subunitColumn, function(idx, val) {
							subunit.push(val)
						})
					} else {
						$.each(this.subunitTree, function(idx, val) {
							subunit.push(val)
						})
					}
					var pnode = $("#org_td_" + tp[pid]);
					var rank = pnode.attr("rank");
					subunit[0] = subunit[0].replace(/{id}/g, tp[id]);
					subunit[0] = subunit[0].replace(/{r}/g, rank === undefined ? 0 : parseInt(rank) + 1);
					subunit[1] = subunit[1].replace(/{id}/g, tp[id]);
					var node = $(subunit.join(""));
					this.context.NodeObject.createHtmlContent(tp).appendTo(node.find("div.org_group"));
					this.buildNode(node, pnode)
				}
				if ( typeof this.onCreateGroupTreeCallback == "function") {
					this.onCreateGroupTreeCallback($("#org_td_" + p), isExec2)
				}
			}
			if ( typeof this.onCreateRankTreeCallback == "function") {
				this.onCreateRankTreeCallback(i, o, isExec1)
			}
		}
		if ( typeof this.onCreateAllTreeCallback == "function") {
			this.onCreateAllTreeCallback(data, isExec0)
		}
		this.data.orgType = this.data.tempOrgType
	},
	buildNode : function(node, pnode) {
		if (this.data.orgType == "column") {
			this.buildNodeColumn(node, pnode)
		} else {
			this.buildNodeTree(node, pnode)
		}
	},
	buildNodeTree : function(node, pnode) {
		var unit = $('<table cellspacing=0  cellpadding=0 class="org_table" type="tree"><tr class="org_tr"></tr></table>');
		var prevTable = null;
		if (node.siblings("td.org_td").length == 0) {
			prevTable = node.closest("table.org_table")
		}
		if (!pnode.length) {
			unit.find("tr.org_tr").append(node);
			this.dom.wrap.append(unit)
		} else {
			var snode = pnode.find("td.org_td:first");
			if (!snode.length) {
				if (pnode.find("table.org_table").length) {
					unit = pnode.find("table.org_table")
				}
				unit.find("tr.org_tr").append(node);
				pnode.find("div.org_group:first").append(unit)
			} else {
				snode.closest("tr.org_tr").append(node)
			}
		}
		if (prevTable) {
			if (node.closest("table.org_table")[0] !== prevTable[0]) {
				prevTable.remove()
			}
		}
	},
	buildNodeColumn : function(node, pnode) {
		var unit = $('<table cellspacing=0  cellpadding=0 class="org_table org_table_col" type="column"></table>');
		var prevTable = null;
		if (node.siblings("tr.org_tr").length == 0) {
			prevTable = node.closest("table.org_table")
		}
		if (!pnode.length) {
			unit.append(node);
			this.dom.wrap.append(unit)
		} else {
			var snode = pnode.find(".org_tr:first");
			if (!snode.length) {
				if (pnode.find("table.org_table").length) {
					unit = pnode.find("table.org_table")
				}
				unit.append(node);
				pnode.find("div.org_group:first").append(unit)
			} else {
				snode.closest("table.org_table").append(node)
			}
		}
		if (prevTable) {
			if (node.closest("table.org_table")[0] !== prevTable[0]) {
				prevTable.remove()
			}
		}
	}
};
function CreateOrgchartNodeBS(aoConf, context) {
	this.conf = aoConf;
	this.context = context;
	this.init()
}

CreateOrgchartNodeBS.prototype = {
	define : function() {
		this.dom = {};
		this.data = {};
		this.html = {};
		this.dom.wrap = this.conf.wrap;
		this.data.source
		this.data.orgType = this.conf.orgType;
		this.html.htmlContent = this.conf.htmlContent || ['<div class="org_node_c">节点内容</div>'];
		this.onStartMove = this.conf.onStartMove;
		this.onEndMove = this.conf.onEndMove;
		this.onAppendNodeWithData = this.conf.onAppendNodeWithData;
		this.onCancelOriginalPlaceholder = this.conf.onCancelOriginalPlaceholder;
		this.onDeleteNodeCallback = this.conf.onDeleteNodeCallback;
		this._createHtmlContent = this.conf.createHtmlContent;
		this._addEvent = this.conf.addEventToNode;
		this.isBindMoveOperation = this.conf.isBindMoveOperation;
		this.isMoveOperation = this.conf.isMoveOperation
	},
	init : function() {
		this.define();
		this.addDragEventToDoc()
	},
	createHtmlContent : function(data) {
		if ( typeof this._createHtmlContent == "function") {
			return this._createHtmlContent(data)
		}
		var node = $(this.html.htmlContent.join(""));
		this.addEvent(node);
		return node
	},
	addEvent : function(item) {
		var that = this;
		item.bind("mousedown", function(e) {
			var self = $(this);
			if ( typeof that.isBindMoveOperation != "undefined" && !that.isBindMoveOperation()) {
				return
			}
			var doc = $(document);
			var group = self.parents(".org_group").first();
			if ( typeof that.isMoveOperation != "undefined" && !that.isMoveOperation()) {
				doc.data("orgmoveable", false);
				return
			} else {
				doc.data("orgmoveable", true)
			}
			doc.data("movenode", group);
			doc.data("refnode", that.dom.wrap.find("div.org_node_c").not("#" + self.attr("id")));
			doc.data("handlenode", self);
			doc.attr("issorgtartmove", 0);
			that.calAllNodeLayout("div.org_group,div.org_node_c");
			that.setOriginalPlaceholder(group);
			that.reserveMoveNodeCss(group);
			that.setMoveNodeCss(group);
			group.data("curOrgtd", group.closest(".org_td"));
			group.data("parOrgtd", group.closest(".org_tr").closest(".org_td"));
			group.appendTo(document.body)
		});
		if ( typeof this._addEvent == "function") {
			this._addEvent(item)
		}
	},
	addDragEventToDoc : function() {
		var that = this;
		if ( typeof this.isBindMoveOperation != "undefined" && !this.isBindMoveOperation())
			return;
		$(document).bind("mousedown", function(e) {
			var self = $(this);
			if (self.data("orgmoveable") === true) {
				var ex = e.pageX || 0;
				var ey = e.pageY || 0;
				self.data("esx", ex);
				self.data("esy", ey);
				self.data("edx", 0);
				self.data("edy", 0)
			}
		}).bind("mousemove", function(e) {
			var self = $(this);
			if (self.data("orgmoveable") === true) {
				var ex = e.pageX || 0;
				var ey = e.pageY || 0;
				self.data("enx", ex);
				self.data("eny", ey);
				self.data("edx", ex - self.data("esx"));
				self.data("edy", ey - self.data("esy"));
				var mNode = self.data("movenode");
				mNode.css({
					left : mNode.data("layout").x + self.data("edx"),
					top : mNode.data("layout").y + self.data("edy")
				});
				var handlenode = self.data("handlenode");
				var nx = handlenode.offset().left;
				var ny = handlenode.offset().top;
				var nw = handlenode.width();
				if (self.attr("issorgtartmove") != 1) {
					self.attr("issorgtartmove", 1);
					mNode.css({
						opacity : .5
					});
					if ( typeof that.onStartMove == "function") {
						that.onStartMove(handlenode)
					}
				}
				self.data("refnode").each(function(i, node) {
					node = $(node);
					if (nx + nw / 2 >= node.data("layout").x && nx + nw / 2 <= node.data("layout").x + node.data("layout").w && ny >= node.data("layout").y && ny <= node.data("layout").y + node.data("layout").h) {
						node.css("opacity", .5);
						node.attr("ismatch", 1);
						handlenode.data("matchnode", node)
					} else {
						node.css("opacity", 1);
						node.attr("ismatch", 0)
					}
					return true
				})
			}
		}).bind("mouseup", function(event) {
			var self = $(this);
			if (self.data("orgmoveable") === true) {
				var handlenode = self.data("handlenode");
				var group = self.data("movenode");
				var a = group.data("css");
				group.css(group.data("css"));
				var w = group.width();
				var h = group.height();
				that.cancelOriginalPlaceholder();
				that.appendMoveNode(handlenode);
				if (handlenode.data("matchnode"))
					handlenode.data("matchnode").css("opacity", 1);
				self.data("movenode", null);
				self.data("orgmoveable", false);
				var ohandleparent = group.data("parOrgtd");
				if ( typeof that.onEndMove == "function") {
					that.onEndMove({
						node : handlenode,
						oparent : ohandleparent
					})
				}
			}
		})
	},
	calAllNodeLayout : function(selecttype) {
		var pid = this.context.DataObject.adapter.pid;
		var id = this.context.DataObject.adapter.id;
		this.dom.wrap.data("layout", {
			x : this.dom.wrap.offset().left,
			y : this.dom.wrap.offset().top,
			w : this.dom.wrap.width(),
			h : this.dom.wrap.height()
		});
		var nodes = $(selecttype);
		nodes.each(function(i, node) {
			node = $(node);
			node.data("layout", {
				x : node.offset().left,
				y : node.offset().top,
				w : node.width(),
				h : node.height()
			})
		})
	},
	setMoveNodeCss : function(node) {
		node.css({
			position : "absolute",
			left : node.data("layout").x,
			top : node.data("layout").y,
			"z-index" : 999
		})
	},
	setOriginalPlaceholder : function(node) {
		var ph = $("#orgplaceholder_o");
		if (!ph.length) {
			$('<div id="orgplaceholder_o"></div>').appendTo(document.body);
			ph = $("#orgplaceholder_o")
		}
		ph.show().css({
			width : node.width() - 22,
			height : node.height() - 22,
			margin : "10px",
			border : "1px dashed #999",
			"border-radius" : "5px"
		});
		ph.appendTo(node.parent())
	},
	cancelOriginalPlaceholder : function() {
		var ph = $("#orgplaceholder_o");
		if (this.onCancelOriginalPlaceholder == "function") {
			this.onCancelOriginalPlaceholder(ph);
			return
		}
		ph.hide().appendTo(document.body)
	},
	reserveMoveNodeCss : function(node) {
		node.data("css", {
			position : node.css("absolute") || "static",
			left : node.css("left"),
			top : node.css("top"),
			opacity : node.css("opacity"),
			"z-index" : node.css("z-index")
		})
	},
	appendMoveNode : function(moveNode) {
		var target = moveNode.data("matchnode");
		var group = moveNode.closest(".org_group");
		var node = group.data("curOrgtd");
		group.appendTo(node);
		if (target && target.length && target.attr("ismatch") == 1) {
			var pnode = target.closest(".org_td");
			this.appendNodeWithData(node, pnode)
		}
	},
	appendNodeWithData : function(node, pnode) {
		var oparent = node.closest(".org_tr").closest(".org_td");
		this.context.DataObject.appendData(node.attr("nid"), pnode.attr("nid"));
		this.context.BaseObject.buildNode(node, pnode);
		if ( typeof this.onAppendNodeWithData == "function") {
			this.onAppendNodeWithData({
				node : node,
				oparent : oparent
			})
		}
	},
	deleteNodeWithData : function(nid) {
		this.context.DataObject.deleteData(nid);
		var node = $("#org_td_" + nid);
		if (node.length) {
			var ptable = node.closest(".org_table");
			var pnode = ptable.parents(".org_td:first");
			if (ptable.find(".org_td").length == 1) {
				ptable.remove()
			} else {
				node.remove()
			}
			if ( typeof this.onDeleteNodeCallback == "function") {
				this.onDeleteNodeCallback(pnode)
			}
		}
	},
	addNodeWithData : function(data) {
		this.context.DataObject.addData(data);
		var source = this.context.DataObject.redefine().formatForRank(data);
		this.context.BaseObject.createByRank(source)
	}
};
function CreateOrgchartBS(aoConf, context) {
	this.conf = aoConf;
	this.context = context;
	this.init()
}

CreateOrgchartBS.prototype = {
	init : function() {
		if (!this.conf.wrap || !this.conf.wrap.length) {
			return
		}
		this.conf.wrap.html("");
		this.COE = new CreateOrgchartExtendBS({}, this);
		var onStartMoveCallback = this.COE.onStartMoveCallback;
		var onEndMoveCallback = this.COE.onEndMoveCallback;
		var onAppendNodeWithData = this.COE.onAppendNodeWithData;
		var onCreateGroupTreeCallback = this.COE.onCreateGroupTreeCallback;
		var onCreateRankTreeCallback = this.COE.onCreateRankTreeCallback;
		var onCreateAllTreeCallback = this.COE.onCreateAllTreeCallback;
		var onStartCreateAllTreeCallback = this.COE.onStartCreateAllTreeCallback;
		var onCancelOriginalPlaceholder = this.COE.onCancelOriginalPlaceholder;
		var addEventToNode = this.COE.addEventToNode;
		var htmlContent = this.COE.htmlContent;
		var createHtmlContent = this.COE.createHtmlContent;
		var isMoveOperation = this.COE.isMoveOperation;
		var onDeleteNodeCallback = this.COE.onDeleteNodeCallback;
		var defaultOption = {
			wrap : this.conf.wrap,
			orgType : this.conf.orgType,
			onStartMove : onStartMoveCallback,
			onEndMove : onEndMoveCallback,
			htmlContent : htmlContent,
			createHtmlContent : createHtmlContent,
			addEventToNode : addEventToNode,
			onAppendNodeWithData : onAppendNodeWithData,
			onCancelOriginalPlaceholder : onCancelOriginalPlaceholder,
			onCreateGroupTreeCallback : onCreateGroupTreeCallback,
			onCreateRankTreeCallback : onCreateRankTreeCallback,
			onCreateAllTreeCallback : onCreateAllTreeCallback,
			onStartCreateAllTreeCallback : onStartCreateAllTreeCallback,
			isMoveOperation : isMoveOperation,
			onDeleteNodeCallback : onDeleteNodeCallback
		};
		$.extend(true, defaultOption, this.conf);
		this.DataObject = new DataForOrgchartBS(defaultOption, this);
		this.NodeObject = new CreateOrgchartNodeBS(defaultOption, this);
		this.BaseObject = new CreateOrgchartBaseBS(defaultOption, this)
	},
	render : function(data) {
		this.NodeObject.addNodeWithData(data)
	}
};
function CreateOrgchartExtendBS(aoConf, context) {
	this.context = context
}

CreateOrgchartExtendBS.prototype = {
	htmlContent : ['<div class="org_node_c" id="org_node_c_{id}" nid="{id}"><div class="org_node_c_inner"><span style="position:absolute;color:#fff;background:#000"></span>', '	<a class="img_corg" href="#">', '		<img src="{img}" />', "	</a>", "</div></div>"],
	onCreateGroupTreeCallback : function(cnode, isExec) {
		if (!isExec)
			return;
		this.context.COE.setLine(cnode)
	},
	onCreateRankTreeCallback : function(rank, data, isExec) {
		if (!isExec)
			return
	},
	onCreateAllTreeCallback : function(data, isExec) {
		var that = this;
		if (data.length === 0)
			return;
		var wrap = this.context.conf.wrap;
		if (!isExec) {
			wrap.find("td.org_td").fadeIn(800);
			wrap.fadeIn(800);
			return
		}
		var id = this.context.DataObject.adapter.id;
		var tWrap = wrap.find("table.org_table:first");
		var allNodes;
		var scaleValue = wrap.data("scaleValue") || 0;
		for (var i in data[0]) {
			if ($("#org_td_" + i).length) {
				for (var j in data[0][i]) {
					var curNode = $("#org_td_" + data[0][i][j][id]);
					if (scaleValue !== 0) {
						allNodes = curNode.find("div.org_node_c, div.org_node_c_inner, div.org_node_c .img_corg img");
						allNodes.each(function(i, e) {
							if (e) {
								var eh = parseFloat(that.context.COE.getFinalStyle(e, "height")) + scaleValue;
								e.style.height = eh + "px";
								var ew = parseFloat(that.context.COE.getFinalStyle(e, "width")) + scaleValue;
								e.style.width = ew + "px"
							}
						})
					}
					curNode.fadeIn(800)
				}
			} else {
				wrap.fadeIn(800);
				break
			}
		}
		wrap.unbind("mousewheel");
		wrap.bind("mousewheel", function(event, delta) {
			allNodes = wrap.find("div.org_node_c, div.org_node_c_inner, div.org_node_c .img_corg img");
			var tiWid = tWrap.width();
			var tiHei = tWrap.height();
			var tiPos = tWrap.offset();
			var imsL = event.pageX - tiPos.left;
			var imsT = event.pageY - tiPos.top;
			irL = imsL / tiWid;
			irT = imsT / tiHei;
			var direct;
			if (delta < 0) {
				direct = -3
			} else {
				direct = 3
			}
			if (!wrap.data("scaleValue")) {
				wrap.data("scaleValue", 0)
			}
			wrap.data("scaleValue", wrap.data("scaleValue") + direct);
			allNodes.each(function(i, e) {
				if (e) {
					var ew = parseFloat(that.context.COE.getFinalStyle(e, "width"));
					var eh = parseFloat(that.context.COE.getFinalStyle(e, "height"));
					e.style.width = ew + direct + "px";
					e.style.height = (ew + direct) * (eh / ew) + "px"
				}
			});
			var tfWid = tWrap.width();
			var tfHei = tWrap.height();
			var disL = imsL - irL * tfWid;
			var disT = imsT - irT * tfHei;
			var iml = parseFloat(that.context.COE.getFinalStyle(tWrap[0], "marginLeft"));
			var ml = (isNaN(iml) ? 0 : iml) + disL;
			var imt = parseFloat(that.context.COE.getFinalStyle(tWrap[0], "marginTop"));
			var mt = (isNaN(imt) ? 0 : imt) + disT;
			tWrap.css({
				"margin-left" : ml,
				"margin-top" : mt
			});
			return false
		})
	},
	onStartCreateAllTreeCallback : function(data) {
		if (data.length === 0)
			return;
		var id = this.context.DataObject.adapter.id;
		var wrap = this.context.conf.wrap;
		for (var i in data[0]) {
			if ($("#org_td_" + i).length) {
				for (var j in data[0][i]) {
					$("#org_td_" + data[0][i][j][id]).hide()
				}
			} else {
				wrap.hide();
				break
			}
		}
	},
	onStartMoveCallback : function(cnode) {
		var target = cnode.closest(".org_group").data("curOrgtd");
		this.context.COE.setLine(target)
	},
	onEndMoveCallback : function(res) {
		var target = res.node.closest(".org_tr").closest(".org_td");
		target.fadeIn(500)
	},
	onAppendNodeWithData : function(res) {
		var target = res.node.closest(".org_tr").closest(".org_td");
		var ctarget = res.oparent;
		target.hide();
		this.context.COE.setLine(target);
		this.context.COE.setLine(ctarget)
	},
	onDeleteNodeCallback : function(pnode) {
		this.context.COE.setLine(pnode)
	},
	setLine : function(pnode) {
		if (pnode.length) {
			var snode;
			if (this.context.BaseObject.data.orgType == "column") {
				snode = pnode.find(".org_table:first").find(".org_tr").children(".org_td")
			} else {
				snode = pnode.find(".org_tr:first").children(".org_td")
			}
			var len = snode.length;
			if (len) {
				pnode.find("div.org_node_c:first").addClass("org_line_bm");
				snode.each(function(i, e) {
					e = $(e);
					e.removeClass("org_line_tm");
					e.removeClass("org_line_r");
					e.removeClass("org_line_l");
					e.removeClass("org_line_lr");
					if (len == 1) {
						if (!e.hasClass("org_line_tm"))
							e.addClass("org_line_tm")
					} else if (i == 0) {
						if (!e.hasClass("org_line_r"))
							e.addClass("org_line_r")
					} else if (i == len - 1) {
						if (!e.hasClass("org_line_l"))
							e.addClass("org_line_l")
					} else {
						if (!e.hasClass("org_line_lr"))
							e.addClass("org_line_lr")
					}
				})
			} else {
				pnode.find("div.org_node_c:first").removeClass("org_line_bm")
			}
		}
	},
	createHtmlContent : function(data) {
		var node, tp = data;
		var pid = this.context.DataObject.adapter.pid;
		var id = this.context.DataObject.adapter.id;
		var logo = this.context.DataObject.adapter.logo;
		var content = [];
		$.each(this.html.htmlContent, function(idx, val) {
			content.push(val)
		});
		content[0] = content[0].replace(/{id}/g, tp[id]);
		content[2] = content[2].replace("{img}", tp[logo]);
		node = $(content.join(""));
		node.find("span").html(tp[id]);
		this.addEvent(node);
		return node
	},
	addEventToNode : function(item) {
		var that = this;
		item.find("img").bind("mousemove", function(e) {
			e.preventDefault()
		}).bind("mouseup", function(e) {
			e.preventDefault()
		}).bind("mousedown", function(e) {
			e.preventDefault()
		})
	},
	isMoveOperation : function() {
		var wrap = this.context.conf.wrap;
		if (wrap.find("table.org_table[type!=tree]").length)
			return false;
		else
			return true
	},
	getFinalStyle : function(aeP, asName) {
		if (aeP.style[asName]) {
			return aeP.style[asName]
		} else if (aeP.currentStyle) {
			return aeP.currentStyle[asName]
		} else if (document.defaultView && document.defaultView.getComputedStyle) {
			asName = asName.replace(/([A-Z])/g, "-$1");
			asName = asName.toLowerCase();
			var s = document.defaultView.getComputedStyle(aeP, "");
			return s && s.getPropertyValue(asName)
		} else {
			return null
		}
	}
};
var OFTFDomain = window.G_Info.Domain || "http://www.tita.com";
function departmentPage() {
	window.OFTita = new OrgchartForTita({
		wrap : $("#box_org_tree")
	})
}

function OrgchartForTita(aoConf) {
	this.conf = aoConf;
	this.init()
}

OrgchartForTita.prototype = {
	init : function() {
		if (!this.conf.wrap.length)
			return;
		this.createOrgChart();
		this.whRateNodeC = parseFloat(this.initHeightOfNodeC / this.initWidthOfNodeC);
		this.bindWrapEvent()
	},
	createOrgChart : function() {
		var OFTitaOption = {
			adapter : this.adapter,
			htmlContent : this.htmlContent,
			onCreateRankTreeCallback : this.onCreateRankTreeCallback,
			onCreateAllTreeCallback : this.onCreateAllTreeCallback,
			onEndMove : this.onEndMoveCallback,
			addEventToNode : this.addEventToNode,
			createHtmlContent : this.createHtmlContent,
			isBindMoveOperation : this.isBindMoveOperation
		};
		window.COBS = new CreateOrgchartBS($.extend({
			wrap : this.conf.wrap
		}, OFTitaOption));
		this.packetDepartmentPerson();
		this.getAllNodes()
	},
	getAllNodes : function() {
		var that = this;
		this.conf.wrap.css({
			"background-image" : "url(http://st-web.tita.com/titacn/tita/common/images/load_m.gif)",
			"background-repeat" : "no-repeat",
			"background-position" : "center center"
		});
		$.ajax({
			type : "get",
			url : window.G_Info.GetAllDepartmentInfoAjax + "?v=" + (new Date).getTime(),
			dataType : "json",
			cache : false,
			success : function(res) {
				if (res.Result == 1) {
					that.conf.wrap.data("scaleValue", -20);
					COBS.DataObject.addData(res.Msg);
					var source = that.searchDataRankByPidRank(0, 1, true);
					COBS.BaseObject.createByRank(source);
					var orgTable = that.conf.wrap.find("table.org_table:first");
					var fixMl = (that.conf.wrap.width() - orgTable.outerWidth()) / 2;
					orgTable.css("margin-left", fixMl);
					OrgchartForTitaMap(that.conf.wrap);
					OFTRule = new OrgchartForTitaRule({
						curScale : 80,
						totalScale : 100
					});
					OFTRule.init();
					OFTFs = new OrgchartForTitaFullScreen({
						orgWrap : that.conf.wrap
					});
					OFTFs.init();
					OFTToolbar = new OrgchartForTitaToolbar({
						orgWrap : that.conf.wrap
					});
					OFTToolbar.init()
				} else {
					window.DialogT.show(that.conf.wrap, {
						autoHide : true,
						delayTime : 2e3,
						verifyClass : "warm_verify",
						text : res.Msg,
						wrap : OFTita.conf.wrap.parent(),
						position : function(tri, tip) {
							return OFTita.positionDialog(tri, tip)
						}
					})
				}
			},
			error : function() {
				window.DialogT.show(that.conf.wrap, {
					autoHide : true,
					delayTime : 2e3,
					verifyClass : "warm_verify",
					text : "请求数据时出错",
					wrap : OFTita.conf.wrap.parent(),
					position : function(tri, tip) {
						return OFTita.positionDialog(tri, tip)
					}
				})
			},
			complete : function() {
				that.conf.wrap.css({
					"background-image" : "none"
				})
			}
		})
	},
	searchDataRankByPidRank : function(pid, lastRank, root) {
		var data = COBS.DataObject.redefine().searchDataGroup(pid);
		var source = COBS.DataObject.redefine().formatForRank(data);
		return source.slice(!root & 1, lastRank + 1)
	},
	isBindMoveOperation : function() {
		return false
	},
	bindWrapEvent : function() {
		var delegater = $("#box_org_tree");
		var moveNode;
		var mouseStartX, mlStartX, pointX, mx, mouseStartY, mlStartY, pointY, my, status;
		var dragCond = false;
		delegater.bind("mousedown", function(e) {
			dragCond = OFTita.isWrapDraggable && OFTita.isWrapDraggableSub;
			status = true;
			if (!dragCond)
				return;
			moveNode = delegater.find("table.org_table:first");
			if (e.pageX != undefined) {
				mouseStartX = e.pageX
			}
			if (e.pageY != undefined) {
				mouseStartY = e.pageY
			}
			mlStartX = parseFloat(moveNode.css("margin-left"));
			mlStartX = isNaN(mlStartX) ? 0 : mlStartX;
			mlStartY = parseFloat(moveNode.css("margin-top"));
			mlStartY = isNaN(mlStartY) ? 0 : mlStartY
		}).bind("mousemove", function(e) {
			if (!dragCond)
				return;
			if (!status)
				return;
			OFTita.hidePersonShow();
			if (e.pageX != undefined) {
				pointX = e.pageX
			}
			if (e.pageY != undefined) {
				pointY = e.pageY
			}
			mx = pointX - mouseStartX;
			my = pointY - mouseStartY;
			moveNode.css("margin-left", mlStartX + mx);
			moveNode.css("margin-top", mlStartY + my)
		}).bind("mouseup", function() {
			status = false;
			if (!dragCond)
				return
		}).bind("mouseover", function() {
			dragCond = OFTita.isWrapDraggable && OFTita.isWrapDraggableSub;
			if (!dragCond) {
				$(this).css("cursor", "default");
				return
			}
			$(this).css("cursor", "move")
		}).bind("mouseout", function() {
			if (!dragCond)
				return;
			$(this).css("cursor", "default")
		});
		$(document).bind("mouseup", function() {
			status = false;
			if (!dragCond)
				return
		})
	},
	setToVeiwCenter : function(nid) {
		var node = $("#org_node_c_" + nid);
		var wrap = $("#box_org_tree");
		var view = wrap.find("table.org_table:first");
		var inner = node.find("div.org_node_c_inner:first");
		var wrapXY = wrap.offset();
		var wrapW = wrap.width();
		var wrapH = wrap.height();
		var nodeXY = node.offset();
		var nodeW = node.outerWidth();
		var nodeH = node.outerHeight();
		var mlX = parseFloat(view.css("margin-left"));
		var mlX = isNaN(mlX) ? 0 : mlX;
		var mlY = parseFloat(view.css("margin-top"));
		var mlY = isNaN(mlY) ? 0 : mlY;
		var tml = mlX - (nodeXY.left - wrapXY.left - wrapW / 2) - nodeW / 2;
		var tmt = mlY - (nodeXY.top - wrapXY.top - wrapH / 2) - nodeH / 2;
		view.stop().animate({
			"margin-left" : tml,
			"margin-top" : tmt
		}, 500, function() {
			inner.addClass("org_flashborder");
			setTimeout(function() {
				inner.removeClass("org_flashborder")
			}, 2e3)
		})
	},
	onCreateRankTreeCallback : function(rank, data, isExec) {
		if (!isExec)
			return
	},
	onCreateAllTreeCallback : function(data, isExec) {
		var that = this;
		if (data.length === 0)
			return;
		var wrap = this.context.conf.wrap;
		if (!isExec) {
			wrap.find("td.org_td").fadeIn(500);
			wrap.fadeIn(500);
			return
		}
		var id = this.context.DataObject.adapter.id;
		var tWrap = wrap.find("table.org_table:first");
		var scaleValue = wrap.data("scaleValue") || 0;
		for (var i in data[0]) {
			for (var j in data[0][i]) {
				OFTita.validateChildren(data[0][i][j][id])
			}
			if ($("#org_td_" + i).length) {
				for (var j in data[0][i]) {
					var curNode = $("#org_td_" + data[0][i][j][id]);
					if (scaleValue !== 0) {
						OFTita.allScaleNode = curNode.find(OFTita.allScaleNodeSelector);
						OFTita.allScaleNode.each(function(i, e) {
							if (e) {
								var ew = parseFloat(that.context.COE.getFinalStyle(e, "width")) + scaleValue;
								e.style.width = ew + "px";
								e.style.height = ew * OFTita.whRateNodeC + "px"
							}
						});
						OFTita.changeNodeBySize(wrap, curNode)
					}
					if (curNode.parents("table[type=column]").length) {
						curNode.find("div.org_node_c").find("a.single_nci,a.showall_nci, a.unfold_nci,a.fold_nci,a.add_nci").hide()
					}
					curNode.fadeIn(500)
				}
			} else {
				if (scaleValue !== 0) {
					OFTita.allScaleNode = wrap.find(OFTita.allScaleNodeSelector);
					OFTita.allScaleNode.each(function(i, e) {
						if (e) {
							var ew = parseInt($(e).attr("maxwidth")) + scaleValue;
							e.style.width = ew + "px";
							e.style.height = ew * OFTita.whRateNodeC + "px"
						}
					});
					OFTita.changeNodeBySize(wrap, wrap)
				}
				wrap.fadeIn(500);
				break
			}
		}
		var absTables;
		wrap.unbind("mousewheel");
		wrap.bind("mousewheel", function(event, delta) {
			OFTita.allScaleNode = wrap.find(OFTita.allScaleNodeSelector);
			var tiWid = tWrap.width();
			var tiHei = tWrap.height();
			var tiPos = tWrap.offset();
			var imsL = event.pageX - tiPos.left;
			var imsT = event.pageY - tiPos.top;
			irL = imsL / tiWid;
			irT = imsT / tiHei;
			var direct;
			if (delta < 0) {
				direct = -5
			} else {
				direct = +5
			}
			if (!wrap.data("scaleValue")) {
				wrap.data("scaleValue", 0)
			}
			wrap.data("scaleValue", wrap.data("scaleValue") + direct);
			if (!OFTita.changeNodeBySize(wrap, null, {
				imsL : imsL,
				imsT : imsT,
				irL : irL,
				irT : irT
			})) {
				OFTRule.fixRule({
					curScale : 100 + wrap.data("scaleValue")
				});
				return false
			}
			OFTita.allScaleNode.each(function(i, e) {
				if (e) {
					var ew = parseFloat(that.context.COE.getFinalStyle(e, "width"));
					e.style.width = ew + direct + "px";
					e.style.height = (ew + direct) * OFTita.whRateNodeC + "px"
				}
			});
			absTables = wrap.find("table.org_table_abs");
			absTables.each(function(i, e) {
				e = $(e);
				e.css("margin-left", -(e.width() - $("#org_node_c_" + e.parent().attr("nid")).outerWidth()) / 2)
			});
			OFTita.fixOrgPositionRefMouse(tWrap, imsL, imsT, irL, irT);
			OFTRule.fixRule({
				curScale : 100 + wrap.data("scaleValue")
			});
			OFTita.hidePersonShow();
			return false
		})
	},
	changeNodeBySize : function(wrap, container, option) {
		if (!container) {
			container = wrap
		}
		var scaleValue = wrap.data("scaleValue");
		if (scaleValue >= 0) {
			container.find("div.org_node_c").removeClass("middle_ort_nci");
			container.find("div.org_node_c").removeClass("small_ort_nci");
			wrap.find("div.org_node_c").width(OFTita.initWidthOfNodeC).height(OFTita.initWidthOfNodeC * OFTita.whRateNodeC);
			wrap.find("div.org_node_c_inner").width(OFTita.initWidthOfNodeInner).height(OFTita.initWidthOfNodeInner * OFTita.whRateNodeC);
			wrap.data("scaleValue", 0);
			if (option) {
				var tWrap = wrap.find("table.org_table:first");
				OFTita.fixOrgPositionRefMouse(tWrap, option.imsL, option.imsT, option.irL, option.irT)
			}
			return false
		} else if (scaleValue >= -30) {
			container.find("div.org_node_c").removeClass("middle_ort_nci");
			container.find("div.org_node_c").removeClass("small_ort_nci")
		} else if (scaleValue >= -60) {
			container.find("div.org_node_c").addClass("middle_ort_nci");
			container.find("div.org_node_c").removeClass("small_ort_nci")
		} else if (scaleValue >= -100) {
			container.find("div.org_node_c").removeClass("middle_ort_nci");
			container.find("div.org_node_c").addClass("small_ort_nci")
		} else {
			container.find("div.org_node_c").removeClass("middle_ort_nci");
			container.find("div.org_node_c").addClass("small_ort_nci");
			wrap.find("div.org_node_c").width(OFTita.initWidthOfNodeC - 100).height((OFTita.initWidthOfNodeC - 100) * OFTita.whRateNodeC);
			wrap.find("div.org_node_c_inner").width(OFTita.initWidthOfNodeInner - 100).height((OFTita.initWidthOfNodeInner - 100) * OFTita.whRateNodeC);
			wrap.data("scaleValue", -100);
			if (option) {
				var tWrap = wrap.find("table.org_table:first");
				OFTita.fixOrgPositionRefMouse(tWrap, option.imsL, option.imsT, option.irL, option.irT)
			}
			return false
		}
		return true
	},
	fixOrgPositionRefMouse : function(tWrap, imsL, imsT, irL, irT) {
		var tfWid = tWrap.width();
		var tfHei = tWrap.height();
		var disL = imsL - irL * tfWid;
		var disT = imsT - irT * tfHei;
		var iml = parseFloat(COBS.COE.getFinalStyle(tWrap[0], "marginLeft"));
		var ml = (isNaN(iml) ? 0 : iml) + disL;
		var imt = parseFloat(COBS.COE.getFinalStyle(tWrap[0], "marginTop"));
		var mt = (isNaN(imt) ? 0 : imt) + disT;
		tWrap.css({
			"margin-left" : ml,
			"margin-top" : mt
		})
	},
	onEndMoveCallback : function(res) {
		OFTita.switchParentNode(res)
	},
	isWrapDraggable : true,
	isWrapDraggableSub : true,
	allScaleNode : null,
	allScaleNodeSelector : "div.org_node_c, div.org_node_c_inner",
	initWidthOfNodeC : 200,
	initHeightOfNodeC : 100,
	initWidthOfNodeInner : 200,
	initHeightOfNodeInner : 100,
	adapter : {
		id : "Id",
		pid : "PId",
		name : "DepartmentName",
		usernum : "TotalUserCount",
		leadername : "DepartmentLeaderName"
	},
	htmlContent : ['<div class="org_node_c" id="org_node_c_{id}" nid="{id}" usernum="{usernum}"><div class="org_node_c_inner">', '<div class="wrap_department">', '	<div class="menu_department">', '		<table width="100%" height="100%" cellspacing="0" cellpadding="0">', '			<tr><td><a class="del_nci" href="javascript:void(0);" style="{style}">删除</a></td></tr>', '			<tr><td><a class="rename_department rename_nci" href="javascript:void(0);" style="{style}">重命名</a></td></tr>', '			<tr><td><a class="add_nci" href="javascript:void(0);">新增子部门</a></td></tr>', "		</table>", "	</div>", '	<div class="item_department">', '		<span class="arrow_department"><a href="javascript:void(0);"></a></span>', '		<span class="name_department">', '		<table width="100%" height="100%" cellspacing="0" cellpadding="0">', "			<tr>", "				<td><b>{usernum}</b>", '				<a class="{fontsize}">{name}</a><span>{username}</span></td>', "			</tr>", "		</table>", "		</span>", '		<span class="ops_department">', '			<a class="experson_nci" href="javascript:void(0);" style="{style}"></a>', '			<a class="showall_nci" href="javascript:void(0);" style="{style}"></a>', '			<a class="single_nci" href="javascript:void(0);" style="{style}"></a>', "		</span>", "	</div>", "</div>", '<div class="unfoldwrap_nci">', '	<div class="unfoldwrapinner_nci">', '		<a class="unfold_nci" href="javascript:void(0);"></a>', '		<a class="fold_nci" href="javascript:void(0);"></a>', '		<a class="unfoldp_nci" href="javascript:void(0);" style="display:none"></a>', '		<a class="foldp_nci" href="javascript:void(0);" style="display:none"></a>', "	</div>", "</div>", "</div></div>"],
	createHtmlContent : function(data) {
		var node, tp = data;
		var pid = this.context.DataObject.adapter.pid;
		var id = this.context.DataObject.adapter.id;
		var name = this.context.DataObject.adapter.name;
		var usernum = this.context.DataObject.adapter.usernum;
		var leadername = this.context.DataObject.adapter.leadername;
		var content = [];
		$.each(this.html.htmlContent, function(idx, val) {
			content.push(val)
		});
		content[0] = content[0].replace(/{id}/g, tp[id]);
		content[0] = content[0].replace(/{usernum}/g, tp[usernum]);
		if (tp[id] == 0) {
			content[4] = content[4].replace("{style}", "display:none");
			content[5] = content[5].replace("{style}", "display:none");
			content[22] = content[22].replace("{style}", "display:none")
		}
		content[21] = content[21].replace("{style}", "display:none");
		content[15] = content[15].replace("{name}", tp[name]);
		if (tp[leadername]) {
			content[15] = content[15].replace("{username}", tp[leadername])
		} else {
			content[15] = content[15].replace("{username}", "")
		}
		if (tp[name].length >= 15) {
			content[15] = content[15].replace("{fontsize}", "fontsize12_dp")
		} else {
			content[15] = content[15].replace("{fontsize}", "")
		}
		content[14] = content[14].replace("{usernum}", tp[usernum]);
		if (COBS.DataObject.dPerson["d_" + tp[id]] && COBS.DataObject.dPerson["d_" + tp[id]].length != 0) {
			content[20] = content[20].replace("{style}", "")
		} else {
			content[20] = content[20].replace("{style}", "display:none")
		}
		node = $(content.join(""));
		node.attr("maxwidth", OFTita.initWidthOfNodeC);
		node.attr("maxheight", OFTita.initHeightOfNodeC);
		node.find("div.org_node_c_inner:first").attr("maxwidth", OFTita.initWidthOfNodeInner);
		node.find("div.org_node_c_inner:first").attr("maxheight", OFTita.initHeightOfNodeInner);
		this.addEvent(node);
		return node
	},
	addEventToNode : function(item) {
		var that = this;
		var wrap = this.context.conf.wrap;
		var nid = item.attr("nid");
		item.bind("mouseover", function() {
			var self = $(this);
			self.css("cursor", "move");
			self.find("div.org_node_c_inner").addClass("over_org_nci")
		}).bind("mouseout", function() {
			var self = $(this);
			self.css("cursor", "default");
			self.find("div.org_node_c_inner").removeClass("over_org_nci")
		});
		item.find("img").bind("mousemove", function(e) {
			e.preventDefault()
		}).bind("mouseup", function(e) {
			e.preventDefault()
		}).bind("mousedown", function(e) {
			e.preventDefault()
		});
		item.find("a.fold_nci, a.unfold_nci, a.del_nci, a.add_nci, a.showall_nci, a.single_nci, a.rename_nci").bind("mousedown", function(e) {
			e.stopPropagation()
		});
		item.find("a.fold_nci").bind("click", function() {
			var self = $(this);
			var sub = $("#org_td_" + nid).find("table.org_table:first");
			var orgTable = wrap.find("table.org_table:first");
			var ml = parseFloat(orgTable.css("margin-left"));
			var fixMl = (isNaN(ml) ? 0 : ml) + ($("#org_td_" + nid).width() - $("#org_node_c_" + nid).outerWidth()) / 2;
			sub.fadeOut(500, function() {
				self.hide();
				item.find("a.unfold_nci").show();
				if (item.hasClass("org_line_bm")) {
					item.removeClass("org_line_bm")
				}
				orgTable.css("margin-left", fixMl)
			});
			OFTToolbar.triShowAllOrg(OFTToolbar.showTri, 1)
		});
		item.find("a.unfold_nci").bind("click", function() {
			OFTita.unfoldNode(nid)
		});
		item.find("a.del_nci").bind("click", function() {
			var self = $(this);
			var paGroup = item.closest("table.org_table").parent();
			var paNode = paGroup.find("div.org_node_c:first");
			if (paNode.css("visibility") == "hidden") {
				item.find("a.showall_nci").trigger("click")
			}
			var name = item.find(".name_department a").html();
			window.DialogT.show($(this), {
				sure : function() {
					OFTita.deleteNode(nid)
				},
				cancel : function() {
					window.DialogT.hide()
				},
				text : "您确定要移除 " + name + " 吗？",
				wrap : OFTita.conf.wrap.parent(),
				position : function(tri, tip) {
					return OFTita.positionDialog(tri, tip)
				}
			})
		});
		item.find("a.add_nci").bind("click", function() {
			OFTita.unfoldNode(nid);
			window.DialogT.show(item, {
				extraId : "addDepartment",
				extraHtml : OFTita.nameDepartmentHtml("add"),
				wrap : OFTita.conf.wrap.parent(),
				position : function(tri, tip) {
					return OFTita.positionDialog(tri, tip)
				}
			});
			OFTita.inputAddDepartment(nid)
		});
		item.find("a.rename_nci").bind("click", function() {
			var name = item.find(".name_department a").html();
			window.DialogT.show(item, {
				extraId : "remameDepartment",
				extraHtml : OFTita.nameDepartmentHtml("rename", name),
				wrap : OFTita.conf.wrap.parent(),
				position : function(tri, tip) {
					return OFTita.positionDialog(tri, tip)
				}
			});
			OFTita.inputRenameDepartment(nid)
		});
		var isHover = false;
		var timer = null;
		item.find(".arrow_department").bind("mouseover", function() {
			isHover = true;
			item.find(".menu_department").stop().animate({
				left : 0
			}, "fast")
		}).bind("mouseout", function() {
			isHover = false;
			if (timer)
				clearTimeout(timer);
			timer = setTimeout(function() {
				if (!isHover) {
					item.find(".menu_department").stop().animate({
						left : -80
					}, "fast");
					isOut = false
				}
			}, 200)
		});
		item.find(".menu_department").bind("mouseover", function() {
			isHover = true
		}).bind("mouseleave", function() {
			isHover = false;
			$(this).stop().animate({
				left : -80
			}, "fast")
		});
		item.find("a.single_nci").bind("click", function() {
			var self = $(this);
			var orgtd = $("#org_td_" + nid);
			orgtd.parents(".org_td").find("div.org_node_c:first").each(function(i, e) {
				OFTita.displayOps($(e).attr("nid"), {
					single : true
				})
			});
			wrap.find("div.org_node_c").filter(function(idx) {
				if ($(this).closest(orgtd).length !== 0) {
					return false
				}
				return true
			}).css("visibility", "hidden");
			wrap.find("td.org_td").filter(function(idx) {
				if ($.contains(orgtd[0], this)) {
					return false
				}
				return true
			}).addClass("nobackground");
			self.hide();
			item.find("a.showall_nci").show();
			OFTToolbar.triShowAllOrg(OFTToolbar.showTri, 1)
		});
		item.find("a.showall_nci").bind("click", function() {
			var self = $(this);
			var orgtd = $("#org_td_" + nid);
			wrap.find("div.org_node_c").filter(function(idx) {
				if ($(this).closest(orgtd).length !== 0) {
					return false
				}
				return true
			}).css("visibility", "visible");
			wrap.find("td.org_td").filter(function(idx) {
				if ($.contains(orgtd[0], this)) {
					return false
				}
				return true
			}).removeClass("nobackground");
			self.hide();
			item.find("a.single_nci").show()
		});
		item.find("a.experson_nci").bind("click", function() {
			var self = $(this);
			var isshow = self.attr("isshow");
			if (isshow && isshow == "1") {
				self.attr("isshow", "0");
				OFTita.hideExperson(nid)
			} else {
				self.attr("isshow", "1");
				OFTita.showExperson(self, nid)
			}
			self.blur()
		})
	},
	isModifyCurrentNodePosition : true,
	unfoldNode : function(nid) {
		var item = $("#org_node_c_" + nid);
		var sub = $("#org_td_" + nid).find("table.org_table:first");
		var wrap = COBS.conf.wrap;
		if (sub.length && sub.css("display") != "none")
			return;
		if (!sub.length) {
			if (wrap.find("table.org_table[type!=tree]").length)
				return;
			var data = OFTita.searchDataRankByPidRank(nid, 1, false);
			if (!data) {
				return
			}
			COBS.BaseObject.createByRank(data);
			sub = $("#org_td_" + nid).find("table.org_table:first");
			sub.hide()
		}
		sub.fadeIn(500, function() {
			item.find("a.unfold_nci").hide();
			item.find("a.fold_nci").show();
			if (!item.hasClass("org_line_bm")) {
				item.addClass("org_line_bm")
			}
		});
		if (!OFTita.isModifyCurrentNodePosition)
			return;
		var orgTable = wrap.find("table.org_table:first");
		var ml = parseFloat(orgTable.css("margin-left"));
		orgTable.css("margin-left", (isNaN(ml) ? 0 : ml) - ($("#org_td_" + nid).width() - $("#org_node_c_" + nid).outerWidth()) / 2)
	},
	deleteNode : function(nid) {
		var wrap = COBS.conf.wrap;
		var orgTable = wrap.find("table.org_table:first");
		var ml = parseFloat(orgTable.css("margin-left"));
		var n = $("#org_td_" + nid).parent().children("td.org_td").length;
		var fixMl = $("#org_node_c_" + nid).outerWidth() / 2;
		var pid = $("#org_td_" + nid).closest(".org_tr").closest(".org_td").attr("nid");
		var name = $("#org_node_c_" + nid).find(".name_department a").html();
		$.ajax({
			type : "post",
			url : window.G_Info.DeleteDepartment + "?v=" + (new Date).getTime(),
			dataType : "json",
			data : {
				id : nid
			},
			success : function(res) {
				if (res.Result == 1) {
					window.DialogT.show($("#org_node_c_" + nid), {
						sureHide : false,
						cancelHide : false,
						verifyClass : "yes_verify",
						autoHide : true,
						delayTime : 2e3,
						text : "移除 " + name + " 成功",
						wrap : OFTita.conf.wrap.parent(),
						position : function(tri, tip) {
							return OFTita.positionDialog(tri, tip)
						}
					});
					if (navigator.userAgent.indexOf("SLCC") != -1) {
						setTimeout(function() {
							COBS.NodeObject.deleteNodeWithData(nid)
						}, 1e3)
					} else {
						COBS.NodeObject.deleteNodeWithData(nid)
					}
					OFTita.validateChildren(pid);
					if (n > 1)
						orgTable.css("margin-left", (isNaN(ml) ? 0 : ml) + fixMl)
				} else {
					window.DialogT.show($("#org_node_c_" + nid), {
						sureHide : false,
						cancelHide : false,
						verifyClass : "warm_verify",
						autoHide : true,
						delayTime : 2e3,
						text : res.Msg,
						wrap : OFTita.conf.wrap.parent(),
						position : function(tri, tip) {
							return OFTita.positionDialog(tri, tip)
						}
					})
				}
			},
			error : function() {
				window.DialogT.show($("#org_node_c_" + nid), {
					sureHide : false,
					cancelHide : false,
					verifyClass : "warm_verify",
					autoHide : true,
					delayTime : 2e3,
					text : "请求数据时出错",
					wrap : OFTita.conf.wrap.parent(),
					position : function(tri, tip) {
						return OFTita.positionDialog(tri, tip)
					}
				})
			}
		})
	},
	renameNode : function(nid, newName) {
		$.ajax({
			type : "post",
			url : window.G_Info.RenameDepartmentAjax + "?v=" + (new Date).getTime(),
			dataType : "json",
			data : {
				id : nid,
				newDepartmentName : newName
			},
			success : function(res) {
				if (res.Result == 1) {
					var tip = window.DialogT.tip;
					var subtip = tip.find("span.tip_department");
					var input = tip.find(".newname_department");
					subtip.addClass("suc_tip_department").html("成功重命名为 " + newName);
					var nameWrap = $("#org_node_c_" + nid).find(".name_department a");
					nameWrap.html(newName);
					if (newName.length >= 15) {
						nameWrap.addClass("fontsize12_dp")
					} else {
						nameWrap.removeClass("fontsize12_dp")
					}
					OFTita.changeNodeData(nid, {
						name : newName
					});
					setTimeout(function() {
						subtip.html("允许1-20位中文、字母、数字、下划线、圆点、圆括号");
						subtip.removeClass("suc_tip_department");
						window.DialogT.hide()
					}, 2e3)
				} else {
					var tip = window.DialogT.tip;
					var subtip = tip.find("span.tip_department");
					subtip.addClass("error_tip_department").html(res.Msg);
					setTimeout(function() {
						subtip.removeClass("error_tip_department").html("允许1-20位中文、字母、数字、下划线、圆点、圆括号")
					}, 3e3)
				}
			},
			error : function() {
				var tip = window.DialogT.tip;
				var subtip = tip.find("span.tip_department");
				subtip.addClass("error_tip_department").html("请求数据出错");
				setTimeout(function() {
					subtip.removeClass("error_tip_department").html("允许1-20位中文、字母、数字、下划线、圆点、圆括号")
				}, 3e3)
			}
		})
	},
	addChildNode : function(nid, newName) {
		$.ajax({
			type : "post",
			url : window.G_Info.AddDepartment + "?v=" + (new Date).getTime(),
			dataType : "json",
			data : {
				pid : nid,
				departmentName : newName
			},
			success : function(res) {
				if (res.Result == 1) {
					var data = [res.Msg];
					COBS.NodeObject.addNodeWithData(data);
					var wrap = COBS.conf.wrap;
					var orgTable = wrap.find("table.org_table:first");
					var ml = parseFloat(orgTable.css("margin-left"));
					var n = $("#org_td_" + nid + " td.org_td").length;
					if (n > 1)
						orgTable.css("margin-left", (isNaN(ml) ? 0 : ml) - $("#org_node_c_" + nid).outerWidth() / 2);
					var tip = window.DialogT.tip;
					var subtip = tip.find("span.tip_department");
					var input = tip.find(".newname_department");
					subtip.addClass("suc_tip_department").html("新建子部门成功");
					setTimeout(function() {
						subtip.removeClass("suc_tip_department").html("允许1-20位中文、字母、数字、下划线、圆点、圆括号")
					}, 3e3);
					setTimeout(function() {
						subtip.removeClass("suc_tip_department");
						input.val("请输入部门名称");
						window.DialogT.hide()
					}, 2e3)
				} else {
					var tip = window.DialogT.tip;
					var subtip = tip.find("span.tip_department");
					subtip.addClass("error_tip_department").html(res.Msg);
					setTimeout(function() {
						subtip.removeClass("error_tip_department").html("允许1-20位中文、字母、数字、下划线、圆点、圆括号")
					}, 3e3)
				}
			},
			error : function() {
				var tip = window.DialogT.tip;
				var subtip = tip.find("span.tip_department");
				subtip.addClass("error_tip_department").html("请求数据出错");
				setTimeout(function() {
					subtip.removeClass("error_tip_department").html("允许1-20位中文、字母、数字、下划线、圆点、圆括号")
				}, 3e3)
			}
		})
	},
	nameDepartmentHtml : function(type, name) {
		return ['						<table class="tabel_ctdiat">', "							<tbody>", "								<tr>", '									<td class="td_content_ctdiat">', '										<div class="content_waprpper_ctdiat">', '											<div class="content_ctdiat">', '<div class="msg_department">', "	<h4>" + (type == "add" ? "新增子部门" : type == "rename" ? "重命名" : "") + "</h4>", "	<div>", '	<input class="newname_department" value="请输入部门名称" />', '	<span class="tip_department">允许1-20位中文、字母、数字、下划线、圆点、圆括号</span>', "	</div>", "</div>", "											</div>", "										</div>", "									</td>", "								</tr>", "								<tr>", '									<td class="tn_btn_ctdiat">', '										<div class="btn_ctdiat">', '											<a href="javascript:void(0);" title="确定" class="btn_sure btn_small_green"><b><i>确定</i></b></a><a href="javascript:void(0);" title="取消" class="btn_cancel btn_small_gay" onclick="window.DialogT.hide();"><b><i>取消</i></b></a>', "										</div>", "									</td>", "								</tr>", "							</tbody>", "						</table>"].join("")
	},
	inputRenameDepartment : function(nid) {
		var tip = window.DialogT.tip;
		var input = tip.find(".newname_department");
		input.val($("#org_node_c_" + nid).find(".name_department a").html());
		var conform = tip.find("a.btn_sure");
		input.unbind("focus.renameDepartment");
		input.unbind("blur.renameDepartment");
		input.unbind("keyup.renameDepartment");
		input.bind("focus.renameDepartment", function() {
			var self = $(this);
			self.addClass("focusname_department")
		}).bind("blur.renameDepartment", function() {
			var self = $(this);
			self.removeClass("focusname_department")
		}).bind("keyup.renameDepartment", function(e) {
			if (e.keyCode == 13)
				conform.trigger("click.renameDepartment")
		});
		conform.unbind("click.renameDepartment");
		conform.bind("click.renameDepartment", function() {
			var name = $.trim(input.val());
			if (!/^[\u4e00-\u9fa5a-zA-Z0-9_.()（）]{1,20}$/.test(name)) {
				var subtip = tip.find("span.tip_department");
				subtip.addClass("error_tip_department");
				setTimeout(function() {
					subtip.removeClass("error_tip_department")
				}, 3e3);
				return
			}
			OFTita.renameNode(nid, name)
		})
	},
	inputAddDepartment : function(nid) {
		var tip = window.DialogT.tip;
		var input = tip.find(".newname_department");
		var conform = tip.find("a.btn_sure");
		input.unbind("focus.addDepartment");
		input.unbind("blur.addDepartment");
		input.unbind("keyup.addDepartment");
		input.val("请输入部门名称");
		input.bind("focus.addDepartment", function() {
			var self = $(this);
			if (self.val() == "请输入部门名称") {
				self.val("")
			}
			self.addClass("focusname_department")
		}).bind("blur.addDepartment", function() {
			var self = $(this);
			if (self.val() == "") {
				self.val("请输入部门名称")
			}
			self.removeClass("focusname_department")
		}).bind("keyup.addDepartment", function(e) {
			if (e.keyCode == 13)
				conform.trigger("click.addDepartment")
		});
		conform.unbind("click.addDepartment");
		conform.bind("click.addDepartment", function() {
			var name = $.trim(input.val());
			if (name == "请输入部门名称")
				return;
			if (!/^[\u4e00-\u9fa5a-zA-Z0-9_.()（）]{1,20}$/.test(name)) {
				var subtip = tip.find("span.tip_department");
				subtip.addClass("error_tip_department");
				setTimeout(function() {
					subtip.removeClass("error_tip_department")
				}, 2e3);
				return
			}
			OFTita.addChildNode(nid, name)
		})
	},
	validateChildren : function(nid) {
		var pid = COBS.DataObject.adapter.pid;
		var nodes = $("#org_td_" + nid).find("div.org_node_c");
		var pNodeId = $("#org_td_" + nid).closest(".org_tr").closest(".org_td").attr("nid");
		if (pNodeId) {
			nodes.push($("#org_node_c_" + pNodeId))
		}
		var nodeId, node, child, data;
		nodes.each(function(i, e) {
			node = $(e);
			nodeId = parseInt(node.attr("nid"));
			var usernum = false;
			for (var i = 0, len = COBS.DataObject.source.length; i < len; i++) {
				data = COBS.DataObject.source[i];
				if (data[pid] == nodeId) {
					usernum = true;
					break
				}
			}
			if (usernum) {
				child = $("#org_td_" + nodeId).find(".org_table:first");
				if (child.length && child.css("display") != "none") {
					var type = $("#org_td_" + nid).find(".org_table:first").attr("type");
					OFTita.displayOps(nodeId, {
						fold : true
					})
				} else {
					OFTita.displayOps(nodeId, {
						unfold : true
					})
				}
			} else {
				OFTita.displayOps(nodeId, {
					unfold : false,
					fold : false
				})
			}
		})
	},
	changeNodeData : function(nid, option) {
		var data;
		if (option.name) {
			data = COBS.DataObject.searchData(nid);
			data.DepartmentName = option.name;
			var fullName = data.FullDepartmentName.split("/");
			fullName[fullName.length - 1] = option.name;
			data.FullDepartmentName = fullName.join("/")
		}
		if (option.del) {
		}
		if (option.add) {
		}
	},
	displayOps : function(nid, option) {
		var node = $("#org_node_c_" + nid);
		if (option.unfold !== false || option.fold !== false) {
			if (option.unfold) {
				node.find("a.unfold_nci").show();
				node.find("a.fold_nci").hide()
			}
			if (option.fold) {
				node.find("a.unfold_nci").hide();
				node.find("a.fold_nci").show()
			}
		} else {
			node.find("a.unfold_nci").hide();
			node.find("a.fold_nci").hide()
		}
		if (option.unfoldp !== false || option.foldp !== false) {
			if (option.unfoldp) {
				node.find("a.unfoldp_nci").css("display", "block").show();
				node.find("a.foldp_nci").hide()
			}
			if (option.foldp) {
				node.find("a.unfoldp_nci").hide();
				node.find("a.foldp_nci").css("display", "block").show()
			}
		} else {
			node.find("a.unfoldp_nci").hide();
			node.find("a.foldp_nci").hide()
		}
		if (option.single !== false || option.showall !== false) {
			if (option.single) {
				node.find("a.single_nci").show();
				node.find("a.showall_nci").hide()
			}
			if (option.showall) {
				node.find("a.single_nci").hide();
				node.find("a.showall_nci").show()
			}
		} else {
			node.find("a.single_nci").hide();
			node.find("a.showall_nci").hide()
		}
	},
	hideExperson : function(nid) {
		this.currentExperson = null;
		var experson = $("#experson_" + nid);
		if (experson.data("currentPersonCard")) {
			OFTita.hidePersonCard(experson.data("currentPersonCard"))
		}
		experson.hide();
		$("#org_node_c_" + nid).find("a.experson_nci").attr("isshow", 0)
	},
	showExperson : function(tri, nid) {
		var that = this;
		var experson = $("#experson_" + nid);
		var wrap = this.conf.wrap.parent();
		if (this.currentExperson && this.currentExperson.length && this.currentExperson.attr("nid") != nid) {
			var cNid = this.currentExperson.attr("nid");
			$("#org_node_c_" + cNid).find("a.experson_nci").trigger("click")
		}
		if (!experson.length) {
			var source = COBS.DataObject.dPerson["d_" + nid], data, tmpl;
			var html = ['<div id="experson_' + nid + '" class="department_person_ex dperson_v2" style="display:none" nid="' + nid + '">', '	<span class="tip_dpe"></span>', '	<span class="close_pcdp" onclick="OFTita.hideExperson(' + nid + ')"></span>', '	<div class="portals_dp clearfix"><div class="content_portals_dp clearfix">', "", "	</div>", '	<div class="moreperson_dp" onclick="OFTita.getMorePerson(' + nid + ')">更多</div>', "	</div>", "</div>"];
			var uids = [];
			for (var i = 0, len = source.length; i < len; i++) {
				data = source[i];
				uids.push(data["UserId"])
			}
			var experson = $(html.join(""));
			var content = experson.find("div.content_portals_dp");
			content.append('<div class="loading_dp"></div>');
			experson.fadeIn(200).appendTo(wrap);
			this.buildExperson(tri, experson, wrap);
			$.ajax({
				type : "post",
				url : window.G_Info.GetUserProfileByIds,
				dataType : "json",
				cache : false,
				data : {
					userIds : uids.join(",")
				},
				success : function(res) {
					if (res.Result == 1) {
						var tmpls = [];
						if (uids.length <= 10) {
							experson.find("div.moreperson_dp").hide()
						}
						for (var i = 0, len = source.length; i < len; i++) {
							data = source[i];
							$.extend(data, res.Msg.DataList[i], true)
						}
						experson.data("currentNum", 0);
						experson.find("div.content_portals_dp").html("");
						that.getMorePerson(nid);
						that.buildExperson(tri, experson, wrap)
					}
				},
				error : function() {
				},
				complete : function() {
					experson.css({
						"background-image" : "none"
					})
				}
			})
		} else {
			experson.data("currentNum", 0);
			experson.find("div.content_portals_dp").html("");
			this.getMorePerson(nid);
			this.buildExperson(tri, experson, wrap)
		}
	},
	currentExperson : null,
	getMorePerson : function(nid) {
		var that = this;
		var experson = $("#experson_" + nid);
		var currentNum = parseInt(experson.data("currentNum"));
		currentNum = isNaN(currentNum) ? 0 : currentNum;
		var source = COBS.DataObject.dPerson["d_" + nid];
		var totalNum = source.length;
		var content = experson.find("div.content_portals_dp");
		if (currentNum < totalNum) {
			var maxNum = Math.min(currentNum + 10, totalNum);
			content.css("height", "auto");
			var h = content.height() + Math.ceil((maxNum - currentNum) / 2) * 45;
			content.animate({
				height : +h
			}, 300, function() {
				var html = [];
				for (var i = currentNum, len = maxNum; i < len; i++) {
					html.push(that.createExperson(nid, source[i]))
				}
				content.append(html.join(""));
				experson.data("currentNum", maxNum);
				if (currentNum + 10 >= totalNum) {
					experson.find("div.moreperson_dp").hide()
				} else {
					experson.find("div.moreperson_dp").show()
				}
			})
		}
	},
	_substring : function(str, len, hasDot) {
		var newLength = 0;
		var newStr = "";
		var chineseRegex = /[^\x00-\xff]/g;
		var singleChar = "";
		var strLength = str.replace(chineseRegex, "**").length;
		for (var i = 0; i < strLength; i++) {
			singleChar = str.charAt(i).toString();
			if (singleChar.match(chineseRegex) != null) {
				newLength += 2
			} else {
				newLength++
			}
			if (newLength > len) {
				break
			}
			newStr += singleChar
		}
		if (hasDot && strLength > len) {
			newStr += "..."
		}
		return newStr
	},
	_convertImage : function(str, width) {
		if (width === 30) {
			return this._substring(str, 3, false)
		} else {
			return this._substring(str, 6, false)
		}
	},
	createExperson : function(nid, data) {
		if (data.HasAvatar === true) {
			var tmpl = ['		<div class="portal_dp {role}" userid="{userid}">', '			<a class="portalimage_dp" href="' + OFTFDomain + '/u/{userid}" target="_blank" onmouseover="OFTita.showPersonCardInter($(this), ' + nid + ', {userid})" onmouseout="OFTita.clearPersonCardInter()">', '				<img src="{avatar}" />', "			</a>", '			<div class="portalinfo_dp">', '			<span><a href="' + OFTFDomain + '/u/{userid}" title="{username}">{username}</a></span>', '			<span><a href="javascript:void(0)" title="{position}">{position}</a></span>', "			</div>", "		</div>"]
		} else {
			var name = this._convertImage(data.Name, 30);
			var tmpl = ['		<div class="portal_dp {role}" userid="{userid}">', '			<a class="portalimage_dp" href="' + OFTFDomain + '/u/{userid}" target="_blank" onmouseover="OFTita.showPersonCardInter($(this), ' + nid + ', {userid})" onmouseout="OFTita.clearPersonCardInter()">', '				<span style="background-color:' + data.Color + '; width:30px; height:30px; display:inline-block; line-height:30px; font-size:12px; color:#fff; text-align:center;">' + name + "</span>", "			</a>", '			<div class="portalinfo_dp">', '			<span><a href="' + OFTFDomain + '/u/{userid}" title="{username}">{username}</a></span>', '			<span><a href="javascript:void(0)" title="{position}">{position}</a></span>', "			</div>", "		</div>"]
		}
		if (data["Relationship"] == 1) {
			tmpl[0] = tmpl[0].replace("{role}", "leaderperson_dp")
		} else {
			tmpl[0] = tmpl[0].replace("{role}", "")
		}
		tmpl[0] = tmpl[0].replace("{userid}", data["UserId"]);
		tmpl[1] = tmpl[1].replace(/\{userid\}/g, data["UserId"]);
		tmpl[2] = tmpl[2].replace("{avatar}", data["UserAvatar"]["Small"]);
		tmpl[5] = tmpl[5].replace("{userid}", data["UserId"]).replace(/\{username\}/g, data["Name"] || "&nbsp;");
		tmpl[6] = tmpl[6].replace(/\{position\}/g, data["Position"] || "&nbsp;");
		return tmpl.join("")
	},
	buildExperson : function(tri, exPersonCard, wrap) {
		exPersonCard.fadeIn(200);
		this.currentExperson = exPersonCard;
		this.showExpersonStatus = true;
		var wrapOffset = wrap.offset();
		var cardW = exPersonCard.width();
		var triW = tri.width();
		var triH = tri.height();
		var offset = tri.offset();
		var triL = offset.left;
		var triT = offset.top;
		exPersonCard.css({
			left : triL - 24 - wrapOffset.left,
			top : triT + triH + 8 - wrapOffset.top
		})
	},
	hidePersonCard : function(nid) {
		$("#personcard_" + nid).fadeOut(200)
	},
	showPersonCardTimer : null,
	showPersonCardInter : function(tri, nid, userId) {
		var that = this;
		if (this.showPersonCardTimer)
			clearTimeout(this.showPersonCardTimer);
		this.showPersonCardTimer = setTimeout(function() {
			that.showPersonCard(tri, nid, userId)
		}, 200)
	},
	clearPersonCardInter : function() {
		if (this.showPersonCardTimer)
			clearTimeout(this.showPersonCardTimer)
	},
	showPersonCard : function(tri, nid, userId) {
		var personCard = $("#personcard_" + userId);
		var wrap = this.conf.wrap.parent();
		wrap.find("div.person_card_dp").filter(function() {
			if ($(this).attr("userid") == userId) {
				return false
			}
			return true
		}).hide();
		if (!personCard.length) {
			var source = COBS.DataObject.dPerson["d_" + nid], data, user;
			var uids = [];
			for (var i = 0, len = source.length; i < len; i++) {
				data = source[i];
				if (data["UserId"] == userId) {
					user = data;
					break
				}
			}
			var html = ['<div id="personcard_' + userId + '" class="person_card_dp" style="display:none" userid="' + userId + '">', '	<span class="close_pcdp" onclick="OFTita.hidePersonCard(' + userId + ')"></span>', '	<div class="content_pcdp clearfix">', '		<dl class="basicinfo_pcdp">', '			<dt class="avatar_pcdp">', '				<a href="' + OFTFDomain + '/u/{userid}" class="image_pcdp" target="_blank"><img src="{avatar}" /></a>', '				<a href="' + OFTFDomain + '/u/{userid}" class="name_pcdp" target="_blank" title="{username}">{username}</a>', "			</dt>", '			<dl class="otherinfo_pcdp">', '				<span class="company_pcdp">{departmentname}</span>', '				<span class="position_pcdp">{position}<label class="intern_post_pcdp"></label></span>', '				<span class="email_pcdp">{email}</span>', '				<span class="tel_pcdp">{tel}</span>', '				<span class="phone_pcdp">{mobile}</span>', "			</dl>", "		</dl>", "	</div>", '	<span class="tip_pcdp"></span>', "</div>"];
			html[5] = html[5].replace("{userid}", data["UserId"]).replace("{avatar}", data["UserAvatar"]["Medium"]);
			html[6] = html[6].replace("{userid}", data["UserId"]).replace(/\{username\}/g, data["Name"]);
			var dName = data["Name"];
			html[9] = html[9].replace("{departmentname}", data["DepartmentName"] || "未填写");
			html[10] = html[10].replace("{position}", data["Position"] || "未填写");
			html[11] = html[11].replace("{email}", data["Email"] || "未填写");
			html[12] = html[12].replace("{tel}", data["WorkPhone"] || "未填写");
			html[13] = html[13].replace("{mobile}", data["Mobile"] || "未填写");
			var card = $(html.join(""));
			var dNameE = card.find("a.name_pcdp");
			var dNameLen = dName.length;
			if (dNameLen > 5 && dNameLen <= 9) {
				dNameE.css("font-size", "16px")
			} else if (dNameLen > 9) {
				dNameE.css("font-size", "12px")
			}
			card.fadeIn(200).appendTo(wrap);
			personCard = $("#personcard_" + userId)
		}
		personCard.fadeIn(200);
		$("#experson_" + nid).data("currentPersonCard", userId);
		this.showPersonCardStatus = true;
		var wrapOffset = wrap.offset();
		var cardW = personCard.width();
		var cardH = personCard.height();
		var triW = tri.width();
		var triH = tri.height();
		var offset = tri.offset();
		var triL = offset.left;
		var triT = offset.top;
		personCard.css({
			left : triL - 8 - wrapOffset.left,
			top : triT - cardH - 40 - wrapOffset.top
		})
	},
	hidePersonShow : function() {
		if (this.showExpersonStatus) {
			var tris = this.conf.wrap.find("a.experson_nci");
			tris.each(function(i, e) {
				if ($(e).attr("isshow") == "1") {
					$(e).trigger("click");
					$(e).attr("isshow", "0")
				}
			});
			this.showExpersonStatus = false
		}
		if (this.showPersonCardStatus) {
			$("div.person_card_dp").hide();
			this.showPersonCardStatus = false
		}
		if (this.showDepartmentPersonStatus) {
			var tris = this.conf.wrap.find("a.foldp_nci");
			tris.each(function(i, e) {
				$(e).trigger("click")
			});
			this.showDepartmentPersonStatus = false
		}
	},
	packetDepartmentPerson : function() {
		if ( typeof window.G_Info.Data == "undefined")
			return;
		var source = window.G_Info.Data;
		if (!COBS.DataObject.dPerson) {
			COBS.DataObject.dPerson = {}
		}
		var dPerson = COBS.DataObject.dPerson, item;
		for (var i = 0, len = source.length; i < len; i++) {
			if (!dPerson["d_" + source[i]["DepartmentId"]]) {
				dPerson["d_" + source[i]["DepartmentId"]] = []
			}
			item = dPerson["d_" + source[i]["DepartmentId"]];
			item.push(source[i])
		}
	},
	positionDialog : function(tri, tip) {
		var off = {};
		var outer = this.conf.wrap.parent().offset();
		var offset = tri.offset();
		var triW = tri.innerWidth();
		var tipW = tip.innerWidth();
		var tipH = tip.innerHeight();
		off.left = offset.left - (tipW - triW) / 2 - outer.left;
		off.top = offset.top - tipH - 5 - outer.top;
		return off
	}
};
function OrgchartForTitaMap(wrap) {
	var html = ['<div id="orgchartForTitaMap" class="map" style="position:absolute;top:62px;right:10px;width:200px;height:60px;border:1px solid #64C0F1">', '	<div id="orgchartForTitaMapCount" style="position:relative;width:100%;height:60px;background:#DAECF8;">', '		<div id="cloneorg" style="width:100%;height:100%;z-index:-1"></div>', '			<div id="orgchartForTitaMapHandleBase"  style="position:absolute;top:0;right:0;width:100%;height:100%;-height:expression(this.parentNode.style.height);z-index:2;opacity:0.3;filter:alpha(opacity=30);">', '		<div id="orgchartForTitaMapHandle" style="position:absolute;left:0;top:0;width:50px;height:25px;border:1px dashed #000;opacity:0.3;background:#999;cursor:move;z-index:10;filter:alpha(opacity=30);"></div>', "		</div>", "	</div>", "</div>"].join("");
	$(html).appendTo(wrap.parent());
	var map = $("#orgchartForTitaMap");
	var mapcont = $("#orgchartForTitaMapCount");
	var moveNode = $("#orgchartForTitaMapHandle");
	var handleBase = $("#orgchartForTitaMapHandleBase");
	var target, cloneOrg;
	var mouseStartX, mlStartX, pointX, mx, mouseStartY, mlStartY, pointY, my, startMove;
	var tW, tH, wrapW, wrapH, hW, hH, cW, cH, trateX, trateY, centerX, centerY, tml, tmt, mcenterX, mcenterY;
	handleBase.mouseenter(function() {
		target = wrap.find("table.org_table:first");
		tW = target.width();
		tH = target.height();
		wrapW = wrap.width();
		wrapH = wrap.height();
		hW = moveNode.outerWidth();
		hH = moveNode.outerHeight();
		cW = mapcont.width();
		cH = tH / tW * cW;
		mapcont.height(cH);
		handleBase.height(cH);
		map.height(cH);
		mlStartX = parseFloat(target.css("margin-left"));
		mlStartX = isNaN(mlStartX) ? 0 : mlStartX;
		mlStartY = parseFloat(target.css("margin-top"));
		mlStartY = isNaN(mlStartY) ? 0 : mlStartY;
		mcenterX = mlStartX - wrapW / 2;
		mcenterY = mlStartY - wrapH / 2;
		trateX = cW / tW;
		trateY = cH / tH;
		centerX = trateX * mcenterX;
		centerY = trateY * mcenterY;
		tml = -centerX - hW / 2;
		tmt = -centerY - hH / 2;
		moveNode.css("left", tml);
		moveNode.css("top", tmt);
		$("#cloneorg").html(wrap.html());
		cloneOrg = $("#cloneorg").children("table.org_table");
		cloneOrg.find("div.org_node_c").replaceWith("<div style='margin:0 auto;width:4px;height:2px;background:#46B5F4;border:1px solid #fff;-font-size:0'></div>");
		cloneOrg.attr({
			width : "100%",
			height : "100%"
		}).css({
			margin : "0"
		}).removeClass();
		cloneOrg.find("table").attr("width", "100%").removeClass();
		cloneOrg.find("td, div.org_group").css({
			margin : "0"
		}).attr("id", "").removeClass();
		if (!validateElementsOverlap(map, moveNode)) {
			var fixMl = (wrap.width() - target.outerWidth()) / 2;
			target.stop().animate({
				"margin-top" : 0,
				"margin-left" : fixMl
			}, 500, function() {
				handleBase.trigger("mouseenter")
			});
			return
		}
	});
	handleBase.mousemove(function(e) {
		e.preventDefault();
		if (!startMove)
			return;
		OFTita.hidePersonShow();
		pointX = e.pageX;
		pointY = e.pageY;
		mx = pointX - mouseStartX;
		my = pointY - mouseStartY;
		moveNode.css("left", mlStartX + mx + "px");
		moveNode.css("top", mlStartY + my + "px");
		moveTarget()
	});
	moveNode.mousedown(function(e) {
		e.preventDefault();
		startMove = true;
		mouseStartX = e.pageX;
		mouseStartY = e.pageY;
		mlStartX = parseFloat(moveNode.css("left"));
		mlStartX = isNaN(mlStartX) ? 0 : mlStartX;
		mlStartY = parseFloat(moveNode.css("top"));
		mlStartY = isNaN(mlStartY) ? 0 : mlStartY
	}).mouseup(function(e) {
		startMove = false
	}).mouseout(function(e) {
		startMove = false
	});
	function moveTarget() {
		tW = target.width();
		tH = target.height();
		wrapW = wrap.width();
		wrapH = wrap.height();
		cW = mapcont.width();
		cH = mapcont.height();
		hW = moveNode.outerWidth();
		hH = moveNode.outerHeight();
		mcenterX = parseFloat(moveNode.css("left")) + hW / 2;
		mcenterY = parseFloat(moveNode.css("top")) + hH / 2;
		trateX = tW / cW;
		trateY = tH / cH;
		centerX = trateX * mcenterX;
		centerY = trateY * mcenterY;
		tml = centerX - wrapW / 2;
		tmt = centerY - wrapH / 2;
		target.css("margin-left", -tml);
		target.css("margin-top", -tmt)
	}


	map.trigger("mouseenter");
	function validateElementsOverlap(wrap1, wrap2) {
		var offset1 = wrap1.offset();
		var w1 = wrap1.width();
		var h1 = wrap1.height();
		var cLeft1 = offset1.left + w1 / 2;
		var cTop1 = offset1.top + h1 / 2;
		var offset2 = wrap2.offset();
		var w2 = wrap2.width();
		var h2 = wrap2.height();
		var cLeft2 = offset2.left + w2 / 2;
		var cTop2 = offset2.top + h2 / 2;
		var divLeft = Math.abs(cLeft1 - cLeft2);
		var divTop = Math.abs(cTop1 - cTop2);
		if (divLeft >= (w1 + w2) / 2 || divTop >= (h1 + h2) / 2) {
			return false
		}
		return true
	}

}

function OrgchartForTitaRule(aoConf) {
	this.conf = aoConf
}

OrgchartForTitaRule.prototype = {
	html : [
		'<div id="orgchartForTitaRule" class="orgchart_tita_rule" style="position:absolute;left:12px;top:62px;width:0;height:0">',
 		'	<div style="display:block;height:180px;width:13px;background:#E2F4FF">',
 		'		<div class="zoomout_otr" style="display:block;height:30px;cursor:pointer">',
 		'		   <span style="position:absolute;width:9px;height:3px;background:#92D2FF;margin-left:2px;margin-top:13px;-font-size:0"></span>',
 		'			<span style="position:absolute;width:3px;height:9px;background:#92D2FF;margin-left:5px;margin-top:10px;-font-size:0"></span>',
 		"		</div>",
 		'		<div style="position:relative;height:120px;background:#9DD8FF">',
 		'			<span class="zoomout_show_otr" style="display:block;height:100px;background:#E2F4FF;-font-size:0"></span>',
 		'			<div class="handle_base_otr" style="position:absolute;left:0;top:0;height:100%;width:50px;margin-left:-5px;-heihgt:expression(this.parentNode.style.height);">',
 		'				<span class="handle_otr" style="position:absolute;left:-3px;display:block;width:23px;height:15px;margin-left:3px;background:#C7EAFF;cursor:pointer;-font-size:0"></span>',
 		"			</div>",
 		"		</div>",
 		'		<div class="zoomint_otr" style="display:block;height:30px;cursor:pointer">',
 		'		   <span style="position:absolute;width:9px;height:3px;background:#92D2FF;margin-left:2px;margin-top:13px;-font-size:0"></span>',
 		"		</div>",
 		"	</div>",
 		"</div>"
 	].join(""),
	init : function() {
		this.orgWrap = OFTita.conf.wrap;
		this.orgTwrap = this.orgWrap.find("table.org_table:first");
		this.build();
		this.fixRule(this.conf);
		this.addEvent()
	},
	build : function() {
		$(this.html).appendTo(this.orgWrap.parent());
		this.ruleWrap = ruleWrap = $("#orgchartForTitaRule");
		this.zoomoutShow = ruleWrap.find("span.zoomout_show_otr");
		this.handle = ruleWrap.find("span.handle_otr");
		this.handleBase = ruleWrap.find("div.handle_base_otr");
		this.zoomout = ruleWrap.find("div.zoomout_otr");
		this.zoomin = ruleWrap.find("div.zoomint_otr");
		this.step = this.handleH = this.handle.height();
		this.handleBaseH = this.handleBase.height();
		this.markNum = this.handleBaseH / this.step
	},
	addEvent : function() {
		var that = this;
		var mouseStartX, mlStartX, pointX, mx, mouseStartY, mlStartY, pointY, my, handleMouseOver, baseMouseOver, startMove, timer, outerTimer, handleSTop;
		this.handleBase.mousemove(function(e) {
			e.preventDefault();
			if (!startMove)
				return;
			pointY = e.pageY;
			my = pointY - mouseStartY;
			if (mlStartY + my < 0) {
				that.handle.css("top", 0);
				return
			}
			if (mlStartY + my > that.handleBaseH - that.step) {
				that.handle.css("top", that.handleBaseH - that.step);
				return
			}
			fixAlignMouse({
				handleTop : mlStartY + my
			});
			if (!timer)
				clearTimeout(timer);
			timer = setTimeout(function() {
				fixAlignMouse({
					handleTop : mlStartY + my
				})
			}, 500)
		}).mouseup(function(e) {
			startMove = false
		}).mouseover(function() {
			baseMouseOver = true
		});
		this.handle.mousedown(function(e) {
			e.preventDefault();
			startMove = true;
			mouseStartY = e.pageY;
			mlStartY = parseFloat(that.handle.css("top"));
			mlStartY = isNaN(mlStartY) ? 0 : mlStartY;
			handleSTop = mlStartY
		}).mouseup(function(e) {
			startMove = false
		}).mouseover(function() {
			handleMouseOver = true;
			$(this).css("background", "#0080C7")
		}).mouseout(function() {
			handleMouseOver = true;
			$(this).css("background", "#8FD3FF")
		});
		this.ruleWrap.parent().mouseup(function() {
			startMove = false
		});
		$(document).mouseup(function() {
			startMove = false
		});
		var denominator = this.conf.totalScale / (this.handleBaseH - this.step);
		this.zoomout.bind("click", function() {
			var ruleTop = that.handle.position().top - that.step;
			if (ruleTop <= 0) {
				ruleTop = 0
			}
			that.fixRule({
				curScale : (1 - ruleTop / (that.handleBaseH - that.step)) * that.conf.totalScale
			});
			that.scale({
				direct : that.step * denominator
			})
		}).mouseover(function() {
			$(this).find("span").css("background", "#0080C7")
		}).mouseout(function() {
			$(this).find("span").css("background", "#8FD3FF")
		});
		this.zoomin.bind("click", function() {
			var ruleTop = that.handle.position().top + that.step;
			if (ruleTop >= that.handleBaseH - that.step) {
				ruleTop = that.handleBaseH - that.step
			}
			that.fixRule({
				curScale : (1 - ruleTop / (that.handleBaseH - that.step)) * that.conf.totalScale
			});
			that.scale({
				direct : -that.step * denominator
			})
		}).mouseover(function() {
			$(this).find("span").css("background", "#0080C7")
		}).mouseout(function() {
			$(this).find("span").css("background", "#8FD3FF")
		});
		function fixAlignMouse(option) {
			that.handle.css("top", option.handleTop + "px");
			that.zoomoutShow.height(option.handleTop + that.handleH / 2);
			var curScale = -(that.handle.position().top - handleSTop) / (that.handleBaseH - that.step) * that.conf.totalScale;
			if ($.browser.msie && parseInt($.browser.version) <= 8) {
				if (Math.abs(curScale) < 5)
					return
			}
			that.scale({
				direct : curScale
			});
			handleSTop = that.handle.position().top
		}

	},
	fixRule : function(option) {
		var handleTop = 0;
		if (option.curScale != null && this.conf.totalScale) {
			handleTop = (this.handleBaseH - this.step) * (1 - option.curScale / this.conf.totalScale)
		}
		this.handle.css("top", handleTop);
		this.zoomoutShow.height(handleTop + this.handleH / 2)
	},
	scale : function(option) {
		OFTita.hidePersonShow();
		var wrap = this.orgWrap;
		var tWrap = this.orgTwrap;
		OFTita.allScaleNode = wrap.find(OFTita.allScaleNodeSelector);
		var tiWid = tWrap.width();
		var tiHei = tWrap.height();
		var tiPos = tWrap.offset();
		var imsL = wrap.width() / 2 - tiPos.left;
		var imsT = wrap.height() / 2 - tiPos.top;
		irL = imsL / tiWid;
		irT = imsT / tiHei;
		var direct = option.direct;
		if (!wrap.data("scaleValue")) {
			wrap.data("scaleValue", 0)
		}
		wrap.data("scaleValue", wrap.data("scaleValue") + direct);
		if (!OFTita.changeNodeBySize(wrap, null, {
			imsL : imsL,
			imsT : imsT,
			irL : irL,
			irT : irT
		})) {
			return false
		}
		OFTita.allScaleNode.each(function(i, e) {
			if (e) {
				var ew = parseFloat(COBS.COE.getFinalStyle(e, "width"));
				e.style.width = ew + direct + "px";
				e.style.height = (ew + direct) * OFTita.whRateNodeC + "px"
			}
		});
		absTables = wrap.find("table.org_table_abs");
		absTables.each(function(i, e) {
			e = $(e);
			e.css("margin-left", -(e.width() - $("#org_node_c_" + e.parent().attr("nid")).outerWidth()) / 2)
		});
		OFTita.fixOrgPositionRefMouse(tWrap, imsL, imsT, irL, irT)
	}
};


function OrgchartForTitaToolbar(aoConf) {
	this.conf = aoConf
}

OrgchartForTitaToolbar.prototype = {
	html : ['<div style="overflow:hidden;padding:10px 0 25px 10px;zoom:1;">', '	<div id="showAllOrgCheckbox" style="float:left;width:120px;padding-top:4px">', '		<a style="float:left;width:14px;height:14px;cursor:pointer;border:2px solid #CECECE;font-size:0;background-position:0 -22px;background-repeat:no-repeat"></a>', '		<label style="float:left;margin-left:5px;height:18px;line-height:18px;font-size:12px;font-weight:bold;color:#666666">展开所有部门</label>', "	</div>", '	<div id="searchDepartmentOrg" class="search_department_org" style="float:left;width:400px">', '		<label style="float:left;margin-left:5px;height:26px;line-height:26px;font-size:12px;font-weight:bold;color:#666666">部门查找</label>', '		<span style="float:left;position:relative;height:22px;padding:3px 26px 0 3px;border:1px solid #D7D7D7;margin-left:8px;">', '			<input value="请输入部门关键字" style="border:0;color:#AAAAAA">', '			<a style="position:absolute;width:20px;height:20px;right:3px;top:3px;cursor:pointer;background:url(http://st-web.tita.com/titacn/tita/admin/luotro/img/sch_sprite.png) 4px 2px no-repeat;-background-image:url(http://st-web.tita.com/titacn/tita/admin/luotro/img/sch_sprite.gif)"></a>', "		</span>", '		<label class="tip_oftt" style="float:left;margin-left:10px;height:26px;line-height:26px;color:red;display:none">没有找到相关部门信息</label>', "	</div>", "</div>"].join(""),
	init : function() {
		this.build();
		this.addEvent()
	},
	build : function() {
		$(this.html).insertBefore(this.conf.orgWrap);
		this.showAllWrap = $("#showAllOrgCheckbox");
		this.showTri = this.showAllWrap.find("a");
		this.schWrap = $("#searchDepartmentOrg");
		this.schInput = this.schWrap.find("input");
		this.schBut = this.schWrap.find("a");
		this.schTip = this.schWrap.find("label.tip_oftt")
	},
	addEvent : function() {
		var that = this;
		var forbidClickInter = false;
		this.showTri.mouseover(function() {
			$(this).css({
				border : "2px solid #2DBCE8"
			});
			OFTita.isModifyCurrentNodePosition = false
		}).mouseout(function() {
			$(this).css({
				border : "2px solid #CECECE"
			});
			OFTita.isModifyCurrentNodePosition = true
		}).click(function() {
			if (forbidClickInter)
				return;
			forbidClickInter = true;
			setTimeout(function() {
				forbidClickInter = false
			}, 500);
			var self = $(this);
			var selected = self[0].getAttribute("selected");
			if (selected == 1) {
				that.foldOrg(self, selected)
			} else {
				that.triShowAllOrg(self, selected)
			}
			OFTita.hidePersonShow()
		});
		this.schInput.focus(function() {
			var self = $(this);
			self.css("color", "#333");
			if (self.val() == "请输入部门关键字") {
				self.val("")
			}
		}).blur(function() {
			var self = $(this);
			self.css("color", "#aaa");
			if (self.val() == "") {
				self.val("请输入部门关键字")
			}
		}).keyup(function(e) {
			if (e.keyCode == 13) {
				var val = $.trim(that.schInput.val());
				if (val == "请输入部门关键字" || val == "")
					return;
				that.searchNodt(val)
			}
		});
		this.schBut.click(function() {
			var val = $.trim(that.schInput.val());
			if (val == "请输入部门关键字" || val == "")
				return;
			that.searchNodt(val)
		})
	},
	triShowAllOrg : function(tri, selected) {
		var self = tri;
		if (selected && selected == 1) {
			self.css({
				"background-image" : "none"
			});
			self.attr("selected", "0")
		} else {
			if ($.browser.msie && $.browser.version == "6.0") {
				self.css({
					"background-image" : "url(http://st-web.tita.com/titacn/tita/admin/luotro/img/sch_sprite.gif)"
				})
			} else {
				self.css({
					"background-image" : "url(http://st-web.tita.com/titacn/tita/admin/luotro/img/sch_sprite.png)"
				})
			}
			self.attr("selected", "1");
			this.showAllOrg()
		}
	},
	showAllOrg : function() {
		this.conf.orgWrap.find("a.unfold_nci").trigger("click");
		this.conf.orgWrap.find("a.showall_nci").filter(function() {
			if ($(this).parents("div.org_node_c").attr("nid") == 0) {
				return false
			}
			return true
		}).trigger("click");
		COBS.NodeObject.addNodeWithData(COBS.DataObject.source)
	},
	foldOrg : function(tri, selected) {
		var self = tri;
		self.css({
			"background-image" : "none"
		});
		self.attr("selected", "0");
		var rank1s = this.conf.orgWrap.find("td.org_td[rank=1]");
		rank1s.each(function(idx) {
			$("#org_node_c_" + $(this).attr("nid")).find("a.fold_nci").trigger("click")
		})
	},
	searchNodt : function(keyword) {
		var nid, item, nids = [], tName;
		var id = COBS.DataObject.adapter.id;
		var name = COBS.DataObject.adapter.name;
		keyword = keyword.toLowerCase();
		for (var p in COBS.DataObject.source) {
			item = COBS.DataObject.source[p];
			tName = item[name].toLowerCase();
			if (tName == keyword) {
				nid = item[id];
				break
			}
			if (tName.indexOf(keyword) != -1) {
				nids.push(item[id])
			}
		}
		if (!nid) {
			if (!nids.length) {
				var that = this;
				this.schTip.show();
				setTimeout(function() {
					that.schTip.hide()
				}, 3e3);
				return
			}
			nid = nids[0]
		}
		this.triShowAllOrg(this.showTri, 0);
		var node = $("#org_node_c_" + nid);
		var wrap = this.conf.orgWrap;
		var view = wrap.find("table.org_table:first");
		var inner = node.find("div.org_node_c_inner:first");
		var wrapXY = wrap.offset();
		var wrapW = wrap.width();
		var wrapH = wrap.height();
		var nodeXY = node.offset();
		var nodeW = node.outerWidth();
		var nodeH = node.outerHeight();
		var mlX = parseFloat(view.css("margin-left"));
		var mlX = isNaN(mlX) ? 0 : mlX;
		var mlY = parseFloat(view.css("margin-top"));
		var mlY = isNaN(mlY) ? 0 : mlY;
		var tml = mlX - (nodeXY.left - wrapXY.left - wrapW / 2) - nodeW / 2;
		var tmt = mlY - (nodeXY.top - wrapXY.top - wrapH / 2) - nodeH / 2;
		view.stop().animate({
			"margin-left" : tml,
			"margin-top" : tmt - (wrapH / 2 - nodeH)
		}, 500, function() {
			inner.addClass("org_flashborder");
			setTimeout(function() {
				inner.removeClass("org_flashborder")
			}, 2e3)
		})
	}
};
(function() {
	var FullScreenApi = {
		supportsFullScreen : false,
		isFullScreen : function() {
			return false
		},
		requestFullScreen : function() {
		},
		cancelFullScreen : function() {
		},
		fullScreenEventName : "",
		prefix : ""
	}, browserPrefixes = "webkit moz o ms khtml".split(" ");
	if ( typeof document.cancelFullScreen != "undefined") {
		FullScreenApi.supportsFullScreen = true
	} else {
		for (var i = 0, il = browserPrefixes.length; i < il; i++) {
			FullScreenApi.prefix = browserPrefixes[i];
			if ( typeof document[FullScreenApi.prefix + "CancelFullScreen"] != "undefined") {
				FullScreenApi.supportsFullScreen = true;
				break
			}
		}
	}
	if (FullScreenApi.supportsFullScreen) {
		FullScreenApi.fullScreenEventName = FullScreenApi.prefix + "fullscreenchange";
		FullScreenApi.isFullScreen = function() {
			switch(this.prefix) {
				case"":
					return document.fullScreen;
				case"webkit":
					return document.webkitIsFullScreen;
				default:
					return document[this.prefix + "FullScreen"]
			}
		};
		FullScreenApi.requestFullScreen = function(el) {
			return this.prefix === "" ? el.requestFullScreen() : el[this.prefix+"RequestFullScreen"]()
		};
		FullScreenApi.cancelFullScreen = function(el) {
			return this.prefix === "" ? document.cancelFullScreen() : document[this.prefix+"CancelFullScreen"]()
		}
	}
	if ( typeof jQuery != "undefined") {
		jQuery.fn.requestFullScreen = function() {
			return this.each(function() {
				var el = jQuery(this);
				if (FullScreenApi.supportsFullScreen) {
					FullScreenApi.requestFullScreen(el)
				}
			})
		}
	}
	window.FullScreenApi = FullScreenApi
})();
function OrgchartForTitaFullScreen(aoConf) {
	this.conf = aoConf
}

OrgchartForTitaFullScreen.prototype = {
	html : ['<div id="orgchartForTitaFullScreen" style="float:right;margin-right:10px;display:inline">', '	<a class="fullscreen_oftf" style="display:block;width:77px;height:30px;line-height:30px;margin-top:8px;padding-left:40px;font-size:16px;color:#fff;font-family:\'微软雅黑\';cursor:pointer;background:#87DDEE url(http://st-web.tita.com/titacn/tita/admin/luotro/img/fsout.png) 15px 8px no-repeat">全屏模式</a>', "</div>"].join(""),
	init : function() {
		this.build();
		this.addEvent()
	},
	build : function() {
		$(this.html).insertBefore(this.conf.orgWrap);
		this.fullScreenElement = this.conf.orgWrap.parent();
		this.triWrap = $("#orgchartForTitaFullScreen");
		this.tri = this.triWrap.find(".fullscreen_oftf")
	},
	addEvent : function() {
		var that = this;
		var fsButton = this.tri[0];
		var fsElement = this.fullScreenElement[0];
		var fsElementWidth = fsElement.style.width;
		var fsElementHeight = fsElement.style.height;
		var fsElementBg = fsElement.style.background;
		var fsElementWidth = fsElement.parentNode.style.width;
		var fsElementHeight = fsElement.parentNode.style.height;
		$(fsButton).bind("click", function() {
			var self = $(this);
			var isFullScreen = self.attr("isfullscreen");
			if (isFullScreen && isFullScreen == "1") {
				if (window.FullScreenApi.supportsFullScreen)
					window.FullScreenApi.cancelFullScreen(fsElement);
				if (!window.FullScreenApi.supportsFullScreen) {
					$(fsElement).addClass("org_fullscreen");
					$("div.headerwrap:first, div.backmanagetitle:first, div.navigationlist:first, div.footer").slideDown("fast");
					fsElement.parentNode.style.width = fsElementWidth;
					fsElement.parentNode.style.height = fsElementHeight;
					onCancelFullscreen()
				}
			} else {
				if (window.FullScreenApi.supportsFullScreen)
					window.FullScreenApi.requestFullScreen(fsElement);
				if (!window.FullScreenApi.supportsFullScreen) {
					$(fsElement).removeClass("org_fullscreen");
					$("div.headerwrap:first, div.backmanagetitle:first, div.navigationlist:first, div.footer").slideUp("fast");
					fsElement.parentNode.style.width = "100%";
					fsElement.parentNode.style.height = "100%";
					onStartFullscreen()
				}
			}
		}).mouseover(function() {
			var self = $(this);
			var isFullScreen = self.attr("isfullscreen");
			self.css("background-color", "#2CB7CC")
		}).mouseout(function() {
			var self = $(this);
			var isFullScreen = self.attr("isfullscreen");
			self.css("background-color", "#87DDEE")
		});
		if (window.FullScreenApi.supportsFullScreen)
			document.addEventListener(FullScreenApi.fullScreenEventName, function() {
				if (FullScreenApi.isFullScreen()) {
					onStartFullscreen()
				} else {
					onCancelFullscreen()
				}
			}, true);
		if (window.FullScreenApi.supportsFullScreen)
			document.addEventListener("keydown", function(e) {
				if ((e.shiftKey || e.keyCode == 16) && e.keyCode == 86) {
					$(fsButton).trigger("click")
				}
			}, false);
		function onStartFullscreen() {
			$(fsElement).addClass("org_fullscreen org_fullscreen_support");
			fsElement.style.width = "100%";
			fsElement.style.height = "100%";
			fsElement.style.background = "#fff";
			$(fsButton).html("退出全屏").css({
				"background-color" : "#87DDEE",
				"background-image" : "url(http://st-web.tita.com/titacn/tita/admin/luotro/img/fsin.png)"
			}).attr("isfullscreen", "1");
			OFTita.hidePersonShow()
		}

		function onCancelFullscreen() {
			$(fsElement).removeClass("org_fullscreen org_fullscreen_support");
			fsElement.style.width = fsElementWidth;
			fsElement.style.height = fsElementHeight;
			fsElement.style.background = fsElementBg;
			$(fsButton).html("全屏模式").css({
				"background-color" : "#87DDEE",
				"background-image" : "url(http://st-web.tita.com/titacn/tita/admin/luotro/img/fsout.png)"
			}).attr("isfullscreen", "0")
		}

	}
};
function FixElememtPositionIndicator(aoConf, context) {
	this.conf = aoConf || {};
	this.context = context;
	this.init()
}

FixElememtPositionIndicator.prototype = {
	define : function() {
		this.ele = null;
		this.eleS = null;
		this.isIE6 = false;
		this.hasInit = false;
		this.context = this.conf.context || "html";
		this.isWin = typeof this.context !== "string" ? false : true;
		this.coordinate = "rb";
		this.offsetX = 0;
		this.offsetY = 0;
		this.curCss = "";
		this.defCss = "";
		this.activeExtra = this.conf.activeExtra || null
	},
	init : function() {
		this.define();
		this.isIE6 = $.browser.msie && $.browser.version == 6;
		var ele = this.conf.ele;
		if (ele.jquery) {
			this.eleS = ele.get(0)
		} else {
			this.eleS = ele
		}
		$(this.conf.relativeWrap)[0].appendChild(this.eleS);
		this.curCss = this.eleS.style.cssText;
		if (!this.conf.relative)
			this.initCss(this.eleS);
		this.active();
		this.addEvent()
	},
	addEvent : function() {
		var that = this;
		if (this.conf.relative)
			return;
		if (!this.isWin) {
			$(window).bind("resize scroll", function() {
				if (that.activeExtra) {
					that.activeExtra()
				}
				that.active()
			})
		}
	},
	active : function() {
		if (this.conf.relative) {
			this.activeRelative(this.eleS);
			return
		}
		var calOffset = this.conf.calOffset && this.conf.calOffset();
		if (calOffset) {
			this.conf.offsetX = calOffset.offsetX || this.conf.offsetX || 0;
			this.conf.offsetY = calOffset.offsetY || this.conf.offsetY || 0
		} else {
			this.conf.offsetX = this.conf.offsetX || 0;
			this.conf.offsetY = this.conf.offsetY || 0
		}
		var cssText = this.makeCss();
		this.fix(this.eleS, cssText)
	},
	activeRelative : function(ele) {
		ele.style.cssText = this.curCss + ";position:position;zoom:1;z-index:1009;left:" + this.conf.offsetX + "px;top:" + this.conf.offsetY + "px";
		this.curCss = ele.style.cssText
	},
	initCss : function(ele) {
		ele.style.cssText = this.curCss + ";position:fixed;-position:absolute;zoom:1;z-index:1009";
		this.curCss = ele.style.cssText
	},
	fix : function(ele, cssText) {
		if (!this.hasInit) {
			this.hasInit = true
		}
		this.curCss = ele.style.cssText;
		ele.style.cssText = this.curCss + (cssText || "")
	},
	makeCss : function() {
		var cd = this.conf.coordinate || this.coordinate;
		var offsetX = this.conf.offsetX || this.offsetX;
		var offsetY = this.conf.offsetY || this.offsetY;
		var top = "", bottom = "", left = "", right = "";
		var ret = "";
		var offs, cw, set = "left";
		if (this.isWin) {
			offs = {
				left : 0,
				top : 0
			};
			cw = 0
		} else {
			offs = this.context.offset();
			cw = this.context.outerWidth()
		}
		switch(cd) {
			case"lt":
				{
					if (this.isIE6) {
						this.eleS.style.left = offs.left + offsetX + "px";
						if (!this.hasInit) {
							top = "expression(eval(document.documentElement.scrollTop+(" + offsetY + ")))";
							ret = [";top:", top].join("")
						}
					} else {
						this.eleS.style.left = offs.left + offsetX + "px";
						this.eleS.style.top = 0 + offsetY + "px"
					}
				}
				break;
			case"lb":
				{
					if (this.isIE6) {
						this.eleS.style.left = offs.left + offsetX + "px";
						if (!this.hasInit) {
							top = "expression(eval(document.documentElement.scrollTop+document.documentElement.clientHeight-this.offsetHeight+(" + -offsetY + ")))";
							ret = [";top:", top].join("")
						}
					} else {
						this.eleS.style.left = offs.left + offsetX + "px";
						this.eleS.style.bottom = 0 + offsetY + "px"
					}
				}
				break;
			case"rt":
				{
					if (this.isIE6) {
						this.eleS.style[set] = offs.left + cw + offsetX + "px";
						if (!this.hasInit) {
							top = "expression(eval(document.documentElement.scrollTop+(" + offsetY + ")))";
							ret = [";top:", top].join("")
						}
					} else {
						this.eleS.style[set] = offs.left + cw + offsetX + "px";
						this.eleS.style.top = 0 + offsetY + "px"
					}
				}
				break;
			case"rb":
				{
					if (this.isIE6) {
						this.eleS.style[set] = offs.left + cw + offsetX + "px";
						if (!this.hasInit) {
							top = "expression(eval(document.documentElement.scrollTop+document.documentElement.clientHeight-this.offsetHeight+(" + -offsetY + ")))";
							ret = [";top:", top].join("")
						}
					} else {
						this.eleS.style[set] = offs.left + cw + offsetX + "px";
						this.eleS.style.bottom = 0 + offsetY + "px"
					}
				}
				break
		}
		return ret
	}
};
function PositionIndicatorElement(aoConf, context) {
	this.conf = aoConf || {};
	this.context = context;
	this.init()
}

PositionIndicatorElement.prototype = {
	define : function() {
		this.ele = null;
		this.tri = null;
		this.dialogW = 0;
		this.isIE6 = $.browser.msie && $.browser.version == 6;
		this.ml = this.w = this.h = 0;
		this.initcialized = false;
		this.Timer = null;
		this.TimerCloser = null;
		this.Blink = new BlinkTitleTita;
		this.Notification = new NotificationIndicatorTita;
		this.hasReqNotification = false
	},
	init : function() {
		var that = this;
		this.define();
		var calOffset = this.conf.calOffset && this.conf.calOffset();
		if (calOffset) {
			this.conf.offsetX = calOffset.offsetX || this.conf.offsetX || 0;
			this.conf.offsetY = calOffset.offsetY || this.conf.offsetY || 0
		} else {
			this.conf.offsetX = this.conf.offsetX || 0;
			this.conf.offsetY = this.conf.offsetY || 0
		}
		var relativeWrap = this.conf.relativeWrap || document.body;
		var html = indicatorHtml();
		$(html).appendTo(relativeWrap);
		this.ele = $("#indicater_tri").hide().css({
			position : "absolute"
		});
		if (this.isIE6) {
			this.ele.css({
				"float" : "left",
				overflow : "hidden",
				position : "relative"
			})
		}
		this.dialogW = this.ele.outerWidth();
		var offsetX = -this.dialogW;
		var de = document.documentElement || document.body;
		var confFEP = {
			context : $("div.contenter:first"),
			relative : this.conf.relative,
			relativeWrap : relativeWrap,
			calOffset : this.conf.calOffset,
			ele : this.ele,
			coordinate : "rt",
			offsetX : this.conf.offsetX != null ? this.conf.offsetX : 0,
			offsetY : this.conf.offsetY != null ? this.conf.offsetY : 70,
			activeExtra : function() {
			}
		};
		if (de.clientWidth <= 1024) {
			var confFEP = {
				context : $("div.contenter:first"),
				relative : this.conf.relative,
				relativeWrap : relativeWrap,
				calOffset : this.conf.calOffset,
				ele : this.ele,
				coordinate : "rt",
				offsetX : this.conf.offsetX != null ? this.conf.offsetX : 0,
				offsetY : this.conf.offsetY != null ? this.conf.offsetY : 70,
				activeExtra : function() {
				}
			}
		}
		if (!this.FEP1) {
			this.FEP1 = new FixElememtPositionIndicator(confFEP);
			this.FEP1.activeExtra = that.activeExtra
		}
		this.ele2 = $("#indicator_v2").hide();
		if (this.isIE6) {
			this.ele2.css({
				position : "absolute"
			}).appendTo(document.body);
			var confFEP2 = {
				context : $("div.contenter:first"),
				relative : this.conf.relative,
				relativeWrap : relativeWrap,
				calOffset : this.conf.calOffset,
				ele : this.ele2,
				coordinate : "rt",
				offsetX : this.conf.offsetX != null ? this.conf.offsetX : 0,
				offsetY : this.conf.offsetY != null ? this.conf.offsetY : 70,
				activeExtra : function() {
				}
			};
			if (!this.FEP2) {
				this.FEP2 = new FixElememtPositionIndicator(confFEP2);
				this.FEP2.activeExtra = that.activeExtra
			}
		}
		this.addEvent()
	},
	activeExtra : function() {
		if (this.isIE6) {
			this.hasInit = false
		}
		if ($(window).scrollTop() > 60) {
			this.conf.offsetY = this.conf.offsetY != null ? this.conf.offsetY : 40
		} else {
			this.conf.offsetY = this.conf.offsetY != null ? this.conf.offsetY : 70
		}
	},
	addEvent : function() {
		return;
		var that = this;
		var wrap = this.ele2.find("ul");
		this.ele.bind("click", function() {
			var self = $(this);
			self.find("a.tri").blur();
			var hasData = self.attr("hasData");
			if (!hasData || hasData != 1) {
				return
			}
			var status = self.attr("isOpen");
			if (!status || status != 1) {
				that.stretchIn()
			} else {
				that.stretchOut()
			}
			if (!that.hasReqNotification) {
				var logo = "http://st-web.tita.com/titacn/tita/common/indicator/img/logo.png";
				that.Notification.requestPermission(function() {
					that.Notification.show("http://st-web.tita.com/titacn/tita/common/indicator/img/logo.png", "tita提醒", "您有新的消息！请查收。")
				});
				that.hasReqNotification = true
			}
			that.Notification.Noti && that.Notification.Noti.cancel()
		});
		this.getIndicator();
		if (this.Timer)
			clearInterval(this.Timer);
		this.Timer = setInterval(function() {
			that.getIndicator()
		}, 15e3);
		$(document).on("clear:Indicator", function(event, types) {
			var res = that.collection;
			if (res && res.length && types) {
				var types = types.split(",");
				for (var i = 0; i < res.length; i++) {
					for (var j = 0; j < types.length; j++) {
						if (res[i] && res[i]["IndicatorType"] == types[j]) {
							res.splice(i, 1);
							break
						}
					}
				}
				that._getDataAfter(res)
			}
		})
	},
	getIndicator : function() {
		var that = this;
		var userId = window.G_Info && G_Info.userId || window.G_Info && G_Info.UserId || window.G_FeedTemplInfo && G_FeedTemplInfo.userId || window.confPMC && confPMC.userId || window.HTConf && HTConf.UserId || bs_tita.loginUserInfo.Id || 0;
		if (!userId) {
			var loc = location.href;
			var mat = loc.match(/\/([\d]+)\//i);
			if (mat) {
				userId = mat[1]
			}
		}
		var webapiUrl = createWebapiUrl("Indicator/Get");
		getXSSAjax(function() {
			$.ajax({
				url : webapiUrl,
				type : "get",
				dataType : "json",
				cache : false,
				data : {},
				success : function(res) {
					res = res.Data;
					if (res.length != 0) {
						that.ele.show();
						var isHasData = that.ele.attr("hasData");
						that.ele.attr("hasData", "1");
						var status = that.ele.attr("isOpen");
						if (!status || status != 1) {
							that.ele.addClass("indicater2_active")
						}
						that.build(res);
						if (isHasData != 1) {
							that.ele2.show();
							that.ele.removeClass("indicater2_active");
							that.ele.addClass("indicater2_hover");
							that.ele.attr("isOpen", "1");
							if (that.TimerCloser)
								clearTimeout(that.TimerCloser);
							that.TimerCloser = setTimeout(function() {
								that.stretchOut()
							}, 6e3);
							if (that.initcialized)
								var logo = "http://st-web.tita.com/titacn/tita/common/indicator/img/logo.png";
							that.Notification.show("http://st-web.tita.com/titacn/tita/common/indicator/img/logo.png", "tita提醒", "您有新的消息！请查收。")
						}
						that.Blink.start("新消息");

					} else {
						that.stretchOut();
						that.ele.attr("hasData", "0");
						that.ele.removeClass("indicater2_active");
						that.ele.hide();
						that.Blink.stop()
					}
					if (!that.initcialized) {
						that.initcialized = true
					}
				},
				error : function() {
					clearInterval(that.Timer)
				}
			})
		})
	},
	hideItem : function(node) {
		if (!node)
			return;
		node.parents("li").remove();
		var li = this.ele2 && this.ele2.find("li");
		if (!li || !li.length) {
			this.stretchOut();
			this.ele.attr("hasData", "0");
			this.ele.removeClass("indicater2_active");
			this.ele.hide();
			this.Blink.stop();
			this.ele2 && this.ele2.find("ul").html("")
		} else {
			var len = li.length;
			switch(len) {
				case 1:
					{
						this.ml = -17;
						this.w = 57;
						this.ele2.css("width", 57);
						this.ele2.css("margin-left", -17)
					}
					break;
				case 2:
					{
						this.ml = -68;
						this.w = 108;
						this.ele2.css("width", 108);
						this.ele2.css("margin-left", -68)
					}
					break;
				default:
					{
						this.ml = -120;
						this.w = 160;
						this.ele2.css("width", 160);
						this.ele2.css("margin-left", -120)
					}
					break
			}
		}
	},
	resetOffset : function(left, top) {
		this.ele.css("left", left);
		this.ele.css("top", top)
	},
	build : function(data) {
		var html = "";
		var wrap = this.ele2.find("ul");
		var len = data.length;
		switch(len) {
			case 1:
				{
					this.ml = -17;
					this.w = 57;
					this.ele2.css("width", 57);
					this.ele2.css("margin-left", -17)
				}
				break;
			case 2:
				{
					this.ml = -68;
					this.w = 108;
					this.ele2.css("width", 108);
					this.ele2.css("margin-left", -68)
				}
				break;
			default:
				{
					this.ml = -120;
					this.w = 160;
					this.ele2.css("width", 160);
					this.ele2.css("margin-left", -120)
				}
				break
		}
		this.h = (Math.floor((len - 1) / 3) + 1) * 64 - 2;
		var mappingUrl = {
			LeaveMessage : "#more/indicatormsg?name=LeaveMessage",
			LeaveTeamIndicator : "#more/indicatormsg?name=LeaveTeamIndicator",
			LeaveWorkIndicator : "#more/indicatormsg?name=LeaveWorkIndicator",
			LeaveAll : "/#more/indicatormsg?name=LeaveAll",
			CreateComment : "#more/indicatormsg?name=CreateComment",
			LeaveDepartMent : "#more/indicatormsg?name=LeaveDepartMent",
			FollowActivityType : "#staff?name=fans&"
		};
		var href = "/u/" + bs_tita.loginUserInfo["Id"] + "/Home";
		for (var i = 0; i < len; i++) {
			var _item = data[i];
			var desc = _item.Contents;
			var type = _item["IndicatorType"];
			var url = "#more/messages?isRead=1&delindicator=" + type;
			if (mappingUrl[type]) {
				url = mappingUrl[type]
			}
			url = href + url + "&appid=1&apptype=1";
			html += ['<li><span class="inner_indi"><a href="', url, '" target="_blank"><span class="num_inii">', _item.IndicatorValue, "</span><span>", desc.replace("通知", ""), "</span></a></span></li>"].join("")
		}
		wrap.html(html)
	},
	stretchIn : function() {
		this.ele.attr("isOpen", 1);
		this.ele.removeClass("indicater2_active");
		this.ele.addClass("indicater2_hover");
		this.ele2.show()
	},
	stretchOut : function() {
		this.ele.attr("isOpen", 0);
		this.ele.removeClass("indicater2_hover");
		this.ele.addClass("indicater2_active");
		this.ele2.hide()
	}
};
function BlinkTitleTita(title, timeout) {
	var self = this;
	var timer = null;
	var backup = document.title;
	self.start = function(title, timeout) {
		self.stop();
		document.title = "";
		if (title != undefined) {
			self.title = title
		}
		self.timeout = timeout == undefined ? 800 : timeout;
		function blink() {
			document.title = "【" + self.title + "】－tita"
		}

		blink()
	};
	self.stop = function() {
		if (timer != null) {
			document.title = backup;
			clearInterval(timer);
			timer = null
		}
	}
}

function NotificationIndicatorTita() {
}

NotificationIndicatorTita.prototype = {
	Timer : null,
	Noti : null,
	show : function(image, title, content) {
		if (!this.isSupport())
			return;
		if (window.webkitNotifications.checkPermission() == 0) {
			this.Noti = window.webkitNotifications.createNotification(image, title, content);
			this.Noti.show();
			var that = this;
			this.Timer = setTimeout(function() {
				that.Noti.cancel()
			}, 6e3);
			that.Noti.onclick = function() {
				window.focus();
				setTimeout(function() {
					if (that.Timer)
						clearTimeout(that.Timer);
					that.Noti.cancel()
				}, 1e3)
			}
		} else {
			var that = this;
			this.requestPermission(function() {
				that.permissionCallback(image, title, content)
			})
		}
	},
	isSupport : function() {
		if (window.webkitNotifications) {
			return true
		} else {
			return false
		}
	},
	requestPermission : function(callback) {
		if (!this.isSupport())
			return;
		if (window.webkitNotifications.checkPermission() != 0) {
			window.webkitNotifications.requestPermission(callback)
		}
	},
	permissionCallback : function(image, title, content) {
		switch(window.webkitNotifications.checkPermission()) {
			case 0:
				{
					this.show(image, title, content);
					return true
				}
				break;
			case 2:
				{
				}
				break;
			default:
				{
					return false
				}
				break
		}
	}
};
function indicatorHtml() {
	return ['<div id="indicater_tri" class="indicater_tri indicater2_tri">', '	<a href="javascript:void(0)" class="tri"></a>', '	<div id="indicator_v2" class="indicater indicater2">', '   <ul class="list_indi">', "   </ul>", "	</div>", "</div>"].join("")
}(function($) {
	$.scrolltotop = function(options) {
		options = jQuery.extend({
			startline : 200,
			scrollto : 0,
			scrollduration : 500,
			fadeduration : [500, 100],
			controlHTML : '<a href="javascript:;"><b>回到顶部</b></a>',
			className : "",
			titleName : "回到顶部",
			offsetx : 5,
			offsety : 5,
			anchorkeyword : "#top"
		}, options);
		var state = {
			isvisible : false,
			shouldvisible : false
		};
		var current = this;
		var $body, $control, $cssfixedsupport;
		var init = function() {
			var iebrws = document.all;
			$cssfixedsupport = !iebrws || iebrws && document.compatMode == "CSS1Compat" && window.XMLHttpRequest;
			$body = window.opera ? document.compatMode == "CSS1Compat" ? $("html") : $("body") : $("html,body");
			var de = document.documentElement, db = document.body;
			var viewW = de.clientWidth == 0 ? db.clientWidth : de.clientWidth, viewH = de.clientHeight == 0 ? db.clientHeight : de.clientHeight;
			if (viewW <= 1024) {
				$control = $('<div class="' + options.className + '" id="topcontrol">' + options.controlHTML + "</div>").css({
					position : $cssfixedsupport ? "fixed" : "absolute",
					bottom : options.offsety,
					right : 0,
					opacity : 0,
					cursor : "pointer"
				}).attr({
					title : options.titleName
				}).click(function() {
					scrollup();
					return false
				}).appendTo("body")
			} else {
				$control = $('<div class="' + options.className + '" id="topcontrol">' + options.controlHTML + "</div>").css({
					position : $cssfixedsupport ? "fixed" : "absolute",
					bottom : options.offsety,
					left : "50%",
					"margin-left" : options.offsetx,
					opacity : 0,
					cursor : "pointer"
				}).attr({
					title : options.titleName
				}).click(function() {
					scrollup();
					return false
				}).appendTo("body")
			}
			if (document.all && !window.XMLHttpRequest && $control.text() != "") {
				$control.css({
					width : $control.width()
				})
			}
			togglecontrol();
			$('a[href="' + options.anchorkeyword + '"]').click(function() {
				scrollup();
				return false
			});
			$(window).bind("scroll resize", function(e) {
				togglecontrol()
			});
			return current
		};
		var scrollup = function() {
			if (!$cssfixedsupport) {
				$control.css({
					opacity : 0
				})
			}
			var dest = isNaN(options.scrollto) ? parseInt(options.scrollto) : options.scrollto;
			if ( typeof dest == "string") {
				dest = jQuery("#" + dest).length >= 1 ? jQuery("#" + dest).offset().top : 0
			}
			$body.animate({
				scrollTop : dest
			}, options.scrollduration)
		};
		var keepfixed = function() {
			var $window = jQuery(window);
			var controlx = $window.scrollLeft() + $window.width() - $control.width() - options.offsetx;
			var controly = $window.scrollTop() + $window.height() - $control.height() - options.offsety;
			$control.css({
				left : controlx + "px",
				top : controly + "px"
			})
		};
		var togglecontrol = function() {
			var scrolltop = jQuery(window).scrollTop();
			if (!$cssfixedsupport) {
				keepfixed()
			}
			state.shouldvisible = scrolltop >= options.startline ? true : false;
			if (state.shouldvisible && !state.isvisible) {
				$control.css({
					display : "block",
					opacity : 0
				});
				$control.stop().animate({
					opacity : 1
				}, options.fadeduration[0]);
				state.isvisible = true
			} else if (state.shouldvisible == false && state.isvisible) {
				$control.css({
					display : "none",
					opacity : 1
				});
				$control.stop().animate({
					opacity : 0
				}, options.fadeduration[1]);
				state.isvisible = false
			}
			var de = document.documentElement, db = document.body;
			var viewW = de.clientWidth == 0 ? db.clientWidth : de.clientWidth;
			if (viewW > 1024) {
				$control.css({
					left : "50%",
					"margin-left" : options.offsetx
				})
			}
		};
		return init()
	}
})(jQuery);
function FixElememtPosition(aoConf) {
	this.conf = aoConf || {};
	this.init()
}

FixElememtPosition.prototype = {
	define : function() {
		this.ele = null;
		this.eleS = null;
		this.isIE6 = false;
		this.hasInit = false;
		this.context = this.conf.context || "html";
		this.isWin = typeof this.context !== "string" ? false : true;
		this.coordinate = "rb";
		this.offsetX = 0;
		this.offsetY = 0;
		this.curCss = "";
		this.defCss = "";
		this.activeExtra = this.conf.activeExtra || null
	},
	init : function() {
		this.define();
		this.isIE6 = $.browser.msie && $.browser.version == 6;
		var ele = this.conf.ele;
		if (ele.jquery) {
			this.eleS = ele.get(0)
		} else {
			this.eleS = ele
		}
		document.body.appendChild(this.eleS);
		this.curCss = this.eleS.style.cssText;
		this.initCss(this.eleS);
		this.active();
		this.addEvent()
	},
	addEvent : function() {
		var that = this;
		if (!this.isWin) {
			$(window).bind("resize scroll", function() {
				if (that.activeExtra) {
					that.activeExtra()
				}
				that.active()
			})
		}
	},
	active : function() {
		var cssText = this.makeCss();
		this.fix(this.eleS, cssText)
	},
	initCss : function(ele) {
		ele.style.cssText = this.curCss + ";position:fixed;-position:absolute;zoom:1;z-index:9999";
		this.curCss = ele.style.cssText
	},
	fix : function(ele, cssText) {
		if (!this.hasInit) {
			this.hasInit = true
		}
		this.curCss = ele.style.cssText;
		ele.style.cssText = this.curCss + (cssText || "")
	},
	makeCss : function() {
		var cd = this.conf.coordinate || this.coordinate;
		var offsetX = this.conf.offsetX || this.offsetX;
		var offsetY = this.conf.offsetY || this.offsetY;
		var top = "", bottom = "", left = "", right = "";
		var ret = "";
		var offs, cw, set = "left";
		if (this.isWin) {
			set = "right";
			offs = {
				left : 0,
				top : 0
			};
			cw = 0
		} else {
			offs = this.context.offset();
			cw = this.context.outerWidth()
		}
		switch(cd) {
			case"lt":
				{
					if (this.isIE6) {
						this.eleS.style.left = offs.left + offsetX + "px";
						if (!this.hasInit) {
							top = "expression(eval(document.documentElement.scrollTop+(" + offsetY + ")))";
							ret = [";top:", top].join("")
						}
					} else {
						this.eleS.style.left = offs.left + offsetX + "px";
						this.eleS.style.top = 0 + offsetY + "px"
					}
				}
				break;
			case"lb":
				{
					if (this.isIE6) {
						this.eleS.style.left = offs.left + offsetX + "px";
						if (!this.hasInit) {
							top = "expression(eval(document.documentElement.scrollTop+document.documentElement.clientHeight-this.offsetHeight+(" + -offsetY + ")))";
							ret = [";top:", top].join("")
						}
					} else {
						this.eleS.style.left = offs.left + offsetX + "px";
						this.eleS.style.bottom = 0 + offsetY + "px"
					}
				}
				break;
			case"rt":
				{
					if (this.isIE6) {
						this.eleS.style[set] = offs.left + cw + offsetX + "px";
						if (!this.hasInit) {
							top = "expression(eval(document.documentElement.scrollTop+(" + offsetY + ")))";
							ret = [";top:", top].join("")
						}
					} else {
						this.eleS.style[set] = offs.left + cw + offsetX + "px";
						this.eleS.style.top = 0 + offsetY + "px"
					}
				}
				break;
			case"rb":
				{
					if (this.isIE6) {
						this.eleS.style[set] = offs.left + cw + offsetX + "px";
						if (!this.hasInit) {
							top = "expression(eval(document.documentElement.scrollTop+document.documentElement.clientHeight-this.offsetHeight+(" + -offsetY + ")))";
							ret = [";top:", top].join("")
						}
					} else {
						this.eleS.style[set] = offs.left + cw + offsetX + "px";
						this.eleS.style.bottom = 0 + offsetY + "px"
					}
				}
				break
		}
		return ret
	}
};
function PositionFeedbackElement() {
	this.init()
}

PositionFeedbackElement.prototype = {
	define : function() {
		this.ele = null;
		this.tri = null;
		this.dialogW = 0;
		this.isIE6 = $.browser.msie && $.browser.version == 6
	},
	init : function() {
		this.define();
		var html = feedbackHtml();
		$(html).appendTo(document.body);
		this.ele = $("#dialog_feedback").css({
			position : "absolute"
		});
		this.tri = this.ele.find("div.tri_feedback");
		if (this.isIE6) {
			this.ele.css({
				"float" : "left",
				overflow : "hidden",
				position : "relative"
			})
		}
		this.dialogW = this.ele.outerWidth();
		var offsetX = -this.dialogW;
		if (this.isIE6) {
			offsetX = 0;
			this.ele.css({
				width : 30
			}).addClass("dialog_feedbackie6")
		} else {
			this.tri.css("left", -30)
		}
		var confFEP = {
			ele : this.ele,
			coordinate : "rb",
			offsetX : offsetX,
			offsetY : 100
		};
		if (!this.FEP) {
			this.FEP = new FixElememtPosition(confFEP)
		}
		this.addEvent()
	},
	addEvent : function() {
		var that = this;
		this.tri.bind("click", function() {
			var self = $(this);
			var status = that.ele.attr("isOpen");
			if (status && status == 1) {
				that.slideRight()
			} else {
				that.slideLeft()
			}
		});
		this.ele.bind("click", function(event) {
			event.stopPropagation()
		});
		$(document).bind("click", function() {
			that.slideRight()
		})
	},
	slideRight : function() {
		var that = this;
		if (this.isIE6) {
			this.ele.animate({
				width : 30
			}, 300).addClass("dialog_feedbackie6")
		} else {
			this.ele.animate({
				right : -this.dialogW
			}, 300, function() {
				that.tri.css("left", -30)
			})
		}
		this.ele.attr("isOpen", "0")
	},
	slideLeft : function() {
		if (this.isIE6) {
			this.ele.animate({
				width : this.dialogW
			}, 300).removeClass("dialog_feedbackie6")
		} else {
			this.tri.css("left", 0);
			this.ele.animate({
				right : 0
			}, 300)
		}
		this.ele.attr("isOpen", "1")
	}
};
function feedbackSubmit() {
	var contWrap = $("#feedbackContent");
	var cont = contWrap.val();
	if (cont == "" || cont == contWrap.get(0).defaultValue) {
		$("#feedbackTip").html("请不要珍惜墨水留下你宝贵的意见吧").show().fadeOut(3e3);
		return
	}
	var userId = window.G_Info && G_Info.userId || window.G_Info && G_Info.UserId || window.G_FeedTemplInfo && G_FeedTemplInfo.userId || window.confPMC && confPMC.userId || window.HTConf && HTConf.UserId;
	$.ajax({
		url : window.G_Info && window.G_Info.AddFAQ || "/Help/HelpView/AddFQA",
		type : "post",
		dataType : "json",
		data : {
			feedback : cont
		},
		success : function(res) {
			if (res.Result == 1) {
				contWrap.val("");
				$("#feedbackTip").html("提交成功").show().fadeOut(3e3, function() {
					PFbE.slideRight()
				});
				contWrap.val("请输入意见反馈").removeClass("focus_textarea_ffb")
			} else {
				$("#feedbackTip").html("提交失败").show().fadeOut(3e3)
			}
		},
		error : function() {
			$("#feedbackTip").html("提交失败").show().fadeOut(3e3)
		}
	})
}

function feedbackFocus(obj) {
	var obj = $(obj);
	var val = obj.val();
	var def = obj.get(0).defaultValue;
	if (val == def) {
		obj.val("");
		obj.addClass("focus_textarea_ffb")
	}
}

function feedbackBlur(obj) {
	var obj = $(obj);
	var val = obj.val();
	var def = obj.get(0).defaultValue;
	if (val == "") {
		obj.val(def);
		obj.removeClass("focus_textarea_ffb")
	}
}

function feedbackHtml() {
	return ['<div id="dialog_feedback" class="dialog_feedback">', '<iframe frameborder="0"></iframe>', '<div class="dialog_feedback_inner">', '<table class="tabel_ctdiat">', "	<tbody>", "		<tr>", '			<td><div class="tri_feedback"><a href="###"></a></div></td>', '			<td class="td_content_ctdiat">', '				<div class="content_waprpper_ctdiat">', '					<div class="content_ctdiat">', '						<div class="formfeedback">', '							<p class="info_ffb">您好，欢迎提出宝贵建议和意见，您留下的每个字都将用来改善我们的服务。</p>', '							<textarea id="feedbackContent" onfocus="feedbackFocus(this)" onblur="feedbackBlur(this)" name="" class="textarea_ffb">请输入意见反馈</textarea>', "						</div>", "					</div>", "				</div>", "			</td>", "		</tr>", "		<tr>", '			<td class="tn_btn_ctdiat" colspan="2">', '				<div id="feedbackTip" style="color:#f00; float:left; padding:5px 0 0 37px"></div>', '				<div class="btn_waprpper_ctdiat">', '					<div class="btn_ctdiat">', '						<a class="mbtn_sgren" title="确定" href="javascript:void(0);" onclick="feedbackSubmit()"><b><i>提交</i></b></a>&nbsp;<a class="mbtn_sgay" title="取消" href="javascript:void(0);" onclick="PFbE.slideRight()"><b><i>取消</i></b></a>', "					</div>", "				</div>", "			</td>", "		</tr>", "	</tbody>", "</table>", "</div>", "</div>"].join("")
}


$(window).bind("load", function() {
});
var clicked = false;
function allowClick() {
	if (!clicked) {
		clicked = true;
		return true
	}
	return false
}

var windowNameSeq = 0;
var windows = new Array;
function windowExists(name) {
	for (var i = 0; i < windows.length; i++) {
		try {
			if (windows[i].name == name) {
				return true
			}
		} catch(exception) {
		}
	}
	return false
}

function getWindow(name) {
	for (var i = 0; i < windows.length; i++) {
		try {
			if (windows[i].name == name) {
				return windows[i]
			}
		} catch(exception) {
		}
	}
}

function removeWindow(name) {
	for (var i = 0; i < windows.length; i++) {
		try {
			if (windows[i].name == name) {
				windows.splice(i, 1);
				return
			}
		} catch(exception) {
		}
	}
}

function pushWin(name, url, width, height) {
	var defaultOptions = "location=yes,status=yes,toolbar=no,personalbar=no,menubar=no,directories=no,";
	defaultOptions += "scrollbars=yes,resizable=yes,";
	defaultOptions += "width=" + width + ",height=" + height;
	launchWinWithOptions(name, url, defaultOptions)
}

function launchWin(name, url, width, height) {
	var defaultOptions = "location=no,status=no,toolbar=no,personalbar=no,menubar=no,directories=no,";
	var winleft = (screen.width - width) / 2;
	var winUp = (screen.height - height) / 2;
	defaultOptions += "scrollbars=no,resizable=yes,top=" + winUp + ",left=" + winleft + ",";
	defaultOptions += "width=" + width + ",height=" + height;
	launchWinWithOptions(name, url, defaultOptions)
}

function launchWinWithOptions(name, url, options) {
	if (!windowExists(name)) {
		var winVar = window.open(url, name, options);
		windows[windows.length] = winVar;
		return winVar
	} else {
		var theWin = getWindow(name);
		theWin.focus()
	}
}

function getTopLevelWindow() {
	var win = window;
	if (win.parent == win) {
		return win
	}
	while (win.parent != win) {
		win = window.parent.window
	}
	return win
}

function closeWin(win) {
	win.close()
}

function handleClose(message) {
	if (confirm(message)) {
		removeWindow(getTopLevelWindow().name);
		closeWin(getTopLevelWindow());
		return true
	} else {
		return false
	}
}

function confirmCancel(message) {
	if (confirm(message)) {
		getTopLevelWindow().location.href = "userinfo.jsp";
		return true
	} else {
		return false
	}
}

function cancelQueue(workgroup, chatID) {
	getTopLevelWindow().location.href = "userinfo.jsp?workgroup=" + workgroup + "&chatID=" + chatID;
	return true
}

function confirmCancelAndClose(message) {
	if (confirm(message)) {
		getTopLevelWindow().location.href = "userinfo.jsp";
		getTopLevelWindow().close();
		return true
	} else {
		return false
	}
}

function confirmCancel(message, workgroup, chatID) {
	if (confirm(message)) {
		getTopLevelWindow().location.href = "userinfo.jsp?workgroup=" + workgroup + "&chatID=" + chatID;
		return true
	} else {
		return false
	}
}

function closeAll() {
	removeWindow(getTopLevelWindow().name);
	closeWin(getTopLevelWindow())
}

function launchHelpWin() {
	var win = launchWin("helpwin", "helpwin.jsp", 550, 350)
}

function hide(divId) {
	if (document.layers) {
		document.layers[divId].visibility = "hide"
	} else if (document.all) {
		document.all[divId].style.visibility = "hidden"
	} else if (document.getElementById) {
		document.getElementById(divId).style.visibility = "hidden"
	}
}

function show(divId) {
	if (document.layers) {
		document.layers[divId].visibility = "show"
	} else if (document.all) {
		document.all[divId].style.visibility = "visible"
	} else if (document.getElementById) {
		document.getElementById(divId).style.visibility = "visible"
	}
}

function getDiv(divID) {
	if (document.layers) {
		return document.layers[divID]
	} else if (document.all) {
		return document.all[divID]
	} else if (document.getElementById) {
		return document.getElementById(divID)
	}
}

function getDivByDoc(divID, doc) {
	if (doc.layers) {
		return doc.layers[divID]
	} else if (doc.all) {
		return doc.all[divID]
	} else if (doc.getElementById) {
		return doc.getElementById(divID)
	}
}

function showTypingIndicator(flag) {
	if (flag) {
	} else {
	}
}

function informConnectionClosed() {
	alert("Your support session has ended, you will be redirected to the transcript page.");
	parent.location.href = "transcriptmain.jsp"
}

function addChatText(yakWin, from, text) {
	var yakDiv = yakWin.document.getElementById("ytext");
	var isAnnouncement = from == "";
	var numChildren = yakDiv.childNodes.length;
	var nameSpan = document.createElement("span");
	var textSpan = document.createElement("span");
	if (isAnnouncement) {
		nameSpan.setAttribute("class", "chat-announcement");
		textSpan.setAttribute("class", "chat-announcement")
	} else {
		textSpan.setAttribute("class", "text")
	}
	var fromIsCurrentUser = false;
	if (!isAnnouncement) {
		fromIsCurrentUser = nickname == from;
		if (fromIsCurrentUser) {
			nameSpan.setAttribute("class", "client_name")
		} else {
			nameSpan.setAttribute("class", "operator-name")
		}
	}
	var chatLineDiv = document.createElement("div");
	chatLineDiv.setAttribute("class", "chat-line");
	var appendFailed = false;
	try {
		if (!isAnnouncement) {
			nameSpan.innerHTML = from + ": ";
			chatLineDiv.appendChild(nameSpan)
		}
		textSpan.innerHTML = text;
		chatLineDiv.appendChild(textSpan);
		yakDiv.appendChild(chatLineDiv)
	} catch(exception) {
		appendFailed = true
	}
	if (!appendFailed) {
		appendFailed = numChildren == yakDiv.childNodes.length
	}
	if (appendFailed) {
		var inn = yakDiv.innerHTML;
		inn += '<div class="chat-line">';
		if (!isAnnouncement) {
			inn += '<span class="';
			if (isAnnouncement) {
				inn += "chat-announcement"
			} else if (fromIsCurrentUser) {
				inn += "client_name"
			} else {
				inn += "operator-name"
			}
			inn += '">' + from + ": </span>"
		}
		inn += '<span class="';
		inn += isAnnouncement ? 'chat-announcement">' : 'chat_text">';
		inn += text + "</span></div>";
		yakDiv.innerHTML = inn
	} else {
	}
}

function scrollYakToEnd(yakWin) {
	var endDiv = yakWin.document.getElementById("enddiv");
	yakWin.scrollTo(0, endDiv.offsetTop)
}

function showChatButton(workgroup, username) {
	var d = new Date;
	var v1 = d.getSeconds() + "" + d.getDay();
	var img = "http://support.tita.com/webchat/live?action=isAvailable&workgroup=" + workgroup;
	var gotoURL = "";
	if (username)
		gotoURL = "http://support.tita.com/webchat/start.jsp?workgroup=" + workgroup + "&location=" + window.location.href + "&username=" + username;
	else
		gotoURL = "http://support.tita.com/webchat/start.jsp?workgroup=" + workgroup + "&location=" + window.location.href;
	$('<a  id="titaOnline" href="#" onclick="launchWin(\'framemain\',\'' + gotoURL + '\',500, 400);return false;"><img border="0" src="' + img + '"></a>').appendTo("body")
}

function displayWorkgroup(workgroup, online, offline) {
	var d = new Date;
	var v1 = d.getSeconds() + "" + d.getDay();
	var img = "http://support.tita.com/webchat/live?action=isAvailable&workgroup=" + workgroup + "&online=" + online + "&offline=" + offline;
	var gotoURL = "http://support.tita.com/webchat/start.jsp?workgroup=" + workgroup + "&location=" + window.location.href;
	$('<a id="titaOnline" href="#" onclick="launchWin(\'framemain\',\'' + gotoURL + '\',500, 400);return false;"><img border="0" src="' + img + '"></a>').appendTo("body")
}

function showChatButtonWithAgent(workgroup, agent) {
	var d = new Date;
	var v1 = d.getSeconds() + "" + d.getDay();
	var img = "http://support.tita.com/webchat/live?action=isAvailable&workgroup=" + workgroup;
	var gotoURL = "http://support.tita.com/webchat/start.jsp?workgroup=" + workgroup + "&agent=" + agent + "&location=" + window.location.href;
	$('<a id="titaOnline" href="#" onclick="launchWin(\'framemain\',\'' + gotoURL + '\',500, 400);return false;"><img border="0" src="' + img + '"></a>').appendTo("body")
}

function showButtonWithoutUI(workgroup, params) {
	var d = new Date;
	var v1 = d.getSeconds() + "" + d.getDay();
	var img = "http://support.tita.com/webchat/live?action=isAvailable&workgroup=" + workgroup;
	var gotoURL = "http://support.tita.com/webchat/start.jsp?workgroup=" + workgroup + "&location=" + window.location.href + "&noUI=true&" + params;
	$('<a id="titaOnline" href="#" onclick="launchWin(\'framemain\',\'' + gotoURL + '\',500, 400);return false;"><img border="0" src="' + img + '"></a>').appendTo("body")
}$(function() {
	function OnLineService() {
		if ( typeof window.bs_tita != "undefined" && !window.bs_tita.IsOpenCustomerService) {
			return
		}
		var self = this;
		$.getScript("http://wpa.b.qq.com/cgi/wpa.php", function() {
			$("body").append('<a href="javascript:void(0);" id="BizQQWAP"></a>');
			BizQQWPA.addCustom({
				aty : "0",
				a : "0",
				nameAccount : 800013946,
				selector : "BizQQWAP"
			})
		})
	}


	window.onLineService = new OnLineService
});
