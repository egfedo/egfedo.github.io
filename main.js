var _a;
var a = 0;
var nameField = document.getElementById("name");
function click() {
    if (nameField.value.length != 0) {
        localStorage["tetris.username"] = nameField.value;
        window.location.href = "./game.html";
    }
}
nameField.value = (_a = localStorage["tetris.username"]) !== null && _a !== void 0 ? _a : "";
document.getElementById("playbutton").addEventListener("click", click);
