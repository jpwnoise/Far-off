export interface Star {
  x: number;
  y: number;
  radius: number;
  speed: number;
  color: string;

  // propiedades legacy / opcionales para otros métodos
  alpha?: number;
  alphaSpeed?: number;
  alphaDirection?: 1 | -1;

  // nuevas propiedades para el destello en cruz
  isShining: boolean;
  rotation: number; // ángulo inicial en radianes
}
