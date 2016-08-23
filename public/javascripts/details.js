$(function(){
    var oldAsset = '';
    var oldAcces = '';
    
    $('#btn-edit').on('click', function(){
        
        if($('#btn-edit').text()==='Edit'){
            $('tr').each(function(value,item){
                if($(item).find('th').text()==='FixedAssetNO')
                {
                    tdAsset = $(item).find('td');
                    tdAsset.attr('id','td-asset');
                    oldAsset = tdAsset.text();
                    tdAsset.html('<input id="text-asset" style="width:500px;height:32px;font-size:16px;" type="text" value="'+oldAsset+'" />')

                }else if($(item).find('th').text()==='Accessories'){

                    tdAcces = $(item).find('td');
                    tdAcces.attr('id','td-acces');
                    oldAcces = tdAcces.text();
                    tdAcces.html('<input id="text-acces" style="width:500px;height:32px;font-size:16px;" type="text" value="'+oldAcces+'" />')
                }
                $('#btn-edit').text('Cancel');
            })

            $(this).after('&nbsp;&nbsp;<button id="btn-save" class="btn btn-success btn-size" onclick="updateInfo()">Save</button>');

        }else{
            $('#btn-edit').text('Edit');
            $('#td-asset').html(oldAsset);
            $('#td-acces').html(oldAcces);
            $('#btn-save').remove();
        }
        
    });

    function updateInfo(){
        // alert(window.location.pathname);
        var data = {};
        var newAsset = $('#text-asset').val();
        var newAcces = $('#text-acces').val();
        if(newAsset !== oldAsset){
            data.FixedAssetNO = newAsset;
        }
        if(newAcces !== oldAcces){
            data.Accessories = newAcces;
        }
        console.log(data);
        if($.isEmptyObject(data)){
            console.log('there is no data, return false ----------');
            $('#td-asset').html(oldAsset);
            $('#td-acces').html(oldAcces);
            $('#btn-edit').text('Edit');
            $('#btn-save').remove();
        }else{
            
            console.log('there is some data, return true ------------');            
            data.updated = new Date;
            $.post(window.location.pathname, data, function(res){
                if(res === 'successful'){
                    $('#td-asset').html(newAsset);
                    $('#td-acces').html(newAcces);
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