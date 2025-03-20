import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  MapPin,
  WavesLadder,
  Bed,
  Bath,
} from 'lucide-angular';
import { Home } from '../models/home.type';
import { Heart } from 'lucide-angular/src/icons';

@Component({
  selector: 'app-home-card',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './home-card.component.html',
  styleUrl: './home-card.component.css',
})
export class HomeCardComponent {
  @Input() home!: Home;
  @Output() toggleFavorite = new EventEmitter<number>();
  // Icons list
  readonly WavesLadder = WavesLadder;
  readonly Bed = Bed;
  readonly Bath = Bath;
  readonly MapPin = MapPin;
  readonly Heart = Heart;

  /**
   * Emit the home id when favorite is toggled
   */
  onFavoriteClick(): void {
    if (this.home.id) {
      this.toggleFavorite.emit(this.home.id);
    }
  }
}
