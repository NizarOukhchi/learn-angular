import { Component, Input } from '@angular/core';
import { LucideAngularModule, MapPin, WavesLadder, Bed, Bath } from 'lucide-angular';
import { Home } from '../../models/home.type';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-card',
  imports: [LucideAngularModule, RouterModule],
  templateUrl: './home-card.component.html',
  styleUrl: './home-card.component.css'
})
export class HomeCardComponent {
  @Input() home!: Home;

  // Icons from Lucide
  readonly mapPinIcon = MapPin;
  readonly wavesLadderIcon = WavesLadder;
  readonly bedIcon = Bed;
  readonly bathIcon = Bath;
}
