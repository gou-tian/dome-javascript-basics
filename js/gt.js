/**
 * Created by gousky on 2015/5/28.
 *
 *
 */
//运动函数
function gtMove(obj,attr,num,target,fn){
    //设定参数 obj(元素),attr(属性名称),num(速度计算值),target(目标值),fn(回调函数)

    //判断速度标值：如果速度小于目标值则速度为正数，否则速度为负数。
    num = parseInt(gtStyle(obj,attr)) < target ? num : -num;
    //定时器管理：清楚定时器。obj.timer为元素(obj)下的一个属性名为timer的属性。从而避免多值运动时发生冲突。
    clearInterval(obj.timer);
    //定时器管理：开启定时器，并以每30毫秒一次执行定时器内的内容。
    obj.timer = setInterval(function(){
        //创建一个变量，计算速度。并用parseInt取整。去掉元素属性值的单位，获取数字以方便后面计算。
        var speed = parseInt(gtStyle(obj,attr)) + num;
        //判断速度值是否超过目标值。如果超过，速度值就等于目标值。并且在赋值之前拉回。可以防止视觉上的卡顿。
        if(speed > target && num > 0 || speed < target && num < 0){
            speed = target;
        }
        //为元素属性值赋值。并加上单位。
        obj.style[attr] = speed + 'px';
        //定时器管理：如果速度值等于目标值时关闭定时器
        if(speed == target){
            clearInterval(obj.timer);
            fn && fn();
        }
    },30)
}
//运动函数-透明度运动
function gtAlpha(obj,num,tar,fn){
    //计算num值。*100使opacity的数值由小数转换成整数。然后判断num数值如小于目标值为正数，大于为负数。
    num = parseInt(gtStyle(obj,'opacity')) * 100 < tar ? num : -num;
    clearInterval(obj.timer);
    obj.timer = setInterval(function(){
        //计算速度值
        var speed = parseInt(gtStyle(obj,'opacity')*100) + num;
        //如果速度值大于或是小于目标值。速度值则等于目标值。
        if(speed > tar && num > 0 || speed < tar && num < 0){
            speed = tar;
        }
        //元素赋值
        obj.style.opacity = speed / 100;
        obj.style.filter = 'alpha(opacity='+ speed +')';
        //关闭定时器条件，在关闭以后判断是否有回调函数。有则执行1，无则忽略。
        if(speed === tar){
            clearInterval(obj.timer);
            fn && fn();
        }
    },30)
}
//抖动函数
function gtShake(obj,attr,fn){
    //判断定时器是否开启，如开启阻止默认事件
    if(obj.timer){ return; }
    //计算元素属性值
    var pos = parseInt(gtStyle(obj,attr));
    //声明一个空数组
    var arrMar = [];
    var num = 0;
    //计算抖动幅度，并添加到数组
    for(var i = 20; i > 0; i-=2){
        arrMar.push(i,-i);
    }
    //给数组添加结束值
    arrMar.push(0);
    //清楚定时器
    clearInterval(obj.timer);
    //开启定时器
    obj.timer = setInterval(function(){
        obj.style[attr] = pos + arrMar[num] + 'px';
        num++;
        if ( num == arrMar.length ) {
            clearInterval( obj.timer );
            //判断是否有回调函数
            fn && fn();
            //清除阻止默认事件
            obj.timer = false;
        }
    },40)
}

//获取元素属性值并做浏览器兼容处理
function gtStyle(obj,attr){
    /*
    * obj(元素),attr(属性名称)
    * 处理浏览器兼容性问题
    * 1、currentStyle 做IE非标准浏览器兼容处理
    * 2、getComputedStyle FF等标准浏览器兼容处理
    * */
    return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];
}
