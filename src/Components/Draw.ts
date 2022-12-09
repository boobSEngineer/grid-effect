import {pixelSize} from "./GridEffect";

export let drawCircle = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, color: string, r: number) => {
    //create gradient
    let gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, r);
    gradient.addColorStop(1, color+'00');
    gradient.addColorStop(1- (Math.min(1, 150/pixelSize/r)), color+'ff');

    //draw
    ctx.beginPath();
    ctx.lineWidth = 20;
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = gradient;
    // ctx.fillStyle = `${color}`;
    ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
    ctx.fill();
}

export let circleAnimation = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, color: string, r: number) => {
    if (centerX && centerY) {
        drawCircle(ctx, centerX, centerY, color, r);
    }
}


export let solveRadiusCircle = (): number => {
    return Math.sqrt(Math.pow((1920), 2) + Math.pow((1080), 2))/pixelSize;
}

export let randomColor = () => {
    let string_color = [];
    let array_letter = ['a', 'b', 'c', 'd', 'e', 'f'];

    for (let i = 0; i < 6; i++) {
        if(Math.floor(Math.random()) < .6) {
            let number = Math.floor(Math.random() * 10);
            string_color.push(number)
        }
        else {
            let index_letter = Math.floor(Math.random() * 6);
            string_color.push(array_letter[index_letter]);
        }
    }
    console.log(string_color);
    return '#' + string_color.join('');
}
