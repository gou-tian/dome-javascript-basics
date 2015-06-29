/**
 * Created by gousky on 2015/6/28.
 *
 * 摩擦运动
 */
//定义参数obj(传入的元素),json传入属性(attr)和属性值或是目标值(target),fn(回调函数))
function gt$(obj,json,fn){
    //关闭定时器,保证每次开启的定时器的时候只有个一个定时器在工作
    clearInterval(obj.iTimer);
    //初始化一个新的变量，设定为数字类型，以便计算iSpeed + num得到与目标值相等的数字
    var num = 0;
    //iSpeed(速度值)
    var iSpeed = 0;
    //开启定时器
    obj.iTimer = setInterval(function(){
        //定义一个布尔类型变量，用于判断所有条件是否满足
        var oBot = true;
        //枚举json获取attr属性
        for(var attr in json){
            //声明一个变量存储attr
            var iTarget = json[attr];
            //判断attr是否为opacity
            if(attr == 'opacity'){
                num = Math.round(gtCss(obj,attr)) * 100;
            }else{
                num = parseInt(gtCss(obj,attr));
            }
            //console.log(num + ' : ' +iSpeed);
            //计算速度
            iSpeed = (iTarget - num) / 8;
            iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
            //元素赋值
            if(num != iTarget){
                oBot = false;
                if(attr == 'opacity'){
                    obj.style.opacity = (iSpeed + num) / 100;
                    obj.style.fliter = 'alpha('+ (iSpeed + num) +')';
                }else{
                    obj.style[attr] = iSpeed + num + 'px';
                }
            }

        }
        //for循环走完查看所有条件是否满足
        if(oBot){
            clearInterval(obj.iTimer);
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