import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'button-overview',
  templateUrl: './button-overview.component.html',
  styleUrls: ['./button-overview.component.css']
})
export class ButtonOverviewComponent implements OnInit {

  status = false;
  description = 'not clicked';
  contents = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('/assets/button-overview/button-overview.e2e-spec.txt', {responseType: 'text'}).subscribe(data => {
      this.contents = data.toString();
    });
  }

  toggle() {
    this.status = !this.status;
    this.description = this.status ? "clicked" : "not clicked";
  }

}
