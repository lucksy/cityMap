import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // Ensure the HttpClient import is correct
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'  // Make sure the service is provided in the root injector
})
export class CitiesService {
  private apiUrl = 'https://66cc4211a4dd3c8a71b6ef68.mockapi.io/api/cities';

  constructor(private http: HttpClient) { }

  getCities(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
