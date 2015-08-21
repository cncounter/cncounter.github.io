// 使用闭包
(function() {
	//
	$(pageInit);
	//
	var flow = null;
	// 
	var _config = {
		paper_min_width : 800,
		paper_min_height : 600,
		paper_width : 0,
		paper_height : 0,
		left_paper : 100, // 最左上角的 paper
		top_paper : 50,
		//
		width_node : 250, // 宽
		height_node : 140,
		margin_parent : 60, // 间距
		margin_partner : 20,
		color : '#38f', // 默认背景颜色
		line_color : "#3333ff", // 连线的颜色
		// 数据URL
		flow_data_url : 'api/flowdata.json'
	};
	//
	
	//
	function bindEvents() {
		//
		var $holder = $("#holder");
		//
		var $btn_fullscreen = $("#btn_fullscreen");
		//
		
		var preFullWH = null;
        $btn_fullscreen.click(function () {
            if ($.util.supportsFullScreen) {
                if ($.util.isFullScreen()) {
                    $.util.cancelFullScreen();
                    if(preFullWH){
	                	var w = preFullWH.w;
	                	var h = preFullWH.h;
	                	//
	                	$holder.width(w);
	                	$holder.height(h);
                    }
                } else {
                	//
                	var $holder = $("#holder");
                	var w_h = wh("holder");
                	
                	// 获取窗口宽高
                	var w = $(window).width();
                	var h = $(window).height();
                	//
                	w = window.screen.width;
                	h = window.screen.height;
                	//
                	$holder.width(w);
                	$holder.height(h);
                	// 暂存
                	preFullWH = w_h;
                	//
                    $.util.requestFullScreen("#holder");
                    
                    //
                    var paper = global.paper;
                    //
                    // 设置size
                    // 全屏,还需要监听全屏退出事件
                    //$("#holder").width(w).height(h);
                    //paper.setSize(w,h);
                }
            } else {
                $.easyui.messager.show("当前浏览器不支持全屏 API，请更换至最新的 Chrome/Firefox/Safari 浏览器或通过 F11 快捷键进行操作。");
            }
        });
		
		//
	    // 只监听 holder.依靠阻止事件传播
	    $holder.bind('mousewheel', mouseWheelHandler);
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
        
        
        //
    }; // end of bindEvents
	
	
	
	// 加载 Raphael
	function loadFlowDiagram(holderid) {
		//
		var holder = document.getElementById(holderid);
		//
		var param = {};// _config;
		param.holder = holder;
		// 新建一个对象
		flow = new FlowDiagram(param);
	};
	//
	
	// 初始化页面JS调用
	function pageInit() {
		var holderid = "holder";
		//
		try{
			//
			loadFlowDiagram(holderid);
			// 绑定各种自定义事件
			bindEvents();
		} catch(ex){
			debug(ex);
		}
	};
})();

