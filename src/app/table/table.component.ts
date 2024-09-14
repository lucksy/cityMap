import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { SearchComponent } from '../search/search.component';
import numWords from 'num-words';



@Component({
  selector: 'app-table',
  standalone: true,
  imports: [HttpClientModule, CommonModule, SearchComponent],
  template: `
  <div>
    <app-search (search)="onSearch($event)"></app-search>

    <div class="table-container">
    @if (paginatedCities.length > 0) {
      <table class="table" role="table" aria-label="City Population Table">
        <thead>
        <tr role="row">
            <th role="columnheader" (click)="sortColumn('city')">
              <span class="sort">
              City
              <span *ngIf="sortColumnKey === 'city'">
                @if (sortDirection === 'asc') {
                  <svg width="16" height="16" viewBox="0 0 24 24"><path d="M7 14l5-5 5 5z"/></svg>
                } @else {
                  <svg width="16" height="16" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
                }
              </span>
              </span>
            </th>
            <th role="columnheader" (click)="sortColumn('men')">
            <span class="sort">
              Men
              <span *ngIf="sortColumnKey === 'men'">
                @if (sortDirection === 'asc') {
                  <svg width="16" height="16" viewBox="0 0 24 24"><path d="M7 14l5-5 5 5z"/></svg>
                } @else {
                  <svg width="16" height="16" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
                }
              </span>
              </span>
            </th>
            <th role="columnheader" (click)="sortColumn('women')">
            <span class="sort">
              Women
              <span *ngIf="sortColumnKey === 'women'">
                @if (sortDirection === 'asc') {
                  <svg width="16" height="16" viewBox="0 0 24 24"><path d="M7 14l5-5 5 5z"/></svg>
                } @else {
                  <svg width="16" height="16" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
                }
              </span>
              </span>
            </th>
            <th role="columnheader" (click)="sortColumn('total')" style="text-align: right;">
            <span class="sort">
              Total
              <span *ngIf="sortColumnKey === 'total'">
                @if (sortDirection === 'asc') {
                  <svg width="16" height="16" viewBox="0 0 24 24"><path d="M7 14l5-5 5 5z"/></svg>
                } @else {
                  <svg width="16" height="16" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
                }
              </span>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          @for (city of paginatedCities; track city.id) {
            <tr (click)="selectCity(city.city)" [attr.tabindex]="$index + 2" role="row" [attr.aria-label]="getAriaLabel(city)" [ngClass]="{'active': selectedCity === city.city}" (focus)="selectCity(city.city)">
              <td role="cell" style="width: 40%;">{{ city.city }}</td>
              <td role="cell" style="width: 20%;">{{ city.men }}</td>
              <td role="cell" style="width: 20%;">{{ city.women }}</td>
              <td role="cell" style="width: 20%; text-align: right;">{{ getTotal(city) }}</td>
            </tr>
          }
        </tbody>
      </table>
        } @else {
          <div class="no-results">
            No results found.
        </div>
        }
      </div>

    <section class="pagination" *ngIf="totalPages > 1" role="navigation" aria-label="Pagination Navigation">
      <button (click)="previousPage()" [disabled]="currentPage === 1" aria-label="Previous Page">Previous</button>
      <span aria-live="polite">Page {{ currentPage }} of {{ totalPages }}</span>
      <button (click)="nextPage()" [disabled]="currentPage === totalPages" aria-label="Next Page">Next</button>
    </section>

  </div>
  `,
  styleUrls: ['./table.component.scss']
})

export class TableComponent implements OnInit {
  public cities: { city: string, women: number, men: number, id: string }[] = [];
  public filteredCities: { city: string, women: number, men: number, id: string }[] = [];
  public paginatedCities: { city: string, women: number, men: number, id: string }[] = [];
  public currentPage: number = 1;
  public itemsPerPage: number = 5;
  public totalPages: number = 1;
  public selectedCity: string | null = null;
  public sortColumnKey: string = '';
  public sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private httpClient: HttpClient, private titleService: Title) { }

  @Output() citySelected = new EventEmitter<string>();

  ngOnInit(): void {
    this.httpClient.get<{ city: string, women: number, men: number, id: string }[]>('https://66cc4211a4dd3c8a71b6ef68.mockapi.io/api/cities')
      .subscribe(data => {
        this.cities = data;
        this.filteredCities = data;
        this.updatePagination();
      });
  }

  onSearch(term: string) {
    const lowerTerm = term.toLowerCase();
    this.filteredCities = this.cities.filter(city =>
      city.city.toLowerCase().split(' ').some(word => word.startsWith(lowerTerm))
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredCities.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCities = this.filteredCities.slice(startIndex, endIndex);
    this.updateTitle();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  updateTitle() {
    this.titleService.setTitle(`City Map - Page ${this.currentPage} of ${this.totalPages}`);
  }

  trackByCityId(index: number, city: { id: string }): string {
    return city.id;
  }

  getTotal(city: { women: number, men: number }): number {
    return Number(city.women) + Number(city.men);
  }

  selectCity(city: string) {
    this.selectedCity = city;
    this.citySelected.emit(city);
  }

  sortColumn(columnKey: string) {
    if (this.sortColumnKey === columnKey) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumnKey = columnKey;
      this.sortDirection = 'asc';
    }

    this.filteredCities.sort((a, b) => {
      const valueA = columnKey === 'total' ? this.getTotal(a) : (a as any)[columnKey];
      const valueB = columnKey === 'total' ? this.getTotal(b) : (b as any)[columnKey];

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      } else if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });

    this.updatePagination();
  }

  getAriaLabel(city: { city: string, women: number, men: number }): string {
    const menFormatted = numWords(city.men);
    const womenFormatted = numWords(city.women);
    const totalFormatted = numWords(this.getTotal(city));
    return `${city.city} City row, ${menFormatted} men, ${womenFormatted} women, total ${totalFormatted}`;
  }

}
