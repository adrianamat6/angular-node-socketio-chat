import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { io } from 'socket.io-client';
import { environment } from '../../../environments/environment';

interface ChatMessage {
  name: string;
  message: string;
}

@Component({
  selector: 'app-chat',
  imports: [ReactiveFormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements OnInit {

  socket = io(environment.webServerUrl);

  messages = signal<ChatMessage[]>([]);
  clientsCount = signal<number>(0);

  chatForm = new FormGroup({
    name: new FormControl(''),
    message: new FormControl('')
  });

  ngOnInit() {
    // antes este callback estaba vacío y los mensajes nunca se guardaban
    this.socket.on('chat_message_server', (data: ChatMessage) => {
      this.messages.update(msgs => [...msgs, data]);
    });

    // el evento debe llamarse igual en frontend y backend: 'clients_count'
    this.socket.on('clients_count', (clientsCount: number) => {
      this.clientsCount.set(clientsCount);
    });
  }

  onSubmit() {
    this.socket.emit('chat_message', this.chatForm.value);
    this.chatForm.get('message')?.reset();
  }

}