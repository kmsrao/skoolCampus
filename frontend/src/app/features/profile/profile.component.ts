import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  changePasswordForm!: FormGroup;
  profileForm!: FormGroup;
  currentUser: any = null;
  isChangingPassword = false;
  isUpdatingProfile = false;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUserValue();
    this.initializeForms();
    this.loadProfile();
  }

  initializeForms(): void {
    this.changePasswordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(4)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(4)]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );

    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.email]],
      phone: [''],
      address: [''],
    });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  loadProfile(): void {
    this.userService.getProfile().subscribe({
      next: (profile) => {
        this.profileForm.patchValue({
          name: profile.name,
          email: profile.email,
          phone: profile.phone || profile.mobileno,
          address: profile.address || profile.currentAddress,
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load profile',
        });
      },
    });
  }

  onChangePassword(): void {
    if (this.changePasswordForm.invalid) {
      Object.keys(this.changePasswordForm.controls).forEach((key) => {
        this.changePasswordForm.get(key)?.markAsDirty();
      });
      return;
    }

    this.isChangingPassword = true;
    const formValue = this.changePasswordForm.value;

    this.userService.changePassword(formValue).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message || 'Password changed successfully',
        });
        this.changePasswordForm.reset();
        this.isChangingPassword = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to change password',
        });
        this.isChangingPassword = false;
      },
    });
  }

  onUpdateProfile(): void {
    if (this.profileForm.invalid) {
      Object.keys(this.profileForm.controls).forEach((key) => {
        this.profileForm.get(key)?.markAsDirty();
      });
      return;
    }

    this.isUpdatingProfile = true;
    const formValue = this.profileForm.value;

    this.userService.updateProfile(formValue).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message || 'Profile updated successfully',
        });
        this.isUpdatingProfile = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to update profile',
        });
        this.isUpdatingProfile = false;
      },
    });
  }

  getFormError(formName: 'changePasswordForm' | 'profileForm', fieldName: string): string {
    const form = this[formName];
    const control = form.get(fieldName);

    if (control?.hasError('required') && control.dirty) {
      return 'This field is required';
    }

    if (control?.hasError('minlength') && control.dirty) {
      return 'Password must be at least 4 characters';
    }

    if (control?.hasError('email') && control.dirty) {
      return 'Invalid email address';
    }

    if (fieldName === 'confirmPassword' && control?.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }

    return '';
  }
}
