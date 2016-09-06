function createTable(divTable, data){

        if(data.length>0){
            //data.sort(function(a,b){return a.total - b.total});
            var tbl_head = document.createElement('thead');
            var tbl_body = document.createElement('tbody');
            var tbl_row = tbl_head.insertRow();
            var isCount = false;

            Object.keys(data[0]._id).forEach(function(v){
                var cell_head = document.createElement('th');
                cell_head.appendChild(document.createTextNode(v));
                tbl_row.appendChild(cell_head);
            })

            if(data[0].total){
                var cell_head = document.createElement('th');
                cell_head.appendChild(document.createTextNode('total'));
                tbl_row.appendChild(cell_head);
                isCount = true;
            }
            tbl_head.appendChild(tbl_row);

            $.each(data, function(index, v){
                var tbl_row = tbl_body.insertRow();
                
                Object.keys(v._id).forEach(function(value){
                    var cell = tbl_row.insertCell();
                    cell.appendChild(document.createTextNode(v._id[value]));
                })
                if(isCount){
                    var cell = tbl_row.insertCell();
                    cell.appendChild(document.createTextNode(v.total));
                }
            })

            divTable.appendChild(tbl_head);
            divTable.appendChild(tbl_body);
        }
}