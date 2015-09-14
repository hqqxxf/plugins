(function(){
    /**
     * Created by Administrator on 2015/8/21.
     */
    var imageStructure = (function(){
        var res = null;
        return {
            init: function(url){
                ajax(url);
            },
            setRes: function(res){
                this.res = res;
            },
            createImage: function(data, oDiv){
                var img = document.createElement('img');
                img.src = "data:image/png;base64," + data.screenshot;
                oDiv.appendChild(img);
                img.style.position = "absolute";
                img.style.top = 0;
                img.style.left = 0;
            },
            getImage: function(){
                var data = this.res.payload.activities[0],
                    objects = this.turnToObject(data.serialized_objects.objects),
                    rootId = data.serialized_objects.rootObject,
                    scale = data.scale,
                    root = this.getNode(objects,rootId);

                this.forEachNode(objects, root);
                console.log(root);
                console.log(data);
                var oDiv = document.createElement('div');
                oDiv.style.width = root.width * scale + 'px';
                oDiv.style.height = root.height * scale + 'px';
                oDiv.style.top = root.top * scale + 'px';
                oDiv.style.left = root.left * scale + 'px';
                oDiv.className = "root";
                this.createImage(data, oDiv);//将传过来的json生成一张图片
                this.createElement(root,oDiv, scale, rootId);//为可点击的事件加border
                document.body.appendChild(oDiv);
            },
            createElement: function(parent, parentNode, scale, rootId){
                if(!parent)return ;
                var oDiv = document.createElement('div'),arr = [];
                parentNode.appendChild(oDiv);
                oDiv.style.width = parent.width * scale + 'px';
                oDiv.style.height = parent.height * scale + 'px';
                oDiv.style.top = parent.top * scale + 'px';
                oDiv.style.left = parent.left * scale + 'px';
                if(parent.importantForAccessibility){
                    oDiv.className = "node";
                    oDiv.addEventListener('click',function(){
                        console.log(parent);
                        oDiv.style.border = "1px solid yellow";
                        if(event.preventDefault)event.preventDefault();
                        if(event.stopPropagation)event.stopPropagation();
                        if(event.returnValue)event.returnValue = false;
                        if(event.cancelBubble) event.cancelBubble = true;
                        return false;
                    },false);
                    //oDiv.onclick = function(){
                    //    console.log(parent);
                    //    oDiv.style.border = "1px solid yellow";
                    //    if(event.preventDefault)event.preventDefault();
                    //    if(event.stopPropagation)event.stopPropagation();
                    //    if(event.returnValue)event.returnValue = false;
                    //    if(event.cancelBubble) event.cancelBubble = true;
                    //    return false;
                    //};
                }else{
                    oDiv.className = "hide-node";
                }

                if(parent.child){
                    for(var i=0; i<parent.child.length; i++){
                        this.createElement(parent.child[i],oDiv, scale, rootId);
                    }
                }
            },
            turnToObject: function(data){
                var root = {};
                for(var i=0; i<data.length; i++){
                    root[data[i].hashCode] = data[i];
                }
                return root;
            },
            getNode: function(data, rootId){
                return data[rootId];
            },
            forEachNode: function(objects, parent){
                if(!parent || !parent.subviews || !parent.subviews.length)return ;
                var subviews = parent.subviews || [],
                    arr = [];
                for(var i=0; i<subviews.length; i++){
                    arr.push(this.getNode(objects,subviews[i]));
                }
                parent.child = arr;
                for(var j=0; j<parent.child.length; j++){
                    this.forEachNode(objects,parent.child[j]);
                }
            }

        }
    })();

    function ajax(url){
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        xhr.open('GET', url, true);
        xhr.send();
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200){
                imageStructure.setRes(JSON.parse(xhr.responseText));
                imageStructure.getImage();
            }
        };
    }
    imageStructure.init("./js/json/frames2.json");
})();