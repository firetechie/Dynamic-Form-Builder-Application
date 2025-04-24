import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FormListComponent } from './components/form-list/form-list.component';
import { FormSubmissionComponent } from './components/form-submission/form-submission.component';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [
            { path: 'forms', component: FormListComponent },
            { path: 'form/:id', component: FormSubmissionComponent },
            { path: '', redirectTo: 'forms', pathMatch: 'full' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }