/**
 * Created by gousky on 2015/6/27.
 *
 * 抖动函数
 */
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