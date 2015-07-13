// 使用闭包
(function() {
	//
	$(pageInit);
	//
	var global = {
		pbar : null
		, config : {
			zoom_num : 10 // 缩放倍数,小数. 数字越小则距离屏幕前的你越近,显示越大
		}
	};
	window.global = global;
	
    // 创建进度条
	function loadRaphaelProgressBar() {
		//
        var holder1 = document.getElementById("holder1");
        //
        var config = {
				value : global.config.zoom_num,
				maxvalue : 20,
				minvalue : 2,
				value : 12,
				element : $(holder1)
            	, onchange : function(value){
            		//
            		var old_value = global.config.zoom_num;
            		//
					global.config.zoom_num = value;
					//
					debug(value);
          		}
        };
        //
        
		//
		var pbar = new ScaleBar(config);
		pbar.init();
        
        //
        //var pbar = Raphael.slidebar(config);
        global.pbar = pbar;
	};
	
	
	function processZoom(zoomUp){
		//
		var zoomNum = global.config.zoom_num;
		//
		if(zoomUp){
			// 放大
			zoomNum ++; // 这是相反的
		} else {
			zoomNum --; // 这是相反的
		}
		//
		if(global.pbar && global.pbar.val){
			global.pbar.val(zoomNum);
		}
	};

	//
	function bindEvents() {
		//
		listenKeyUp();
		listenMouseWheel();
		//
		function listenKeyUp(){
			// 监听键盘按键
			$(document).keyup(function (e) {
				var WHICH_UP = 38;
				var WHICH_DOWN = 40;
				//
				var which = e.which;
				
		        /**  CTRL + ??? 的情况  */
		        if(!e.ctrlKey){
		        	return;
		        }
	        	// 监听鼠标滚轮.  CTRL + Up/Down 作为快捷键
		        if (which === WHICH_UP) {
		           // Ctrl + Up
		           processZoom(1);
		           return stopEvent(e);
		        } else if (which === WHICH_DOWN) {
		           // Ctrl + Down
		           processZoom(0);
		           return stopEvent(e);
		        }
		    });
		};
		
		function listenMouseWheel(){
			$(document).bind('mousewheel', mouseWheelHandler);
	        //
		    // 监听鼠标滚轮.  CTRL + Up/Down 作为快捷键
	        function mouseWheelHandler(event, delta, deltaX, deltaY) {
	        	// 
	        	if(event.ctrlKey){
	        		return; // Ctrl 键则取消
	        	}
	        	// 是否向上滚动
	        	var zoomUp = delta > 0 ? 1 : 0;
	        	
	        	processZoom(zoomUp);
	        	//
	            return stopEvent(event);
	        };
		};
        
	}; // end of bindEvents
	
	// 初始化页面JS调用
	function pageInit() {
		loadRaphaelProgressBar();
		// 绑定各种自定义事件
		bindEvents();
	};

})();

//////////////////////////////////////////////////////////////////////////////////////
///////// 工具函数
//////////////////////////////////////////////////////////////////////////////////////

// 调试
function debug(obj) {
	try{
		// 只适用于具有console的浏览器
		if(!window["console"] || !window["console"]["dir"] || !window["console"]["info"]){  return;	}
		var params = Array.prototype.slice.call(arguments, 0);
		for(var i=0; i < params.length; i++){
			if ("object" === typeof params[i] ) {
				window["console"]["dir"](params[i]);
			} else {
				window["console"]["info"](params[i]);
			}
		}
	} catch (ex){
		// 吃掉异常
	}
};

// 停止事件.
function stopEvent(e){
	if(!e){
		return;
	}
	if(e.stopPropagation){
		e.stopPropagation();
	}
	if(e.preventDefault){
		e.preventDefault();
	}
	//
	return false;
};

// 获取宽高
function wh(id){
	if(!id){
		return {};
	}
	return {
		w : $("#"+id).width(),
		h : $("#"+id).height()
	};
};

// 文字样式不允许选择
function unselect(element){
	if(!element || !element.node || !element.attr){return element;}
    var style = element.node.style || {};
    style.unselectable = "on";
    style.MozUserSelect =  "none";
    style.WebkitUserSelect= "none";
    //
	element.attr({
		"font-family": "microsoft yahei",
		cursor : "default"
	});
	return element;
};

function iconcursor(element){
	if(!element || !element.attr){return element;}
	element.attr(
		{
			cursor : "pointer"
			, stroke: "none"
		});
	return element;
};
