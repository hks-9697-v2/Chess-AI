


var board,
game = new Chess();
var init_move=game.ugly_moves()[0];
//Sorting Structure
var sort_struct={
obj:game.ugly_moves()[0],
val:0

};


//Openings ....................
var MoveCount=0,can=0;
var Opening_ready=function(moves){
 can=0;
 var s;

 if(moves.length==1){
 //Giuoco Piano Opening
 if(moves[0]=="e4")
 {
 game.move('e5');
 board.position(game.fen()); 
 return 1;
 }
 //Queen's Gambit
 if(moves[0]=="d4")
 {
 
 game.move('d5');
 board.position(game.fen());
 return 1;
 }
 //English Opening
 if(moves[0]=="c4")
 {
 
 game.move('c5');
 board.position(game.fen());
 return 1;
 }
 if(moves[0]=="Nf3")
 {
 game.move('e5');
 board.position(game.fen()); 
 return 1;
 }
 }
 else if(moves.length==3){
 if(moves[0]=="e4"&&moves[1]=="e5"&&moves[2]=="Nf3")
 {
 game.move('Nc6');
 board.position(game.fen());
 return 1;
 }
 // Tchigoran Defense
 else if(moves[0]=="d4"&&moves[1]=="d5"&&moves[2]=="c4")
 {
 game.move('Nc6');
 board.position(game.fen());
 return 1;
 }
 //Hedgehog Defence
 else if(moves[0]=="c4"&&moves[1]=="c5"&&moves[2]=="Nf3")
 {
 game.move('Nf6');
 board.position(game.fen());
 return 1;
 }
 //King's Gambit
 else if(moves[0]=="e4"&&moves[1]=="e5"&&moves[2]=="f4")
 {
 game.move('exf4');
 board.position(game.fen());
 return 1;
 }
 }
 else if(moves.length==5){
 if(moves[0]=="e4" && moves[1]=="e5" && moves[2]=="Nf3" && moves[3]=="Nc6"&&moves[4]=="Bc4")
 {
 game.move('Bc5');
 board.position(game.fen());
 return 1;
 }
 else if(moves[0]=="c4"&&moves[1]=="c5"&&moves[2]=="Nf3"&& moves[3]=="Nc6"&&moves[4]=="g4")
 {
 game.move('b6');
 board.position(game.fen());
 return 1;
 }
 //Nizmo-Indian Defense
 else if(moves[0]=="d4"&&moves[1]=="Nf6"&&moves[2]=="c4"&& moves[3]=="e6"&&moves[4]=="Nc3")
 {
 game.move('Bb4');
 board.position(game.fen());
 return 1;
 }
 }
 
 if(moves.length==1)
 {
 game.move('e6');
 board.position(game.fen());
 return 1;
 }

 return 0;
 
};


//Openings End here....................



//Move Ordering Evaluation function

 function rank(i) {
 return i >> 4;
 }
 
 function file(i) {
 return i & 15;
 }
 
 function algebraic(i){
 var f = file(i), r = rank(i);
 return 'abcdefgh'.substring(f,f+1) + '87654321'.substring(r,r+1);
 }

 
