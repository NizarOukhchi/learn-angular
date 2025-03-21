import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LucideAngularModule, MapPin, WavesLadder, Bed, Bath, Heart } from "lucide-angular";
import { Home } from "../models/home.type";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-home-card",
  standalone: true,
  imports: [LucideAngularModule, FormsModule, CommonModule],
  templateUrl: "./home-card.component.html",
  styleUrl: "./home-card.component.css",
})
export class HomeCardComponent {
  @Input() home!: Home;
  @Output() toggleFavorite = new EventEmitter<number>();

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
    this.toggleFavorite.emit(this.home.id);
  }
}