$(function(){
    $('#btn-filter').on('click',function(){

        $.post(window.location.pathname, $('#filter-form').serialize(), function(res){
            $('#results-table').html('');
            if(res){
                var data = JSON.parse(res);
            }else{
                $('#results-count').text(0);
                return;
            }
            //console.log(data)
            if(Object.keys(data[0]._id).length === 0){
                $('#results-count').text(0);
                $('#export2excel').hide();
                return;
            }else{
                $('#results-count').text(data.length);
            }
             
            if(data.length>0){
                
                data.sort(function(a,b){return a.total - b.total});
                createTable($('#results-table')[0], data);

                $('#results-table thead th:last')
                    .css({"cursor":"pointer"})
                    .html('<span id="sort-arrow" class="glyphicon glyphicon-arrow-up"></span>total')
                    .on('click', function(){
                        $('#results-table tbody').html($('#results-table tbody tr').toArray().reverse());
                        if($('#sort-arrow').hasClass('glyphicon-arrow-up')){
                            $('#sort-arrow').removeClass('glyphicon-arrow-up').addClass('glyphicon-arrow-down');
                        }else{
                            $('#sort-arrow').removeClass('glyphicon-arrow-down').addClass('glyphicon-arrow-up');
                        }
                    });
                $('#export2excel').show();
                
            }
        })
    })

    $("#txt-search").keyup(function(e){
            var filtername = $(this).val();
            if( filtername != ""){
            $('table tbody tr').hide().filter(":contains('"+filtername+"')").show();
            }else{
            $('table#results-table tbody tr').show();
        }
    })

    $('#export2excel').on('click', function(){

        $( "#results-table" ).table_download({
            format: "csv",
            separator: ",",
            filename: "results",
            linkname: "Export CSV",
            quotes: "\""
        });
    })
})