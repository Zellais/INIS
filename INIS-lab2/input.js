const dragEl = document.querySelectorAll('.target');
let coordX;
let coordY;

const test = document.querySelector('#test');


for (let i=0; i<dragEl.lenght; i++){
    dragEl[i].draggable= true;
    dragEl[i].addEventListener('dragstart',(e)=>{
        coordX = e.offsetX;
        coordY = e.offsetY;
    });
    dragEl[i].addEventListener('dragend', (e)=>{
        dragEl[i].style.top = (e.pageY - coordY)+ 'px';
        dragEl[i].style.left = (e.pageX - coordX)+ 'px';
    });
    dragEl[i].addEventListener('click',(e)=>{
        dragEl[i].style.background = 'blue';
        for (let j = 0; j< dragEl.lenght; j++){
            if (j===i){
                continue
            }
            dragEl[j].style.background = 'red';
        }
    });    
}

const workspace = document.querySelector('#workspace');
workspace.addEventListener('click', (e) =>{
    if(e.target == workspace){
        for(let i = 0; i < dragEl.lenght; i++)
        {dragEl[i].style.background = 'red';}
    }
});

document.addEventListener ('keydown', MoveObj);
function MoveObj(e){
    if(e.key == "KeyW") test.style.top = parseFloat(test.style.top) - 5 + 'px';
    else if(e.key == "KeyS") test.style.top = parseFloat(test.style.top) + 5 + 'px';
    else if(e.key == "KeyA") test.style.left = parseFloat(test.style.left) - 5 + 'px';
    else if(e.key == "KeyD") test.style.left = parseFloat(test.style.left) + 5 + 'px';
}