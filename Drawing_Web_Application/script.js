const canvas=document.querySelector("canvas"),
toolbtn=document.querySelectorAll(".tool"),
fillcolor=document.querySelector("#fill-color");
sizeslider=document.querySelector("#size-slider");
colorbtn=document.querySelectorAll(".colors .option");
clearcanvas=document.querySelector(".clear-canvas");
saveimg=document.querySelector(".save-img");


let prevmouseX,prevmouseY,snapshot;
ctx=canvas.getContext("2d");
let isdrawing=false;
brushWidth=5;
selectedtool="brush"
selectedcolor="#fff"

const setbackground=()=>{
    ctx.fillStyle='#fff'
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle=selectedcolor;
}

window.addEventListener("load",()=>{
    canvas.width=canvas.offsetWidth;
    canvas.height=canvas.offsetHeight;
    setbackground();
})

const drawRect=(e)=>{
    if(!fillcolor.checked){
        return  ctx.strokeRect(e.offsetX, e.offsetY, prevmouseX-e.offsetX, prevmouseY-e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevmouseX-e.offsetX, prevmouseY-e.offsetY);
}

const drawCircle=(e)=>{
    ctx.beginPath();
    let radius=Math.sqrt(Math.pow((prevmouseX-e.offsetX),2)+ Math.pow((prevmouseY-e.offsetY),2));
    ctx.arc(prevmouseX, prevmouseY, radius, 0, 2*Math.PI);
    fillcolor.checked ? ctx.fill():ctx.stroke();

}

const drawTriangle=(e)=>{
    ctx.beginPath();
    ctx.moveTo(prevmouseX,prevmouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevmouseX*2-e.offsetX,e.offsetY);
    ctx.closePath();
    fillcolor.checked ? ctx.fill():ctx.stroke();

}

const drawing=(e)=>{
    if(!isdrawing) return;
    ctx.putImageData(snapshot, 0, 0);

    if(selectedtool==="brush" || selectedtool==="eraser"){
        ctx.strokeStyle=selectedtool==="eraser" ? "#fff":selectedcolor;
        ctx.lineTo(e.offsetX,e.offsetY);
        ctx.stroke();
    }else if(selectedtool==="rectangle"){
        drawRect(e);
    }else if(selectedtool==="circle"){
        drawCircle(e);
    }else{
        drawTriangle(e);
    }


}

const startdraw=(e)=>{
    isdrawing=true;
    prevmouseX=e.offsetX;
    prevmouseY=e.offsetY;
    ctx.beginPath();
    ctx.lineWidth=brushWidth;
    ctx.strokeStyle=selectedcolor;
    ctx.fillStyle=selectedcolor;
    snapshot=ctx.getImageData(0, 0, canvas.width, canvas.height);

}

const stopdraw=(e)=>{
    isdrawing=false;
}

toolbtn.forEach(btn=>{
    btn.addEventListener("click",()=>{
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedtool=btn.id;
        console.log(selectedtool);
    })
})

sizeslider.addEventListener("change",()=>brushWidth=sizeslider.value)

colorbtn.forEach(btn=>{
    btn.addEventListener("click",()=>{
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedcolor=window.getComputedStyle(btn).getPropertyValue("background-color");
    })
})

clearcanvas.addEventListener("click",()=>{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
})

saveimg.addEventListener("click", () => {
    const link = document.createElement("a"); 
    link.download = `${Date.now()}.jpg`; 
    link.href = canvas.toDataURL();
    link.click(); 
});

canvas.addEventListener("mousemove",drawing)
canvas.addEventListener("mousedown",startdraw)
canvas.addEventListener("mouseup",stopdraw)