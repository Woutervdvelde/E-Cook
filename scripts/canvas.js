const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
ctx.fillRect(0,0,500,500);

canvas.onmouseover = (e) => {
    // console.log(e);
}

canvas.onmousemove = (e) => {
    console.log(e);
}