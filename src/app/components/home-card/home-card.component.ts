import { BathIcon, BedIcon, FileIcon, LucideAngularModule, MapPinIcon, MapPinnedIcon, WavesLadderIcon } from 'lucide-angular';
import { Home } from './../../models/home.type';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-home-card',
  imports: [LucideAngularModule],
  templateUrl: './home-card.component.html',
  styleUrl: './home-card.component.css'
})
export class HomeCardComponent {
  @Input() home!: Home ;
  readonly FileIcon = FileIcon;
  readonly mapPinIcon = MapPinIcon;
  readonly bedIcon = BedIcon;
  readonly bathIcon = BathIcon;
  readonly wavesLadderIcon = WavesLadderIcon;
}
