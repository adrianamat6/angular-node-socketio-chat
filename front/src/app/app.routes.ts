import { Routes } from '@angular/router';
import { Chat } from './components/chat/chat';

export const routes: Routes = [
    { path: '', component: Chat },
    { path: 'chat', component: Chat },
    { path: '**', component: Chat }
];
