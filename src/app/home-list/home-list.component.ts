import { Component, OnInit, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomecardComponent } from "../homecard/homecard.component";
import { HomeService } from "../service/home.service"; 
import { Home } from "../models/model.type";

@Component({
  selector: "app-home-list",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./home-list.component.html",
  styleUrl: "./home-list.component.css",
})
export class HomeListComponent  {
  private homeService = inject(HomeService);

  homes = signal<Home[]>([]);

  ngOnInit() {
    this.homeService.getHomes().subscribe({
      next: (homes) => this.homes.set(homes),
      error: (err) => console.error("Error fetching homes:", err),
    });
  }
}