(function ( $ ) {
    
    $.fn.table_download = function( options ) {
        var export_id = 0;
        var export_data_array = [];

        // define the default options
        var settings = $.extend({
            format: "csv",
            separator: ",",
            filename: "data",
            linkname: "Export",
            quotes: "\"",
            newline: "\r\n"
        }, options );        
        
        // generate the CSV dowload link(s)
        if (settings.format == "csv") {        
            return this.each(function() {
                export_id++;
                var csv = "\ufeff";
                // loop each row of the table
                $(this).find("tr").each(function () {
                    // loop each td cell of the row
                    if ($(this).find("td").length > 0) {
                        var sep = "";
                        $(this).find("td").each(function () {
                            csv += sep + settings.quotes + $(this).text() + settings.quotes;
                            sep = settings.separator;
                        });
                        csv += settings.newline;                
                    }
                    // loop each th cell of the row
                    else if ($(this).find("th").length > 0) {
                        var sep = "";
                        $(this).find("th").each(function () {
                            csv += sep + settings.quotes + $(this).text() + settings.quotes;
                            sep = settings.separator;
                        });
                        csv += settings.newline;                
                    }                          
                });


                window.URL = window.URL || window.webkiURL;
                // create the blob
                var blob = new Blob([csv]);
                // create the URL
                var blobURL = window.URL.createObjectURL(blob);        

                fileName = settings.filename+'.csv';
                // add the download link
                //$(this).append("<a class='table_download_csv_link' href='"+blobURL+"' download='"+fileName+"' export_id='"+export_id+"'>"+settings.linkname+"</a>");
				a = document.createElement("a");
                a.download = fileName;
                a.href = blobURL;

                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
				
                // add the event listener for IE blob download
                if (window.navigator.msSaveOrOpenBlob) {
                    var fileData = [csv];
                    blobObject = new Blob(fileData);
                    export_data_array.push ({export_id: export_id, file_name: fileName, blob_object: blobObject});
                    $(this).find('.table_download_csv_link').click(function(){
                        console.log(export_data_array);
                        var export_id = $(this).attr("export_id");
                        for (var i=0; i < export_data_array.length ; i++) {
                            if (export_data_array[i].export_id == export_id) {
                                window.navigator.msSaveOrOpenBlob(export_data_array[i].blob_object, export_data_array[i].file_name);
                            }
                        }
                    });
                }                  
            });        
        }
               
    };
 
}( jQuery ));
