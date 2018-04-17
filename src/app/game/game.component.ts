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
  opponentId: number;
  imgbalise: string = '';
  img;
  rooms: Observable<any[]>;
  popup = false;

  constructor(private route: ActivatedRoute, authService: AuthService, 
              private db: AngularFirestore, private router: Router, 
              public auth: AuthService, private modalService: NgbModal) {
    // this.img = db.collection('img').valueChanges();
    this.rooms = db.collection('rooms').valueChanges();
  }
  ngOnInit() {
    this.roomId = this.route.snapshot.paramMap.get('id');
    this.username = this.route.snapshot.paramMap.get('username');
    this.username = this.username.replace(/\s/g, '');
    this.db
    .collection('img')
    .valueChanges()
    .subscribe((img) => {
      this.img = img;
    });
    this.db
      .doc<Room>('rooms/' + this.roomId)
      .valueChanges()
      .subscribe((room) => {
        this.room = room;
        if (!room) {
          this.router.navigate(['home']);
        }
        if (room.players.length === 2) {
          if (this.room.players[0].win || this.room.players[1].win) {
            this.popup = true;
          }
          this.message = ' ';
        }
        this.myPlayerId = room.players[0].name === this.username ? 0 : 1;
        // this.opponentId = room.players[0].name === this.username ? 1 : 0;
        if (room.players[1]) {
          this.opponentId = room.players[1].name === this.username ? 1 : 0;
        }
        
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
    this.db.doc<Room>('rooms/' + this.roomId).delete().then(() => {
    });
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
          // this.htmlStr = '<img src=' + this.room.players[0].url +
        //  ' alt = "imgToFind" class="test"><h3>' + this.room.players[0].img + '</h3>';
          // this.card = false;
          
        } else if (this.room.players[1].name === this.username) {
          this.room.players[1].img = imgbalise.name;
          this.room.players[1].url = imgbalise.urlImg;
          this.db.doc<Room>('rooms/' + this.roomId).update(this.room);
          // this.htmlStr = '<img src=' + this.room.players[1].url +
        //  ' alt = "imgToFind" class="test"><h3>' + this.room.players[1].img + '</h3>';
          // this.card = false;
          
        }
        this.setWinFalse();
      });
  }
  isLoose(i) {    

    if (this.room && this.room.players.length > 1) {
      this.img[i].disabled = true;
    
      if (this.img.reduce((acc, el) => {
        return acc && el.disabled ? el.disabled : false;
      })) {
        this.room.players[this.opponentId].win = true;
        this.db.doc<Room>('rooms/' + this.roomId).update(this.room);
      }
    }

    
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
      this.db.doc<Room>('rooms/' + this.roomId).delete().then(() => {

      });
    } else if (this.room.players[1].name === this.username) {
      this.room.players[1].win = true;
      this.db.doc<Room>('rooms/' + this.roomId).update(this.room);
      this.router.navigate(['home']);
      this.db.doc<Room>('rooms/' + this.roomId).delete().then(() => {

      });
    }
  }
}



// ar app = angular.module("testapp",[]);

// app.factory("DataModel", function() {
//   var Service = {};
  
  
  
//   return Service;
// });

// app.controller("ChatController", function($scope) {
//   $scope.chatMessages = [];
  
//   $scope.formatChat = function(icon,username,text,origDt) {
//     var chat = {};
//     chat.icon = icon;
//     chat.username = username;
//     chat.text = text;
//     chat.origDt = origDt;
//     return chat;
//   }
  
//   $scope.addChat = function() {
//     if ($scope.newChatMsg != "") {
//       var chat = $scope.formatChat("http://placehold.it/16x16",
//                            "steve",
//                            $scope.newChatMsg,
//                            new Date());
       
//       $scope.chatMessages.push(chat);
//       $scope.newChatMsg = "";
//     }
//     else {
      
//     }
//   }
  
// });

// app.filter('reverse', function() {
//   return function(items) {
//     return items.slice().reverse();
//   };
// });
