import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  MapPin,
  WavesLadder,
  Bed,
  Bath,
} from 'lucide-angular';

@Component({
  selector: 'app-homecard',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './homecard.component.html',
  styleUrls: ['./homecard.component.css']
})
export class HomecardComponent {
  homes = [
    {
      title: 'Beautiful Family Home',
      description: 'Spacious family home with a large backyard and modern amenities.',
      city: 'San Francisco',
      rooms: 4,
      bathrooms: 2,
      hasPool: true,
      picture: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      id: '1'
    }
  ];
}
