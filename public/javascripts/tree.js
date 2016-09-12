	/* Constructor */
	function JSDragDropTree()
	{
		this.foldercloseImage = '/img/folder_close.gif';
		this.folderopenImage = '/img/folder_open.gif';
		this.plusImage = '/img/node_plus.gif';
		this.minusImage = '/img/node_minus.gif';
        this.q = {
            department: "department=&Vendor=&OS=&CPU=&RAM=&group=department&group=&group=&company=",
            displayName: "company=&Vendor=&OS=&CPU=&RAM=&group=displayName&group=&group=&department=",
            pcinfo: "company=&Vendor=&OS=&CPU=&RAM=&group=displayName&group=ComputerName&group=Model&group=SN&displayName="
        }
	}
	
	/* JSDragDropTree class */
	JSDragDropTree.prototype = {
        getList: function(q, pnode, attr,callback){
			$.ajax({
				type: "post",
				url: "/statistics/",
				data: q,
				async: false,
				success: function(data){
					//console.log(data);
                	if(data){
                    var list = data.map(function(item){
                        return item._id[attr];
                    })
					//console.log('list:'+ list);
                    callback(pnode, list, attr);
                }
				}
			})
        },
        createSubUl: function(parentNode, list, attr){
            var pNode = document.getElementById("parentNode");
            var ul = document.createElement('UL');
			var parentId = parseInt(parentNode.className.split('_').pop());
			ul.className = "ul_" + parentId;
            ul.style.display='block';
            $.each(list, function(index, v){
                var li = document.createElement("LI");
                li.className = "li_" + (parentId + 1);
				if(attr === "department"){
					var img1 = document.createElement('IMG');
					var img2 = document.createElement('IMG');
                	img1.src = '/img/node_plus.gif';
					img2.src = '/img/folder_close.gif';
				}
				else if(attr === "displayName")
				{
					var img2 = document.createElement('IMG');
                	img2.src = '/img/head.png';
				}
                var a = document.createElement('a');
				a.href = 'javascript:void(0)';
                a.innerText = v;
				if(img1){
                	li.appendChild(img1);
				}
                li.appendChild(img2);
                li.appendChild(a);
                ul.appendChild(li);
                parentNode.appendChild(ul);
            });
        },
		showInfo: function(q, table){
			$.post("/statistics/", q, function(res){
				//console.log(res);
				table.html("");
				res.forEach(function(item){
					Object.keys(item._id).forEach(function(title){
						table.append("<tr><th>"+title+"</th><td>"+item._id[title]+"</td></tr>");
					})
				})
				
			})
		},
	}

	$(function(){
      treeObj = new JSDragDropTree();

      $("#top_node").on("click", function(){
          $(this).nextAll().toggle();
          changeIcon(this, treeObj);
        });

      $(".li_2").on("click",(function(){
        treeObj.getList( treeObj.q.department+$(this).text(),
                        this,
                        "department",
                        treeObj.createSubUl
                        );
        $(this).find("img").first().attr('src', treeObj.minusImage)
                   .next().attr('src', treeObj.folderopenImage);
        $(this).unbind();
        
        $(this).find('a:first').on('click', function(){
          $(this).nextAll().toggle();
          changeIcon(this, treeObj);
        });
        //console.log($(this).find("ul li"))
        $(this).find(".li_3").on("click", function(){
          //console.log(treeObj.q.displayName+$(this).text())
          treeObj.getList( treeObj.q.displayName+$(this).text(),
                        this,
                        "displayName",
                        treeObj.createSubUl
                        );
          $(this).find("img").first().attr('src', treeObj.minusImage)
                   .next().attr('src', treeObj.folderopenImage);
          $(this).unbind();

          $(this).find('a:first').on('click', function(){
            $(this).nextAll().toggle();
            changeIcon(this, treeObj);
          });

          $(this).find(".li_4").on("click", function(){
            console.log($(this).text())
            treeObj.showInfo(treeObj.q.pcinfo+$(this).text(), $("#pcinfo-list"));
          });
        })

      }));
      
      function changeIcon(obj, imgObj){
          if($(obj).next()[0].style.display === "block"){
            $(obj).prev().attr('src', imgObj.folderopenImage)
                   .prev().attr('src', imgObj.minusImage);
          }else{
            $(obj).prev().attr('src', imgObj.foldercloseImage)
                   .prev().attr('src', imgObj.plusImage);
          }
      }

    })