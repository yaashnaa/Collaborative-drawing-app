window.onload=function(){

    /* Initialise variables */
    let isDrawing = false;
    let x = 0;
    let y = 0;

    /* Get canvas and context */
    const canvas = document.getElementById('sheet');
    var context = canvas.getContext('2d');

    /* Add the event listeners for mousedown, mousemove, and mouseup */
    canvas.addEventListener('mousedown', e => {
        /* Drawing begins */
        x = e.offsetX;
        y = e.offsetY;
        isDrawing = true;
    });
    
    canvas.addEventListener('mousemove', e => {
        /* Drawing continues */
        if (isDrawing === true) {
            drawLine(context, x, y, e.offsetX, e.offsetY);
            x = e.offsetX;
            y = e.offsetY;
        }
    });
    
    window.addEventListener('mouseup', e => {
        /* Drawing ends */
        if (isDrawing === true) {
            drawLine(context, x, y, e.offsetX, e.offsetY);
            x = 0;
            y = 0;
            isDrawing = false;
        }
    });

    /* Initialise socket */
    var socket = io();

    /* Receiving Updates from server */
    socket.on('update_canvas',function(data){
        let {x1,y1,x2,y2,color} = JSON.parse(data);
        drawLine(context,x1,y1,x2,y2,color,true);
    });

    /* Function to Draw line from (x1,y1) to (x2,y2) */
    function drawLine(context, x1, y1, x2, y2,color = selected_color,from_server = false) {

        /* Send updates to server (not re-emiting those received from server) */
        if(!from_server)
            socket.emit('update_canvas',JSON.stringify({x1,y1,x2,y2,color}));
        
        /* Draw line with color, stroke etc.. */
        context.beginPath();
        context.strokeStyle = color;
        context.lineWidth = 5;
        context.lineCap = 'round'
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
        context.closePath();
        }

}

/* helper function to change selected_color
   triggered onclick buttons below canvas
   'red','green','blue'
 */
let selected_color = 'red';
function selectColor(color){
    document.getElementsByClassName(selected_color)[0].classList.remove('selected');
    document.getElementsByClassName(color)[0].classList.add('selected');    
    selected_color = color;
}


  let selected_option = "line";

  function changeBackgroundPattern(option) {
    const contentContainer = document.getElementById("sheet");

    if (option === "dots") {
      contentContainer.style.backgroundColor = "black";
      contentContainer.style.opacity = "1";
      contentContainer.style.backgroundImage =
        "radial-gradient(#000000 0.65px, transparent 0.65px), radial-gradient(#000000 0.65px, #ffffff 0.65px)";
      contentContainer.style.backgroundSize = "54px 54px";
      contentContainer.style.backgroundPosition = "0 0, 27px 27px";
    } else if (option === "paper") {
      contentContainer.style.backgroundColor = "#ffffff";
      contentContainer.style.opacity = "1";
      contentContainer.style.backgroundImage =
        "linear-gradient(#000000 4px, transparent 4px), linear-gradient(90deg, #000000 4px, transparent 4px), linear-gradient(#000000 2px, transparent 2px), linear-gradient(90deg, #000000 2px, #ffffff 2px)";
      contentContainer.style.backgroundSize =
        "100px 100px, 100px 100px, 20px 20px, 20px 20px";
      contentContainer.style.backgroundPosition =
        "-4px -4px, -4px -4px, -2px -2px, -2px -2px";
    } else if (option === "line") {
      contentContainer.style.backgroundColor = "#ffffff";
      contentContainer.style.opacity = "1";
      contentContainer.style.backgroundImage =
        " repeating-linear-gradient(0deg, #000000, #000000 1px, #ffffff 1px, #ffffff)";
      contentContainer.style.backgroundSize = "20px 20px";
    } else if (option === "grid") {
      contentContainer.style.backgroundColor = "#ffffff";
      contentContainer.style.opacity = "1";
      contentContainer.style.backgroundImage =
        " linear-gradient(#000000 1.3px, transparent 1.3px), linear-gradient(to right, #000000 1.3px, #ffffff 1.3px)";
      contentContainer.style.backgroundSize = "26px 26px";
    } else if (option === "paperTexture") {
      contentContainer.style.backgroundColor = "#ffeee0";
      contentContainer.style.backgroundImage =
        'url("https://www.transparenttextures.com/patterns/textured-paper.png")';
      contentContainer.style.backgroundSize = "auto";
    }

    selected_option = option;
    socket.emit("change_background", option);
   
  }
//   socket.on("change_background", function (option) {
//     changeBackgroundPattern(option);
//   });

  
  
