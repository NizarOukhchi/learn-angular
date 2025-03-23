import { Component, Input, inject } from '@angular/core';
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
  imports: [CommonModule, LucideAngularModule],
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

  onFavoriteClick() {
    this.homeService.toggleFavorite(this.home);
  }
}
