import { Component, inject } from '@angular/core';

import { navItems } from './_nav';
import { Subject, takeUntil, tap } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent {

  public navItems = navItems;

  isAuthenticated = false;
  // listConfig: ArticleListConfig = {
  //   type: "all",
  //   filters: {},
  // };
  // tags$ = inject(TagsService)
  //   .getAll()
  //   .pipe(tap(() => (this.tagsLoaded = true)));
  tagsLoaded = false;
  destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    console.log("defaultlayour")
    // this.userService.isAuthenticated
    //   .pipe(
    //     tap((isAuthenticated) => {
    //       if (isAuthenticated) {
    //         void this.router.navigate(["/"]);
    //       } else {
    //         void this.router.navigate(["/login"]);
    //       }
    //     }),
    //     takeUntil(this.destroy$)
    //   )
    //   .subscribe(
    //     (isAuthenticated: boolean) => (this.isAuthenticated = isAuthenticated)
    //   );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // setListTo(): void {
  //   // If feed is requested but user is not authenticated, redirect to login
  //   if (!this.isAuthenticated) {
  //     void this.router.navigate(["/login"]);
  //     return;
  //   }

  //   // Otherwise, set the list object
  //   // this.listConfig = { type: type, filters: filters };
  // }
}
