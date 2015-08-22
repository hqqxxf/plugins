(function(){
    /**
     * Created by Administrator on 2015/8/21.
     */
    var imageStructure = (function(){
        var res = null;
        return {
            setRes: function(res){
                this.res = res;
            },
            getRes: function(){
                return this.res;
            },
            createImage: function(data){
                var img = document.createElement('img');
                img.src = "data:image/png;base64," + data.screenshot;
                document.body.appendChild(img);
                img.style.position = "absolute";
            },
            getImage: function(){
                var data = this.res.payload.activities[0],
                    objects = this.turnToObject(data.serialized_objects.objects),
                    rootId = data.serialized_objects.rootObject,
                    scale = data.scale,
                    root = this.getNode(objects,rootId);
                this.createImage(data);
                this.forEachNode(objects, root);
                console.log(root);
                var oDiv = document.createElement('div');
                this.createElement(root,oDiv, scale, rootId);
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
                    parent.hashCode == rootId ? oDiv.className = "root" : oDiv.className = "node";
                if(parent.clickable == "true"){
                    console.log(parent.width ,parent.height);
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

    function ajax(){
        //var url = "./js/json/image.json";
        var url = "./js/json/frames2.json";
        getStructure(url);
        function getStructure(url){
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
    }
    function init(){
        ajax();
    }
    init();
})();