var getFastcompare = function (move) {
var piece=move.piece;
var y=rank(move.to);
var x=file(move.to);
var y1=rank(move.from);
var x1=file(move.from);
var isWhite=move.color=='w';
var ans=0;
if (piece=== 'p') {
 ans= ( isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x] )-( isWhite ? pawnEvalWhite[y1][x1] : pawnEvalBlack[y1][x1] );
} else if (piece=== 'r') {
 ans= ( isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x] )- ( isWhite ? rookEvalWhite[y1][x1] : rookEvalBlack[y1][x1] );
} else if (piece=== 'n') {
 ans= knightEval[y][x]-knightEval[y1][x1];
} else if (piece=== 'b') {
 ans= ( isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x] )-( isWhite ? bishopEvalWhite[y1][x1] : bishopEvalBlack[y1][x1] );
} else if (piece=== 'q') {
 ans= evalQueen[y][x]-evalQueen[y1][x1];
} else if (piece=== 'k') {
 ans= ( isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x] ) - ( isWhite ? kingEvalWhite[y1][x1] : kingEvalBlack[y1][x1] );
}
if(game.get(algebraic(move.to)))
{
if (game.get(algebraic(move.to)).type=== 'p') {
 ans= ans + 10;
} else if (game.get(algebraic(move.to)).type=== 'r') {
 ans= ans + 50;
} else if (game.get(algebraic(move.to)).type=== 'n') {
 ans= ans + 30;
} else if (game.get(algebraic(move.to)).type=== 'b') {
 ans= ans + 30;
} else if (game.get(algebraic(move.to)).type=== 'q') {
 ans= ans + 90;
} else if (game.get(algebraic(move.to)).type=== 'k') {
 ans= ans + 900;
}
}
return ans;
};

var eval_compare_value=function(a)
{
if(a==1)
{
 return -1;
}
else if(a==4)
{
 return -1;
}
else if(a==2)
{
 return -1;
}
else
{
 return 1;
}
}

var eval_compare=function(a,a_eval,b,b_eval){
return (eval_compare_value(a.flags)<eval_compare_value(b.flags))||((eval_compare_value(a.flags)==eval_compare_value(b.flags))&&(a_eval<b_eval));
}

//Move Ordering Evaluation Function Ends .................

//Transposition Table
var temp1=[];

 var temp2=[];
 var temp3=[];

 for (var i=0;i<1000004;i++){
 temp1.push("as");
 }

 for (var i=0;i<1000004;i++){
 temp2.push(-1);
 }

 for (var i=0;i<1000004;i++){
 temp3.push(init_move);
 }

 var Hash=function(x="as"){
 var val=0;
 var len=x.length;
 
 for (var i=0;i<len;i++){
 var p=x.charCodeAt(i);
 val=val*97+(p-40);
 val%=1000003;
 if(val<0){
 val+=1000003;
 }
 }
 return val;
 }


var lookup=function(indx=1,st="as"){
 if(temp2[indx]==-1)
 return -1;

 if(temp1[indx]!=st){
 console.log("Collision\n");
 console.log(indx);
 console.log("\n");
 console.log(temp1[indx]);
 console.log("\n");
 console.log(st);
 console.log("\n");
 return -1;
 }

 return 1;
}


var insert=function(st,indx,next){
 
 temp1[indx]=st;
 temp2[indx]=1;
 temp3[indx]=next;
}

var get=function(indx=1){
 console.log("Finally\n");
 console.log(temp3[indx]);
 return temp3[indx];
 
}
//Transposition Table functions end here...........




//MiniMax With Alphabeta pruning
var minimaxRoot =function(depth, game, isMaximisingPlayer) {

var newGameMoves = game.ugly_moves();
var bestMove = -9999;
var bestMoveFound;

// Move Ordering......

var newGameMovearr=[];

for (var i=0;i<newGameMoves.length;i++){

var temp={
 obj:newGameMoves[i],
 value:getFastcompare(newGameMoves[i])
};
newGameMovearr.push(temp);
}
newGameMovearr.sort(function(a,b){return eval_compare(a.obj,a.value,b.obj,b.value)});


// Move Ordering ends.....

for(var i = 0; i < newGameMoves.length; i++) {
 var newGameMove = newGameMovearr[i].obj;
 
 game.ugly_move(newGameMove);
 var value = minimax(depth - 1, game, -10000, 10000, !isMaximisingPlayer);
 //var value=negamax(depth-1,game,-10000,10000,!isMaximisingPlayer);
 game.undo();
 if(value >= bestMove) {
 bestMove = value;
 bestMoveFound = newGameMove;
 }
}


return bestMoveFound;
}



