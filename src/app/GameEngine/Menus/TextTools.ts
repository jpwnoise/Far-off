export class TextTools {

    drawMultilineText(ctx: CanvasRenderingContext2D, text:string, x:number, y:number, lineHeight = 20) {
        const lines = text.split("\n");
        lines.forEach((line, index) => {
            ctx.fillText(line, x, y + index * lineHeight);
        });
    }
}