
//////////////////////////////////////////////////////////////////////////////////////
///////// 工具函数
//////////////////////////////////////////////////////////////////////////////////////

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
	if(!id || !window.jQuery){
		return {};
	}
	var selector = id;
	if("string" === typeof id){
		if(!id.startsWith("#") || !id.startsWith(".")){
			selector = "#" + id;
		}	
	}
	
	return {
		w : jQuery(selector).width(),
		h : jQuery(selector).height()
	};
};

function getMax(a, b){
	if(isNaN(a) && isNaN(b)){
		return  a < b ? b : a;
	}
	if(isNaN(a)){
		return isNaN(b)? null : b;
	}
	if(isNaN(b)){
		return isNaN(a)? null : a;
	}
	//
	return Math.max(a, b);
};

function getMin(a, b){
	if(isNaN(a) && isNaN(b)){
		return  b > a ? a : b;
	}
	if(isNaN(a)){
		return isNaN(b)? null : b;
	}
	if(isNaN(b)){
		return isNaN(a)? null : a;
	}
	//
	return Math.min(a, b);
};

// 请求AJAX,工具方法; 解析的返回对象,是标准的com.sinog2c.mvc.message.JSONMessage类型
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

// 继承. 工具方法,将obj1的属性复制到obj2
function extendsProperty(obj1, obj2) {
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


