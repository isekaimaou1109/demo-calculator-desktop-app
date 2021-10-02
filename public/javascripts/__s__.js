var socket = io();

var usernameField = document.getElementById('username');
var passwordField = document.getElementById('password');

socket.on('connect', function () {
    console.log("I am connected or not? " + socket.connected);
    socket.emit("exchange", { name: "client", date: Date.now() });
    socket.emit('geometry', window.location.pathname);
});

socket.on('deny_access', function (message) {
    if (message.trim() !== "") {
        alert(message);
    }
});

socket.on('countup_wronglogin', function (isBlocked) {
    if (isBlocked) {
        alert("You still being blocked by typing wrong value!!");
    }
});