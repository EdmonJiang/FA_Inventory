$(function(){
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
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
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