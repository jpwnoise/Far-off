    /** clase para hacer aparecer un texto desde 
     * la derecha superior  deslizandose a la izquierda*/
    export class MovingText {
        ctx: CanvasRenderingContext2D;
        // posiciones 
        position = { x:0, y:0 }
        finalPosition = {x:0, y:0}

        //acumulador del tiempo
        timeAcc = 0;

        //duracion de la animacion en segundos
        duration = .2; 
        
        /** el texto a animar */
        text = ''; 

        //bandera para el control de la animacion
        active = false;

        playAnim(){
            this.active = true; 
        }

        constructor(ctx:CanvasRenderingContext2D, finalPosition:{x:number, y:number}, text:string = ''){
            this.ctx = ctx; 
            this.text = text; 
            this.finalPosition = finalPosition;

            // lo posicionamos en la esquina superio derecha 
            this.position.x = this.ctx.canvas.width;
            this.position.y = 50;
        }

        /** por si quieres cambiar el texto */
        setText(text:string){
            this.text = text
        }

        updateMovement(deltaTime:number){
            if (this.active){
                this.timeAcc += deltaTime; 
                const timeProgress = this.timeAcc / this.duration;
                this.position.x = this.ctx.canvas.width + (this.finalPosition.x - this.ctx.canvas.width) * timeProgress;
                this.position.y = 50 + (this.finalPosition.y - 50) * timeProgress;


                if (this.timeAcc >= this.duration){
                    this.timeAcc = 0; 
                    this.position.x = this.finalPosition.x;
                    this.position.y = this.finalPosition.y;
                    this.active = false;
                }
            }
        }

        //dibuja solo el texto 
        drawText(){
            const ctx = this.ctx;
            ctx.font = '15px Audiowide';
            ctx.fillStyle = 'yellow'; 
            ctx.fillText(this.text, this.position.x, this.position.y);
        }

        // METODOS PRINCIPALES 

        update(deltaTime:number){
            this.updateMovement(deltaTime)
        }

        draw(){
            this.drawText();       
        }
    }