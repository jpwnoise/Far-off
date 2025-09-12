import { TextAnimation } from '../Animation/TextAnimation';
import { StarsTravel } from '../Animation/StarsTravel';

/** Menú principal que se muestra al inicio del juego */
export class StartMenu {
    private titleAnimation: TextAnimation;
    private subTitle: TextAnimation;
    starsTravelAnimation: StarsTravel;
    private ctx: CanvasRenderingContext2D
    starsAnimationSpeed = 10;


    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.starsTravelAnimation = new StarsTravel(this.ctx)

        this.titleAnimation = new TextAnimation(this.ctx, 'Far-off', '50px', { r: 255, g: 255, b: 255 }, 0, 0, 8000, 0);
        this.titleAnimation.fadeOut = false;

        this.subTitle = new TextAnimation(this.ctx, 'El silencio del abismo', '25px', { r: 255, g: 0, b: 0 }, 0, 40, 8000, 3000);
        this.subTitle.fadeOut = false;
    }

    /** incia la animacion en la que se separa el título del subtitulo  
     * esto para cuando el jugador ha presionar jugar o iniciar partida 
    */
   startMenuMovement() {
        this.starsAnimationSpeed = 5;
        this.titleAnimation.movementDirection = 'right';
        this.subTitle.movementDirection = 'left';
        this.titleAnimation.fadeOut = true;
        this.subTitle.fadeOut = true;
    }

    update() {
        this.titleAnimation.update();
        this.subTitle.update();
        this.starsTravelAnimation.update(this.starsAnimationSpeed);
    }

    draw() {
        this.starsTravelAnimation.draw();
        this.titleAnimation.draw();
        this.subTitle.draw();
    }

}