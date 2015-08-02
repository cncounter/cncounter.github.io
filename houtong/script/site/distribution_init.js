// 使用闭包
(function() {
	//
	$(pageInit);
	// 
	var __config = {
		_note_info : "默认配置信息,这堆配置信息,可以通过后台配置来覆盖",
		dist_height : 300, // 正态分布图的高度
		dist_width : 540,
		//showDistributionImage : showDistributionImage,
		//
		min_paper_width : 800,
		min_paper_height : 600,
		left_paper : 200, // 最左上角的 paper
		top_paper : 80,
		beforechange : function(tdata){
			debug("beforechange:", tdata);
			// 返回 true 则允许改变
			return true;
		}, 
		onchange : function(ndata){
    		// 回调函数
    		if(!ndata){ return; }
    		global.config.data = ndata;
    		// 处理, 刷新
			showDistributionImage();
			// 执行其他操作
			debug("onchange:", ndata);
		},
		distdata_json_url : 'api/distdata.json'
	};
	//
	var global = {
		paper : null
		, config : __config
	};
	window.global = global;

	// 显示部门信息
	function showDistributionImage(){
		//
		var paper = global.paper;
		// 清空旧有的元素
		paper.clear();
		// 绘制曲线
		paper.distributionPath(global.config);
	};
	//
	
	// 加载 Raphael
	function loadRaphael(holderid) {
		//
		var holder = document.getElementById(holderid);
		//
		getAndShowDistributionImage();
		
		//
		function getAndShowDistributionImage(){
			//
			var url = global.config.distdata_json_url;
			var data = {
				xxx : new Date().getTime()
			};
			// 获取JSON_KPI信息
			var successCallback = function(message){
				//
				global.config.data = message.data;
				//
				newPaper(holder);
				showDistributionImage();
			};
			requestAjax(url, data, successCallback);
		};
	};
	//
	function newPaper(holder){
		//
		var $holder = $(holder);
		//
		var _width = $holder.width();
		var _height = $holder.height();
		//
		if(_width > global.config.min_paper_width){
			global.config.min_paper_width = _width;
		}
		if(_height > global.config.min_paper_height){
			global.config.min_paper_height = _height;
		}
		
		var width = global.config.min_paper_width;
		var height = global.config.min_paper_height;
		// paper 画纸。
		var paper = new Raphael(holder, width, height);
		// 持有
		global.paper = paper;
	};
	
	// 初始化页面JS调用
	function pageInit() {
		try{
			var holderid = "holder";
			// 加载 Raphael
			loadRaphael(holderid);
		} catch(ex){}
	};

})();

//////////////////////////////////////////////////////////////////////////////////////
///////// 工具函数
//////////////////////////////////////////////////////////////////////////////////////
// 请求AJAX,工具方法; 解析的返回对象,是标准的JSONMessage类型
function requestAjax(url, data, successCallback, errorCallback){
	var scope = this;
	//
	var ajaxObject = {
	    url: url,
	    data: data,
        //type: "post",
        type : "get",
	    success: function (message) {
			if("object" === typeof message){}
			else if(window["JSON"]){
	    		message = JSON.parse(message);
	    	} else { // IE6, IE7
    	   		message = eval("("+ message + ")");
	    	}
	   		if(successCallback){
	    	   successCallback.call(scope, message);
	   		}
        	return false;
	    },
	    error: function (jqXHR, textStatus, errorThrown) {
	    	// 把错误吃了
	       if(errorCallback){
	    	   errorCallback.apply(scope, arguments);
	       } else {
	    	   alert("操作失败!");
	       };
	    }
	};
	// 执行AJAX请求
	try{
		$.ajax(ajaxObject);
	} catch (ex){
	    // 把错误吃了
		// 如果有错,可能是没有引入 jQuery
	}
};
// 调试
function debug(obj) {
	// 只适用于具有console的浏览器
	if(!window["console"]){  return;	}
	var params = Array.prototype.slice.call(arguments, 0);
	for(var i=0; i < params.length; i++){
		if ("object" === typeof params[i] ) {
			window["console"]["dir"](params[i]);
		} else {
			window["console"]["info"](params[i]);
		}
	}
};