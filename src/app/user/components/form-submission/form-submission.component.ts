import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from '../../../shared/services/form.service';

@Component({
  selector: 'app-form-submission',
  templateUrl: './form-submission.component.html',
  styleUrls: ['./form-submission.component.css']
})
export class FormSubmissionComponent implements OnInit {
  form: any;
  submissionForm: FormGroup;
  submitted = false;
  submissionSuccess = false;

  constructor(
    private formService: FormService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.submissionForm = this.fb.group({});
  }

  ngOnInit(): void {
    const formId = this.route.snapshot.params['id'];
    this.formService.getFormById(+formId).subscribe(form => {
      this.form = form;
      this.createForm();
    });
  }

  createForm() {
    const group: any = {};
    this.form?.fields.forEach((field: any) => {
      const validators = [];
      if (field.required) {
        validators.push(Validators.required);
      }
      group[field.id] = [field.defaultValue || '', validators];
    });
    this.submissionForm = this.fb.group(group);
  }

  onSubmit() {
    if (this.submissionForm.valid) {
      this.formService.submitForm(this.form.id, this.submissionForm.value)
        .subscribe(
          () => {
            this.submissionSuccess = true;
            setTimeout(() => {
              this.router.navigate(['/user/forms']);
            }, 2000);
          },
          error => {
            console.error('Submission failed', error);
            this.submitted = true;
            this.submissionSuccess = false;
          }
        );
    } else {
      this.submitted = true;
    }
  }
}