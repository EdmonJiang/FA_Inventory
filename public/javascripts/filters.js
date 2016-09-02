$(function(){
    $('#btn-filter').on('click',function(){

        $.post(window.location.pathname, $('#filter-form').serialize(), function(res){
            $('#results-table').text(res);
        })
    })
})