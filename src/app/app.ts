import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Game2 } from './game2/game2';

@Component({
  selector: 'app-root',
  imports: [Game2],
  templateUrl: './app.html',
  styleUrl: './app.sass'
})
export class App {
  protected readonly title = signal('far-off');
}
