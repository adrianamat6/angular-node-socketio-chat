import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { io } from 'socket.io-client';

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
export class Chat {

  socket = io('http://localhost:3000');
  // messages: ChatMessage[] = [];
  messages = signal<ChatMessage[]>([])

  chatForm = new FormGroup({
    name: new FormControl(),
    message: new FormControl()
  });

  ngOnInit() {
    this.socket.on('chat_message_server', (data: ChatMessage) => {
      // this.messages.update((oldValue: ChatMessage[]) => {
      //   return [...oldValue, data];
      // })
      // const arrCopia = [...this.messages()];
      // arrCopia.push(data);
      // this.messages.set(arrCopia);
      this.messages.set([...this.messages(), data]);
    });
  }

  onSubmit() {
    this.socket.emit('chat_message', this.chatForm.value);
    this.chatForm.get('message')?.reset();
  }

}
