import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  Validators,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { Errors } from "../../../models/errors.model";
import { first, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { UserService } from "src/app/services/user.service";
import { AuthenticationService } from "src/app/services/authentication.service";

interface AuthForm {
  username: FormControl<string>;
  password: FormControl<string>;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  authType = "";
  title = "";
  errors: Errors = { errors: {} };
  isSubmitting = false;
  authForm: FormGroup<AuthForm>;
  destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly authenticationService: AuthenticationService
  ) {
    // use FormBuilder to create a form group
    this.authForm = new FormGroup<AuthForm>({
      username: new FormControl("", {
        validators: [Validators.required],
        nonNullable: true,
      }),
      password: new FormControl("", {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });
  }

  ngOnInit(): void {
    this.authType = this.route.snapshot.url.at(-1)!.path;
    this.title = this.authType === "login" ? "Sign in" : "Sign up";
    if (this.authType === "register") {
      this.authForm.addControl(
        "username",
        new FormControl("", {
          validators: [Validators.required],
          nonNullable: true,
        })
      );
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  submitForm(): void {
    console.log(this.authForm.value, ">>this.authForm.value")
    this.isSubmitting = true;
    this.errors = { errors: {} };

    // let observable =
    //   this.authType === "login"
    //     ? this.userService.login(
    //       this.authForm.value as { email: string; password: string }
    //     )
    //     : this.userService.register(
    //       this.authForm.value as {
    //         email: string;
    //         password: string;
    //         username: string;
    //       }
    //     );

    // observable.pipe(takeUntil(this.destroy$)).subscribe({
    //   next: () => void this.router.navigate(["/"]),
    //   error: (err) => {
    //     this.errors = err;
    //     this.isSubmitting = false;
    //   },
    // });
    this.authenticationService.login(this.authForm.value as { username: string; password: string })
    .pipe(takeUntil(this.destroy$)).subscribe({
        next: () => void this.router.navigate(["/"]),
        error: (err) => {
          this.errors = err;
          this.isSubmitting = false;
        },
      });
  }
}
