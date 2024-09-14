// private apiKey = 'AIzaSyC8KmO08TsCnkTkRChVZK_URaflWTAk_uE';

// src/app/google-maps-loader.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsLoaderService {
  private apiKey: string = 'AIzaSyC8KmO08TsCnkTkRChVZK_URaflWTAk_uE';
  private scriptLoadingPromise: Promise<void> | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  loadGoogleMaps(): Observable<void> {
    return new Observable((observer: Observer<void>) => {
      if (!isPlatformBrowser(this.platformId)) {
        observer.error('Not running in a browser environment');
        return;
      }

      if (this.scriptLoadingPromise) {
        this.scriptLoadingPromise.then(() => {
          observer.next();
          observer.complete();
        }).catch((error) => {
          observer.error(error);
        });
        return;
      }

      this.scriptLoadingPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}`;
        script.onload = () => {
          resolve();
        };
        script.onerror = (error: any) => {
          reject('Could not load Google Maps script');
        };

        document.head.appendChild(script);
      });

      this.scriptLoadingPromise.then(() => {
        observer.next();
        observer.complete();
      }).catch((error) => {
        observer.error(error);
      });
    });
  }
}
