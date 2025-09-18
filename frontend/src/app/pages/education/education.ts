import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './education.html',
})
export class Education implements OnInit {
  lessons = signal<{title: string, content: string}[]>([]);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<{lessons: {title: string, content: string}[]}>('http://localhost:3000/education')
      .subscribe(res => this.lessons.set(res.lessons));
  }
}
