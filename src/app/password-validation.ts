import {AbstractControl, FormControl} from '@angular/forms';
export class PasswordValidation {

  static MatchPassword(AC: FormControl) {
    return new Promise( resolve => {
      const password = AC.parent.controls['password'].value; // to get value in input tag
      const confirmPassword = AC.value; // to get value in input tag
      if (password !== confirmPassword) {
        console.log('false');
        return resolve({not_match: true});
        // AC.get('confirmPassword').setErrors({MatchPassword: true});
      } else {
        // AC.get('confirmPassword').setErrors({MatchPassword: false});
        console.log('true');
        return resolve(null);
      }
    });
  }
}
