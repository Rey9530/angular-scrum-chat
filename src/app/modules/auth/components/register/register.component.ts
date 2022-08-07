import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { ErrorAPI } from '../../../../shared/interface/error.interface';
import { User } from '../../../../core/user/user.types';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class RegisterComponent implements OnInit {

  @ViewChild('signUpNgForm') signUpNgForm: NgForm;

  alert: { type: FuseAlertType; message: string } = {
      type   : 'error',
      message: ''
  };
  signUpForm: UntypedFormGroup;
  showAlert: boolean = false;

  /**
   * Constructor
   */
  constructor(
      private _authService: AuthService,
      private _formBuilder: UntypedFormBuilder
  )
  {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void
  {
      // Create the form
      this.signUpForm = this._formBuilder.group({
              fullName      : ['', Validators.required],
              email     : ['', [Validators.required, Validators.email]],
              password  : ['', Validators.required], 
              agreements: ['', Validators.requiredTrue]
          }
      );
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Sign in
   */
  signUp(): void
  {
    this.showAlert=false;
    if(this.signUpForm.valid){
      let formData = this.signUpForm.value;
      delete formData.agreements ;
      this._authService.signUp(formData).subscribe({
        next: (response:User)=>{ 
          this.showAlert=true; 
          this.alert= {
            type:'success',
            message:' El usuario: '+response.fullName+' fue creado'
          } 
          location.reload();
        },
        error: (error)=>{ 
          this.showAlert=true;
          let respError:ErrorAPI = error.error; 
          this.alert= {
            type:'error',
            message:respError.message.toString()
          } 
        },
      })
    }
  }
}
