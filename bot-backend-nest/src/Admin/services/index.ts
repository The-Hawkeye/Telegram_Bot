import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  private apiKey = 'b1bac58531f9171a352beae496bc5155';
  private users: string[] = [];

  getApiKey(): string {
    console.log(this.apiKey);
    return this.apiKey;
  }

  setApiKey(key: string): string {
    this.apiKey = key;
    return 'API key updated successfully';
  }

  getUsers(): string[] {
    return this.users;
  }
}
