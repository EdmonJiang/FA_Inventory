$(function(){
        
    $.post('/statistics/', "company=&department=&Vendor=&OS=&CPU=&RAM=&group=company&group=&limit=&count=on", function(res){
        var response = JSON.parse(res);
        var data = [];
        response.forEach(function(item){
            var oitem = {
                name: item._id.company,
                value: item.total,
                color: getColor()
            }
            //console.log(oitem)
            data.push(oitem);
        })

        		var chart = new iChart.Donut2D({
					render : 'canvasDiv-company',
					data: data,
					title : {
						text : 'Laptop Distribution of Companies',
						color : '#3e576f',
						offsety: -15
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

    })

    function getColor(){
        var arrColor = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
        var sColor = '#';
        [1,1,1].forEach(function(v,k){
            sColor += arrColor[parseInt(Math.random()*15)];
        })
        return sColor;
    }

    // var data = [
    //             {name : 'Android',value : 52.5,color:'#4572a7'},
    //             {name : 'IOS',value : 34.3,color:'#aa4643'},
    //             {name : 'RIM',value : 8.4,color:'#89a54e'},
    //             {name : 'Microsoft',value : 3.6,color:'#80699b'},
    //             {name : 'Other',value : 1.2,color:'#3d96ae'}
    //         ];
});