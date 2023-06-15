import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setLocalStorage(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  getLocalStorage(key: string) {
    const value = localStorage.getItem(key);
    return value as string
  }

  removeLocalStorage(key: string) {
    return localStorage.removeItem(key);
  }

  clearLocalStorage() {
    return localStorage.clear();
  }
}
