import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  MapPin,
  WavesLadder,
  Bed,
  Bath,
  Heart,
} from 'lucide-angular';
import { Home } from '../models/home.type';
import { CommonModule } from '@angular/common';
import { HomeService } from '../services/home.service';

@Component({
  selector: 'app-home-card',
  imports: [LucideAngularModule, FormsModule, CommonModule],
  templateUrl: './home-card.component.html',
  styleUrl: './home-card.component.css',
})
export class HomeCardComponent {
  @Input() home!: Home;
  homeService = inject(HomeService);

  // Icons list
  readonly MapPin = MapPin;
  readonly WavesLadderIcon = WavesLadder;
  readonly BedIcon = Bed;
  readonly BathIcon = Bath;
  readonly HeartIcon = Heart;

  onFavoriteClick(): void {
    if (!this.home.id) {
      return;
    }
    this.homeService.toggleFavorite(this.home.id);
  }
}
