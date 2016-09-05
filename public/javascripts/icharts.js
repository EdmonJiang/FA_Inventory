$(function(){
    var objQuery ={
		company: {
				q:"company=&department=&Vendor=&OS=&CPU=&RAM=&group=company&group=&limit=&count=on",
				type: drawDonut2D
			},
		os:{
			q:"company=&department=&Vendor=&OS=&CPU=&RAM=&group=OS&group=&limit=&count=on",
			type: drawBar2D
		},
		ram:{
			q:"company=&department=&Vendor=&OS=&CPU=&RAM=&group=RAM&group=&limit=&count=on",
			type: drawColumn2D
		}
	}
	ajaxData(objQuery.company.q, objQuery.company.type);

	$('#select-chart').change(function(){
		var objQ = objQuery[$(this).val()];
		ajaxData(objQ.q, objQ.type);
	})

	function ajaxData(req, fnDraw){
		$.post('/statistics/', req, function(res){
			var response = JSON.parse(res);
			var data = [];
			response.forEach(function(item){
				var oitem = {
					name: item._id[Object.keys(item._id)[0]],
					value: item.total,
					color: getColor()
				}
				//console.log(oitem)
				data.push(oitem);
			})
			fnDraw(data);
    	})
	}
    
	function drawDonut2D(data){
		var chart = new iChart.Donut2D({
					render : 'canvasDiv',
					data: data,
					title : {
						text : 'Laptop Distribution of Companies',
						color : '#3e576f',
						offsety: -15
					},
					footnote : {
						text : 'Data from ACBSIT Nanjing',
						color : '#486c8f',
						fontsize : 11,
						padding : '0 38'
					},
					center : {
						text:'100%',
						color:'#3e576f',
						shadow:true,
						shadow_blur : 2,
						shadow_color : '#557797',
						shadow_offsetx : 0,
						shadow_offsety : 0,
						fontsize : 40
					},
					sub_option : {
						label : {
							background_color:null,
							sign:false,//设置禁用label的小图标
							padding:'0 4',
							border:{
								enable:false,
								color:'#666666'
							},
							fontsize:11,
							fontweight:600,
							color : '#4572a7'
						},
						border : {
							width : 2,
							color : '#ffffff'
						}
					},
					shadow : true,
					shadow_blur : 6,
					shadow_color : '#aaaaaa',
					shadow_offsetx : 0,
					shadow_offsety : 0,
					background_color:'#fefefe',
					offset_angle:-120,//逆时针偏移120度
					showpercent:true,
					decimalsnum:2,
					width : 1400,
					height : 400,
					radius:120
				});
				
				chart.draw();
	}

	function drawBar2D(data){

				new iChart.Bar2D({
						render : 'canvasDiv',
						data: data,
						title : 'Quantity between OSs',
						footnote : 'Data from ACBSIT Nanjing',
						width : 1400,
						height : 400,
						coordinate:{
							width:640,
							height:280,
							scale:[{
									position:'bottom',	
									start_scale:0,
									end_scale:100,
									scale_space:40,
									listeners:{
									parseText:function(t,x,y){
										return {text:t+" pcs"}
									}
									}
							}]
						},
						rectangle:{
							listeners:{
								drawText:function(r,t){
									return t+"%";
								}
							}
						}
				}).draw();

	}

	function drawColumn2D(data){
		
		data = sortRAM(data);
		var chart = new iChart.Column2D({
			render : 'canvasDiv',//渲染的Dom目标,canvasDiv为Dom的ID
			data: data,//绑定数据
			title : 'Quantity between RAMs',//设置标题
			width : 1400,//设置宽度，默认单位为px
			height : 400,//设置高度，默认单位为px
			shadow:true,//激活阴影
			shadow_color:'#c7c7c7',//设置阴影颜色
			coordinate:{//配置自定义坐标轴
				scale:[{//配置自定义值轴
						position:'left',//配置左值轴	
						start_scale:0,//设置开始刻度为0
						end_scale:26,//设置结束刻度为26
						scale_space:20,//设置刻度间距
						listeners:{//配置事件
						parseText:function(t,x,y){//设置解析值轴文本
							return {text:t+" pcs"}
						}
					}
				}]
			}
		});
		//调用绘图方法开始绘图
		chart.draw();

	}
    function getColor(){
        var arrColor = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
        var sColor = '#';
        [1,1,1].forEach(function(v,k){
            sColor += arrColor[parseInt(Math.random()*15)];
        })
        return sColor;
    }
	function sortRAM(data){
		var arr = data.map(function(value){return value.name})
		arr.sort(function(a,b){return parseInt(a)>parseInt(b)?1:-1})
		newData = arr.map(function(value){
			var newitem = {};
			data.forEach(
				function(item){
					//console.log('item.name: '+item.name+' value:'+value)
					if(item.name == value){
						newitem = item;
					}
				})
				return newitem;
			}
		)
		return newData;
	}
});