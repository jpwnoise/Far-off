/** la info de la nave */
export interface ShipOption {
    name: string;
    description: string;
    imageSrc: string;
    image?: HTMLImageElement;
}

/** la info del arma secundnaria */
export interface SurgeCannonOption {
    name: string;
    description: string;
    imageSrc: string;
    image?: HTMLImageElement;
}

/** el tipo de borde que rodea la opcion */
export interface Border {
    width: number;
    height: number;
    color: string;
    borderWidth: number;
    backgroundColor: string;
}
