import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response/api-response.model';
import { Role } from 'src/app/shared/models/role/role.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit, OnDestroy {
  @Input() role: any;
  public profil: any
  private subscription = new Subscription();

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.getProfil()
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getProfil() {
    this.subscription.add(
      this.userService.getRole(this.role.role_uuid).subscribe((response: ApiResponse) => {
        console.log(response.data);
        this.profil = response.data;
      })
    );
  }
}
