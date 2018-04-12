import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from 'angularfire2/firestore';
import { Player } from './../models/player';
import { Room } from './../models/room';
import { Img } from './../models/img';
import * as firebase from 'firebase/app';
import { MatchmakingComponent } from '../matchmaking/matchmaking.component';
import { AuthService } from '../auth.service';
import { NgbModal, NgbActiveModal, NgbModule, 
  ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  closeResult: string;
  message = 'Attente d\'un joueur';
  msg;
  roomId: string;
  username: string;
  room: Room = new Room();
  myPlayerId: number;
  imgbalise: string = '';
  htmlStr: string = '';
  card:boolean = true;
  img: Observable<any[]>;
  rooms: Observable<any[]>;
  popup = false;
  constructor(private route: ActivatedRoute, authService: AuthService, 
              private db: AngularFirestore, private router: Router, 
              public auth: AuthService, private modalService: NgbModal) {
    this.img = db.collection('img').valueChanges();
    this.rooms = db.collection('rooms').valueChanges();
  }
  ngOnInit() {
    this.roomId = this.route.snapshot.paramMap.get('id');
    this.username = this.route.snapshot.paramMap.get('username');
    this.username = this.username.replace(/\s/g, '');
    this.db
      .doc<Room>('rooms/' + this.roomId)
      .valueChanges()
      .subscribe((room) => {
        this.room = room;
        this.myPlayerId = room.players[0].name === this.username ? 0 : 1;
        if (room.players.length === 2) {
          if (this.room.players[0].win || this.room.players[1].win) {
            this.popup = true;
          }
          this.message = 'Starting game';
          if (this.room.players[0].url && this.room.players[0].name === this.username) {
            this.htmlStr = '<img src=' + this.room.players[0].url +
             ' alt = "imgToFind" ><h3>' + this.room.players[0].img + '</h3>';
            this.card = false;
          } else if (this.room.players[1].url && this.room.players[1].name === this.username) {
            this.htmlStr = '<img src=' + this.room.players[1].url +
             ' alt = "imgToFind" ><h3>' + this.room.players[1].img + '</h3>';
            this.card = false;
          }
        }
      });

      
    const $wrap = $('#gameBoard');
    $wrap
      .on('click', '.card', function (e) {
        $(this).toggleClass('hidden');
        return false;
      })
      .on('mouseover', '.card', function (e) {
        $(this).addClass('toggle');
      })
      .on('mouseout', '.card', function (e) {
        $(this).removeClass('toggle');
      });
  }
  open(content) {
    this.modalService.open(content);
  }

  // set var win to false in db
  setWinFalse() {
    this.room.players[0].win = false;
    this.room.players[1].win = false;
    this.db.doc<Room>('rooms/' + this.roomId).update(this.room);
  }
  // turn by turn
  test() {
    if (this.room.players[0].name === this.username) {
      this.room.turn = 1;
    } else if (this.room.players[1].name === this.username) {
      this.room.turn = 0;
    }
    this.db.doc('rooms/' + this.roomId).update(JSON.parse(JSON.stringify(this.room)));
  }
  // check if it's my turn
  isMyTurn(): boolean {
    return this.room && this.room.turn !== undefined && 
    this.room.players[this.room.turn].name === this.username;
  }
  // go to home
  mainMenu() {
    this.router.navigate(['home']);
  }
  // return a random number
  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  // random card to find
  randomCard() {
    let imgbalise;
    this.db
      .collection<Img>('img')
      .valueChanges()
      .take(1)
      .subscribe((img) => {        
        imgbalise = img[this.getRandomInt(23)];
        this.updateRoom();
        if (this.room.players[0].name === this.username) {
          this.room.players[0].img = imgbalise.name;
          this.room.players[0].url = imgbalise.urlImg;
          this.db.doc<Room>('rooms/' + this.roomId).update(this.room);
          this.htmlStr = '<img class="anonyme randomC" src=' + this.room.players[0].url +
         ' alt = "imgToFind" ><h3>' + this.room.players[0].img + '</h3>';
          this.card = false;
          
        } else if (this.room.players[1].name === this.username) {
          this.room.players[1].img = imgbalise.name;
          this.room.players[1].url = imgbalise.urlImg;
          this.db.doc<Room>('rooms/' + this.roomId).update(this.room);
          this.htmlStr = '<img class="anonyme randomC" src=' + this.room.players[1].url +
         ' alt = "imgToFind" ><h3>' + this.room.players[1].img + '</h3>';
          this.card = false;
          
        }
        this.setWinFalse();
      });
    console.log(this.img[1].urlImg);
  }
  
  // update room ?
  updateRoom() {
    this.db.doc<Room>('rooms/' + this.roomId).update(this.room);
  }
  // input question
  onEnter(value: string) { 
    if (this.room.players[0].img.toLowerCase() === value.toLowerCase()) {  
      this.room.players[0].win = true;
      this.db.doc<Room>('rooms/' + this.roomId).update(this.room);
    } else if (this.room.players[1].img.toLowerCase() === value.toLowerCase()) { 
      this.room.players[1].win = true;
      this.db.doc<Room>('rooms/' + this.roomId).update(this.room);
    }
    const data = { question:value, answer:null, user:'' };
    this.room.answers.push(data);
    this.test();  
  }
  // check if it's my turn to answer
  isMyTurnToAnswer() {
    if (this.room.answers.length > 0 &&
       this.room.answers[this.room.answers.length - 1].user !== this.username &&
       this.room.answers[this.room.answers.length - 1].answer !== undefined) {
      return true; 
    }
    return false;
  }
  // send answer to opponent
  sendAnswer(val) {
    this.room.answers[this.room.answers.length - 1].answer = val;
    this.room.answers[this.room.answers.length - 1].user = this.username;
    this.db.doc<Room>('rooms/' + this.roomId).update(this.room);
  }
  // return last question
  lastQuestion() {
    return 'Question : ' + this.room.answers[this.room.answers.length - 1].question;    
  }
   // display q&a
  lastResponse() {
    if (this.room.answers !== undefined && this.room.answers.length > 0 &&
       this.room.answers[this.room.answers.length - 1].answer !== null) {
      if (this.room.answers[this.room.answers.length - 1].answer) {
        return 'Question: ' + this.room.answers[this.room.answers.length - 1].question +
    ' Reponse: Oui';
      } 
      return 'Question: ' + this.room.answers[this.room.answers.length - 1].question +
    ' Reponse: Non';
    }
  }
  rageQuit() {
    if (this.room.players[0].name === this.username) {
      this.room.players[0].win = true;
      this.db.doc<Room>('rooms/' + this.roomId).update(this.room);
      this.router.navigate(['home']);
    } else if (this.room.players[1].name === this.username) {
      this.room.players[1].win = true;
      this.db.doc<Room>('rooms/' + this.roomId).update(this.room);
      this.router.navigate(['home']);
    }
  }
}

