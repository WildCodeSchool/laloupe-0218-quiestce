import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from 'angularfire2/firestore';
import { Player } from './../models/player';
import { Room } from './../models/room';
import 'rxjs/add/operator/take';
import { LoginComponent } from '../login/login.component';
import { AuthService } from './../auth.service';

@Component({
  selector: 'app-matchmaking',
  templateUrl: './matchmaking.component.html',
  styleUrls: ['./matchmaking.component.scss'],
})
export class MatchmakingComponent implements OnInit {

  constructor(private authService: AuthService, private db: AngularFirestore, 
              private router: Router) { }

  ngOnInit() {
    this.getRooms();
  }

  getRooms() {
    const roomsCollection = this.db.collection<Room>('rooms');

    const snapshot = roomsCollection.snapshotChanges().take(1).subscribe((snap) => {
      const player = new Player();
      player.name = this.authService.name;

      for (const snapshotItem of snap) {
        const roomId = snapshotItem.payload.doc.id;
        const roomy = snapshotItem.payload.doc.data() as Room;

        if (roomy.players.length === 1) {
          roomy.players.push(player);
          this.db.doc('rooms/' + roomId).update(JSON.parse(JSON.stringify(roomy)));
          this.router.navigate(['game', roomId, player.name]);
          return;
        }
      }

      const room = new Room();
      room.turn = 1;
      room.players = [player];
      this.db.collection('rooms')
        .add(JSON.parse(JSON.stringify(room)))
        .then((doc) => {
          this.router.navigate(['game', doc.id, player.name]);
        });
    });
  }

  mainMenu() {
    this.router.navigate(['home']);
  }
}
