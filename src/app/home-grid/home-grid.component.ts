import { Component, inject } from '@angular/core';
import { HomeService } from '../services/home.service';
import { HomeCardComponent } from '../home-card/home-card.component';

@Component({
  selector: 'app-home-grid',
  imports: [HomeCardComponent],
  templateUrl: './home-grid.component.html',
  styleUrl: './home-grid.component.css',
})
export class HomeGridComponent {
  homesService = inject(HomeService);
  homes = this.homesService.paginatedHomes.asReadonly();
  isLoading = this.homesService.isLoading.asReadonly();
  error = this.homesService.error.asReadonly();

  ngOnInit() {
    this.homesService.fetchHomes();
  }
}
