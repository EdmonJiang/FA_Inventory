$(function(){
    var objQuery ={
		company: {
				q:"department=&Vendor=&OS=&CPU=&RAM=&group=company&group=&company=",
				type: drawDonut2D
			},
		os:{
			q:"department=&Vendor=&OS=&CPU=&RAM=&group=OS&group=&company=",
			type: drawBar2D
		},
		ram:{
			q:"department=&Vendor=&OS=&CPU=&RAM=&group=RAM&group=&company=",
			type: drawColumn2D
		},
		model:{
			q:"department=&Vendor=&OS=&CPU=&RAM=&group=Model&group=&group=&company=",
			type: drawMultiColum2D
		},
		cpu:{
			q:"department=&Vendor=&OS=&CPU=&RAM=&group=CPU&group=&group=&company=",
			type: drawBar2DTop
		}
	}
	ajaxData(objQuery.company.q, objQuery.company.type);

	$('#select-chart').change(function(){
		var objQ = objQuery[$(this).val()];
		ajaxData(objQ.q+$('#company-chart').val(), objQ.type);
	})
	$('#company-chart').change(function(){
		var objQ = objQuery[$('#select-chart').val()];
		ajaxData(objQ.q+$(this).val(), objQ.type);
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
	function showModal(req){
		$.post('/statistics/', req, function(res){
			$('#chart-table').html('');
            var data = JSON.parse(res);
            //console.log(data)
            if(Object.keys(data[0]._id).length === 0){
                return;
            }else{
				createTable($('#chart-table')[0], data);
				$('#chart-Modal').modal({keyboard: true});
            }
		})
	}
//company   
	function drawDonut2D(data){
		var chart = new iChart.Donut2D({
					render : 'canvasDiv',
					data: data,
					title : {
						text : 'Laptop Distribution of Companies',
						color : '#3e576f',
						offsety: -10
					},
					footnote : {
						text : 'Data from ACBSIT Nanjing',
						color : '#486c8f',
						fontsize : 11,
						padding : '0 38',
						offsetx: -50
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
//os
	function drawBar2D(data){

				new iChart.Bar2D({
						render : 'canvasDiv',
						data: data,
						title : 'Quantity between OSs',
						footnote : 'Data from ACBSIT Nanjing',
						width : 1400,
						height : 400,
						animation : true,//开启过渡动画
						animation_duration:800,//800ms完成动画
						coordinate:{
							width:740,
							height:380,
							scale:[{
									position:'bottom',	
									start_scale:0,
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
						},
						sub_option:{
							listeners:{
								/**
								 * r:iChart.Rectangle2D对象
								 * e:eventObject对象
								 * m:额外参数
								 */
								click:function(r,e,m){
									var q = "department=&Vendor=&OS="+r.get('name')+"&CPU=&RAM=&group=department&group=ComputerName&group=displayName&company="+$('#company-chart').val();
									$('#myModalLabel').text(r.get('name'));
									showModal(q);
									//alert(r.get('name')+' '+r.get('value'));
								}
							}
						}

				}).draw();

	}
//ram
	function drawColumn2D(data){
		
		data.sort(function(a,b){return parseInt(a.name) - parseInt(b.name)});
		var chart = new iChart.Column2D({
			render : 'canvasDiv',//渲染的Dom目标,canvasDiv为Dom的ID
			data: data,//绑定数据
			title : 'Quantity between RAMs',//设置标题
			footnote : {
						text : 'Data from ACBSIT Nanjing',
						color : '#486c8f',
						fontsize : 11,
						padding : '0 38',
						offsetx: 50,
					},
			width : 1400,//设置宽度，默认单位为px
			height : 400,//设置高度，默认单位为px
			animation : true,//开启过渡动画
			animation_duration:800,//800ms完成动画
			shadow:true,//激活阴影
			shadow_color:'#c7c7c7',//设置阴影颜色
			column_space: 10,
			column_width : 70,
			coordinate:{//配置自定义坐标轴
				scale:[{//配置自定义值轴
						position:'left',//配置左值轴	
						start_scale:0,//设置开始刻度为0
						scale_space:20,//设置刻度间距
						listeners:{//配置事件
						parseText:function(t,x,y){//设置解析值轴文本
							return {text:t+" pcs"}
						}
					}
				}]
			},
			sub_option:{
				listeners:{
					/**
					 * r:iChart.Rectangle2D对象
					 * e:eventObject对象
					 * m:额外参数
					 */
					click:function(r,e,m){
						var q = "department=&Vendor=&OS=&CPU=&RAM="+r.get('name')+"&group=department&group=ComputerName&group=displayName&company="+$('#company-chart').val();
						$('#myModalLabel').text(r.get('name'));
						showModal(q);
						//alert(r.get('name')+' '+r.get('value'));
					}
				}
			}
		});
		//调用绘图方法开始绘图
		chart.draw();

	}
//model
	function drawMultiColum2D(data){
		data.sort(function(a,b){return b.value - a.value});
		var chart = new iChart.Column2D({
				render : 'canvasDiv',
				data : data,
				title : {
					text : 'Quantity between Models',
					color : '#3e576f'
				},
				footnote : {
					text : 'Data from ACBSIT Nanjing',
					color : '#909090',
					fontsize : 11,
					offsety: -100,
					offsetx: -50
				},
				width : 1400,
				height : 650,
				offsety: -100,
				label : {
					fontsize:11,
					textAlign:'right',
					textBaseline:'middle',
					rotate:-45,
					color : '#666666'
				},
				tip:{
					enable:true,
					listeners:{
						 //tip:提示框对象、name:数据名称、value:数据值、text:当前文本、i:数据点的索引
						parseText:function(tip,name,value,text,i){
							//将数字进行百位格式化
							var f = new String(value);
							f = f.split("").reverse().join("").replace(/(\d{3})/g,"$1,").split("").reverse();
							if(f[0]==','){
								f.shift();
							}	
							f = f.join("");
							
							return name+"<br/>"+f+"pcs<br/>proportion of the total:<br/>"+(value/this.get('total') * 100).toFixed(2)+ '%';
						}
					}
				},
				animation : true,//开启过渡动画
				animation_duration:800,//800ms完成动画
				shadow : true,
				shadow_blur : 2,
				shadow_color : '#aaaaaa',
				shadow_offsetx : 1,
				shadow_offsety : 0,
				column_space: 5,
				column_width : 100,
				sub_option : {
					label : false,
					border : {
						width : 2,
						color : '#ffffff'
					},
					listeners:{
					/**
					 * r:iChart.Rectangle2D对象
					 * e:eventObject对象
					 * m:额外参数
					 */
					click:function(r,e,m){
						var q = "department=&Vendor=&OS=&CPU=&Model="+r.get('name')+"&group=department&group=ComputerName&group=displayName&company="+$('#company-chart').val();
						$('#myModalLabel').text(r.get('name'));
						showModal(q);
						//alert(r.get('name')+' '+r.get('value'));
					}
				}
				},
				coordinate : {
					background_color : null,
					grid_color : '#c0c0c0',
					width : 960,
					height:300,
					axis : {
						color : '#c0d0e0',
						width : [0, 0, 1, 0]
					},
					scale : [{
						position : 'left',
						start_scale : 0,
						scale_space : 5,
						scale_width: 9,
						scale_enable : false,
						label : {
							fontsize:11,
							color : '#666666'
						},
						listeners:{
							parseText:function(t,x,y){
								return {text:t}
							}
						 }
					}]
				}
			});
			
			//利用自定义组件构造左侧说明文本
			chart.plugin(new iChart.Custom({
					drawFn:function(){
						//计算位置
						var coo = chart.getCoordinate(),
							x = coo.get('originx'),
							y = coo.get('originy');
						//在左上侧的位置，渲染一个单位的文字
						chart.target.textAlign('start')
						.textBaseline('bottom')
						.textFont('600 11px Verdana')
						.fillText('Quantity(pcs)',x-40,y-10,false,'#6d869f');
						
					}
			}));
			
			chart.draw();
	}
//cpu
	function drawBar2DTop(data){
		data.sort(function(a,b){return b.value - a.value});
		data = data.slice(0,10);
		new iChart.Bar2D({
			render : 'canvasDiv',
			background_color : '#EEEEEE',
			data : data,
			title : 'CPU TOP10',
			footnote : 'Data from ACBSIT Nanjing',
			width : 1400,
			height : 450,
			coordinate : {
				width : 840,
				height : 360,
				axis : {
					width : [0, 0, 1, 1]
				},
				scale : [{
					position : 'bottom',
					start_scale : 0,
					scale_space : 2
				}]
			},
			animation : true,
			sub_option : {
				listeners : {
					parseText : function(r, t) {
						return t + " pcs";
					},
					click:function(r,e,m){
						var q = "department=&Vendor=&OS=&CPU="+r.get('name')+"&RAM=&group=department&group=ComputerName&group=displayName&company="+$('#company-chart').val();
						$('#myModalLabel').text(r.get('name'));
						showModal(q);
						//alert(r.get('name')+' '+r.get('value'));
					}
				},
			},
			legend : {
				enable : false
			}
		}).draw();

	}

    function getColor(){
        var arrColor = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
        var sColor = '#';
        [1,1,1].forEach(function(v,k){
            sColor += arrColor[parseInt(Math.random()*15)];
        })
        return sColor;
    }

});