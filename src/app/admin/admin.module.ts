import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

// Components
import { FormBuilderComponent } from './components/form-builder/form-builder.component';
import { FormListComponent } from './components/form-list/form-list.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MaterialModule } from '../core/material.module';

@NgModule({
    declarations: [
        DashboardComponent,
        FormBuilderComponent,
        FormListComponent
    ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        DragDropModule,
        MaterialModule,
    ]
})
export class AdminModule { }