var minimax = function (depth, game, alpha, beta, isMaximisingPlayer) {
positionCount++;
var cur=game.fen();
var curHash=Hash(cur);
if (depth === 0) {
 return -evaluateBoard(game.board());
}

var newGameMoves = game.ugly_moves();
//Value Recall using transposition table.
var trans_move=newGameMoves[0];
if(lookup(curHash,cur)==1){
 trans_move=get(curHash);
}
else
{
 trans_move=init_move;
}
// Move Ordering......
var newGameMovearr=[];

for (var i=0;i<newGameMoves.length;i++){

var temp={
 obj:newGameMoves[i],
 value:getFastcompare(newGameMoves[i])
};
newGameMovearr.push(temp);

}
newGameMovearr.sort(function(a,b){return (eval_compare(a.obj,a.value,b.obj,b.value)||b===trans_move)});


// Move Ordering ends.....


var idx=0;
var bmvalue=0;
//Value Store using transposition table.
if (isMaximisingPlayer) {
 var bestMove = -9999;
 for (var i = 0; i < newGameMoves.length; i++) {
 game.ugly_move(newGameMovearr[i].obj);
 bmvalue=bestMove;
 bestMove = Math.max(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
 if(bmvalue==bestMove)
 {}
 else
 {
 idx=i;
 }
 game.undo();
 alpha = Math.max(alpha, bestMove);
 if (beta <= alpha) {
 try {insert(cur,curHash,newGameMovearr[i].obj);}catch(err) { }
 return bestMove;
 }
 }
 try {insert(cur,curHash,newGameMovearr[idx].obj);}catch(err) { }
 return bestMove;

} else {
 var bestMove = 9999;
 for (var i = 0; i < newGameMoves.length; i++) {
 game.ugly_move(newGameMovearr[i].obj);
 bmvalue=bestMove;
 bestMove = Math.min(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
 if(bmvalue==bestMove)
 {}
 else
 {
 idx=i;
 }
 game.undo();
 beta = Math.min(beta, bestMove);
 if (beta <= alpha) {
 try {insert(cur,curHash,newGameMovearr[i].obj);}catch(err) { }
 return bestMove;
 }
 }
 try {insert(cur,curHash,newGameMovearr[idx].obj);}catch(err) { }
 return bestMove;
}
};

//Het Change


// var mtdfminimax = function (depth,alpha, beta) {

//  MoveCount++;
//  if (depth === 0) {
//  return -evaluateBoard(game.board());
//  }
 
//  var newGameMoves = game.ugly_moves();
//  var bestmove;
//  for (var i=0;i<newGameMoves.length;i++){
//  game.ugly_move(newGameMoves[i]);
//  var p=-mtdfminimax(depth-1,-beta,-alpha);
//  if(p>=alpha){
//  alpha=p;
//  }
//  game.undo();
//  if(alpha>=beta){
//  break;
//  }
//  }

//  return alpha;
//  //var cur=game.fen();
//  //var curHash=Hash(cur);
 
//  // if(lookup(curHash,cur)==1){
//  // return newGameMoves[get(curHash)];
//  // }
// };

// var mtdfMinimaxroot=function(depth, game, isMaximisingPlayer){
//  var newGameMoves=game.ugly_moves();
//  var bestmove=newGameMoves[0];
//  var bestval=-20000;

//  for (var i=0;i<newGameMoves.length;i++){
//  var alpha=-10000,beta=-alpha;

//  game.ugly_move(newGameMoves[i]);
//  while(alpha+1>beta){
//  var mid=(alpha+beta)>>1;

//  var val=-mtdfminimax(depth-1,mid,mid+1);

//  if(val<=mid){
//  beta=mid;
//  }

//  else alpha=mid+1;
//  }

//  var finalval=mtdfminimax(depth-1,alpha,beta);
//  if(finalval>bestval){
//  bestval=finalval;
//  bestmove=newGameMoves[i];
//  }
 
//  game.undo();
//  }

//  return bestmove;
 
// };


// Basic Minimax Algorithm....................


var basicMinimaxRoot = function(depth, game, isMaximisingPlayer) {

var newGameMoves = game.ugly_moves();
var bestMove = -9999;
var bestMoveFound;
for(var i = 0; i < newGameMoves.length; i++) {
 var newGameMove = newGameMoves[i];
 game.ugly_move(newGameMove);
 
 var value = basicMinimax(depth - 1, game, !isMaximisingPlayer);
 game.undo();
 if(value >= bestMove) {
 bestMove = value;
 bestMoveFound = newGameMove;
 }
}
return bestMoveFound;
}

var basicMinimax = function(depth, game, isMaximisingPlayer) {
if(depth==0)
 return -evaluateBoard(game.board());

var newGameMoves = game.ugly_moves();

if(isMaximisingPlayer) {
 var bestValue = -10000;
 for(var i=0; i<newGameMoves.length; i++) {
 game.ugly_move(newGameMoves[i]);
 var v = minimax(depth-1, game, !isMaximisingPlayer);
 game.undo();
 bestValue = Math.max(bestValue, v);
 }
 return bestValue;
}
else {
 var bestValue = 10000;
 for(var i=0; i<newGameMoves.length; i++) {
 game.ugly_move(newGameMoves[i]);
 var v = minimax(depth-1, game, !isMaximisingPlayer);
 game.undo();
 bestValue = Math.min(bestValue, v);
 }
 return bestValue;
}
}



var mysolve=function(depth,game,alpha,beta,isMaximisingPlayer){
 positionCount++;
 MoveCount++;
 if(depth==0)
 return -evaluateBoard(game.board());

 if(isMaximisingPlayer){
 var newGameMoves=game.ugly_moves() ;
 //Move Ordering

 var newGameMovearr=[];

for (var i=0;i<newGameMoves.length;i++){

var temp={
 obj:newGameMoves[i],
 value:getFastcompare(newGameMoves[i])
};
newGameMovearr.push(temp);
}
newGameMovearr.sort(function(a,b){return eval_compare(a.obj,a.value,b.obj,b.value)});

for(var i=0;i<newGameMoves.length;i++)
{
 newGameMoves[i]=newGameMovearr[i].obj;
}



 var curbest=-10000;
 for (var i=0;i<newGameMoves.length;i++){
 game.ugly_move(newGameMoves[i]);
 var x=mysolve(depth-1,game,alpha,beta,!isMaximisingPlayer);
 if(x>=alpha){
 alpha=x;
 }
 
 curbest=Math.max(curbest,x);
 game.undo();
 if(alpha>=beta){
 break;
 }
 }
 return curbest;
 }

 else{
 var newGameMoves=game.ugly_moves();
 
 var curbest=10000;
 for (var i=0;i<newGameMoves.length;i++){
 game.ugly_move(newGameMoves[i]);
 var x=mysolve(depth-1,game,alpha,beta,!isMaximisingPlayer);
 if(x<=beta){
 beta=x;
 }

 curbest=Math.min(curbest,x);
 game.undo();
 if(alpha>=beta){
 break;
 }
 }
 return curbest;
 }
}

var mysolveroot=function(depth,game,isMaximisingPlayer){
 var newGameMoves=game.ugly_moves();

 //Move Ordering
 var alpha=-10000,beta=10000;
 var newGameMovearr=[];

for (var i=0;i<newGameMoves.length;i++){

var temp={
 obj:newGameMoves[i],
 value:getFastcompare(newGameMoves[i])
};
newGameMovearr.push(temp);
}
newGameMovearr.sort(function(a,b){return eval_compare(a.obj,a.value,b.obj,b.value)});

for(var i=0;i<newGameMoves.length;i++)
{
 newGameMoves[i]=newGameMovearr[i].obj;
}
// Move Ordering ends.....



 var bestval=-10001;
 var bestmove;

 for (var i=0;i<newGameMoves.length;i++){
 game.ugly_move(newGameMoves[i]);
 
 while(alpha+1>beta){
 var mid=(alpha+beta)>>1;
 var x=mysolve(depth-1,game,mid,mid+1,!isMaximisingPlayer);
 if(x>=mid){
 alpha=mid+1;
 }

 else
 beta=mid;
 }

 var x=mysolve(depth-1,game,alpha,beta,!isMaximisingPlayer);
 if(x>=bestval){
 bestval=x;
 bestmove=newGameMoves[i];
 }
 game.undo();
 }

 return bestmove;
}

var pvsRoot =function(depth, game, isMaximisingPlayer) {

var newGameMoves = game.ugly_moves();
var bestMove = -9999;
var bestMoveFound;

// Move Ordering......

var newGameMovearr=[];

for (var i=0;i<newGameMoves.length;i++){

var temp={
 obj:newGameMoves[i],
 value:getFastcompare(newGameMoves[i])
};
newGameMovearr.push(temp);
}
newGameMovearr.sort(function(a,b){return eval_compare(a.obj,a.value,b.obj,b.value)});


// Move Ordering ends.....

for(var i = 0; i < newGameMoves.length; i++) {
 var newGameMove = newGameMovearr[i].obj
 
 game.ugly_move(newGameMove);
 var value = pvs(depth - 1, game, -10000, 10000, !isMaximisingPlayer);
 game.undo();
 if(value >= bestMove) {
 bestMove = value;
 bestMoveFound = newGameMove;
 }
}

return bestMoveFound;
}


var pvs=function(depth,game,alpha,beta,isMaximisingPlayer){
positionCount++;
 if(depth==0){
 return -evaluateBoard(game.board());
 }

 var newGameMoves=game.ugly_moves();

//Move Ordering
var newGameMovearr=[];

for (var i=0;i<newGameMoves.length;i++){

var temp={
 obj:newGameMoves[i],
 value:getFastcompare(newGameMoves[i])
};
newGameMovearr.push(temp);
}
newGameMovearr.sort(function(a,b){return eval_compare(a.obj,a.value,b.obj,b.value)});

for(var i=0;i<newGameMoves.length;i++)
{
 newGameMoves[i]=newGameMovearr[i].obj;

}


 if(isMaximisingPlayer){
 var value=-10000;
 if(newGameMoves.length!=0)
 {
 game.ugly_move(newGameMoves[0]);
 value=pvs(depth-1,game,alpha,beta,!isMaximisingPlayer);
 game.undo(); 
 }
 game.ugly_move(newGameMoves[0]);
 value=pvs(depth-1,game,alpha,beta,!isMaximisingPlayer);
 game.undo();
 if( value >= beta )
 {return value;} 
 if( value > alpha ) {
 alpha = value; 
 
 }


 for (var i=1;i<newGameMoves.length;i++)
 {
 game.ugly_move(newGameMoves[i]);
 var score=pvs(depth-1,game,alpha,alpha+1,!isMaximisingPlayer);
 
 if(score>alpha)
 {
 var score=pvs(depth-1,game,alpha,beta,!isMaximisingPlayer);
 }
 game.undo();

 if( score >= beta )
 {return score;} 
 if( score > alpha ) {
 alpha = score; 
 }

 }

 return alpha;
 }
 else{

 var value=10000;
 if(newGameMoves.length!=0)
 {
 game.ugly_move(newGameMoves[0]);
 value=pvs(depth-1,game,alpha,beta,!isMaximisingPlayer);
 game.undo(); 
 }
 if( value <= alpha )
 {return value;} 
 if( value < beta ) {
 beta = value; 
 
 }

 

 for (var i=1;i<newGameMoves.length;i++)
 {
 var newGameMove= newGameMoves[i];

 game.ugly_move(newGameMove);
 var score=pvs(depth-1,game,beta-1,beta,!isMaximisingPlayer);
 
 if(score<beta)
 {
 var score=pvs(depth-1,game,alpha,beta,!isMaximisingPlayer);
 }
 game.undo();
 if( score <= alpha )
 {return score;} 
 if( score < beta ) {
 beta = score; 
 
 }


 
 }

 return beta;


 }

}

var FailSoftab=function(depth,game,alpha,beta,isMaximisingPlayer){
 if(depth==0){
 return -evaluateBoard(game.board());
 }

 if(isMaximisingPlayer){
 var cur=-10000;
 var newGameMoves=game.ugly_moves();

// Move Ordering......

var newGameMovearr=[];

for (var i=0;i<newGameMoves.length;i++){

var temp={
 obj:newGameMoves[i],
 value:getFastcompare(newGameMoves[i])
};
newGameMovearr.push(temp);
}
newGameMovearr.sort(function(a,b){return eval_compare(a.obj,a.value,b.obj,b.value)});

for(var i=0;i<newGameMoves.length;i++)
{
 newGameMoves[i]=newGameMovearr[i].obj;
}
// Move Ordering ends.....


 for (var i=0;i<newGameMoves.length;i++){
 game.ugly_move(newGameMoves[i]);
 var curscore=FailSoftab(depth-1,game,alpha,beta,!isMaximisingPlayer);
 game.undo();
 if(curscore>=cur){
 cur=curscore;
 if(cur>=alpha){
 alpha=cur;
 }

 if(cur>=beta){
 break;
 }
 }
 }

 return cur;
 }

 else{
 var cur=-10000;
 var newGameMoves=game.ugly_moves();
 
 for (var i=0;i<newGameMoves.length;i++){
 game.ugly_move(newGameMoves[i]);
 var curscore=FailSoftab(depth-1,game,alpha,beta,!isMaximisingPlayer);
 game.undo();
 if(curscore<=cur){
 cur=curscore;
 }

 if(cur<=beta){
 beta=cur;
 }

 if(alpha>=cur)
 break;
 }
 return cur;
 }
}


var evaluateBoard = function (board) {
var totalEvaluation = 0;
for (var i = 0; i < 8; i++) {
 for (var j = 0; j < 8; j++) {
 totalEvaluation = totalEvaluation + getPieceValue(board[i][j], i ,j);
 }
}
return totalEvaluation;
};

var reverseArray = function(array) {
return array.slice().reverse();
};

var pawnEvalWhite =
[
 [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
 [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
 [1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0],
 [0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5],
 [0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0],
 [0.5, -0.5, -1.0, 0.0, 0.0, -1.0, -0.5, 0.5],
 [0.5, 1.0, 1.0, -2.0, -2.0, 1.0, 1.0, 0.5],
 [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
];

var pawnEvalBlack = reverseArray(pawnEvalWhite);

var knightEval =
[
 [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
 [-4.0, -2.0, 0.0, 0.0, 0.0, 0.0, -2.0, -4.0],
 [-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0],
 [-3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0],
 [-3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0, -3.0],
 [-3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0],
 [-4.0, -2.0, 0.0, 0.5, 0.5, 0.0, -2.0, -4.0],
 [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
];

var bishopEvalWhite = [
[ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
[ -1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
[ -1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0],
[ -1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0],
[ -1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0],
[ -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0],
[ -1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -1.0],
[ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
];

var bishopEvalBlack = reverseArray(bishopEvalWhite);

var rookEvalWhite = [
[ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
[ 0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5],
[ -0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
[ -0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
[ -0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
[ -0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
[ -0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
[ 0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0]
];

var rookEvalBlack = reverseArray(rookEvalWhite);

var evalQueen = [
[ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
[ -1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
[ -1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
[ -0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
[ 0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
[ -1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
[ -1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -1.0],
[ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
];

var kingEvalWhite = [

[ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
[ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
[ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
[ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
[ -2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
[ -1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
[ 2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0 ],
[ 2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0 ]
];

var kingEvalBlack = reverseArray(kingEvalWhite);




var getPieceValue = function (piece, x, y) {
if (piece === null) {
 return 0;
}
var getAbsoluteValue = function (piece, isWhite, x ,y) {
 if (piece.type === 'p') {
 return 10 + ( isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x] );
 } else if (piece.type === 'r') {
 return 50 + ( isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x] );
 } else if (piece.type === 'n') {
 return 30 + knightEval[y][x];
 } else if (piece.type === 'b') {
 return 32 + ( isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x] );
 } else if (piece.type === 'q') {
 return 90 + evalQueen[y][x];
 } else if (piece.type === 'k') {
 return 900 + ( isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x] );
 }
 throw "Unknown piece type: " + piece.type;
};

var absoluteValue = getAbsoluteValue(piece, piece.color === 'w', x ,y);
return piece.color === 'w' ? absoluteValue : -absoluteValue;
};


/* board visualization and games state handling */

var onDragStart = function (source, piece, position, orientation) {
if (game.in_checkmate() === true || game.in_draw() === true ||
 piece.search(/^b/) !== -1) {
 return false;
}
};

var makeBestMove = function () {


if(!Opening_ready(game.history()))
{
var bestMove = getBestMove(game); 
 game.ugly_move(bestMove);
 board.position(game.fen());
}
renderMoveHistory(game.history());
if (game.game_over()) {
 alert('Game over');
}


};


var positionCount;
var getBestMove = function (game) {
if (game.game_over()) {
 alert('Game over');
}

positionCount = 0;
var depth = 3;

var d = new Date().getTime();
 var algo = parseInt($('#algorithm_tbu').find(':selected').text());
console.log(algo);
var bestMove = game.ugly_moves()[0];
if(algo==1)
{
	bestMove=basicMinimaxRoot(depth, game, true);
}
else if(algo==2)
{
	bestMove=minimaxRoot(depth, game, true);
}
else if(algo==3)
{
	bestMove=mysolveroot(depth, game, true);
}
else if(algo==4)
{
	bestMove=pvsRoot(depth, game, true);
}
var d2 = new Date().getTime();
var moveTime = (d2 - d);
var positionsPerS = ( positionCount * 1000 / moveTime);

$('#position-count').text(positionCount);
$('#time').text(moveTime/1000 + 's');
$('#positions-per-s').text(game.fen());
return bestMove;
};

var renderMoveHistory = function (moves) {
var historyElement = $('#move-history').empty();
historyElement.empty();
for (var i = 0; i < moves.length; i = i + 2) {
 historyElement.append('<span>' + moves[i] + ' ' + ( moves[i + 1] ? moves[i + 1] : ' ') + '</span><br>')
}
historyElement.scrollTop(historyElement[0].scrollHeight);

};

var onDrop = function (source, target) {

var move = game.move({
 from: source,
 to: target,
 promotion: 'q'
});

removeGreySquares();
if (move === null) {
 return 'snapback';
}

renderMoveHistory(game.history());

window.setTimeout(makeBestMove, 250);
};

var onSnapEnd = function () {
board.position(game.fen());
};

var onMouseoverSquare = function(square, piece) {
var moves = game.moves({
 square: square,
 verbose: true
});

if (moves.length === 0) return;

greySquare(square);

for (var i = 0; i < moves.length; i++) {
 greySquare(moves[i].to);
}
};

var onMouseoutSquare = function(square, piece) {
removeGreySquares();
};

var removeGreySquares = function() {
$('#board .square-55d63').css('background', '');
};

var greySquare = function(square) {
var squareEl = $('#board .square-' + square);

var background = '#a9a9a9';
if (squareEl.hasClass('black-3c85d') === true) {
 background = '#696969';
}

squareEl.css('background', background);
};

var cfg = {
draggable: true,
position: 'start',
onDragStart: onDragStart,
onDrop: onDrop,
onSnapEnd: onSnapEnd
};
board = ChessBoard('board', cfg);
