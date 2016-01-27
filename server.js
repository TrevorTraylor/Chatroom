var express = require('express');
var app = express();

app.use(express.static(__dirname + "/static"));

var server = app.listen(8000, function(){
	console.log("Listening on port 8000")
});

var io = require('socket.io').listen(server);
var users = [];

io.sockets.on('connection', function(socket){
	socket.on('newUser', function(userData){

		users.push(
			{
				socketID : socket.id,
				name:userData.userName
			});
		io.emit('updateUserList', users);
			io.emit('updateMessageBoard', 
			{msg: ("<p>" +userData.userName +  
			" has just entered the room" + "</p>")})
	})
	socket.on('newMessage', function(userData){
		if('newMessage' != ''){
		console.log(userData);
		console.log(userData.msg);
		io.emit('updateMessageBoard', userData);
	}
		})
	
	
	socket.on('disconnect', function(){
		for(index in users){
			if(users[index].socketID == socket.id){
				io.emit('updateMessageBoard', 
					{msg: ("<p>" + users[index].name 
					+ " has left the chatroom " + "</p>")})
				users.splice(index, 1);
				io.emit('updateUserList', users);

			}
		}
	});
});