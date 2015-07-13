
// 闭包,避免污染全局空间
(function(){
	// 采用包装模式, 将maxvalue等问题屏蔽在外.
	
	window.ScaleBar = ScaleBar;
	var hasInited = false;
	var _ScaleBar_Instance = null;

function ScaleBar(config) {
	// 初始默认值
	// 采用继承机制
	config = config || {};
	config = _extends(config, {});
	config = _extends(config, {
		x : 10 ,
		y : 2 ,
		value : 10,
		minvalue : 0,
		maxvalue : 20,
		initquiet : false,
		//totalvalue : 20,
		element : null, // 包装元素
		vertical : 1,// 是否垂直方向
		color : "#6fdeee",
		onchange : function(value) {}// 回调函数, 值改变时触发
	});
	// 值转换
	config.totalvalue = config.maxvalue - config.minvalue;
	config.value = config.value - config.minvalue;
	var onchange = config.onchange;
	config.onchange = function(value){
		onchange(value + config.minvalue);
	};
	//
	this.config = config;
	
	//
	if(hasInited){
		this._ScaleBar = _ScaleBar_Instance;
		this._ScaleBar.onchange = function(value){
			onchange(value + config.minvalue);
		};
		return this; 
	} else {
		//
		this._ScaleBar = new _ScaleBar(this.config);
		_ScaleBar_Instance = this._ScaleBar;
		//
		return this;
		
	}
};	

ScaleBar.prototype = {
	init : function() {
		if(hasInited){
			return;
		}
		this._ScaleBar.init();
		hasInited = true;
	},
	val : function(v, quiet){
		if(!arguments.length || (!v && 0 !== v)){
			var v = this._ScaleBar.val(v, quiet);
			return v + this.config.minvalue;
		}
		//
		v = v || 0;
		v = v - this.config.minvalue;
		//
		this._ScaleBar.val(v, quiet);
		//
		return this;
	}
};
/**
 * 拖动条,比例尺
 */ 
function _ScaleBar(config) {
	// 初始默认值
	// 采用继承机制
	config = config || {};
	config = _extends(config, {
		x : 10 ,
		y : 2 ,
		value : 10,
		totalvalue : 20,
		initquiet : false,
		//totalvalue : 20,
		element : null, // 包装元素
		vertical : 1,// 是否垂直方向
		color : "#6fdeee",
		onchange : function(value) {}// 回调函数, 值改变时触发
	});
	//
	this.config = config;
};
	
_ScaleBar.prototype = {
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
		this.element = $(this.config.element);
		if(this.element.data("hasInited")){
			return;
		}
		this.build();
		this.val(this.config.value, this.config.initquiet);
		this.addEvent();
		this.element.data("hasInited", true);
	},
	build : function() {
		$(this.html).appendTo(this.element);//.parent());
		this.ruleWrap = ruleWrap = $("#orgchartForTitaRule");
		this.zoomoutShow = ruleWrap.find("span.zoomout_show_otr");
		this.handleOtr = ruleWrap.find("span.handle_otr");
		this.handleBase = ruleWrap.find("div.handle_base_otr");
		this.zoomout = ruleWrap.find("div.zoomout_otr");
		this.zoomin = ruleWrap.find("div.zoomint_otr");
		this.step = this.handleH = this.handleOtr.height();
		this.handleBaseH = this.handleBase.height();
		this.markNum = this.handleBaseH / this.step;
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
				that.handleOtr.css("top", 0);
				return
			}
			if (mlStartY + my > that.handleBaseH - that.step) {
				that.handleOtr.css("top", that.handleBaseH - that.step);
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
		this.handleOtr.mousedown(function(e) {
			e.preventDefault();
			startMove = true;
			mouseStartY = e.pageY;
			mlStartY = parseFloat(that.handleOtr.css("top"));
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
		var denominator = this.config.totalvalue / (this.handleBaseH - this.step);
		this.zoomout.bind("click", function() {
			var ruleTop = that.handleOtr.position().top - that.step;
			if (ruleTop <= 0) {
				ruleTop = 0
			}
			that.setCursor({
				value : (1 - ruleTop / (that.handleBaseH - that.step)) * that.config.totalvalue
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
			var ruleTop = that.handleOtr.position().top + that.step;
			if (ruleTop >= that.handleBaseH - that.step) {
				ruleTop = that.handleBaseH - that.step
			}
			that.setCursor({
				value : (1 - ruleTop / (that.handleBaseH - that.step)) * that.config.totalvalue
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
			that.handleOtr.css("top", option.handleTop + "px");
			that.zoomoutShow.height(option.handleTop + that.handleH / 2);
			var value = -(that.handleOtr.position().top - handleSTop) / (that.handleBaseH - that.step) * that.config.totalvalue;
			if (browser().msie && parseInt(browser().version) <= 8) {
				if (Math.abs(value) < 5)
					return
			}
			that.scale({
				direct : value
			});
			handleSTop = that.handleOtr.position().top
		}

	},
	setCursor : function(option) {
		var value = option.value || option;
		var handleTop = 0;
		if (value != null && this.config.totalvalue) { // 计算
			handleTop = (this.handleBaseH - this.step) * (1 - value / this.config.totalvalue)
		}
		this.handleOtr.css("top", handleTop);
		this.zoomoutShow.height(handleTop + this.handleH / 2);
	},
	scale : function(option) {
		var direct = option.direct;
		this.add(direct);
	},
	add : function(v){
		var cv = this.val() || 0;
		this.val(cv + v);
	},
	val : function(v, quiet){
		// 返回当前数据
		var element = this.element;
		var value = element.data("scaleValue") || 0;
		if(!arguments.length || (!v && 0 !== v)){
			return Math.round(value);
		}
		//
		if(v > this.config.totalvalue){
			v = this.config.totalvalue;
		} else if(v < 0){
			v = 0;
		}
		v = Math.round(v);
		// 否则就是设置值.
		element.data("scaleValue", v);
		// 移动指针位置
		this.setCursor(v);
		//
		if(!quiet && value != v){
			this.config.onchange && this.config.onchange(v);
		}
		return this;
	}
};

// 辅助函数
function browser(){
	var userAgent = navigator.userAgent.toLowerCase(); 
	// Figure out what browser is being used 
	var _browser = { 
		version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1], 
		safari: /webkit/.test( userAgent ), 
		opera: /opera/.test( userAgent ), 
		msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ), 
		mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent ) 
	}; 
	return _browser;
};
// 继承. 工具方法
function _extends(obj1, obj2) {
	//
	if (!obj1) {
		return false;
	}
	obj2 = obj2 || this;
	if(obj2 === window){
		obj2 = {};
	}
	for (var name in obj1 ) {
		if(obj1.hasOwnProperty(name)){
			var v = obj1[name];
			obj2[name] = v;
		}
	}
	//
	return obj2;
};
//
})();
