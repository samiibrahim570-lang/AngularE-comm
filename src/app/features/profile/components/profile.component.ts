import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, AuthResponse } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  currentUser: AuthResponse | null = null;
  loading = false;
  submitted = false;
  error = '';
  success = '';
  isEditing = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.initializeForm();
    }
  }

  initializeForm(): void {
    this.profileForm = this.formBuilder.group({
      fullName: [this.currentUser?.fullName || '', [Validators.required, Validators.minLength(3)]],
      email: [{ value: this.currentUser?.email || '', disabled: true }, Validators.required],
      phoneNumber: ['', [Validators.pattern(/^\d+$/)]],
      whatsAppNumber: ['', [Validators.pattern(/^\d+$/)]],
      address: ['', Validators.minLength(5)]
    });
  }

  get f() {
    return this.profileForm.controls;
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.initializeForm();
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    this.success = '';

    if (this.profileForm.invalid) {
      return;
    }

    if (!this.currentUser) {
      return;
    }

    this.loading = true;
    const updateData = {
      fullName: this.profileForm.get('fullName')?.value,
      phoneNumber: this.profileForm.get('phoneNumber')?.value,
      whatsAppNumber: this.profileForm.get('whatsAppNumber')?.value,
      address: this.profileForm.get('address')?.value
    };

    this.authService.updateProfile(this.currentUser.userId, updateData).subscribe({
      next: () => {
        this.success = 'Profile updated successfully!';
        this.isEditing = false;
        this.loading = false;
        setTimeout(() => {
          this.success = '';
        }, 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to update profile';
        this.loading = false;
      }
    });
  }
}
