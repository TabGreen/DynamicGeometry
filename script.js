//constants
const height = 500;//画布高度
const width = 500;//画布宽度
const pointsDensity = 1.5;//密度(点/100*100像素)
const pointsNum = pointsDensity * ((width * height)/(100*100));
const maxDis = 150;//两点允许被线段连接的最大距离


const ScaleFactor_speed = 2;//速度的比例因子
const updateTime = 10;//更新频率(毫秒)
/*
ScaleFactor_speed和updateTime
两个变量的乘积决定了点的移动速度,updateTime越小,移动越流畅
本来打算用时间戳使移动更流畅的,但那样很难搞
所以放弃了
*/

const pointWidth = 3;//点的宽度(一般不显示)
const lineWidth = 2;//线条宽度
//theme
const lineColor = [255,255,255];//普通颜色
const bgColor = [0,0,0];//背景颜色
function setTheme(){
    document.body.style.backgroundColor = 
    `rgb(${bgColor[0]},${bgColor[1]},${bgColor[2]})`;
}
//specialColor
const isSpecialInNormalOn = false;//默认情况下的特殊颜色开启状态
const isSpecialInSpecialOn = true;//特殊情况下特殊颜色开启状态(1.线段连接到鼠标时)

var specialColor = [255,255,255];//特殊颜色初始值
var specialColor_vector = [];//特殊颜色向量
const specialColor_speed = 1;//特殊颜色变化速度
function setSpecialColor_vector(){
    let first = (Math.random()*2-1) * specialColor_speed;
    let more = specialColor_speed-Math.abs(first);
    let second = (Math.random()*2-1) * more;
    more -= Math.abs(second);
    let third = (Math.random()*2-1) * more;
    specialColor_vector = [first,second,third];
}
setSpecialColor_vector();
function specialColor_go(){
    for(let i=0;i<specialColor_vector.length;i++){
        specialColor[i] += specialColor_vector[i];
        if(specialColor[i]>255){specialColor[i] = 255;
        setSpecialColor_vector();}
        if(specialColor[i]<0){specialColor[i] = 0;
        setSpecialColor_vector();}
    }
}
//ctx
const cvsEL = document.getElementById('canvas');
const ctx = cvsEL.getContext('2d');

setTheme();
//setSizeAndPos
function setCVSElSize(){
    cvsEL.width = width;
    cvsEL.height = height;
}
function setCVSElPos(){
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let x = (windowWidth - width) / 2;
    let y = (windowHeight - height) / 2;
    cvsEL.style.left = x + 'px';
    cvsEL.style.top = y + 'px';
}
setCVSElSize();
setCVSElPos();
window.addEventListener('resize',setCVSElPos);
//createPoints
function createRandom_Pos_Point(){
    let x = Math.random() * width;
    let y = Math.random() * height;
    return {x,y};
}
var pointList = [];
for(let i = 0; i < pointsNum; i++){
    pointList.push(createRandom_Pos_Point());
}
//create随机向量
function createRandom_Pos_Vector(){
    let x = Math.random() * ScaleFactor_speed-ScaleFactor_speed/2;
    let y = Math.random() * ScaleFactor_speed-ScaleFactor_speed/2;
    return {x,y};
}
var vectorList = [];
for(let i = 0; i < pointsNum; i++){
    vectorList.push(createRandom_Pos_Vector());
}

//drawLines
function drawLine(point1,point2,isSpecial=false){
    ctx.beginPath();
    ctx.moveTo(point1.x,point1.y);
    ctx.lineTo(point2.x,point2.y);
    ctx.closePath();
    ctx.lineWidth = lineWidth;
    let a = 1;let dis_ = Math.sqrt(Math.pow(point1.x-point2.x,2)+
        Math.pow(point1.y-point2.y,2));if(dis_<maxDis){a=(maxDis-dis_)/dis_}else{a=0;}
    ctx.strokeStyle = `rgba(${lineColor[0]},${lineColor[1]},${lineColor[2]},${a})`;
    if(isSpecial){ctx.strokeStyle = `rgba(${specialColor[0]},${specialColor[1]},${specialColor[2]},${a})`;}
    ctx.stroke();
}
function drawAllLines(){
    for(let i = 0; i < pointsNum+1; i++){
        for(let j = i + 1; j < pointsNum+1; j++){
            if(pointList[i].x==null||pointList[j].x==null
            ||pointList[i].y==null||pointList[j].y==null
            ){continue;}
            let isSpecial = isSpecialInNormalOn;
            if(pointList[i]==mouse||pointList[j]==mouse){isSpecial = true;}
            drawLine(pointList[i],pointList[j],isSpecial);
        }
    }
}
function movePoints(){
    for(let i = 0; i < pointsNum; i++){
        let vector = vectorList[i];
        let point = pointList[i];
        point.x += vector.x;
        point.y += vector.y;
        if(point.x < 0){
            vector.x = Math.abs(vector.x);
        }if(point.x > width){
            vector.x = -Math.abs(vector.x);
        }
        if(point.y < 0){
            vector.y = Math.abs(vector.y);
        }if(point.y > height){
            vector.y = -Math.abs(vector.y);
        }
    }
}
var mouse = {};
pointList.push(mouse);
function addMouse(e){
    if(e){
        mouse.x = e.clientX - cvsEL.offsetLeft;
        mouse.y = e.clientY - cvsEL.offsetTop;
    }
}
function removeMouse(){
    mouse.x=null;
    mouse.y=null;
}
cvsEL.addEventListener('mousemove',addMouse);
cvsEL.addEventListener('touchmove',addMouse);
cvsEL.addEventListener('mouseout',removeMouse);
cvsEL.addEventListener('touchend',removeMouse);
setInterval(()=>{
    ctx.clearRect(0,0,width,height);
    movePoints();
    drawAllLines();
    if(isSpecialInSpecialOn||isSpecialInNormalOn){
        specialColor_go();
    }
},updateTime);

//禁止移动端缩放
document.addEventListener('touchstart', function(event) {
if (event.touches.length > 1) {event.preventDefault();}},{
passive:false});document.addEventListener('gesturestart',
function(event) {event.preventDefault();});