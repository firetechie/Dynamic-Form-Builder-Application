import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormService } from '../../../shared/services/form.service';

@Component({
  selector: 'app-form-list',
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.css']
})
export class FormListComponent implements OnInit {
  displayedColumns: string[] = ['title', 'description', 'action'];
  dataSource = new MatTableDataSource<any>();

  constructor(private formService: FormService) { }

  ngOnInit(): void {
    this.loadForms();
  }

  loadForms() {
    this.formService.getForms().subscribe(forms => {
      this.dataSource.data = forms;
    });
  }
}