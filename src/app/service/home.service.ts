import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Home } from "../models/model.type";

@Injectable({
  providedIn: "root",
})
export class HomeService {
  private apiUrl = "http://localhost:3000/homes";

  constructor(private http: HttpClient) {}

  /**
   * Get all homes from the API
   * @returns Observable of Home array
   */
  getHomes(): Observable<Home[]> {
    return this.http.get<Home[]>(this.apiUrl);
  }
}