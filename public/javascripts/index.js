$(function(){
      txtSearch = $('#txtSearch');
      txtSearch.focus();
      txtSearch.val(txtSearch.val());
      $('a.servicetag').click(function(event){
        event.preventDefault();
        event.stopPropagation();
        var that = this;
        sn = $(this).text();
        if(/^[0-9A-Z]{7}$/.test(sn)){
          $.post( "/servicetag/",{sn:sn}, function(data) {
            if(Array.isArray(data) && data.length>0){
              $('#sn-table').html('');
              createTable($('#sn-table')[0], data);
              $('#myModalLabel').text('Warranty Details - '+sn);
              $('#SN-Modal').modal({keyboard: true});
            }else if(data.error){
              $(that).prop('title', data.error);
              $(that).tooltip();
              $(that).mouseenter();
              return;
            }else{
                return;
            }
          });
        }else{
            $(this).prop('title','This brand is not DELL');
            $(this).tooltip();
            $(this).mouseenter();
        }
      })
    });
   
function onSearch(){
    keyword = $('#txtSearch').val().trim();
    console.log(keyword);
    if(keyword===''){
    //$('#txtSearch').removeAttr('name');
    window.location.href = '/';
    return false;
    };
    return true;
}