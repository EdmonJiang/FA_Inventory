$(function(){

    $('#refresh-log').click(function(){
        $('#log-list').html('');
        $.post('/logs/', function(data){
            //console.log(data);
            if(data){
                createLogList(data);
            }else{
                return;
            }
        })
    })

    function createLogList(logs){

        var list = $('#log-list');

        for(var i=0,len=logs.length;i<len;i++){
            if(logs[i].operate === "add")
            {
                list.append("<li>"+logs[i].ComputerName</li>")
            }else if(logs[i].operate === "update")
            {

            }else if(logs[i].operate === "delete")
            {

            }
            
        }
    }
    // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init($('#chart')[0]);

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: 'The last three months\' logs'
            },
            tooltip: {},
            legend: {
                data:['add','update','delete']
            },
            xAxis: {
                data: ["Mon","Tue","Wen","Thu","Fri","Sat"]
            },
            yAxis: {},
            series: [{
                name: 'add',
                type: 'bar',
                stack: 'total',
                data: [5, 20, 36, 10, 10, 20]
            },
            {
                name: 'update',
                type: 'bar',
                stack: 'total',
                data: [15, 10, 26, 40, 60, 30]
            },
            {
                name: 'delete',
                type: 'bar',
                stack: 'total',
                data: [1, 2, 6, 5, 10, 12]
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
})