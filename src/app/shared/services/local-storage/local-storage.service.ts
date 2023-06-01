import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setLocalStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getLocalStorage(key: string) {
    const value = localStorage.getItem(key);
    return JSON.parse(value as string)
  }

  removeLocalStorage(key: string) {
    return localStorage.removeItem(key);
  }

  clearLocalStorage() {
    return localStorage.clear();
  }
}
