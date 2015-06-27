/**
 * Created by gousky on 2015/6/27.
 *
 * 匀速运动
 *
 */
//todo:匀速运动带完成内容：以json形式完成参数的属性(attr)和目标值(tar)的传递
function gtSpeed( obj,attr,tar,num,fn ){
    //设定参数obj(元素),attr(属性名称),num(速度计算值),tar(目标值),fn(回调函数)
    if(attr == 'opacity'){
        //计算num值。*100使opacity的数值由小数转换成整数。然后判断num数值如小于目标值为正数，大于为负数。
        num = parseInt(gtStyle(obj,'opacity')) * 100 < tar ? num : -num;
    }else{
        //判断速度标值：如果速度小于目标值则速度为正数，否则速度为负数。
        num = parseInt(gtStyle(obj,attr)) < tar ? num : -num;
    }
    //关闭定时器，保证每次触发时候只有个一个定时器存在
    clearInterval(obj.iTimer);
    //开启定时器
    obj.iTimer = setInterval(function(){
        if(attr == 'opacity'){
            //计算速度值
            var speed = parseInt(gtStyle(obj,'opacity')*100) + num;
            //如果速度值大于或是小于目标值。速度值则等于目标值。
            if(speed > tar && num > 0 || speed < tar && num < 0){
                speed = tar;
                //关闭定时器
                clearInterval(obj.iTimer);
                //关闭以后判断是否有回调函数,有则执行，无则忽略。
                fn && fn.call(obj);
            }
            //元素赋值
            obj.style.opacity = speed / 100;
            obj.style.filter = 'alpha(opacity='+ speed +')';
        }else{
            //判断iSpeed是否大于tar，大于则iSpeed为正数，否则为负数
            //声明一个变量，用来计算速度
            var iSpeed = parseInt(gtStyle(obj,attr)) + num;
            //判断iSpeed是否大于tar，大于则关闭定时器，否则继续相加
            if(iSpeed > tar && num > 0 || iSpeed < tar && num < 0){
                iSpeed = tar;
                //关闭定时器
                clearInterval(obj.iTimer);
                //关闭以后判断是否有回调函数,有则执行，无则忽略。
                fn && fn.call(obj);
            }
            //元素赋值
            obj.style[attr] = iSpeed + 'px';
        }
    },30)
}
//获取css样式attr属性值并做浏览器兼容处理
function gtStyle(obj,attr){
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

