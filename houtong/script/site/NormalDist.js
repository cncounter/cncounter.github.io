

// 扩展 Raphael.fn, 成为插件; 正态分布图
Raphael.fn.distributionPath = function(config) {
	
	var paper = this;
	var cdata = config.data || [];
	
	var height = config.dist_height || 300;
	var width = config.dist_width || 540;
	var x = config.left_paper;
	var y = config.top_paper;
	var xe = x + width;
	var ye = y + height;
	//
	var x_pad = 20;
	var y_pad = 10;
	//
	var keyPoints = [];
	
	//
	refresh(cdata);
	
	// 
	function refresh(data){
		// 清空旧有的元素
		paper.clear();
		//
		keyPoints = _fnCalcKeyPoints(data);
	    // 画底部的一条横线, 这条线固定
	    drawBottomLine();
	    // 画竖线
	    drawVerticalLine(data);
	    // 画曲线
	    drawNormalDistLine(data); 
	    // 画比例
	    drawPercentage(data); 
	    // 画人数
	    drawPersonNumber(data); 
	    // 绘制或更新底部的拖动标尺
		loadSizeBar(data);
		
	};
    
    // 画底部的一条横线, 这条线固定
    function drawBottomLine(){
	    //
	    paper.path(["M", x, ye, "L", xe, ye]).attr({stroke: "#000" || Raphael.getColor(), "stroke-width": 2, "stroke-linecap": "round"});
    };
    
    // 画竖线
    function drawVerticalLine(data){
	    var lls = generateVLines(data);
	    var color = "#111" || Raphael.getColor();
	    var line_width = 0.4;
	    // 
	    for(var i=0; i < lls.length; i++){
	    	//
	    	var ll = lls[i];
	    	//
	        var c = paper.path(ll).attr({stroke: color || Raphael.getColor(), "stroke-width": line_width, "stroke-linecap": "round"});
	    }
    };
    
    function drawPercentage(data){
    	//
    	var len = data.length;
    	//   每段的长
    	var pw = (width - 2 * x_pad)/ len;
    	// 总长
    	var total = calTotal(data);
    	//
    	var fontsize = 12;
    	//
	    for(var i=0; i < len; i++){
	    	//
	    	var di = data[i];
	    	var info = di["info"];
	    	var value = di["value"];
	    	//
	    	var percent = calPercent(value, total);
			var text = percent + "%";
	    	//
	    	var px =  x + x_pad + i * pw + pw/2;
	    	var py = ye - fontsize/2 - 4;
			//
			var textEl = paper.text(px, py, text);
			textEl.attr({
				"font-size" : fontsize,
				"cursor" : "default"
			});
			// 
			unselect(textEl);
	    }
    };
    function drawPersonNumber(data){
    	//
    	var len = data.length;
    	//   每段的长
    	var pw = (width - 2 * x_pad)/ len;
    	// 总长
    	var total = calTotal(data);
    	//
    	var fontsize = 12;
    	//
	    for(var i=0; i < len; i++){
	    	//
	    	var di = data[i];
	    	var info = di["info"];
	    	var value = di["value"];
	    	//
	    	var percent = calPercent(value, total);
			var text = info + "(" + value + "人)";
	    	//
	    	var px =  x + x_pad + i * pw + pw/2;
	    	var py = ye + fontsize*3/2 - 4;
			//
			var textEl = paper.text(px, py, text);
			textEl.attr({
				"font-size" : fontsize,
				"cursor" : "default"
			});
			// 
			unselect(textEl);
	    }
    };
    
    function unselect(textEl){
			// 
			var tstyle = textEl.node.style;
			tstyle.unselectable = "on";
			tstyle.MozUserSelect = "none";
			tstyle.WebkitUserSelect = "none";
    };
    
    function calPercent(value, total){
    	//var percent = (100 * value/total).toFixed(1);
    	var percent = Math.floor(100 * value/total);
	    return percent;
    };
    function calTotal(data){
    	var len = data.length;
    	var total = 0;
	    for(var i=0; i < len; i++){
	    	//
	    	var di = data[i];
	    	var value = di["value"] || 0;
	    	total += value;
	    }
	    return total;
    };
    
    // 画曲线
    function drawNormalDistLine(data){
	    //
	    var pps = [];//generatePoints();
    	//
    	var color = "hsb(.6, .75, .75)";
	    // 画曲线
	    for(var i=0; i < pps.length; i++){
	    	//
	    	var ps = pps[i];
	        //var c = paper.path(ps).attr({stroke: color || Raphael.getColor(), "stroke-width": 4, "stroke-linecap": "round"});
	    }
	    //
    	var vpoints = calVLinePoints(data);
    	var p0 = {
    		x : 0,
    		y : y_pad
    	};
    	var pn = {
    		x : width ,
    		y : y_pad
    	};
    	//
    	var allPoints = [];
    	allPoints.push(p0);
    	//
    	var kpoints = [].concat(keyPoints);
	    for(var ki=0; ki < kpoints.length; ki++){
	    	//
	    	var kp = kpoints[ki];
	    	//
	    	kp.x = kp.x + x_pad;
	    	//
	    }
    	
    	
    	allPoints = allPoints.concat(kpoints);
    	allPoints = allPoints.concat(vpoints);
    	//
    	allPoints.push(pn);
    	// 快速排序
    	allPoints = quickSort(allPoints);
    	
    	//
	    var cp = [];
	    // 根据关键点绘制贝塞尔曲线
	    //
	    var newPoints = [];
	    
	    for(var ai = 0; ai < allPoints.length; ai++){
	    	var ap = allPoints[ai];
	    	//
	    	if(!ap){
	    		continue;
	    	}
	    	if(!ap.x && !ap.y){
	    	} else {
	    		
	    		ap.y = Math.floor(ap.y);
	    		newPoints.push(ap);
	    	}
	    }
	    allPoints = newPoints;
	    //
	    var path2Str = "";
    	
	    // 根据关键点绘制贝塞尔曲线
	    for(var ai = 0; ai < allPoints.length; ai++){ 
	    	var ap = allPoints[ai];
	    	//
	    	if(!ap){
	    		continue;
	    	}
	    	if(!ap.x && !ap.y){
	    		continue;
	    	}
	    	
	    	var ax = ap.x + x;
	    	var ay = height - ap.y + y;
	    	//
	    	if(allPoints.length -1 == ai){
	    		debug(ax,ay);
	    		//ay -= 2;
	    		path2Str += "M"+ (ax -x_pad) + ","+ (ay -2);
	    		path2Str += " S"+ (ax) + ","+ay + ","+ (ax+1) + ","+ (ay+1);
	    		continue;
	    	}
	    	//
	    	if(0 == ai){
	    		// https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths
	    		//cp.push('M', ax, ay, 'S');
	    		cp.push('M', ax, ay, 'T');
	    		//cp.push('M', ax, ay, 'L');
	    	} else {
	    		cp.push(ax, ay);
	    	}
	    	
	    }
	    // 补丁
	    //cp.push(ax+10, ay);
    	
	    //
	    var path = paper.path(cp.join(','));
	    var path2 = paper.path(path2Str);
	    path.attr({stroke: color || Raphael.getColor(), "stroke-width": 3, "stroke-linecap": "round"});
	    path2.attr({stroke: color || Raphael.getColor(), "stroke-width": 3, "stroke-linecap": "round"});
	    
    };
    //
    
	//
	function quickSort(arr) {
	  if (arr.length <= 1) { return arr; }
	  var pivotIndex = Math.floor(arr.length / 2);
	  var pivot = arr.splice(pivotIndex, 1)[0];
	  var left = [];
	  var right = [];
	  for (var i = 0; i < arr.length; i++){
	    if (arr[i].x < pivot.x) {
	      left.push(arr[i]);
	    } else {
	      right.push(arr[i]);
	    }
	  }
	  return quickSort(left).concat([pivot], quickSort(right));
	};
    
    //
    function generatePoints(){
    	//
    	var points = [];
    	//
    	var sum = 100;
		
    	for(var i = 0; i < sum; i++){
    		//
    		var pn = calDistLinePath(i, sum);
    		//
    		points.push(pn);
    	}
    	//
    	return points;
    };
    
    function calDistLinePath(i, sum){
    	//
    	var pk1 = calPoint(i, sum);
    	var pk2 = calPoint(i + 1, sum);
    	
    	//
    	var p1 = ["M", pk1.x, pk1.y];
		//
		var p2 = ["S", pk1.x, pk1.y, pk2.x, pk2.y];
		
		//
    	var distP = [p1, p2];
    	//
    	return distP;
    };
    //
    function generateVLines(data){
    	
    	var lines = [];
		
    	var vps = calVLinePoints(data);
    	
    	for(var i = 0; i < vps.length; i++){
    		//
    		var vp = vps[i];
    		var pk1 = {
    			x: vp.x + x 
    			,
    			y : height + y - vp.y
    		};
    		//
	    	var pk2 = {x: pk1.x, y : ye};
	    	
	    	// 路径
	    	var line = ["M", pk1.x, pk1.y ,
			    "L", pk2.x, pk2.y
			    ];
    		//
    		lines.push(line);
    	}
    	//
    	return lines;
    };
    function calVLinePoints(data){
    	
    	var vpoints = [];
    	//
    	var p0 = {
    		x : -2.5 * x_pad,
    		y : y_pad
    	};
    	var pn = {
    		x : width + x_pad/2,
    		y : y_pad
    	};
    	//
    	var tempPoints = [];
    	tempPoints.push(p0);
    	tempPoints = tempPoints.concat(keyPoints);
    	tempPoints.push(pn);
    	//
    	for(var i = 0; i <= tempPoints.length; i++){
    		//
    		if(0 == i || i == tempPoints.length){
    			continue;
    		}
    		//
    		var tp1 = tempPoints[i-1];
    		var tp2 = tempPoints[i];
    		if(!tp1 || !tp2){
    			continue;
    		}
    		//
    		if(tp1.x > tp2.x){
    			continue;
    		}
    		//
    		var tx = (tp1.x + tp2.x)/2 + x_pad;
    		//
    		var xy = 1 || ((tp1.x + tp2.x)/2 ) / ((tp1.x + tp2.x)/2 + x_pad/2);
    		var ty = (tp1.y + tp2.y)/2 * (xy || 1);
    		
    		// 补丁-处理第一个点,最后一个点
    		if(1 == i){
    			ty = tp1.y +2;
    		}
    		if(tempPoints.length-1 == i){
    			ty = tp2.y +2;
    		}
    		//
    		var t = {
    			x : tx,
    			y : ty
    		};
    		//
    		vpoints.push(t);
    	}
    	//
    	//
    	return vpoints;
    };
    //
    // {width : 宽, height : "总的高度", i : "第几个点", sum 总的点数}
    function calLine(i, sum){
    	//
    	var pk1 = calPoint(i, sum);
    	var pk2 = {x: pk1.x, y : ye};
    	
    	// 路径
    	var p1 = ["M", pk1.x, pk1.y ,
		    "L", pk2.x, pk2.y
		    ];
		//
    	return p1;
    };
    // {width : 宽, height : "总的高度", i : "第几个点", sum 总的点数}
    function calPoint(i, sum){
    	// 计算
    	var w = width - 2 * x_pad;
    	var h = height;
    	//
    	var dp = fnDistrinbutionXY(i, sum, w, h, keyPoints);
    	//
    	var x1 = x_pad + dp.x;
    	var y1 =  y_pad + dp.y;
    	//
    	var pk1 = {x: x + x1, y : ye - y1};
    	//
    	return pk1;
    };
    
	// 这个应该接收2个参数, xx 与 width; 方便偏移
    // 算比例
    function fnDistrinbutionXY(n, sum, w, h, keyPoints){
    	//
    	var PI = Math.PI;
    	var sx = w / keyPoints.length; // 每段的x长度
    	var x1 = w * n / sum; // 改点的 x 位置
    	
    	// 算出前后关键点
    	var preP = null;
    	var postP = null;
    	var postI = 0;
	    // 
	    for(var i=0; i < keyPoints.length; i++){
	    	//
	    	var kp = keyPoints[i] || {};
	    	//
	    	var kx = kp.x;
	    	var ky = kp.y;
	    	//
	    	if(x1 <= kx){
	    		postP = kp; // 后一个点
	    		postI = i;
	    		//
	    		if(i > 0){
	    			preP = keyPoints[i - 1]; // 前一个点
	    		}
	    		//
	    		break;
	    	} else if(i +1 == keyPoints.length){
	    		// 最后一个点
	    		preP = kp;
	    	}
	    }
	    //
	    var prex = preP ? preP.x : 0;
	    var prey = preP ? preP.y : 0;
	    var postx = postP ? postP.x : w;
	    var posty = postP ? postP.y : 0;
	    //
	    
	    //var sx = postx - prex;
	    var sy = (posty - prey); // 两个关键点的y差值
	    //
	    var dx = x1 - prex; // 此点的距离
	    //
	    //
	    var dbx = (dx / sx); // x 步移
	    var dby = dbx * sy;
	    
    	var y1 = prey + dby ;
    	
    	
	    
    	var res = Math.sin(PI*n/sum);
    	//
    	res = (res ).toFixed(3);
    	y1 += calcWeiTiao();
    	
    	// 加上微调
    	function calcWeiTiao(){
    		//
    		var weitiao = 0;
    		//
    		return weitiao;
    	};
    	//
    	//
    	var p1 = {
    		x : x1,
    		y : y1
    	};
    	//
    	return p1;
    };
    //
    // 计算关键点
    function _fnCalcKeyPoints(datas){
    	var keyPoints = [];
    	//
    	if(!datas || !datas.length){ return keyPoints;}
    	//
    	var sum = 0;
    	var square_sum = 0;
	    // 
	    for(var i=0; i < datas.length; i++){
	    	//
	    	var d = datas[i] || {};
	    	//
	    	var color = d.color;
			var id = d.id;
			var info = d.info;
			var value = d.value || 0;
			// 计算总值
			sum += value;
			square_sum += value*value;
	    }
    	var sum_2 = sum*sum;
	    
	    // 
	    for(var i=0; i < datas.length; i++){
	    	//
	    	var d = datas[i] || {};
	    	//
	    	var color = d.color;
			var id = d.id;
			var info = d.info;
			var value = d.value || 0;
			if(value < 1){
				value = 1;
			}
			// 百分比
			var sz = 100 * value / sum;
			//
			var ylen = height * sz/100;
				ylen = ylen * Math.sqrt(2);
			var xd = (width - 2 * x_pad) * (i + 0.5)/datas.length ; // i+半个
			
			//
			var kpoint = {
				size : sz,
				info : info,
				value: value,
				y : Math.floor(ylen) ,
				x : Math.floor(xd)
			};
			//
			keyPoints.push(kpoint);
	    }
    	//
    	return keyPoints;
    };
    
    // 创建进度条
	function loadSizeBar(data) {
        //
        var barMarginY = 80;
        var barX = x;
        var barY = y + height + barMarginY;
        var barWidth = width ;
        var barHeight = 10;
        //
        var param = {
            	x : barX
            	, y : barY
            	, width : barWidth
            	, height : barHeight
            	, data : data
            	, paper : paper
            	, onchange : function(ndata){
            		//
            		config.onchange && config.onchange(ndata);
            		//
            		refresh(ndata);
            	}
            	, beforechange : config.beforechange
        };
        var sbar = Raphael.sizebar(param);
	};
	
};
