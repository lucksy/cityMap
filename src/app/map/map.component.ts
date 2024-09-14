import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { GoogleMapsLoaderService } from '../google-maps-loader.service';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnChanges, OnInit {
  @Input() city: string | undefined;

  private map!: google.maps.Map;
  private geocoder!: google.maps.Geocoder;

  constructor(private googleMapsLoader: GoogleMapsLoaderService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['city'] && this.city) {
      this.googleMapsLoader.loadGoogleMaps().subscribe({
        next: () => {
          this.smoothZoomToCity(this.city!);
        },
        error: (err) => {
          console.error('Failed to load Google Maps:', err);
        }
      });
    }
  }

  ngOnInit() {
    this.googleMapsLoader.loadGoogleMaps().subscribe({
      next: () => {
        this.initMap();
      },
      error: (err) => {
        console.error('Failed to load Google Maps:', err);
      }
    });
  }

  initMap() {
    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: { lat: 0, lng: 0 },
      zoom: 2
    });
    this.geocoder = new google.maps.Geocoder();
  }

  smoothZoomToCity(city: string) {
    this.smoothZoom(this.map, 2, () => {
      this.geocoder.geocode({ address: city }, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
        if (status === 'OK' && results && results[0]) {
          this.map.panTo(results[0].geometry.location);
          setTimeout(() => {
            this.smoothZoom(this.map, 10);
          }, 1000);
        } else {
          console.error('Geocode was not successful for the following reason: ' + status);
        }
      });
    });
  }

  smoothZoom(map: google.maps.Map, targetZoom: number, callback?: () => void) {
    const currentZoom = map.getZoom() || 2;
    if (currentZoom !== targetZoom) {
      google.maps.event.addListenerOnce(map, 'zoom_changed', () => {
        this.smoothZoom(map, targetZoom, callback);
      });
      setTimeout(() => {
        map.setZoom(currentZoom + (targetZoom > currentZoom ? 1 : -1));
      }, 10);
    } else if (callback) {
      callback();
    }
  }
}
