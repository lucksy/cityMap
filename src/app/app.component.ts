import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TableComponent } from './table/table.component';
import { MapComponent } from './map/map.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TableComponent, MapComponent],
  template: `
  <div class="wrap">
      <header>
        <h1>City Map</h1>
      </header>
        <section class="container">
          <div>
            <app-table (citySelected)="onCitySelected($event)"></app-table>
          </div>
          <div>
            <app-map [city]="selectedCity"></app-map>
          </div>
      </section>
  </div>
`,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'cityMap';
  selectedCity: string = '';


  onCitySelected(city: string) {
    this.selectedCity = city;
  }
}
