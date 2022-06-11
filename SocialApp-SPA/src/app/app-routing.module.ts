import { AuthtabsGuard } from './guard/authtabs.guard';
import { AuthGuard } from './guard/auth.guard';
import { AuthTabsComponent } from './components/auth-tabs/auth-tabs.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./components/auth-tabs/auth.module').then(m => m.AuthModule),
    canActivate: [AuthtabsGuard]
  },
  {
    path: 'streams',
    loadChildren: () => import('./components/streams/streams.module').then(m => m.StreamsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'post/:id',
    loadChildren: () => import('./components/comments/comments.module').then(m => m.CommentsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'people',
    loadChildren: () => import('./components/people/people.module').then(m => m.PeopleModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'people/following',
    loadChildren: () => import('./components/following/following.module').then(m => m.FollowingModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'people/followers',
    loadChildren: () => import('./components/followers/followers.module').then(m => m.FollowersModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'notifications',
    loadChildren: () => import('./components/notifications/notifications.module').then(m => m.NotificationsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'chat/:id',
    loadChildren: () => import('./components/chat/chat.module').then(m => m.ChatModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
