import { Component, inject } from "@angular/core";
import { HomeService } from "../services/home.service";
import { HomeCardComponent } from "../components/home-card/home-card.component";

@Component({
  selector: "app-home-grid",
  standalone: true,
  imports: [HomeCardComponent],
  templateUrl: "./homes-grid.component.html",
  styleUrl: "./homes-grid.component.css",
})
export class HomeGridComponent {
  homeService = inject(HomeService);
  homes = this.homeService.paginatedHomes;
  isLoading = this.homeService.isLoading;
  error = this.homeService.error;

  ngOnInit(): void {
    this.homeService.fetchHomes();
  }
}