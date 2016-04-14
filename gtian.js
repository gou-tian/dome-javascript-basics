/**
 * Created by gouTian on 2015/10/27.
 */
// 样式属性计算
function css(obj, attr) {
    //标准浏览器与IE非标准浏览器兼容处理
    if (obj.currentStyle) {
        //IE非标准浏览器
        return obj.currentStyle[attr];
    } else {
        //标准浏览器
        return getComputedStyle(obj, false)[attr];   //兼容老版本火狐下getComputedStyle的一个Bug。需要多传入一个参数
    }
}
// 元素拖拽
function drag(obj,arr){
    obj.onmousedown = function(e){
        // event事件兼容处理
        var
            ev = e || window.event,
        // 计算鼠标当前位置
            objX = ev.clientX - this.offsetLeft,
            objY = ev.clientY - this.offsetTop;
        // 低版本ie全局捕获
        if(this.setCapture){
            this.setCapture();
        }
        document.onmousemove = function(e){
            // event事件兼容处理
            var
                ev = e || event,
            // 计算鼠标当前位置
                docX = ev.clientX - objX,
                docY = ev.clientY - objY;

            // 属性值赋值
            obj.style.top = docY + 'px';
            obj.style.left = docX + 'px';
        };
        document.onmouseup = function(){
            //清空事件
            document.onmousemove = null;
            document.onmouseup = null;
            //释放全局捕获
            if(obj.setCapture){
                obj.releaseCapture();
            }
        };
        // 阻止默认事件
        return false;
    };
}
// 缓冲运动
function bufferMove(obj,json,fn){

    //清楚定时器
    clearInterval(obj.iTime);
    //速度值计算变量
    var iSpeed = 0;
    var num = 0;
    //开启定时器
    obj.iTime = setInterval(function(){
        //设置多属性判断条件
        var iSwitch = true;
        //循环json获取属性及属性值
        for(var attr in json){
            //获取属性值
            var iTarget = json[attr];
            //判断属性
            if(attr == 'opacity') {
                num = Math.round(css(obj,'opacity') * 100);
            }else{
                num = parseInt(css(obj,attr));
            }
            //速度值计算
            iSpeed = (iTarget - num) / 8;
            iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
            //属性赋值
            if(num != iTarget){
                //每次进来时说明有条件未执行完成iSwitch设置为false
                iSwitch = false;
                if(attr == 'opacity'){
                    obj.style.opacity = (iSpeed + num) / 100;
                    obj.style.filter = 'alpha(opacity' + (iSpeed + num) + ')';
                }else{
                    obj.style[attr] = iSpeed + num + 'px';
                }
            }
        }
        //全部for循环执行完毕后检查所有条件是否执行完，判断条件为iSwitch,iSwitch为true为所有条件满足
        if(iSwitch){
            //关闭定时器
            clearInterval(obj.iTime);
            //关闭定时器后判断是否有回调函数，如果有则执行同时把this指向调用对象
            fn && fn.call(obj);
        }
    },14);
}
// IE9以下用户名焦点事件
function oldIE(obj){
    if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/8./i)=="8." ||navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/9./i)=="9."){
        obj.value = '用户名';
        // 获取焦点
        obj.onfocus = function(){
            if(obj.value == '用户名'){
                obj.value = '';
            }else if(obj.value != '用户名' && obj.value === ''){
                return false;
            }
        };
        // 失去焦点的时候判断value值是否改变
        obj.onblur = function(){
            if(obj.value === ''){
                obj.value = '用户名';
            }else if(obj.value === '' && obj.value != '用户名'){
                return false;
            }
        };
    }
}
// 获取视口宽高
function view(){
    return {
        W : document.documentElement.clientWidth,
        H : document.documentElement.clientHeight
    };
}
// 事件监听
function bind(obj,ev,fn){
    if(obj.addEventListener){
        obj.addEventListener(ev ,fn,false);
    }else{
        obj.attachEvent('on' + ev,function(){
            fn.call(obj);
        });
    }
}
// 删除出事件
function removeBind(obj,ev,fn){
    if(obj.removeEventListener){
        obj.removeEventListener(ev ,fn(),false);
    }else{
        obj.detachEvent('on' + ev,function(){
            fn().call(obj);
        });
    }
}
// 移动端拖拽监听
function mobTouch(obj){
    document.title = view().W;
    bind(obj,'touchstart',function(e){
        var ev = e || event;
        var objX = ev.targetTouches[0].clientX - obj.offsetLeft;
        var objY = ev.targetTouches[0].clientY - obj.offsetTop;
        bind(document,'touchmove',function(e){
            var ev = e || event;
            var docX = ev.targetTouches[0].clientX - objX;
            var docY = ev.targetTouches[0].clientY - objY;
            if(docX > view().W / 2){
                docX = view().W / 2;
            }else if(docX < 0){
                docX = 0;
            }
            obj.style.left = docX + 'px';
            obj.style.top = docY + 'px';
        });
        bind(document,'touchend',function(){
            bind(document,'touchmove',function(){});
            bind(document,'touchend',function(){});
        });
    });
}
// 手势滑动方向计算
function touchAngle(touchObj,showHide){
    var setting = {
        show : showHide.show,
        hide : showHide.hide,
        up : showHide.up,
        down : showHide.down
    };
    //返回角度
    function GetSlideAngle(dx, dy) {
        return Math.atan2(dy,dx) * 180 / Math.PI;
    }
    //根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
    function GetSlideDirection(startX, startY, endX, endY) {
        var dy = startY - endY;
        var dx = endX - startX;
        var result = 0;
        //如果滑动距离太短
        if(Math.abs(dx) < 2 && Math.abs(dy) < 2) {
            return result;
        }
        var angle = GetSlideAngle(dx, dy);
        if(angle >= -45 && angle < 45) {
            result = 4;
        }else if (angle >= 45 && angle < 135) {
            result = 1;
        }else if (angle >= -135 && angle < -45) {
            result = 2;
        }
        else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
            result = 3;
        }
        return result;
    }
    //滑动处理
    var startX, startY;
    bind(touchObj,'touchstart',function (ev) {
        startX = ev.touches[0].pageX;
        startY = ev.touches[0].pageY;
    });
    bind(touchObj,'touchend',function (ev) {
        var endX, endY;
        endX = ev.changedTouches[0].pageX;
        endY = ev.changedTouches[0].pageY;
        var direction = GetSlideDirection(startX, startY, endX, endY);
        switch(direction) {
            case 0:
                // 没滑动
                break;
            case 1:
                // 向上
                ifFn(setting.up);
                break;
            case 2:
                // 向下
                ifFn(setting.down);
                break;
            case 3:
                // 向左
                ifFn(setting.hide);
                break;
            case 4:
                // 向右
                ifFn(setting.show);
                break;
            default:
        }
        function ifFn(setting){
            if(typeof setting != 'undefined'){
                setting();
            }else{
                ev.stopPropagation();
            }
        }
    });
}
// 延时隐藏
function ShowHide(objName,tarEle){
    this.objName = objName;
    this.tarEle = tarEle;
    this.timer = null;
}
ShowHide.prototype.overMouse = function(){
    var _this = this;
    bind(this.objName,'mouseover',function(){
        _this.tarEle.style.display = 'block';
    });
    bind(this.tarEle,'mouseover',function(){
        clearTimeout(_this.timer);
    });
};
ShowHide.prototype.outMouse = function(){
    var _this = this;
    bind(this.objName,'mouseout',function(){
        _this.delayed();
    });
    bind(this.tarEle,'mouseout',function(){
        _this.delayed();
    });
};
ShowHide.prototype.delayed = function(){
    var _this = this;
    this.timer = setTimeout(function(){
        _this.tarEle.style.display = 'none';
    },300);
};
ShowHide.prototype.toggle = function(){
    return {
        over : this.overMouse(),
        out : this.outMouse(),
        timer : this.delayed()
    };
};
//tab
function tabSwitch(elemet){

    this.setElement = {
        obj : elemet.obj, // choice element
        objWarpClass : elemet.objWarpClass, // choice element class name
        childHover : elemet.childHover, // choice element hover class name
        childActive : elemet.childActive, // choice element active class name
        objChildWarpClass : elemet.objChildWarp, // child element class name
        fn : elemet.fn
    };
    // 判断setElement值是否为undefined，条件为真的时候弹出错误提示
    for(var isNull in this.setElement){

        if(typeof this.setElement[isNull] === 'undefined' && isNull != 'fn'){
            return alert('请设置 ' + isNull + ' 的值,否则会导致程序错误！');
        }
    }
    this.obj = document.getElementsByTagName(this.setElement.obj);
    var _setElement = this.setElement;
    var objLen = this.obj.length;
    var tabArr = [];
    var conArr = [];
    for(var i = 0; i < objLen; i++){
        // 判断选择元素的class
        for(var j = 0; j < this.obj[i].className.split(' ').length; j ++){
            // tab标签
            if(this.obj[i].className.split(' ')[j] == this.setElement.objWarpClass){
                tabArr.push(this.obj[i]);
            }
            // tab内容
            if(this.obj[i].className.split(' ')[j] == this.setElement.objChildWarpClass){
                conArr.push(this.obj[i]);
            }
        }
    }
    // 鼠标移入移出
    (function(){
        var childTab = tabArr[0].children;
        var childLen = childTab.length;
        for(var i = 0; i < childLen; i++){
            childTab[i].index = i;
            bind(childTab[i],'mouseover',function(){
                for(var i = 0; i < childLen; i++){
                    childTab[i].className = _setElement.childActive;
                    conArr[i].style.display = 'none';
                }
                childTab[this.index].className = _setElement.childHover;
                conArr[this.index].style.display = 'block';
                _setElement.fn && _setElement.fn();
            });
        }
    })();
}
//
function tagName(elemet){
    this.setElement = {
        obj : elemet.obj, // choice element
        objWarpClass : elemet.objWarpClass // choice element class name
    };
    this.obj = document.getElementsByTagName(this.setElement.obj);
    var objLen = this.obj.length;
    var tabArr = [];
    for(var i = 0; i < objLen; i++){
        // 判断选择元素的class
        for(var j = 0; j < this.obj[i].className.split(' ').length; j ++){
            // tab标签
            if(this.obj[i].className.split(' ')[j] == this.setElement.objWarpClass){
                tabArr.push(this.obj[i]);
            }
        }
    }
    if(tabArr.length === 1 && tabArr.length !== 0){
        return tabArr[0];
    }else if(tabArr.length > 1){
        return tabArr;
    }
}
// 获取iframe里页面中元素值
function getFrames(eleID,chilEleID){
    var tmp = '';
    if(document.frames){
        tmp += document.frames[eleID].document.getElementById(chilEleID);
    }else{
        tmp = document.getElementById(eleID).contentWindow.document.getElementById(chilEleID);
    }
    return tmp;
}
function positiveIntegerRE(val){
    // 正整数匹配
    var Re = /^-?[0-9]\d*$/gm;
    var result = Re.test(val);
    if(!result){
        alert('输入的内容必须为正整数');
    }
    return val;
}
// 浏览器区分
function ifBrowser(){
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1;
    if (isOpera) {
        return "Opera";
    } //判断是否Opera浏览器
    if (userAgent.indexOf("Firefox") > -1) {
        return "FF";
    } //判断是否Firefox浏览器
    if (userAgent.indexOf("Chrome") > -1){
        return "Chrome";
    }
    if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    } //判断是否Safari浏览器
    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
        return "IE";
    } //判断是否IE浏览器
}
// 节点类型判断
function typeNode(node,num){
	var iNum = num || 1;
	var reuslt = [];
	for(var i = 0, len = node.length; i < len; i++){
		if(node[i].nodeType === iNum){
			reuslt.push(node[i]);
		}
	}
	return reuslt;
}
// iframe计算子页面高度
function setIframeHeight(iframeId) {
    var frameWin = document.getElementById(iframeId);
    // var frameBox = document.getElementById("frameBox");
    var newHeight;
    if (frameWin.Document) {
        newHeight = frameWin.Document.body.scrollHeight + 20 + "px";
    } else {
        newHeight = frameWin.contentDocument.body.scrollHeight + 20 + "px";
    }
    frameWin.style.height = newHeight;
    // frameBox.style.height = newHeight;
}
