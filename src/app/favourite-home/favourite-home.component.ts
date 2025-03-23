import { Component, inject } from '@angular/core';
import { HomeService } from '../services/home.service';
import { CommonModule } from '@angular/common';
import { HomeCardComponent } from '../home-card/home-card.component';
@Component({
  selector: 'app-favourite-home',
  imports: [CommonModule, HomeCardComponent],
  templateUrl: './favourite-home.component.html',
  styleUrl: './favourite-home.component.css',
})
export class FavouriteHomeComponent {
  homeService = inject(HomeService);
  favoritesHomes = this.homeService.favoritesHomes;
}
