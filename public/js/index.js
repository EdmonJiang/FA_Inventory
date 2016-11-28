$(function(){
      var txtSearch = $('#txtSearch');
      txtSearch.focus();
      txtSearch.val(txtSearch.val());
      $('a.servicetag').click(function(event){
        event.preventDefault();
        event.stopPropagation();
        var that = this;
        var sn = $(this).text();
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
            $(that).prop('title','that brand is not DELL');
            $(that).tooltip();
            $(that).mouseenter();
        }
      })

      $('a.samaccount').click(function(event){
        event.preventDefault();
        event.stopPropagation();
        var that = this;
        var gad = $(this).text();
          $.getJSON( "http://nanjingit.apac.group.atlascopco.com/?name="+gad)
          .done(function(data) {
            if($.isPlainObject(data) && !$.isEmptyObject(data)){
              if(data.error){
                $(that).prop('title', data.error);
                $(that).tooltip();
                $(that).mouseenter();
                return;
              }else{
                $('#sn-table').html('');
                var keys = Object.keys(data);

                keys.forEach(function(item) {
                  $('#sn-table').append("<tr><th>"+item+"</th><td style='word-break: break-all;'>"+data[item]+"</td></tr>")
                })
                $('#myModalLabel').text('AD Details - '+gad);
                $('#SN-Modal').modal({keyboard: true});
                return;
              }
            }else{
                $(that).prop('title', 'No information found.');
              $(that).tooltip();
              $(that).mouseenter();
                return;
            }
          }).fail(function(jqxhr, testStatus, error) {
            $(that).prop('title', error);
              $(that).tooltip();
              $(that).mouseenter();
              return;
          });
      })
    });
   
function onSearch(){
    var keyword = $('#txtSearch').val().trim();
    //console.log(keyword);
    if(keyword===''){
    //$('#txtSearch').removeAttr('name');
    window.location.href = '/';
    return false;
    };
    return true;
}