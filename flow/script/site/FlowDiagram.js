
;(function(moduleName){
	// 注册到全局空间  window
	moduleName = moduleName || FlowDiagram.name;
	window[moduleName] = FlowDiagram;
	
	// 构造函数, 流程图
	function FlowDiagram(param){
		//
		var thisProperties = {
			paper : null
			, pbar : null
			, width : 0
			, height : 0
		};
		extendsProperty(thisProperties, this);
		//
		this.param = param || {};
		//
		this.init();
		this.refresh();
	};
	
	// 初始化函数
	FlowDiagram.prototype.init = function(){
		// 
		var __config = {
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
			holder : null,
			flow_data_url : 'api/flowdata.json'
		};
		// 复制属性
		var config = extendsProperty(this.param, __config);
		this.config = config;
		//
		this.holder = config.holder; 
		this.data = config.data; 
	};
	
	// 刷新
	FlowDiagram.prototype.refresh = function (){
		this.newPaper();
		this.render();
	};
	
	
	// 创建新 Paper
	FlowDiagram.prototype.newPaper = function (holder){
		holder = holder || this.holder; // 缓存
		this.holder = holder;
		//
		this.calcWidthHeight(this.holder);
		// paper 画纸。
		var paper = new Raphael(holder, this.width, this.height);
		// 持有
		this.paper = paper;
	};
	
	// 计算宽高
	FlowDiagram.prototype.calcWidthHeight = function (holder){
		//
		var widthHeight = wh(holder);
		//
		var config = this.config;
		//
		var _width = getMax(config.paper_min_width,widthHeight.w);
		var _height = getMax(config.paper_min_height,widthHeight.h);
		//
		this.width = _width;
		this.height = _height;
	};
	
	
	// 加载数据
	FlowDiagram.prototype.loadData = function (callback){
		//
		var me = this;
		var config = this.config;
		//
		var url = config.flow_data_url;
		if(!url){
			return null;
		}
		//
		//
		var para = {
			// 参数,先不管
		};
		// 获取JSON_KPI信息
		var successCallback = function(message){
			//
			me.data = message;
			callback && callback.call(me, me.data);
		};
		requestAjax(url, para, successCallback);
		//
		return null;
	};
	
	
	// 渲染函数
	FlowDiagram.prototype.render = function(){
		//
		// 没有数据
		if(!this.data){
			return this.loadData(this.render); // 回调自身
		}
		//
		this.drawFlow(this.data);
	};
	
	// 绘制流程图
	FlowDiagram.prototype.drawFlow = function(data){
		// 
		debug("有数据了:", data);
		//
		if(!data){
			return this;
		}
		var me = this;
		var paper = this.paper;
		var config = this.config;
		//
		var meta = data.meta;
		
		var flowDefine = meta.flowDefine;
		var flowData = data.data || [];
		//
		var flowNodeArray = calcFlowSize(config, flowData);
		//
		for(var i=0; i < flowNodeArray.length; i++){
			//
			var flowNode = flowNodeArray[i];
			flowNode = _drawFlowNode(paper, config, flowDefine, flowNode);
		}
		_drawFlowDefineTitletext(me, paper, config, flowDefine);
		//
		for(var i=0; i < flowNodeArray.length -1; i++){
			//
			var flowNode = flowNodeArray[i];
			var flowNodeNext = flowNodeArray[i+1];
			//
			//
			paper.connectElement(flowNode.rect, flowNodeNext.rect, config, config.line_color);
		}
		
	};
	// 计算流程图的尺寸,坐标
	function calcFlowSize(config, flowData){
		//
		// 节点的属性模板
		var defaultNodeProperty = {
				width : config.width_node, // 宽
				height : config.height_node, //高
				expand: 0,	// 是否强制展开, 记录在tree中比较合理
				hideNodeCount : 0, // 隐藏元素数量
				spanX  : 0, // 占用宽
				spanY : 0,  // 占用高
				x : 0,
				y : 0,
				datanode : null  // 节点
		};
		//
		var marginp = config.margin_parent;
		var flowNodeArray = [];
		var dxy = { //
			x : config.left_paper || 0,
			y : config.top_paper + 200
		};
		
		for(var i=0; i < flowData.length; i++){
			//
			var flow = flowData[i];
			// 先用着
			var node = extendsProperty(defaultNodeProperty, flow);
			if(node){
				// 计算流程节点的尺寸
				calcAndSetFlowNodeSize(node, config, dxy);
				//
				dxy.x = dxy.x + node.width;
				// dxy.y = dxy.y + node.height;
				//
				dxy.x = dxy.x + marginp;
				//
				flowNodeArray.push(node);
			}
		}
		
		
		//
		return flowNodeArray;
		
	};
	
	// 计算树的大小,完全包装为新对象
	function calcAndSetFlowNodeSize(node, config, dxy){
		if(!node || !config || !dxy){
			return null;
		}
		//
		var width = node.width || config.width_node;
		var height = node.height || config.height_node;
		//
		var x = dxy.x;
		var y = dxy.y;
		//
		node.x = x;
		node.y = y;
		node.width = width;
		node.height = height;
		//
		return node;
	};
	function calcXY(node, startX, startY, expand_level){
		if(!node){
			return null;
		}
		//
		startX = startX || config.left_paper;
		startY = startY || config.top_paper;
		//
		var defw = node.width || config.width_node;
		var defh = node.height || config.height_node;
		var marginp = config.margin_parent;
		var margins = config.margin_partner;
		
		//
		var sx = startX;
		var sy = startY;
		//
		sx += defw + marginp;
		
		//
		// 设置自身的
		node.x = startX;
		node.y = startY;
		//
		var spanX = node.spanX;
		var spanY = node.spanY;
		// 根据跨度修正
		node.y += spanY/2;
		
		
		//
		return node;
	};
	
	
	// 都需要绘制节点Title
	function _drawFlowDefineTitletext(me, paper, config, flowDefine){
		// 计算title节点的x,y
		var tx = 0 + me.width/3;
		var ty = 0 + me.height/4;
		
		var text = flowDefine.flowDefineName || "";

		// 2. 绘制title信息
		//
		var fontSize = 36;
		var textAnchor = "start";
		
		
		var nameText = paper.text(tx, ty, text);
		// 设置字体
		nameText.datanode = flowDefine;
		nameText.attr({
			"font-family": "microsoft yahei",
			"font-weight": "bold",
			"text-anchor": textAnchor,
			"font-size" : fontSize,
			cursor : "default"
		});
		unselect(nameText);
		me.nameText = nameText;
		// 
	};
	
	function _drawFlowNode(paper, config, flowDefine, flowNode){
		
		//
		flowNode = _drawNode_Basic(paper, config, flowDefine, flowNode);
		//
		return flowNode;
	}
	function _drawNode_Basic(paper, config, flowDefine, node){
		// 计算基础数据
		
		// 
		var w = node.width || config.width_node;
		var h = node.height || config.height_node;
		var r = 10;
		var pad = config.padding_dept;
		var pad_top = config.padding_dept_top;
		var pad_line = config.pad_line;
		//
		var color = Raphael.color(config.color);
		
		//
		var x_s = node.x || config.left_paper;
		var y_s = node.y || config.top_paper;
		var x_e = x_s + w;
		var y_e = y_s + h;
		
		var type = node.nodeType;
		// type=1,2,3,4;起点，节点,终点
		var type_Start = 1;
		var type_NormalNode = 2;
		var type_End = 3;
		
		// 绘制矩形框
		_drawRect();
		// 绘制查看按钮
		if(type_Start != type){
			_drawLookInfo();
		}
		// 都需要绘制节点Title
		_drawTitletext();
		// 绘制分隔线
		if(type_Start != type){
				_drawSepLine();
		}
		// 绘制状态图标
		_drawStatusIcon();
		// 绘制更新时间
		_drawUpdateTime();
		// 绘制部门name_或用户姓名
		_drawDeptUserNameText();
		
		// 绘制逻辑执行完成
		return node;
		
		// 下面是闭包函数,通过上方的代码调用执行.
		
		
		// 绘制矩形框
		function _drawRect(){
			// 1. 绘制矩形框
			var rect = paper.rect(x_s, y_s, w, h, r);
			rect.datanode = node;
			rect.attr({
				fill : '#38f',//"#72d3da",
				stroke : color,
				"fill-opacity" : 0.2,
				"stroke-opacity" : 0.5,
				"stroke-width" : 0
			});
			node.rect = rect;
		};
		
		// 绘制查看按钮
		function _drawLookInfo(){
			var lookinfo = "查看";
			//
			var lx = x_e - 40;
			var ly = y_e - 20;
			//
			var lookText = paper.text(lx, ly , lookinfo);
			lookText.attr({
				"font-family":"microsoft yahei",
				"font-size" : 14
				, "text-anchor" : "start"
				, "color": "#23cba6"
				, "fill": "#2ebcee"
				//, cursor : "pointer"
			});
			lookText.datanode = node;
			unselect(lookText);
			
		    //
			lookText.attr({
				cursor : "pointer"
			});
			
			// 绑定展开事件
			function detail_handler(e, data){
				if(config.detail_handler){
					// 利用闭包特性调用
					config.detail_handler(node);
				}
			}
			lookText.click(detail_handler);
		};
		
		// 都需要绘制节点Title
		function _drawTitletext(){
			// 计算title节点的x,y
			var tx = x_s + 20;
			var ty = y_s + 10 + 20/2 + 4;
			
			var text = node.nodeName || "";

			// 2. 绘制title信息
			//
			var fontSize = 20;
			var textAnchor = "start";
			var textMaxLen = 12;
			var lines = 1;
			if(text.length > textMaxLen){
				lines = 2;
			}
			
			
			if(text.length > textMaxLen){
				if(text.length > textMaxLen*2){
					text = text.substr(0, textMaxLen*2 - 2) + "...";
				}
				text = text.substr(0, textMaxLen) + "\n" + text.substr(textMaxLen);
				ty += pad_top/2;
				lines = 2;
			}
			
			var nameText = paper.text(tx, ty, text);
			// 设置字体
			nameText.datanode = node;
			nameText.attr({
				"font-family": "microsoft yahei",
				"font-weight": "bold",
				"text-anchor": textAnchor,
				"font-size" : fontSize,
				cursor : "default"
			});
			unselect(nameText);
			node.nameText = nameText;
			// 
		};
		// 闭包函数,绘制图标与分类
		function _drawIconType(){
			// TODO _drawIconType
			var icon_subject_src =  config.icon_subject_src;
			var icon_goal_src = config.icon_goal_src;
			var icon_plan_src = config.icon_plan_src;
			
			//
			if(type_NormalNode == type){
				var src = config.icon_subject_src;
				var text = "战略主题";
			} else if(type_End == type){
				var src = config.icon_goal_src;
				var text = "部门目标";
			} else if(type_End == type){
				var src = config.icon_plan_src;
				var text = "保障计划";
			}
			
			var iw = pad_line * 0.8;
			var ih = iw;
			var ix = x_s+ pad*0.8;
			var iy = y_s + pad_top/5;
			var img_icon = paper.image(src, ix, iy, iw, ih);
			
			//
			var tx = ix + iw + 6;
			var ty = y_s + pad_line/2;
			var typeText = paper.text(tx, ty , text);
			typeText.attr({
				"font-family": "microsoft yahei"
				, "font-size" : 16
				, "text-anchor" : "start"
				, "fill" : "#2ae"
			});
			unselect(typeText);
		};
		// 闭包函数,绘制分隔线
		function _drawSepLine(){
			var slw = w-2;
			var slh = 1;
			var slx_1 = x_s+1;
			var slx_2 = slx_1;
			var sly_1 = y_s + pad_line;
			var sly_2 = y_e - pad_line;
			var src = config.line_hsep_src;
			var img_1 = paper.image(src, slx_1, sly_1, slw, slh);
			var img_2 = paper.image(src, slx_2, sly_2, slw, slh);
		};

		// 闭包函数,绘制状态标记
		function _drawStatusIcon(){
			//
			var sr = 10;
			var sx = x_e - 30;
			var sy = y_s + 20;
			// 0标黄, 1标红, 2标蓝
			var status = node.status;
			var color = "#eeec6e";
			if(1 == status){
				color = "#73ee28";
			} else if(2 == status){
				color = "#ee4e42";
			}
			//
			var status_circle = paper.circle(sx,sy,sr);
			//
			status_circle.attr({
				fill : color
				,stroke : color
				,"stroke-width": 1
				,cursor : "pointer"
			});
		};

		// 闭包函数,绘制更新时间
		function _drawUpdateTime(){
			//
			var ux = x_s + 20 ;
			var uy = y_e - 20;
			
			//
			var updatetime =  "2015年08月21日" || node.createTime || "";
			
			//
			var signName = node.signName || "";
			
			//
			//
			if(type_NormalNode == type){
				if(!signName){
					updatetime = "提交时间: " + updatetime;
				} else {
					updatetime = "开始时间: " + updatetime;
				}
			} else if(type_Start == type){
				updatetime = "开始时间: " + updatetime;
			} else if(type_End == type){
				updatetime = "通过时间: " + updatetime;
			}
			
			// 3.3更新时间
			//
			var updatetimeText = paper.text(ux, uy , updatetime);
			updatetimeText.attr({
				"font-family":"microsoft yahei",
				"font-size" : 14
				, "text-anchor" : "start"
			});
			updatetimeText.datanode = node;
			unselect(updatetimeText);
		};
		
		// 闭包函数,绘制部门name
		function _drawDeptUserNameText(){
			//
			var dx = x_s + 20 ;
			var dy = y_e - 60;
			
			//
			var deptname = node.deptname || "";
			var userName = node.userName || "";
			var signName = node.signName || "";
			
			//
			if(type_NormalNode == type){
				deptname = "审批人: " + signName;
				if(!signName){
					deptname = "填写人: " + userName;
				}
			} else if(type_Start == type){
				deptname = "申请人: " + userName;
			} else if(type_End == type){
				deptname = "审核人: " + signName;
			}
			
			// 3.3更新时间
			//
			var deptnameText = paper.text(dx, dy , deptname);
			deptnameText.attr({
				"font-family":"microsoft yahei"
				, "font-size" : 12
				, "text-anchor" : "start"
				, cursor : "pointer"
			});
			deptnameText.datanode = node;
			unselect(deptnameText);
		};

	};
	
	
	
	
})("FlowDiagram");



