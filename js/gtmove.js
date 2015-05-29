/**
 * Created by gousky on 2015/5/28.
 */
//运动函数
function gtMove(obj,attr,num,target){
    //设定参数 obj(元素),attr(属性名称),num(速度计算值),target(目标值)
    //定时器管理：清楚定时器。obj.timer为元素(obj)下的一个属性名为timer的属性。从而避免多值运动时发生冲突。
    clearInterval(obj.timer);
    //判断速度标值：如果速度小于目标值则速度为正数，否则速度为负数。
    if(num < target){
        num = +num;
    }else{
        num = -num;
    }
    //定时器管理：开启定时器，并以每30毫秒一次执行定时器内的内容。
    obj.timer = setInterval(function(){
        //创建一个变量，计算速度。并用parseInt取整。去掉元素属性值的单位，获取数字以方便后面计算。
        var speed = num + parseInt(gtStyle(obj,attr));
        //判断速度值是否超过目标值。如果超过，速度值就等于目标值。并且在赋值之前拉回。可以防止视觉上的卡顿。
        if(speed > target && num > 0 || speed < target && num < 0){
            speed = target;
        }
        //为元素属性值赋值。并加上单位。
        obj.style[attr] = speed + 'px';
        //定时器管理：如果速度值等于目标值时关闭定时器
        if(speed == target){
            clearInterval(obj.timer)
        }
    },30)
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
