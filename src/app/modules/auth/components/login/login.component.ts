import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { ErrorAPI } from '../../../../shared/interface/error.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class LoginComponent implements OnInit {

  alert: { type: FuseAlertType; message: string } = {
    type   : 'success',
    message: ''
};
signInForm: UntypedFormGroup;
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
    this.signInForm = this._formBuilder.group({
        email     : ['', [Validators.required, Validators.email]],
        password  : ['', Validators.required],
        rememberMe: ['']
    });
}

// -----------------------------------------------------------------------------------------------------
// @ Public methods
// -----------------------------------------------------------------------------------------------------

/**
 * Sign in
 */
signIn()
{ 
  if(this.signInForm.valid){
    this._authService.signIn(this.signInForm.value).subscribe({
      next: (response)=>{
        this.showAlert=true; 
        this.alert= {
          type:'success',
          message:response.fullName+' Encontrado '
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
