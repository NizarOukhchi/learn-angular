import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import { Home } from "../models/home.type"
import { Injectable } from "@angular/core"

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private apiUrl = "http://localhost:3000/homes"

  constructor(private http: HttpClient) {}

  getAllHomes(): Observable<Home[]> {
    return this.http.get<Home[]>(this.apiUrl)
  }
}