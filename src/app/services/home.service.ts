import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Home } from '../models/home.type';

const API_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private http: HttpClient) {}

  getHomes(): Observable<Home[]> {
    return this.http.get<Home[]>(`${API_URL}/homes`);
  }
}
