import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule, MapPin, WavesLadder, Bed, Bath, Heart } from 'lucide-angular';
import { Home } from '../../models/home.type';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-card',
  imports: [CommonModule, LucideAngularModule, RouterModule],
  templateUrl: './home-card.component.html',
  styleUrl: './home-card.component.css'
})
export class HomeCardComponent {
  @Input() home!: Home;
  @Output() toggleFavorite = new EventEmitter<number>();

  // Icons from Lucide
  readonly mapPinIcon = MapPin;
  readonly wavesLadderIcon = WavesLadder;
  readonly bedIcon = Bed;
  readonly bathIcon = Bath;
  readonly Heart = Heart;

  onFavoriteClick(): void {
    if (this.home.id) {
      this.toggleFavorite.emit(this.home.id);
    }
  }
}
