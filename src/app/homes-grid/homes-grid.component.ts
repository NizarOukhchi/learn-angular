import { Component, inject } from '@angular/core';
import { HomeService } from '../services/home.service';
import { Home } from '../models/home.type';
import { HomeCardComponent } from '../home-card/home-card.component';

@Component({
  selector: 'app-homes-grid',
  imports: [HomeCardComponent],
  templateUrl: './homes-grid.component.html',
  styleUrl: './homes-grid.component.css',
})
export class HomesGridComponent {
  homeService = inject(HomeService);
  homes = this.homeService.homes;
  isLoading = this.homeService.isLoading;
  error = this.homeService.error;

  ngOnInit(): void {
    this.homeService.getAllHomes();
  }
}
