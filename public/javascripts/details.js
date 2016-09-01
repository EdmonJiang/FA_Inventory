$(function(){
    var oldAsset = '';
    var oldAcces = '';
    var oldWarranty = '';
    var oldRemark = '';
    
    $('#btn-edit').on('click', function(){
        
        if($('#btn-edit').text()==='Edit'){
            $('tr').each(function(value,item){
                if($(item).find('th').text()==='FixedAssetNO')
                {
                    elem = $(item).find('td');
                    elem.attr('id','td-asset');
                    oldAsset = elem.text();
                    elem.html('<input id="text-asset" style="width:500px;height:32px;font-size:16px;" type="text" value="'+oldAsset+'" />')

                }else if($(item).find('th').text()==='Accessories'){

                    elem = $(item).find('td');
                    elem.attr('id','td-acces');
                    oldAcces = elem.text();
                    elem.html('<input id="text-acces" style="width:500px;height:32px;font-size:16px;" type="text" value="'+oldAcces+'" />')
                }else if($(item).find('th').text()==='warranty'){

                    elem = $(item).find('td');
                    elem.attr('id','td-warranty');
                    oldWarranty = elem.text();
                    elem.html('<input id="text-warranty" style="width:500px;height:32px;font-size:16px;" type="date" value="'+oldWarranty+'" />')
                }else if($(item).find('th').text()==='remark'){

                    elem = $(item).find('td');
                    elem.attr('id','td-remark');
                    oldRemark = elem.text();
                    elem.html('<input id="text-remark" style="width:500px;height:32px;font-size:16px;" type="text" value="'+oldRemark+'" />')
                }
                $('#btn-edit').text('Cancel');
            })

            $(this).after('&nbsp;&nbsp;<button id="btn-save" class="btn btn-success btn-size" onclick="updateInfo()">Save</button>');

        }else{
            $('#btn-edit').text('Edit');
            $('#td-asset').html(oldAsset);
            $('#td-acces').html(oldAcces);
            $('#td-warranty').html(oldWarranty);
            $('#td-remark').html(oldRemark);
            $('#btn-save').remove();
        }
        
    });

    function updateInfo(){
        // alert(window.location.pathname);
        var data = {};
        var newAsset = $('#text-asset').val();
        var newAcces = $('#text-acces').val();
        var newWarranty = $('#text-warranty').val();
        var newRemark = $('#text-remark').val();
        if(newAsset !== oldAsset){
            data.FixedAssetNO = newAsset;
        }
        if(newAcces !== oldAcces){
            data.Accessories = newAcces;
        }
        if(newWarranty !== oldWarranty){
            data.warranty = newWarranty;
        }
        if(newRemark !== oldRemark){
            data.remark = newRemark;
        }
        //console.log(data);
        if($.isEmptyObject(data)){
            //console.log('there is no data, return false ----------');
            $('#td-asset').html(oldAsset);
            $('#td-acces').html(oldAcces);
            $('#td-warranty').html(oldWarranty);
            $('#td-remark').html(oldRemark);
            $('#btn-edit').text('Edit');
            $('#btn-save').remove();
        }else{
            
            //console.log('there is some data, return true ------------');            
            //data.updated = new Date;
            $.post(window.location.pathname, data, function(res){
                //console.log(res);
                if(res === 'successful'){
                    $('#td-asset').html(newAsset);
                    $('#td-acces').html(newAcces);
                    $('#td-warranty').html(newWarranty);
                    $('#td-remark').html(newRemark);
                    $('#btn-edit').text('Edit');
                    $('#btn-save').remove();
                    $('#edit-success').css({
                       'position': 'fixed',
                        'bottom': "300px",
                        'left': (window.screen.width - 300)/2+"px",
                        'font-size': '3em',
                        'padding': '50px' 
                    }).fadeIn('fast', function(){
                        $(this).delay(1000).fadeOut('slow');
                    })
                }else{
                    $('#edit-failed').css({
                       'position': 'fixed',
                        'bottom': "300px",
                        'left': (window.screen.width - 300)/2+"px",
                        'font-size': '3em',
                        'padding': '50px' 
                    }).fadeIn('fast', function(){
                        $(this).delay(1000).fadeOut('slow');
                    })
                }
            })
        }  
    }

    window.updateInfo = updateInfo;
});