//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

// 扩展 Raphael.fn, 成为插件； 绘制连接线。 
// 定制，专门画战略路径图的线
// 可以只传递1个参数,则这个参数就是现成的线条
// (线条)
// (父节点, 子节点, 线条色, 线条内部填充色)
Raphael.fn.connectElement = function(pnode, snode, config, bgColor) {
	// 方向
	var marginp = config.margin_parent;
	var margins = config.margin_partner;
	var exp_radius = 0;//config.exp_radius;
	// 取得颜色
	var color = Raphael.color(config.color);
	//
	// 返回该元素的边界框
	var bboxP = pnode.getBBox();
	var bboxS = snode.getBBox();
	//
	// 上下左右.
	var pUp = {
		x : bboxP.x + bboxP.width / 2,
		y : bboxP.y - 1
	};
	var pDown = {
		x : bboxP.x + bboxP.width / 2,
		y : bboxP.y + bboxP.height + 12
	};
	var pLeft = {
		x : bboxP.x - 1,
		y : bboxP.y + bboxP.height / 2
	};
	var pRight = {
		x : bboxP.x + bboxP.width - 4,
		y : bboxP.y + bboxP.height / 2
	};
	//
	var sUp = {
		x : bboxS.x + bboxS.width / 2,
		y : bboxS.y - 1
	};
	var sDown = {
		x : bboxS.x + bboxS.width / 2,
		y : bboxS.y + bboxS.height + 1
	};
	var sLeft = {
		x : bboxS.x - 1,
		y : bboxS.y + bboxS.height / 2
	};
	var sRight = {
		x : bboxS.x + bboxS.width + 1,
		y : bboxS.y + bboxS.height / 2
	}
			 
	//////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////
	//
	// 简单绘制,只需要4个点
	// Number.toFixed(dn); 在数字小数点 后面补dn个0

	var pStart  = pRight;
	var pStart  = {
		x : pRight.x +  3 + 1,
		y : pRight.y
	};
	var pBreak  = {
		x : pStart.x + marginp/2 - exp_radius,
		y : pStart.y
	};
	var sEnd = sLeft;
	var sBreak = {
		x : pBreak.x , // x 保持一致
		y : sEnd.y
	};
	// 画一个箭头
	
	
	
	var path = ["M", pStart.x.toFixed(3), pStart.y.toFixed(3),
				"C", pBreak.x.toFixed(3), pBreak.y.toFixed(3),
				sBreak.x.toFixed(3), sBreak.y.toFixed(3),
				sEnd.x.toFixed(3), sEnd.y.toFixed(3),
				].join(",");
	
	// var path1 = ["M", pStart.x.toFixed(3), pStart.y.toFixed(3),
	// 			"L", pBreak.x.toFixed(3), pBreak.y.toFixed(3),
	// 			"L", sBreak.x.toFixed(3), sBreak.y.toFixed(3),
	// 			"L", sEnd.x.toFixed(3), sEnd.y.toFixed(3),
	// 			].join(",");
	
	// 判断,是新绘制,还是使用已有的线条和背景
	var lineObj = {
			bgPath : bgColor && bgColor.split && this.path(path).attr({
				stroke : bgColor.split("|")[0], // 背景
				fill : "none",
				"stroke-width" : 0 //bgColor.split("|")[1] || 3 // 背景宽度
			}),
			linePath : this.path(path).attr({
				stroke : color,
				fill : "none",
				"stroke-width": 6,
				"stroke-linecap": "square",
				"arrow-end" : "block-midium-midium"
			}),
			from : pnode,
			to : snode
		};
	return lineObj;
};

