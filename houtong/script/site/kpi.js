// 使用闭包
(function() {
	//
	$(pageInit);
	// 
	var __config = {
		_note_info : "默认配置信息,这堆配置信息,可以通过后台配置来覆盖",
		width_dept : 250, // 宽
		height_dept : 140,
		padding_dept : 12,
		padding_dept_top : 20,
		radius_dept : 10,
		margin_parent : 60, // 间距
		margin_partner : 20,
		exp_radius : 8, // 展开按钮的半径大小
		color : '#38f', // 默认颜色
		downposition : null,
		prevposition : null,
		offset : {x: 0, y:0},
		//
		zoom_num : 10, // 缩放倍数,小数. 数字越小则距离屏幕前的你越近,显示越大
		zoom_num_dept : 16, //不显示部门和负责人的阀值(含)
		zoom_num_emp : 18, // 不显示经理和职员的阀值(含)
		expand_level : 2, // 展开级别,展开全部,则设置为100即可
		expand_all : 0,	  // 展开所有
		show_mgr_title : 1, // 显示部门经理title
		show_mgr_name : 1, // 显示部门经理 name
		mgr_src : "./image/m_36.png",
		emp_src : "./image/e_36.png",
		mgr_emp_size : 18,
		min_paper_width : 800,
		min_paper_height : 600,
		paper_width : 0,
		paper_height : 0,
		left_paper : 100, // 最左上角的 paper
		top_paper : 50,
		line_color : "#3333ff", // 连线的颜色
		prevNodePositionInfo : {
			//展开某个节点时的位置信息
			enable : false
			, bbox : null
			, prevoffset : null
		}, 
		detail_handler: function (node){
			// (" TODO 请传入或者修改此函数的逻辑,处理查看事件");
			alert(node.name+ "[id="+node.id+",type="+node.type+"]");
			debug(node);
		},
		//
		orginfo_json_url : 'api/orginfo.json',
		kpiinfo_json_url : 'api/kpiinfo.json',
		kpiall_json_url : 'api/kpiall.json'
		//kpiinfo_json_url : 'api/kpiall.json' // 请切换了试试
	};
	//
	var global = {
		svg : null
		,paper : null
		, pbar : null
		, config : __config
		, currentCachedKPIInfo : null
	};
	window.global = global;
	
	
	// 部门节点的属性模板
	var defaultDeptNode = {
			width : global.config.width_dept, // 宽
			height : global.config.height_dept, //高
			expand: 0,	// 是否强制展开, 记录在tree中比较合理
			hideNodeCount : 0, // 隐藏元素数量
			spanX  : 0, // 占用宽
			spanY : 0,  // 占用高
			x : 0,
			y : 0,
			expand_status : 0, // 1 是展开,显示 - 号，强制显示子节点; 0 是默认不确定， 2是收缩显示加号
			expand_level : 0,
			treenode : null  // 树节点
	};
	
	
	// 刷新节点树
	function refreshKPITree(){
		var kpiInfo = currentCachedKPIInfo();
		showKPIImageByJSON(kpiInfo);
	};

	// 显示KPI信息
	function showKPIImageByJSON(kpiInfo){
		//
		if(!kpiInfo){
			return;
		}
		currentCachedKPIInfo(kpiInfo);
		var paper = global.paper;
		// 清空旧有的元素
		paper.clear();
		
		// 6. 重置一些值
    	//global.config.prevposition=null;
    	//global.config.downposition=null;
    	//global.config.offset = {x: 0, y:0};
    	//
		// 这是设置基础形状,需要进行封装
		drawKPITree(paper, kpiInfo);
    	//
		loadRaphaelProgressBar();
	};
	
	
	// 根据node节点，绘制整棵树
	function drawKPITree(paper, root){
		//
		if(!paper || !root){
			return null;
		}
		//
		var expand_level = global.config.expand_level;
		
		// 1. 遍历,计算整体大小,调用另一个递归方法来计算
		var tree_with_size = calcTreeSize(root, expand_level);
		
		// 2. 预定义大小,计算出结果
		var tree_with_xy = calcXY(tree_with_size, 0, 0, expand_level);
		
		// 3. 开始绘制
		fitPaperSize(paper, tree_with_xy, expand_level);
		var tree = drawKPINodeTree(paper, tree_with_xy, expand_level);
		// 
		// refreshPaperZoom();
		
		// 校正位置
		moveRootToCenter(paper, tree_with_xy);
		
		// 3.1 校正点击加号展开时自身位置不改变的问题
		fixExpandNodePosition(paper, tree_with_xy);
		
		// 4. 绑定事件
		
		// 5. 绘制复选框等其他按钮
		//
		return tree;
	};
	
	// 绘制KPI节点树
	function drawKPINodeTree(paper, tree_with_xy, expand_level){
		//
		//
		var curnode = drawKPINode(paper, tree_with_xy);
		//
		// 遍历,挨个绘制
		var subnodes = tree_with_xy.subnodes;
		for (var i = 0; i < subnodes.length;  i++) {
			var node = subnodes[i];
			// 迭代遍历, 如果还有子元素,则遍历子元素
			drawKPINodeTree(paper, node);
		}
		//
		// 设置连线
		drawKPINodeConnectLine(paper, tree_with_xy);
		//
		return tree_with_xy;
	};
	
	// 根据node节点，获取 shape. 这是绘制单个节点
	function drawKPINode(paper, node){
		if(!node){
			return null;
		}
		var type = node.type;
		//
		var type_Strategy = 1;
		var type_Subject = 2;
		var type_Goal = 3;
		var type_Plan = 4;
		// 0. 先绘制基础的部分
		_drawKPINode_Basix(paper, node);
		
		//
		if(type_Subject == type){
			return _drawKPINode_Subject(paper, node);
		} else if(type_Goal == type){
			return _drawKPINode_Goal(paper, node);
		} else if(type_Plan == type){
			return _drawKPINode_Plan(paper, node);
		} else if(type_Strategy == type){
			return _drawKPINode_Strategy(paper, node);
		} else {
			// 数据出问题了
			return node;
		}
	};

	// XXX 绘制KPI节点-基础部分
	function _drawKPINode_Basix(paper, node){
		// 计算基础数据
		var config = global.config;
		//
		var w = node.width || config.width_dept;
		var h = node.height || config.height_dept;
		var r = config.radius_dept;
		var pad = config.padding_dept;
		var pad_top = config.padding_dept_top;
		//
		var color = Raphael.color(config.color);
		
		//
		var x_s = node.x || config.left_paper;
		var y_s = node.y || config.top_paper;
		var x_e = x_s + w;
		var y_e = y_s + h;
		
		var type = node.type;
		//
		var type_Strategy = 1;
		var type_Subject = 2;
		var type_Goal = 3;
		var type_Plan = 4;
		
		//
		_drawRect();
		// 绘制矩形框
		function _drawRect(){
			// 1. 绘制矩形框
			var rect = paper.rect(x_s, y_s, w, h, r);
			rect.datanode = node;
			rect.attr({
				fill : color,
				stroke : color,
				"fill-opacity" : 0.3,
				"stroke-width" : 2
			});
			node.rect = rect;
		};
		
		//
		_drawExpIcon();
		// 1.1 绘制下方的展开状态图标
		function _drawExpIcon(){
			// expand_level
			// expand_status
			// 没有子节点的情况
			var expand_status = node.expand_status;
			//
			var exp_circle = null;
			
			// 上下左右.
			var pDown = {
				x : x_s + w/2 +1,
				y : y_e + 8
			};
			var pRight = {
				x : x_e +  8,
				y : y_s + h / 2 
			};
			//
			var exp_x = pRight.x;
			var exp_y = pRight.y;
			
			
			//exp_radius
			var exp_radius = config.exp_radius;
			var charExp = "";
			if(1 == expand_status){
				// 展开状态, -号
				charExp = "-";
			} else if(2 == expand_status){
				// 收缩状态, +号
				var charExp = "+";
			}
			//
			if(1 == expand_status || 2 == expand_status){
				// 绘制展开状态/收缩状态, +号
				var exp_circle = paper.circle(exp_x, exp_y, exp_radius);
				var exp_char = paper.text(exp_x, exp_y, charExp);
				//
				exp_circle.attr({
					"stroke-width": 2
				});
				exp_char.attr({
					"font-size": 18
				});
				unselect(exp_char);
			} else {
				// 不绘制. 0
			}
			//
			exp_circle && exp_circle.attr({
				fill : "#eee"
				,stroke : color
				,cursor : "pointer"
			});
			exp_char && exp_char.attr({
				stroke : color
				,cursor : "pointer"
			});
			// 绑定展开事件
			function exp_handler(e, data){
				// treenode
				var to_expand_status = 0;
				if(1 == expand_status){
					 // 变成关闭
					 to_expand_status = 2;
				} else {
					 to_expand_status = 1;
				}
				//
				setExpandNodePosition(node.rect);
				// 改变状态,刷新
				node.treenode &&( node.treenode.to_expand_status = to_expand_status);
				refreshKPITree();
			}
			//
			exp_circle && exp_circle.click(exp_handler);
			exp_char && exp_char.click(exp_handler);
			
		};
		
		
		if(type_Strategy != type){
			_drawLookInfo();
		}
		//
		function _drawLookInfo(){
			var lookinfo = "查看";
			//
			var lookText = paper.text(x_e - 40, y_e - 14 , lookinfo);
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
		_drawTitletext();
		function _drawTitletext(){
			// 计算title节点的x,y
			var tx = x_s + pad;
			var ty = y_s + pad_top;
			
			var text = node.name || node.text || "";

			// 2. 绘制title信息
			//
			var fontSize = 14;
			var textAnchor = "start";
			var textMaxLen = 10;
			var lines = 1;
			if(text.length > textMaxLen){
				lines = 2;
			}
			if(type_Plan == type){
				ty += pad_top + 4;
			} 
			//
			if(type_Plan != type && type_Goal != type){
				// 如果缩放比例太小,则进行特殊处理
				if(global.config.zoom_num >= global.config.zoom_num_emp){ // 补丁
					//
					textMaxLen = 6;
					fontSize = 24;
					tx = x_s + w/2;
					ty = ty += h/2 - pad_top*4/5;
					if(lines > 1){
						ty -= pad_top*2/3;
					}
					textAnchor = "middle";
				} else if(global.config.zoom_num >= global.config.zoom_num_dept){ // 补丁
					//
					textMaxLen = 8;
					fontSize = 20;
					tx = x_s + w/2;
					ty = ty += h/2 - pad_top*3/2;
					if(lines > 1){
						ty -= pad_top/2;
					}
					textAnchor = "middle";
				}
			}
			
			
			// title节点
			if(type_Strategy == type){
				// 强制居中
				ty = y_s + h/2;
				textAnchor = "start";
				textMaxLen = 16;
				fontSize = 16;
			}
			
			if(text.length > textMaxLen){
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
		
		// 绘制用户姓名图标
		if(type_Plan == type){
			_drawUserNameIcon();
		}
		// 闭包函数,绘制用户姓名和图标
		function _drawUserNameIcon(){
			//
			var uiw = 24;
			var uih = 24;
			var uix = x_s + pad;
			var uiy = y_s + 2;
			var uicon= node.uicon;
			var img = paper.image(uicon, uix, uiy, uiw, uih);
			//
			var unx = uix + uiw+pad/2;
			var uny = uiy + uih/2;
			// . 绘制用户信息
			var uname = node.uname || "";
			var unameText = paper.text(unx, uny, uname);
			
			unameText.datanode = node;
			unameText.attr({
				"font-family":"microsoft yahei",
				"font-weight": "bold",
				"font-size" : 14,
				"text-anchor" : "start",
				cursor : "pointer"
			});
			unselect(unameText);
			// TODO 这里可以画一个图片
			var ulx = uix;
			var uly = uiy + uih + pad_top/3;
			var dotText = paper.text(ulx, uly, "········································");
			dotText.attr({
				"font-family":"microsoft yahei",
				"font-size" : 18,
				"text-anchor" : "start",
				cursor : "pointer"
			});
			unselect(dotText);
		};
		
		// 绘制状态图标
		if(type_Goal == type || type_Plan == type){
			_drawStatusIcon();
		}
		// 闭包函数,绘制状态标记
		function _drawStatusIcon(){
			//
			var sr = 10;
			var sx = x_e - pad - sr/2;
			var sy = y_s + pad_top;
			// 0标黄, 1标红, 2标蓝
			var status = node.status;
			var color = "#eeec6e";
			if(1 == status){
				color = "#ee4e42";
			} else if(2 == status){
				color = "#2873ee";
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
		
		if(type_Goal == type || type_Plan == type){
			_drawRateInfo();
		}
		// 闭包函数,绘制进度信息
		function _drawRateInfo(){
			//
			var jx = x_s + pad ;
			var jy = y_s + h/2;
			//
			if(type_Plan == type){
				jy += 20;
			}
			//
			var rate = node.rate || 0;
			var jinduinfo = "当前进度:";
			
			// 3.1完成进度
			//
			var jinduText = paper.text(jx, jy , jinduinfo);
			jinduText.attr({
				"font-family":"microsoft yahei",
				"font-size" : 12
				, "text-anchor" : "start"
			});
			jinduText.datanode = node;
			unselect(jinduText);
			// 画2个椭圆
			var jw = 80;
			var jh = 8;
			var jr = 1;
			var jbars_x = jx + 60;
			var jbars_y = jy - jh/2;
			var jindu1 = paper.rect(jbars_x, jbars_y, jw, jh, jr);
			var jindu2 = paper.rect(jbars_x, jbars_y, jw * rate /100, jh, jr);
			jindu2.attr({
				fill : "#2fc2f5"
			});
			
			var jindut2 = ""+ rate +"%";
			var jindu2Text = paper.text(jw + jbars_x + 5, jy , jindut2);
			jindu2Text.attr({
				"font-family":"microsoft yahei",
				"font-size" : 12
				, "text-anchor" : "start"
				//, cursor : "pointer"
			});
			unselect(jindu2Text);
		
		};
		
		if(type_Goal == type || type_Plan == type){
			_drawUpdateTime();
		}
		// 闭包函数,绘制更新时间
		function _drawUpdateTime(){
			//
			var ux = x_s + pad ;
			var uy = y_e - h/3 + pad_top;
			
			if(type_Goal == type){
				uy = uy - pad_top;
			}
			
			//
			var updatetime = node.updatetime || "";
			
			//
			updatetime = "更新时间: " + updatetime;
			
			// 3.3更新时间
			//
			var updatetimeText = paper.text(ux, uy , updatetime);
			updatetimeText.attr({
				"font-family":"microsoft yahei",
				"font-size" : 12
				, "text-anchor" : "start"
			});
			updatetimeText.datanode = node;
			unselect(updatetimeText);
		};
		
		//
		if(type_Goal == type || type_Subject == type){
			_drawDeptnameText();
		}
		// 闭包函数,绘制部门name
		function _drawDeptnameText(){
			//
			var dx = x_s + pad ;
			var dy = y_e - h/3 + pad_top;
			
			//
			var deptname = node.deptname || "";
			
			//
			if(type_Goal == type){
				deptname = "部门: " + deptname;
			} else if(type_Subject == type){
				deptname = "主责: " + deptname;
			}
			
			// 3.3更新时间
			//
			var deptnameText = paper.text(dx, dy , deptname);
			deptnameText.attr({
				"font-family":"microsoft yahei",
				"font-size" : 12
				, "text-anchor" : "start"
			});
			deptnameText.datanode = node;
			unselect(deptnameText);
		};
		//
		return node;
	};
	
	
	
	// 绘制战略主题
	function _drawKPINode_Subject(paper, node){
		//
		return node;
	};
	
	// 绘制部门目标
	function _drawKPINode_Goal(paper, node){
		//
		return node;
	};
	
	// 绘制员工保障计划
	function _drawKPINode_Plan(paper, node){
		//
		return node;
	};
	
	// 绘制部门计划
	function _drawKPINode_Strategy(paper, node){
		//
		return node;
	};
	
	
	// 绘制连接线
	function drawKPINodeConnectLine(paper, pnode){
		//
		var config = global.config;
		
		var subnodes = pnode.subnodes;
		for (var i = 0; i < subnodes.length;  i++) {
			var snode = subnodes[i];
			// 迭代遍历, 如果还有子元素,则遍历子元素
			paper.connectElement(pnode.rect, snode.rect, config, config.line_color)
		}
		if(pnode.tempemp){
			paper.connectElement(pnode.rect, pnode.tempemp, config, config.line_color)
		}
	};

	
	// 计算树的大小,完全包装为新对象
	function calcTreeSize(root, expand_level){
		if(!root){
			return null;
		}
		// 每次都是新对象
		var defNode = $.extend({} ,defaultDeptNode);
		// 克隆对象
		var tree_with_size = $.extend(defNode, root);
		//
		tree_with_size.treenode = root; // 缓存tree对象
		tree_with_size.expand_level = expand_level;// 存储展开级别
		
		//
		// 遍历直接子节点,引用
		var children = root.children;
		//
		var tree = currentTree();
		//
		var subnodes = [];
		for (var i = 0; i < children.length;  i++) {
			var jsnode = children[i];//tree.get_node(children[i]);
			//
			// 迭代遍历, 如果还有子元素,则遍历子元素
			// 没有,则不会进入循环
			var snode = calcTreeSize(jsnode, expand_level-1);
			//
			var to_expand = getExpandStatus(root);
			if(2 == to_expand){ // 必须先判断收缩状态
				// 不展开
				tree_with_size.expand_status = 2;// 1 是展开,显示 - 号，强制显示子节点; 0 是默认不确定， 2是收缩显示加号
				tree_with_size.hideNodeCount += 1;
			} else if(1 == to_expand || expand_level > 1){
				// 记录下子节点是否展开
				tree_with_size.expand_status = 1; // 1 是展开,显示 - 号，强制显示子节点; 0 是默认不确定， 2是收缩显示加号
				//
				subnodes.push(snode);
				snode.pnode = root;
			} else {
				tree_with_size.expand_status = 2;// 1 是展开,显示 - 号，强制显示子节点; 0 是默认不确定， 2是收缩显示加号
				tree_with_size.hideNodeCount += 1;
			}
		}
		//
		var config = global.config;
		var subNodesSize = subnodes.length;
		var marginp = config.margin_parent;
		var margins = config.margin_partner;
		//
		var spanX = 0;
		var spanY = 0;
		// 计算占用宽高
		for (var i = 0; i < subNodesSize;  i++) {
			var snode = subnodes[i];
			//
			spanX += snode.spanX;
			spanY += snode.spanY;
			//
			// 判断方向,计算与子节点的跨度
			spanX += marginp;
			
			//
			if(0 == i){
				continue;
			}
			// 判断方向,计算子节点之间的跨度
			spanY += margins;
		}
		// 修正没有子节点的情况
		if(subNodesSize < 1){
			//
			spanX = tree_with_size.width;
			spanY = tree_with_size.height;
			
		}
		
		// 
		tree_with_size.jsnode = root;
		tree_with_size.subnodes = subnodes;
		tree_with_size.spanX = spanX;
		tree_with_size.spanY = spanY;
		//
		return tree_with_size;
	};
	function calcXY(tree_with_size, startX, startY, expand_level){
		if(!tree_with_size){
			return null;
		}
		//
		var config = global.config;
		startX = startX || config.left_paper;
		startY = startY || config.top_paper;
		//
		var defw = tree_with_size.width || config.width_dept;
		var defh = tree_with_size.height || config.height_dept;
		var marginp = config.margin_parent;
		var margins = config.margin_partner;
		
		//
		var sx = startX;
		var sy = startY;
		//
		sx += defw + marginp;
		
		// 迭代遍历, 如果还有子元素,则遍历子元素
		var subnodes = tree_with_size.subnodes;
		for (var i = 0; i < subnodes.length;  i++) {
			var node = subnodes[i];
			// 先计算节点, 再加下一个节点的值
			calcXY(node, sx, sy);
			// 修补
			// 算法要改变. 根据前一个元素累加, 因为不规则子树
			var spanX_sub = node.spanX;
			var spanY_sub = node.spanY;
			sy += (spanY_sub + margins);
			
		}
		//
		// 设置自身的
		tree_with_size.x = startX;
		tree_with_size.y = startY;
		//
		var spanX = tree_with_size.spanX;
		var spanY = tree_with_size.spanY;
		// 根据跨度修正
		tree_with_size.y += spanY/2;
		
		
		//
		return tree_with_size;
	};
	//
	// 自适应 paper 大小
	function fitPaperSize(paper, tree_with_xy, expand_level){
		// 设置paper的大小
		var config = global.config;
		var spanX = tree_with_xy.spanX + config.left_paper * 2.5;
		var spanY = tree_with_xy.spanY + config.top_paper * 2.5;
		
		if(config.paper_width < 1 || config.paper_height < 1){
			config.paper_width = config.min_paper_width;
			config.paper_height = config.min_paper_height;
		}
		var width = config.paper_width;
		var height = config.paper_height;
		// 比对最小限制
		if(spanX > width){
			width = spanX;
		}
		if(spanY > height){
			height = spanY;
		}
		paper.setSize(width, height);
	};
	
	// 校正位置
	function moveRootToCenter(paper, tree_with_xy){
		//
		var dxdy = calcDxDy(tree_with_xy);
		//
		dx = dxdy.dx;
		dy = dxdy.dy;
		//
		global.config.offset.y = dy;
		global.config.offset.x = dx;
		//
		refreshPaperZoom();
		 
	};
	// 清空缓存的这个值.
	function clearExpandNodePosition(){
		if(global.config.prevNodePositionInfo){
			global.config.prevNodePositionInfo.enable = false; // 不启用
			global.config.prevNodePositionInfo.bbox = null; // 置空
			global.config.prevNodePositionInfo.prevoffset = null; // 置空
			global.config.prevNodePositionInfo.prevnode = null;
		}
	};
	// 设置展开节点的信息保存
	function setExpandNodePosition(rect){
		if(!rect){
			return;
		}
		clearExpandNodePosition();
		//
		var node = rect.datanode;
		var bbox = rect.getBBox();
		
		//
		var paper = global.paper;
		//
		//
		var config = global.config;
		//
		var prevRootXY = getPrevRootXY();
		var dxdy = calcDxDy(prevRootXY);
		// 克隆
		var offset = {
			x : config.offset.x
			, y : config.offset.y
		};
		//
		var prevNodePositionInfo = {
				enable : true // 启用
				,bbox : bbox  // 设值
				, prevoffset : offset	// 之前的offset
				, dxdy : dxdy
				, prevnode : node
			};
		//
		global.config.prevNodePositionInfo = prevNodePositionInfo;
	};
	function calcDxDy(tree_with_xy){
		//
		var rx = tree_with_xy.x;
		var ry = tree_with_xy.y;
		//
		var config = global.config;
		var startX = startX || config.left_paper;
		var startY = startY || config.top_paper;
		//
		var spanX = tree_with_xy.spanX;
		var spanY = tree_with_xy.spanY;
		//
		var pW = config.min_paper_width;
		var pH = config.min_paper_height;
		//
		var dx =  rx - pW/2 + startX;
		var dy =  ry - pH/2 + startY;
		
		//
		dx = 0; // 强制不使用计算值
		//
		var dxdy = {
			dx: dx
			,dy: dy
		};
		return dxdy;
	};
	// 根据 root 获取相对偏移,修正
	function fixExpandNodePosition(paper, tree_with_xy){
		// 
		var config = global.config;
		var prevNodePositionInfo = config.prevNodePositionInfo;
		if(!prevNodePositionInfo || !prevNodePositionInfo.enable){
			savePrevRootXY(tree_with_xy);
			return; // 没有相应的信息,则不往下执行.
		}
		//
		var prevoffset = prevNodePositionInfo.prevoffset;
		var dxdy = prevNodePositionInfo.dxdy;
		
		//
		var _dx = dxdy.dx;
		var _dy = dxdy.dy;
		//
		var _ox = prevoffset.x;
		var _oy = prevoffset.y;
		// 取得点击加号以前的拖动偏移量
		var _x = _ox - _dx;
		var _y = _oy - _dy;
		
		config.offset.y += _y;
		config.offset.x += _x; 
		//
		config.prevNodePositionInfo = null;
		savePrevRootXY(tree_with_xy);
		refreshPaperZoom();
		
		return;
		
	};
	function getPrevRootXY(){
		return global.config.prevRootXY;
	};
	function savePrevRootXY(prevRoot){
		if(!prevRoot){
			return;
		}
		global.config.prevRootXY = prevRoot;
	};
	// 展开所有节点状态
	function expandAllNodeStatus(checked){
		// 
		global.config.expand_level = checked ? 100 : 2;
		global.config.expand_all = checked ? 1 : 0;
		//
		if(!checked){
			// 选中,那就没什么事了
			return;
		}
		// 否则, 去除所有节点的记忆状态
		var root = currentCachedKPIInfo();
		clear_to_expand_status(root);
		//
	};
	//
	function clear_to_expand_status(node){
		//
		if(!node){
			return;
		}
		if(node.treenode){
			node.treenode.to_expand_status = 0;
		}
		if(node.to_expand_status){
			node.to_expand_status = 0;
		}
		// 循环子节点
		var children = node.children;
		if(!children){
			return;
		}
		//
		for(var i=0; i< children.length; i++){
			clear_to_expand_status(children[i]);
		}
	};
	
    // 刷新paper的zoom
    function refreshPaperZoom(){
		//
		var paper = global.paper;
		var config = global.config;
		var zoomNum = config.zoom_num;
		//
		var width = paper.width;
		var height = paper.height;
		//
		var nw = width * zoomNum /10;
		var nh = height * zoomNum / 10;
		//
		var x = config.offset.x || 0;
		var y = config.offset.y || 0;
		//
		var fit = false;
		//
		paper.setViewBox(x, y,nw, nh, fit);
		//
		$(".transient").remove();
    };
	//
	function currentCachedKPIInfo(node){
		if(node){
			global.currentCachedKPIInfo = node;
		}
		return global.currentCachedKPIInfo;
	};


	// 上面是绘制战略路径图的逻辑代码
    // 创建进度条
	function loadRaphaelProgressBar() {
		//
        var holder1 = document.getElementById("holder1");
        //
        var $holder1 = $("#holder1");
        var pos = $holder1.offset();
		var config = global.config;
        var value = config.zoom_num;
        var c = {
            	x : 10
            	, y : 30
            	, value : value
				, minvalue : 3
				, maxvalue : 15
            	, vertical : 1
            	, color : "#6fdeee"
            	, element : holder1
            	, fixsize : pos
            	, onchange : function(value){
            		//
            		
            		var old_value = config.zoom_num;
            		var zoom_num_dept = config.zoom_num_dept;
            		var zoom_num_emp = config.zoom_num_emp;
            		//
					config.zoom_num = value;
					debug(config.zoom_num, zoom_num_dept, zoom_num_emp);
            		// 触动阀值
            		if(old_value < zoom_num_dept && value >= zoom_num_dept){
						return refreshKPITree();
            		} else if(old_value >= zoom_num_dept && value < zoom_num_dept){
						return refreshKPITree();
            		}
            		// 触动阀值
            		if(old_value < zoom_num_emp && value >= zoom_num_emp){
						return refreshKPITree();
            		} else if(old_value >= zoom_num_emp && value < zoom_num_emp){
						return refreshKPITree();
            		}
            		// 普通情况
					refreshPaperZoom();
          		}
        };
        var pbar = Raphael.progressbar(c);
        global.pbar = pbar;
	};
	
	//
	function bindEvents() {
		//
		var $holder = $("#holder");
		//
		var $export_image = $("#btn_export_image");
		var $btn_direction_toggle = $("#btn_direction_toggle");
		var $checkbox_expand_all = $("#checkbox_expand_all");
		var $btn_fullscreen = $("#btn_fullscreen");
		var $btn_deptshow = $("#btn_deptshow");
		var $btn_save_showconfig = $("#btn_save_showconfig");
		var $savedimg_anchor = $("#savedimg_anchor");
		var $popup_saveimage_area = $("#popup_saveimage_area");
		var $btn_close_popup = $("#btn_close_popup");
		var $savefile = $("#savefile"); // 用来
		//
		$export_image.click(function() {
			//
			var imgSrc = saveSVGToPNG("savedimg") ;
			var fileName = "战略路径图_" + new Date().getTime();
			//
			$popup_saveimage_area.removeClass("hide");
			//
			$savedimg_anchor.attr("href", imgSrc);
			$savedimg_anchor.attr("download", "" + fileName + ".png");
		});
		
		//
		$checkbox_expand_all.click(function() {
			//
			var checked = $checkbox_expand_all.attr('checked') || $checkbox_expand_all.prop("checked");
			//
			expandAllNodeStatus(checked);
			// 刷新部门树 ...
			refreshKPITree();
		}); 
		//
        $btn_fullscreen.click(function () {
            if ($.util.supportsFullScreen) {
                if ($.util.isFullScreen()) {
                    $.util.cancelFullScreen();
                } else {
                    $.util.requestFullScreen("#holder");
                    //
                    var paper = global.paper;
                    // 获取全屏窗口的size
                    var w = $(window).width();
                    var h = $(window).height();
                    //
                    // 设置size
                    //paper.setSize(w, h);
                    //global.config.paper_width = w;
                    //global.config.paper_height = h;
                    // 全屏,还需要监听全屏退出事件
                    //$("#holder").width(w).height(h);
                    //paper.setSize(w,h);
                    //refreshKPITree();
                }
            } else {
                $.easyui.messager.show("当前浏览器不支持全屏 API，请更换至最新的 Chrome/Firefox/Safari 浏览器或通过 F11 快捷键进行操作。");
            }
        });
		//
        $btn_deptshow.click(function (e) {
        	//
            var showmgrtitle = global.config.show_mgr_title ? true: false;
            var showmgrname = global.config.show_mgr_name ? true: false;
            
            $showconfig = $("#showconfig_area");
            //
        	var pos = $(this).offset();
            //
            var _left = pos.left + 15;
            var _top = pos.top + 40;
            //
            $showconfig.css({
            	"top" : _top + "px",
            	"left": _left + "px"
            });
            $showconfig.removeClass("hide");
            
            // 设置值
            var $showmgrtitle = $("#showmgrtitle");
            var $showmgrname = $("#showmgrname");
            //
            if($showmgrtitle.prop){
            	$showmgrtitle.prop("checked", showmgrtitle);
            } else {
            	$showmgrtitle.attr("checked", showmgrtitle);
            }
            if($showmgrname.prop){
            	$showmgrname.prop("checked", showmgrname);
            } else {
            	$showmgrname.attr("checked", showmgrname);
            }
            //
        });
        $btn_save_showconfig.click(function (e) {
            //
            $showconfig = $("#showconfig_area");
            //
            var $showmgrtitle = $("#showmgrtitle");
            var $showmgrname = $("#showmgrname");
            //
            var showmgrtitle = $showmgrtitle.prop("checked") || $showmgrtitle.attr("checked");
            var showmgrname = $showmgrname.prop("checked") || $showmgrname.attr("checked");
            //
            if(showmgrtitle){
	            global.config.show_mgr_title=1;
            } else {
	            global.config.show_mgr_title=0;
            }
            if(showmgrname){
	            global.config.show_mgr_name=1;
            } else {
	            global.config.show_mgr_name=0;
            }
            //
            $showconfig.addClass("hide");
			// 刷新部门树 ...
			refreshKPITree();
        });
		
		// 闭包内的函数
		function hidePopUp(){
			$popup_saveimage_area.addClass("hide");
		};
		//
		function processZoom(zoomUp){
			//
			var zoomNum = global.config.zoom_num;
			//
			if(zoomUp){
				// 放大
				zoomNum --; // 这是相反的
			} else {
				zoomNum ++; // 这是相反的
			}
			//
			if(zoomNum < 3){
				zoomNum = 3;
			} else if(zoomNum > 25){
				zoomNum = 25;
			}
			//
			if(global.pbar && global.pbar.val){
				global.pbar.val(zoomNum);
			} else {
				//
				global.config.zoom_num = zoomNum;
				refreshPaperZoom();
			}
		};
		//
		$btn_close_popup.click(function(){
			hidePopUp();
		});
		
		// 监听键盘按键
		$(document).keyup(function (e) {
			//
			var WHICH_ESC = 27;
			var WHICH_UP = 38;
			var WHICH_DOWN = 40;
			//
			var which = e.which;
			
			// 监听ESC键
	        if (which === WHICH_ESC) {
	            /** 这里编写当ESC时的处理逻辑！ */
	           hidePopUp();
	           return stopEvent(e);
	        }
	        /**  CTRL + ??? 的情况  */
	        if(e.ctrlKey){
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
	        }
	    });
	    
	    // 只监听 holder. 是否应该监听 svg元素? 先不管
	    var $svg = $(global.svg);
	    // 监听2个位置,依靠阻止事件传播
	    global.svg && $svg.bind('mousewheel', mouseWheelHandler);
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
        
        // 全局
        $(document).mouseup(function(e){ // 放开鼠标
        	global.config.prevposition=null;
        	global.config.downposition=null;
        }); 
        $holder.mousedown(function(e){ // 按下鼠标
        	//
        	var screenX = e.screenX;
        	var screenY = e.screenY;
        	//
        	var downposition = {
        		screenX : screenX
        		,screenY: screenY
        	};
        	//
        	global.config.downposition=( downposition);
        }).mouseup(function(e){ // 放开鼠标
        	global.config.prevposition=null;
        	global.config.downposition=null;
        }).mouseout(function(e){ // 鼠标离开
        	//global.config.downposition=null;
        }).mouseleave(function(e){ // 鼠标离开
        	//global.config.downposition=null;
        }).mousemove(function(e){ // 鼠标移动
        	//
        	var screenX = e.screenX;
        	var screenY = e.screenY;
        	//
        	var current = {
        		screenX : screenX
        		,screenY: screenY
        	};
        	//
        	var prevposition = global.config.prevposition;
        	var downposition = global.config.downposition;
        	if(!downposition){
        		return;
        	}
        	if(!prevposition || !prevposition.screenX){
        		prevposition = downposition;
        	}
        	//
        	if(!prevposition || !prevposition.screenX){
        		return; // 没有按下什么,返回
        	}
        	//
    		var pX = prevposition.screenX;
    		var pY = prevposition.screenY;
    		//
    		var deltaX = pX - screenX;
    		var deltaY = pY - screenY;
    		//
    		var min = 5;
    		if(deltaX > min || deltaX < -1*min 
    			|| deltaY > min || deltaY < -1*min){
    			// 移动超过 min 个像素
    			
    			var delta = {
    				deltaX : deltaX
    				, deltaY : deltaY
    			};
    			dragRaphael(delta);
    			//
    			global.config.prevposition=( current);
    		}
        });
        
        //
        function dragRaphael(delta){
        	if(!delta){
        		return;
        	}
			//
			var paper = global.paper;
			var config = global.config;
			//var zoomNum = config.zoom_num;
			//
			var width = paper.width;
			var height = paper.height;
			//
			var x = config.offset.x || 0;
			var y = config.offset.y || 0;
			//
			x += delta.deltaX;
			y += delta.deltaY;
			// 判断x, y的合理性
			var times = 0.7;
			//
			if(x < -1*width*times){
				x =  -1*width*times;
			}
			if(x > width*times){
				x =  width*times;
			}
			if(y < -1*height*times){
				y =  -1*height*times;
			}
			if(y > height*times){
				y =  height*times;
			}
			//
			config.offset.x = x;
			config.offset.y = y;
			var fit = false;
			//
			refreshPaperZoom();
        };
	}; // end of bindEvents
	
	
	
	// 请参考: http://www.jstree.com/api/#/?q=.jstree%20Event
	function loadJsTree() {
		//
		var config_core_data = {
			'url' : function(node) {
				// 指定 AJAX_JSON的地址
				return global.config.orginfo_json_url;
			},
			'data' : function(node) {
				return {
					'id' : node.orgid// 转换,      自定义ID, node.orgid
					,
					'text' : node.name +"(" + (node.empnum||0) + ")"	// 转换
				};
			}
		};
		var config = {
			'core' : {
				'data' : config_core_data
			}
		};
		//
		var $orginfo_tree = $('#orginfo_tree');
		var $current_org_name = $('#current_org_name');
		// 绑定选择事件; select_node.jstree
		$orginfo_tree.on('select_node.jstree', function(e, data) {
			//
			var node = data.node;
			//
			var text = node.text || "";
			//
			if(text.indexOf("(") > 0){
				var ind = text.indexOf("(");
				text = text.substr(0, ind);
			}
			$current_org_name.text(text); 
			// 
			getAndShowKPIImageByNode(node);
		});
		
		// 绑定选择事件
		$orginfo_tree.on('changed.jstree', function(e, data) {
			//
			var action = data.action;
			if("ready" == action){
				var root = data.instance.get_node(data.selected[0]);
				
				var node = root || {};
				//
				var text = node.text;
			if(text.indexOf("(") > 0){
				var ind = text.indexOf("(");
				text = text.substr(0, ind);
			}
				$current_org_name.text(text); 
				// 
				getAndShowKPIImageByNode(node);
			}
		});
		
		//
		function getAndShowKPIImageByNode(node){
			//
			var url = global.config.kpiinfo_json_url;
			var data = {
				orgid : node.orgid
			};
			// 获取JSON_KPI信息
			var successCallback = function(message){
				//
				showKPIImageByJSON(message);
			};
			requestAjax(url, data, successCallback);
		};
		//
		try{
			var tree = $orginfo_tree.jstree(config);
		} catch(ex){
			alert("请部署到Web服务器中访问"); // 捕获不到,杯具
		}

	};

	// 加载 Raphael
	function loadRaphael(holderid) {
		//
		var holder = document.getElementById(holderid);
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
		//
		var width = global.config.min_paper_width;
		var height = global.config.min_paper_height;
		// paper 画纸。
		var paper = new Raphael(holder, width, height);
		// 持有
		global.paper = paper;
		global.svg = paper ? paper.canvas : null;
		// 然后就完了。
		// 等着触发事件. 然后绘制相应的图形
	};
	//
	// 初始化页面JS调用
	function pageInit() {
		var holderid = "holder";
		//
		try{
			// 加载 Raphael
			loadRaphael(holderid);
		} catch(ex){
			debug(ex);
		}
		try{
			// 加载 Tree
			loadJsTree();
		} catch(ex){
			debug(ex);
		}
		try{
			// 绑定各种自定义事件
			bindEvents();
		} catch(ex){
			debug(ex);
		}
	};
})();


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
	var exp_radius = config.exp_radius;
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
		x : bboxP.x + bboxP.width + 12,
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
		x : pRight.x + + exp_radius/3 + 1,
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
				"stroke-width" : 2 //bgColor.split("|")[1] || 3 // 背景宽度
			}),
			linePath : this.path(path).attr({
				stroke : color,
				fill : "none"
				,"stroke-width": 2, "stroke-linecap": "round"
			}),
			from : pnode,
			to : snode
		};
	return lineObj;
};


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
	if(!id){
		return {};
	}
	return {
		w : $("#"+id).width(),
		h : $("#"+id).height()
	};
};


