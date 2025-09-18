import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.html',
})
export class Notifications implements OnInit {
  messages = signal<{text: string, type: string}[]>([]);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<{messages: {text: string, type: string}[]}>('http://localhost:3000/notifications')
      .subscribe(res => this.messages.set(res.messages));
  }
}
