import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FormBuilderComponent } from './components/form-builder/form-builder.component';
import { FormListComponent } from './components/form-list/form-list.component';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [
            { path: 'forms', component: FormListComponent },
            { path: 'create-form', component: FormBuilderComponent },
            { path: 'edit-form/:id', component: FormBuilderComponent },
            { path: '', redirectTo: 'forms', pathMatch: 'full' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }