import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormService } from '../../../shared/services/form.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-form-list',
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.css']
})
export class FormListComponent implements OnInit {
  displayedColumns: string[] = ['title', 'description', 'actions'];
  dataSource = new MatTableDataSource<any>();
  forms$ = this.formService.forms$;
  snackBar: any;

  constructor(
    private formService: FormService,
    private router: Router,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.formService.getForms().subscribe(); // This will load initial data

    // Subscribe to forms$ to get updates
    this.formService.forms$.subscribe(forms => {
      this.dataSource.data = forms;
    });
  }

  loadForms() {
    this.formService.getForms().subscribe((forms: any[]) => {
      this.dataSource.data = forms;
    });
  }

  createNewForm() {
    this.router.navigate(['/admin/forms/new'], {
      queryParams: { create: true }
    });
  }

  // deleteForm(id: number) {
  //   if (confirm('Are you sure you want to delete this form?')) {
  //     this.formService.deleteForm(id).subscribe(() => {
  //       this.loadForms();
  //     });
  //   }
  // }

  deleteForm(id: number): void {
    if (confirm('Are you sure you want to delete this form?')) {
      this.formService.deleteForm(id).subscribe({
        next: () => {
          this.snackBar.open('Form deleted successfully', 'Close', {
            duration: 3000
          });
        },
        error: () => {
          this.snackBar.open('Error deleting form', 'Close', {
            duration: 3000
          });
        }
      });
    }
  }
}