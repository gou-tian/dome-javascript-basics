/**
 * Created by gousky on 2015/6/28.
 *
 * 匀速运动
 *
 *json形式出入传入属性(attr)和属性值或是目标值(target)
 */
//定义参数obj(传入的元素),json传入属性(attr)和属性值或是目标值(target),num(速度计算值),fn(回调函数))
function $gt( obj,json,iSpeed,fn ){
    //关闭定时器
    clearInterval(obj.iTimer);
    //初始化一个新的变量，赋值为数字类型
    var num = 0;
    //开启定时器
    obj.iTimer = setInterval(function(){
        //定义新的变量判断多属性值是否到达预定目标值,变量类型为布尔值
        var spdTar = true;
        //循环json
        for(var attr in json){
            //声明一个变量存放目标值
            var iTarget = json[attr];
            //判断attr属性名称，如果是opacity用Math取整
            if(attr == 'opacity'){
                num = Math.round(gtCss(obj,'opacity') * 100);
            }else{
                num = parseInt(gtCss(obj,attr));
            }
            //如果num>iTarget的时候num=iTarget
            if(num != iTarget){
                spdTar = false;
                if (attr == 'opacity') {
                    obj.style.opacity = (num + iSpeed) / 100;
                    obj.style.filter = 'alpha(opacity='+ (num + iSpeed) +')';
                } else {
                    obj.style[attr] = num + iSpeed + 'px';
                }
            }

        }
        if(spdTar){
            num = iTarget;
            clearInterval(obj.iTimer);
            console.log('End');
            fn && fn.call(obj);
        }
    },30)
}

//获取css样式attr属性值并做浏览器兼容处理
function gtCss(obj,attr){
    //obj(元素),attr(属性名称)
    //处理浏览器兼容性问题
    if(obj.currentStyle){
        //currentStyle 做IE非标准浏览器兼容处理
        return obj.currentStyle[attr];
    }else{
        //getComputedStyle FF等标准浏览器兼容处理
        return getComputedStyle(obj)[attr];
    }
}
//TODO:匀速运动以json形式完成。带修复Bug为不能随意传入速度值