// 请求AJAX,工具方法; 解析的返回对象,是标准的com.sinog2c.mvc.message.JSONMessage类型
function requestAjax(url, data, successCallback, errorCallback){
	var scope = this;
	//
	var ajaxObject = {
	    url: url,
	    data: data,
        type: "post",
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


// 将svg保存为png
function saveSVGToPNG(imgId) {
	//
	var canvas = document.getElementById("tempcanvas");

	var img = document.getElementById(imgId);
	//
	//load a svg snippet in the canvas
	if(global && global.svg){
		// 修改了源码,将文本重复问题解决
		canvg(canvas, global.svg.outerHTML);
	}
	//
	//
	var image = new Image();
	image.src = canvas.toDataURL("image/png");
	
	//将canvas转成图片
	var imgSrc = image.src;//canvas.toDataURL("image/png");
	img.src = "";
	img.src = imgSrc;
	return imgSrc;
};


//
function currentTree(){
	var $orginfo_tree = $('#orginfo_tree');
	return $orginfo_tree.jstree();
};

	
// 该节点的子节点是否展开
function getExpandStatus(node){
	//
	var result = 0;
	// 展开状态
	if(!node){
		result = 0; // 错误情况
	} else if(node.treenode && node.treenode.to_expand_status){
		result = node.treenode.to_expand_status; //记忆中的关闭
	} else if(node.to_expand_status){ // 1,2
		result = node.to_expand_status; //记忆中的关闭
	} else if(global.config.expand_all){
		result = 1; // 全局展开
	} else if(2 == node.expand_status){
		result = node.expand_status; // 这个没用
	} else if(node.treenode){ // 记忆中的展开
		result = node.treenode.to_expand_status || 0;
	}
	//
	return result;
};
