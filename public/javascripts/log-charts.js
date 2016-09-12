$(function(){

    var btnrefresh = $('#refresh-log').click(function(){
        $('#log-list').html('');
        $.post('/logs/', function(data){
            //console.log(data);
            if(data){
                createTable($('#log-list')[0], data, addIcon);
                $('#log-count').text(data.length);
                //drawChart(data);
                //$("#log-list").append('<a name="1" href="#1"></a>').find("a")[0].click();
            }else{
                return;
            }
        })
    })

    btnrefresh.click();

    function addIcon(tbl_body){
        var trs = tbl_body.getElementsByTagName("tr");
        for(var i=0,len=trs.length;i<len;i++){
            var tdAction = trs[i].getElementsByTagName("td")[4],
                tdPC = trs[i].getElementsByTagName("td")[1];
            switch(tdAction.textContent){
                case "add":
                    tdPC.innerHTML = '<a href="/details/'+tdPC.innerText+'" target="_blank">'+tdPC.innerText+'</a>';
                    tdAction.innerHTML = '<span class="glyphicon glyphicon-ok text-success"></span>';
                    break;
                case "update":
                    tdPC.innerHTML = '<a href="/details/'+tdPC.innerText+'" target="_blank">'+tdPC.innerText+'</a>';
                    tdAction.innerHTML = '<span class="glyphicon glyphicon-refresh text-warning"></span>';
                    break;
                case "delete":
                    tdAction.innerHTML = '<span class="glyphicon glyphicon-remove text-danger"></span>';
                    break;
            }
        }
    }
    function dateArray(){
        var myDate = new Date(); //获取今天日期
        myDate.setDate(myDate.getDate() - 6);
        var dArray = []; 

        for (var i = 0; i < 7; i++) {
            dArray.push((myDate.getMonth()+1)+"-"+myDate.getDate());
            myDate.setDate(myDate.getDate() + 1);
        }
        return dArray;
    }
    drawChart(groupLog);
    function drawChart(data){
        if(data){
            var arrAdd = (new Array(7)).fill(0),
                arrDelete = (new Array(7)).fill(0),
                arrUpdate = (new Array(7)).fill(0),
                xArray = dateArray();

            data.forEach(function(item) {
                switch(item._id.action){
                    case "add":
                        arrAdd[xArray.indexOf(item._id.month+"-"+item._id.day)] = item.total;
                        break;
                    case "delete":
                        arrDelete[xArray.indexOf(item._id.month+"-"+item._id.day)] = item.total;
                        break;
                    case "update":
                        arrUpdate[xArray.indexOf(item._id.month+"-"+item._id.day)] = item.total;
                        break;
                }
            })
            
        }else{
            return;
        }

        // var adds = logs.map(function(item){
        //     return item.
        // })
    // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init($('#chart')[0]);
        
        // var yseries = data.map(function(item){
        //     return item.total
        // })
        // 指定图表的配置项和数据
        var option = {
            title: {
                text: 'The lastest week\'s logs'
            },
            tooltip: {},
            legend: {
                data:['add','update','delete']
            },
            xAxis: {
                data: xArray //["Mon","Tue","Wen","Thu","Fri","Sat"]
            },
            yAxis: {},
            color: ["#75b15d","#ffa500","#e21010"],
            series: [{
                name: 'add',
                type: 'bar',
                stack: 'total',
                data: arrAdd //[5, 20, 36, 10, 10, 20]
            },
            {
                name: 'update',
                type: 'bar',
                stack: 'total',
                data: arrUpdate //[15, 10, 26, 40, 60, 30]
            },
            {
                name: 'delete',
                type: 'bar',
                stack: 'total',
                data: arrDelete //[1, 2, 6, 5, 10, 12]
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }

})