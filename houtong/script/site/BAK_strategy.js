// 使用闭包
(function() {

	
	//
	function drawTempEmp(paper, node){
		//
		if(!node || !paper){
			return null;
		}
		
		if(node.children.length > 0 || !node.original  || !node.original.empnum){
			//
			return null;
		}
		//
		var w = node.width || global.config.width_dept;
		var h = node.height || global.config.height_dept;
		var r = global.config.radius_dept;
		var pad = global.config.padding_dept;
		
		var marginp = global.config.margin_parent;
		var margins = global.config.margin_partner;
		var direction = global.config.direction;
		
		//
		var x_s = node.x || global.config.left_paper;
		var y_s = node.y || global.config.top_paper;
		
		//
		x_s = x_s + marginp + w;
		
		var x_e = x_s + w;
		var y_e = y_s + h;
		
		// 1. 绘制矩形框
		var rect = paper.rect(x_s, y_s, w, h, r);
		var tempemp = rect;
		//
		rect.dblclick(dbclickHandler);
		rect.datanode = node;
		
		// expand_level
		// expand_status
		// 1.1 绘制下方的展开状态图标
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
		if(0 == direction){// 判断横竖
			var exp_x = pDown.x;
			var exp_y = pDown.y;
		} else {
			var exp_x = pRight.x;
			var exp_y = pRight.y;
		}
		
		//exp_radius
		var exp_radius = global.config.exp_radius;
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
			,stroke : "#00e"
			,cursor : "pointer"
		});
		exp_char && exp_char.attr({
			stroke : "#00e"
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
			setExpandNodePosition(rect);
			// 改变状态,刷新
			node.treenode &&( node.treenode.to_expand_status = to_expand_status);
			refreshDeptTree();
		}
		//
		exp_circle && exp_circle.click(exp_handler);
		exp_char && exp_char.click(exp_handler);
		
		
		var color = Raphael.getColor();
		rect.attr({
			fill : color,
			stroke : color,
			"fill-opacity" : 0.3,
			"stroke-width" : 2
			//,cursor : "pointer"
		});
		// 设置字体
		var font = paper.getFont("Times", 800); //Times
		// 2. 绘制部门信息
		var text = node.text || "";
		//
		var tlen = text.length;
		//
		text = text.substr(tlen - 2);
		text = "于栾英　　　　已关注";
		//
		var nameText = paper.text(x_e -5, y_s + pad * 0.6, text);
		
		//var nameText = paper.print(x_s + w/2, y_s + pad, text, font, 30);
		
		nameText.dblclick(dbclickHandler);
		nameText.datanode = node;
		nameText.attr({
			"font-family":"microsoft yahei",
			"font-size" : 13,
			"text-anchor" : "end",
			cursor : "pointer"
		});
		unselect(nameText);
		//
		var src= "image/e_24.png";
		var img = paper.image(src, x_s + 25, y_s + pad * 0.2, 24, 24);
		
		
		var dotText = paper.text(x_s + 5, y_s + pad*1.5, "········································");
		dotText.attr({
			"font-family":"microsoft yahei",
			"font-size" : 18,
			"text-anchor" : "start",
			cursor : "pointer"
		});
		unselect(dotText);
		
		// 3. 绘制部门经理
		var original = node.original || {};
		//
		var linkman = original.linkman;
		var linktitle = original.linktitle;
		//
		var linkinfo = "";
		if(linkman){
			linkinfo += linkman; 
		}
		if(linktitle){
			linkinfo += "("+ linktitle +")";
		}
		//
		linkinfo = "任务目标名称";
		//
		var linkText = paper.text(x_s + 20, y_s + pad * 2.8 , linkinfo);
		linkText.attr({
			"font-family":"microsoft yahei",
			"font-size" : 14
			, "text-anchor" : "start"
			//, cursor : "pointer"
		});
		linkText.dblclick(dbclickHandler);
		linkText.datanode = node;
		unselect(linkText);
		
		
		// 3.1完成进度
		//
		var jindu = original.jindu || 80;
		//
		var jinduinfo = "";
		if(node.text.indexOf("集团") > 0){
		}else if(node.text.indexOf("公司") > 0 ){
		}else
		{
			jinduinfo = "进度条:";
			
			//
			var jinduText = paper.text(x_s + 20, y_s + pad*4 , jinduinfo);
			jinduText.attr({
				"font-family":"microsoft yahei",
				"font-size" : 12
				, "text-anchor" : "start"
				//, cursor : "pointer"
			});
			jinduText.datanode = node;
			unselect(jinduText);
			// 画2个椭圆
			var jinduw = 80;
			var jinduxs = x_s + 80;
			var jindu1 = paper.rect(x_s + 80, y_s + pad*3.9, jinduw, 8, 1);
			var jindu2 = paper.rect(x_s + 80, y_s + pad*3.9, jinduw * jindu /100, 8, 1);
			jindu2.attr({
				fill : "#2fc2f5"
			});
			
			var jindut2 = ""+ jindu +"%";
			var jindu2Text = paper.text(jinduw + jinduxs + 5 , y_s + pad*4 , jindut2);
			jindu2Text.attr({
				"font-family":"microsoft yahei",
				"font-size" : 12
				, "text-anchor" : "start"
				//, cursor : "pointer"
			});
			unselect(jindu2Text);
		}
		//
		
		// 查看
		//
		//
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
		lookText.dblclick(dbclickHandler);
		lookText.datanode = node;
		unselect(lookText);
		
		
		//
		var timeinfo = "2015-01-01";
		//
		var timeText = paper.text(x_s + 20, y_e - 14 , timeinfo);
		timeText.attr({
			"font-family":"microsoft yahei",
			"font-size" : 12
			, "text-anchor" : "start"
			, "color": "#23cba6"
			//, cursor : "pointer"
		});
		unselect(timeText);
		
		//
		node.tempemp = tempemp;
	};

	


})();




