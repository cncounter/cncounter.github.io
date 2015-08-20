/*!
 * SizeBar 0.1.0 - Raphael plugin
 * 拖动条
 * Powered by www.renfufei.com
 */
(function(Raphael) {
	// 需要的参数: paper,x,y,长度,高度； 以及values[各个子段的权值,color];
	Raphael.sizebar = function(param) {
		// 初始默认值
		// 采用继承机制
		param = param || {};
		param = _extends(param, {
			paper : null,		// 画布
			x : 0,
			y : 0,
			width : 400,
			height : 10,
			data : [], // 各个数据
			weight : 1,  // 总权值
			barSet : null,
			textSet : null,
			opacityCSet : null,
			cursorSet : null,
			currentDataChange : 0,
			margin : 15,
			size : 300,
			size2 : 32,
			csize : 15,
			csize2 : 40,
			padding : 5,
			radius : 3,
			clinew : 1, //线宽度
			backrect : null, // 背景rect
			frontrect : null, // 前景rect, 在这个 rect 内部拖动
			initcallchange : false, //是否触发初始回调
			onchange : function(ndata) {},// 回调函数, 值改变时触发
			beforechange : function(tdata) {return true;}// 回调函数, 值改变时触发
		});
		//
		return new SizeBar(param);
	};
	// 构造函数
	function SizeBar(config) {
		//
		this._extends(config);
		//
		this.init();
		// 处理显示
		this.processRender();
		// 触发change完成事件
		this.initcallchange && this.onchange && this.onchange(this.data);
	};
	//
	SizeBar.prototype._extends = _extends;
	// 初始化操作
	SizeBar.prototype.init = function (){
		// 处理初始值
		this.setData(this.data);
	};
	
	// 初始化Data
	SizeBar.prototype.setData = function (data){
		//
		if(!data || !data.length){
			return this;
		}
		// 处理
		var data_n = [];
		for(var j =0; j < data.length; j++){
			var dn = data[j];
			//
			dn = _extends(dn, {});
			data_n.push(dn);
		}
		//
		this.data = data_n;
		//
		var weight = 0;
		for(var i=0; i < data.length; i++){
			var d = data[i];
			var value = d.value;
			if(value < 0){
				value = 0;
			}
			weight += value;
		}
		//
		this.weight = weight;
	};
	
	// 渲染
	SizeBar.prototype.processRender = function (){
		//
		this.drawRect();
		this.drawCursor();
	};
	//
	SizeBar.prototype.drawRect =  function (){
		var that = this;
		var paper = that.paper;
		//
		var bx = that.x;
		var by = that.y;
		
		var bw = that.width;
		var bh = that.height;
		var weight = that.weight;
		// 画多个矩形
		// 遍历 data
		that.barSet = paper.set();
		that.textSet = paper.set();
		var dw = 0;
		//
		var data = that.data || [];
		//
		var len = data.length;
		//
		for(var i=0; i < len; i++){
			var d = data[i];
			var value = d.value || 0;
			if(value < 0){
				value = 0;
			}
			var color = d.color || Raphael.getColor();
			var info = d.info || "";
			var id = d.id || "";
			//
			var margin = that.margin;
			var psw = that.widthPerStage();
			var rw = (value) * psw + margin;
			var rh = bh;
			var rx = bx + dw;
			var ry = by;
			//
			drawBackRect();
			drawRatioText();
			// 累加
			dw += rw;
			
			function drawBackRect(){
				// 矩形条
				var rect = paper.rect(rx, ry, rw, rh);
				rect.attr({
					stroke : color
					, fill : color
					, r : 0
				});
				rect._id = id;
				that.barSet.push(rect);
			};
			//
			function drawRatioText(){
				
				// 文字
				var tx = rx + rw /2;
				var ty = ry - 10;
				var ratio = Math.floor((value / weight) * 100); // 这个还有点问题,加起来不到100
				var text = info + " " + ratio.toFixed(0) + "%";
				//
				var textEl = paper.text(tx, ty, text);
				that.textSet.push(textEl);
				// 
				var tstyle = textEl.node.style;
				tstyle.unselectable = "on";
				tstyle.MozUserSelect = "none";
				tstyle.WebkitUserSelect = "none";
			};
		}
		//
		that.textSet.attr({"text-anchor": "middle"}); // 改变集合内所有   fill 特性
		
		// 画顶层透明矩形
		that.frontrect = paper.rect(bx, by, bw, bh);
		that.frontrect.attr({
			stroke : "#fff"
			,fill : "#6fdeee" //"180-#fff-#000",// 设置颜色
			,"stroke-width" : 1
			, opacity : 0 // 透明
		});
		//
		that.frontrect.toFront();
	};
	// 绘制滑块
	SizeBar.prototype.drawCursor =  function (){
		var that = this;
		var paper = that.paper;
		var color = "#ccc";
		// 画多个滑块
		that.cursorSet = paper.set();
		that.opacityCSet = paper.set(); //
		//
		var barSet = that.barSet || [];
		// 遍历 // 从1 开始,0的不画, 共n-1 个
		for(var i=1; i < barSet.length; i++){ 
			var b = barSet[i];
			var id = b._id || "";
			//
			var bbox = b.getBBox();
			var bx = bbox.x;
			var by = bbox.y;
			//
			var ch = that.height + 4;
			var cw = ch;
			var cx = bx - cw/2;
			var cy = by - 2;
			//
			var cursor = paper.rect(cx, cy, cw, ch);
			cursor.attr({
				stroke : "#222"
				, fill : color
				, opacity : 0.1
				, r : 3
				, "stroke-width" : 1
			});
			cursor._id = id;
			that.cursorSet.push(cursor);
			//
			//// 透明滑块,用来拖加拖动事件
			var cc = cursor.clone().attr({  opacity: 1 });
			cc._id = id;
        	// 加到 
			that.opacityCSet.push(cc);
			// 使用闭包绑定事件
			bindCursorEvent(that, cc);
			
		} // end for
		//
		function bindCursorEvent(that, cc){
			// 事件
			cc.drag(function(dx, dy, _x, _y,e) {
				// onmove
				that.ccOnMove(cc, dx, dy, _x, _y);
				return stopEvent(e);
			}, function(e_x, e_y, e) { //onstart
				that.ccOnMoving = true;
				that.currentDataChange = 0;
				//
				return stopEvent(e);
			}, function(e) { // onend
				that.ccOnMoving = false;
				that.ccOnMoveEnd(e);
				//
				return stopEvent(e);
			});
		};
	};
	
	
	SizeBar.prototype.ccOnMoveEnd = function(e) {
		// 放开以后,根据data修正各个cursor的值
		//
		var that = this;
		var data = this.data;
		var weight = this.weight;
		var bx = that.x;
		var margin = that.margin;
		var psw = that.widthPerStage();
		//
		var barSet = that.barSet ;
		var textSet = that.textSet;
		if(!data || !weight){
			return;
		}
		if(!barSet || !textSet){
			return;
		}
		//
		var cursorSet = that.cursorSet ;
		var opacityCSet = that.opacityCSet;
		if(!cursorSet || !opacityCSet){
			return;
		}
		//
		// 遍历 data
		var len = data.length;
		var dw = 0;
		//
		for(var i=0; i < len; i++){
			var d = data[i];
			var value = d.value || 0;
			if(value < 0){
				value = 0;
			}
			var id = d.id || "";
			//
			var rw = (value) * psw + margin;
			var rx = bx + dw;
			//
			barSet[i].attr({
				x : rx,
				width : rw
			});
			
			var tx = rx + rw /2;
			textSet[i].attr({
				x: tx
			});
			//
			// 累加
			dw += rw;
			//
			var ch = that.height + 4;
			var cw = ch;
			var cx = rx - cw/2;
			if(0 == i){
				continue;
			}
			//
			cursorSet[i-1] && cursorSet[i-1].attr({
				x : cx
			});
			opacityCSet[i-1] && opacityCSet[i-1].attr({
				x : cx
			});
		}
	};
	// 移动处理
	// {dx: 从按下拖动时到此时的x值改变; dy: y改变; _x: }
	SizeBar.prototype.ccOnMove = function(cc, dx, dy, _x, _y) {
		var that = this;
		//
		if (that.ccOnMoving) {
			// 
			var nx = _x -  that.x - that.x/2;
			nx = getNewXCoordinate(cc, nx);
			//
			that.setCursor(cc, nx);
			// 边动边改
			that.processDataChange(cc, dx, nx); 
		
		} else {
			//
		}
		// 
		function getNewXCoordinate(opacityCursor, newX){
			var minX = that.x;
			var maxX = that.x + that.width;
			var margin = that.margin;
			var psw = that.widthPerStage();
			// 判断超出边界
			if(newX < minX){
				newX = minX;
			}
			if(newX > maxX){
				newX = maxX;
			}
			//
			var bbox = opacityCursor.getBBox();
			var cWidth = bbox.width;
			
			// 判断Bar的相对位置
			//
			var id = opacityCursor._id;
			var barSet = that.barSet;
			var targetBar = searchById(barSet, id, "_id");
			var targetBarIndex = searchIndexById(barSet, id, "_id");
			// 左边的
			var prevBar = barSet[targetBarIndex-1];
			
			//
			var targetBBox = targetBar.getBBox();
			var bxMax = targetBBox.x2;
			// 捡一个半
			//bxMax = bxMax - psw - cWidth*2/2;
			bxMax = bxMax - margin - cWidth*2/2;
			//
			var bboxPre = prevBar.getBBox();
			var bxMin = bboxPre.x;
			// 减半个
			bxMin = bxMin + margin ;//+ cWidth*1/2;
			
			// 判断超出边界
			if(newX < bxMin){
				newX = bxMin;
			}
			if(newX > bxMax){
				newX = bxMax;
			}
			// TODO 还要处理向前向后借位的情况
			//
			return newX;
		};
	};
	
	// 设置 Cursor 的位置
	SizeBar.prototype.setCursor = function(cc, nx) {
		// 移动进度条的显示位置
		cc.attr({ x : nx });
		//
		var id = cc._id;
		var cursor = searchById(this.cursorSet, id , "_id");
		cursor && cursor.attr({ x : nx});
	};
	
	//
	SizeBar.prototype.processDataChange = function(cc, dx, nx) {
		// cc, cursor, rect, text, data
		// 计算改变了几个
		var change = (dx/this.width) * this.weight;
		change = Math.round(change);
		if(change == 0){
			//return;
		}
		// 移除上次的影响
		change = change - this.currentDataChange;
		if(change == 0){
			return;
		}
		//
		var id = cc._id;
		var barSet = this.barSet;
		var targetBar = searchById(barSet, id, "_id");
		var targetBarIndex = searchIndexById(barSet, id, "_id");
		
		// 左边的
		var prevBar = barSet[targetBarIndex-1];
		
		// 克隆数组
		var data = cloneArray(this.data) || [];
		//
		var targetData = searchById(data, id, "id");
		var targetDataIndex = searchIndexById(data, id, "id");
		var prevData = data[targetDataIndex-1];
		
		//
		if(prevData){
			var preV = prevData.value + change;
		}
		if(targetData){
			var targetV = targetData.value - change;
		}
		if(preV < 0 || targetV < 0){
			return;
		} else if(preV > this.weight || targetV > this.weight){
			return;
		} 
		//设置前一个的值，后一个的值
		prevData && (prevData.value = preV);
		targetData && (targetData.value = targetV);
		//
		
		//  是否允许改变
		var allow = this.beforechange(data);
		//
		if(false !== allow){
			//
			this.currentDataChange += change;
			this.data = data;
			this.onchange(this.data);
		};
		
	};
	
	
	// 每一段的长度
	SizeBar.prototype.widthPerStage = function(){
		var that = this;
		var len = that.data.length;
		var nl = len -0;
		if(nl < 0){
			nl= 0;
		}
		//
		var margin = this.margin || 15;
		//
		var psw = (that.width - margin*nl) * 1 / (that.weight);// 空位
		return psw;
	};
	
	
	//////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////
	// 继承. 工具方法,obj1的属性复制到obj2
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
	// 克隆一维数组. 工具方法
	function cloneArray(arrays) {
		//
		var newArray = [];
		//
		if (!arrays || arrays.length<1) {
			return newArray;
		}
		//
		for (var i=0; i < arrays.length; i++) {
			//
			var ele = arrays[i];
			//
			if(!ele){
				continue;
			}
			//
			var newEle = _extends(ele, {});
			newArray.push(newEle);
		}
		//
		return newArray;
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
	
	// 根据ID取得set中的值
	function searchById(set, id, idKey){
		var result = _searchElementAndIndexById(set, id, idKey);
		return result.element;
	};
	function searchIndexById(set, id, idKey){
		var result = _searchElementAndIndexById(set, id, idKey);
		return result.index;
	};
	function _searchElementAndIndexById(set, id, idKey){
		//
		var result = {
				index : -1,
				element : null
		};
		if(!set || !id){
			return result;
		}
		if(!idKey){
			idKey = "id";
		}
		//
		for(var i=0; i< set.length; i++){
			var el = set[i];
			var _id = el[idKey];
			if(_id == id){
				result.index = i;
				result.element = el;
				break;
			}
		}
		//
		return result;
	};

})(window.Raphael);
