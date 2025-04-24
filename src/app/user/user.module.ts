import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { FormListComponent } from './components/form-list/form-list.component';
import { FormSubmissionComponent } from './components/form-submission/form-submission.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MaterialModule } from '../core/material.module';

@NgModule({
    declarations: [
        DashboardComponent,
        FormListComponent,
        FormSubmissionComponent
    ],
    imports: [
        CommonModule,
        UserRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule
    ]
})
export class UserModule { }