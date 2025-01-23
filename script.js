//constants
const height = 500;
const width = 500;
const pointsNum = 30;
const maxDis = 130;//两点允许被线段连接的最大距离


const ScaleFactor_speed = 2;//速度的比例因子
const updateTime = 10;
/*
ScaleFactor_speed和updateTime
两个变量的乘积决定了点的移动速度,updateTime越小,移动越流畅
本来打算用时间戳使移动更流畅的,但那样很难搞
所以放弃了
*/

const pointWidth = 3;
const lineWidth = 2;
//theme
const lineColor = [255,255,255];
const bgColor = [0,0,0];
function setTheme(){
    document.body.style.backgroundColor = 
    `rgb(${bgColor[0]},${bgColor[1]},${bgColor[2]})`;
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
function drawLine(point1,point2){
    ctx.beginPath();
    ctx.moveTo(point1.x,point1.y);
    ctx.lineTo(point2.x,point2.y);
    ctx.closePath();
    ctx.lineWidth = lineWidth;
    let a = 1;let dis_ = Math.sqrt(Math.pow(point1.x-point2.x,2)+
        Math.pow(point1.y-point2.y,2));if(dis_<maxDis){a=(maxDis-dis_)/dis_}else{a=0;}
    ctx.strokeStyle = `rgba(${lineColor[0]},${lineColor[1]},${lineColor[2]},${a})`;
    ctx.stroke();
}
function drawAllLines(){
    for(let i = 0; i < pointsNum+1; i++){
        for(let j = i + 1; j < pointsNum+1; j++){
            if(pointList[i].x==null||pointList[j].x==null
            ||pointList[i].y==null||pointList[j].y==null
            ){continue;}

            drawLine(pointList[i],pointList[j]);
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
cvsEL.addEventListener('mouseout',removeMouse);
setInterval(()=>{
    ctx.clearRect(0,0,width,height);
    movePoints();
    drawAllLines();
},updateTime);