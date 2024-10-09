var canvas = document.getElementById("field");
var ctx = canvas.getContext("2d");
var nextCanvas = document.getElementById("next");
var nextCtx = nextCanvas.getContext("2d");
var scoreP = document.getElementById("score");
var speedP = document.getElementById("speed");
var usernameP = document.getElementById("username").children[0];
var username = localStorage["tetris.username"];
usernameP.innerText = username;
var gameoverDiv = document.getElementById("gameover");
var mainBlock = document.body.querySelector("main");
var lbTable = document.getElementById("lbtable");
var resultP = document.getElementById("result");
var tetraminoes = {
    'I': [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    'J': [
        [2, 0, 0],
        [2, 2, 2],
        [0, 0, 0]
    ],
    'L': [
        [0, 0, 3],
        [3, 3, 3],
        [0, 0, 0]
    ],
    'O': [
        [4, 4],
        [4, 4]
    ],
    'S': [
        [0, 5, 5],
        [5, 5, 0],
        [0, 0, 0]
    ],
    'T': [
        [0, 6, 0],
        [6, 6, 6],
        [0, 0, 0]
    ],
    'Z': [
        [7, 7, 0],
        [0, 7, 7],
        [0, 0, 0]
    ],
    'HUI': [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 1],
    ]
};
var tetraminoKeys = ['I', 'J', 'L', 'O', 'S', 'T', 'Z', 'HUI'];
var colours = {
    1: {
        first: "#18e5e6",
        second: "#62eeef"
    },
    2: {
        first: "#0202e6",
        second: "#2828de"
    },
    3: {
        first: "#e69a0f",
        second: "#e7a326"
    },
    4: {
        first: "#e6e60c",
        second: "#e5e538"
    },
    5: {
        first: "#18e50f",
        second: "#3ee337"
    },
    6: {
        first: "#9a05e7",
        second: "#a127e0"
    },
    7: {
        first: "#e10808",
        second: "#dc2929"
    },
};
var field = [];
var clearLines = [];
var stopFlag = false;
var gameOverFlag = false;
var keyState = {
    'KeyW': false,
    'KeyA': false,
    'KeyS': false,
    'KeyD': false,
    'Space': false,
};
var lineClearScorings = {
    1: 100,
    2: 300,
    3: 500,
    4: 800
};
var levelThresholds = {
    1: 0,
    2: 1000,
    3: 2500,
    4: 5000,
    5: 10000,
    6: 25000,
    7: 50000,
    8: 100000,
    9: 250000,
    10: 500000,
    11: Infinity
};
var levelSpeeds = {
    1: { moveWindow: 500, lockWindow: 200 },
    2: { moveWindow: 370, lockWindow: 200 },
    3: { moveWindow: 274, lockWindow: 110 },
    4: { moveWindow: 203, lockWindow: 81 },
    5: { moveWindow: 150, lockWindow: 60 },
    6: { moveWindow: 111, lockWindow: 44 },
    7: { moveWindow: 82, lockWindow: 33 },
    8: { moveWindow: 61, lockWindow: 24 },
    9: { moveWindow: 45, lockWindow: 20 },
    10: { moveWindow: 30, lockWindow: 20 },
};
for (var i = 0; i < 20; i++) {
    field.push([]);
    for (var j = 0; j < 10; j++) {
        field[i].push(0);
    }
}
var figure = getRandomFigure();
var figX = 3;
var figY = 0;
var next = getRandomFigure();
var counter = 0;
var linesCleared = 0;
var score = 0;
var level = 1;
var moveWindow = 500;
var lockWindow = 200;
// DISPLAY FUNCTIONS
function drawBlock(x, y, color, context) {
    if (context === void 0) { context = ctx; }
    context.fillStyle = color.second;
    context.fillRect(34 * x + 2, 34 * y + 2, 32, 32);
    context.fillStyle = color.first;
    context.fillRect(34 * x + 6, 34 * y + 6, 24, 24);
    context.fillStyle = "#f5f5f5";
    context.fillRect(34 * x + 2, 34 * y + 2, 2, 2);
    context.fillRect(34 * x + 32, 34 * y + 2, 2, 2);
    context.fillRect(34 * x + 2, 34 * y + 32, 2, 2);
    context.fillRect(34 * x + 32, 34 * y + 32, 2, 2);
}
function drawBackground() {
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, ctx.canvas.width - 1, ctx.canvas.height - 1);
    for (var i = 0; i < 20; i++) {
        for (var j = 0; j < 10; j++) {
            drawBlock(j, i, { first: "#dedede", second: "#e6e6e6" });
        }
    }
}
function drawFigureColor(matrixX, matrixY, mat, color) {
    for (var i = 0; i < mat.length; i++) {
        for (var j = 0; j < mat[i].length; j++) {
            if (mat[i][j]) {
                drawBlock(matrixX + j, matrixY + i, color);
            }
        }
    }
}
function drawFigure(matrixX, matrixY, mat, context) {
    if (context === void 0) { context = ctx; }
    for (var i = 0; i < mat.length; i++) {
        for (var j = 0; j < mat[i].length; j++) {
            if (mat[i][j]) {
                drawBlock(matrixX + j, matrixY + i, colours[mat[i][j]], context);
            }
        }
    }
}
function drawField() {
    for (var y = 0; y < 20; y++) {
        for (var x = 0; x < 10; x++) {
            if (field[y][x]) {
                drawBlock(x, y, colours[field[y][x]]);
            }
        }
    }
}
function drawWhiteLine(y) {
    for (var i = 0; i < 10; i++) {
        drawBlock(i, y, { first: "#ffffff", second: "#f5f5f5" });
    }
}
function drawNext(figure) {
    nextCtx.fillStyle = "#f5f5f5";
    nextCtx.fillRect(0, 0, ctx.canvas.width - 1, ctx.canvas.height - 1);
    drawFigure(1, 1, figure, nextCtx);
}
// UTILITY FUNCTIONS
function rotateMatrix(mat) {
    var N = mat.length - 1;
    return mat.map(function (row, i) {
        return row.map(function (_val, j) { return mat[N - j][i]; });
    });
}
function randRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
function clearKeyState() {
    for (var key in keyState) {
        keyState[key] = false;
    }
}
// FIELD FUNCTIONS
function checkCollisions(matrixX, matrixY, mat) {
    for (var i = 0; i < mat.length; i++) {
        for (var j = 0; j < mat[i].length; j++) {
            if (mat[i][j] &&
                (matrixY + i >= 20 || matrixY + i < 0 ||
                    matrixX + j >= 10 || matrixX + j < 0 ||
                    field[matrixY + i][matrixX + j])) {
                console.log("Collision at ".concat(matrixX + j, " ").concat(matrixY + i));
                return false;
            }
        }
    }
    return true;
}
function placeFigure(matrixX, matrixY, mat) {
    var output = [];
    for (var i = 0; i < mat.length; i++) {
        var checkFlag = false;
        for (var j = 0; j < mat[i].length; j++) {
            if (mat[i][j]) {
                field[matrixY + i][matrixX + j] = mat[i][j];
                checkFlag = true;
            }
        }
        if (checkFlag) {
            var fillFlag = true;
            for (var j = 0; j < 10; j++) {
                if (!field[matrixY + i][j]) {
                    fillFlag = false;
                    break;
                }
            }
            if (fillFlag) {
                output.push(matrixY + i);
            }
        }
    }
    return output;
}
// GAME LOGIC
var lastChosen = "";
function getRandomFigure() {
    var chosen = tetraminoKeys[randRange(0, tetraminoKeys.length - 1)];
    if (chosen === lastChosen) {
        chosen = tetraminoKeys[randRange(0, tetraminoKeys.length - 1)];
    }
    lastChosen = chosen;
    return tetraminoes[chosen];
}
function gameOver() {
    var _a;
    resultP.innerText = "\u0412\u0430\u0448 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442: ".concat(score);
    if (!("tetris.leaderboard" in localStorage)) {
        var arr = [];
        localStorage["tetris.leaderboard"] = JSON.stringify(arr);
    }
    var leaderboard = (_a = JSON.parse(localStorage["tetris.leaderboard"])) !== null && _a !== void 0 ? _a : [];
    var i = leaderboard.length;
    for (; i >= 0; i--) {
        if (i != 0 && score <= leaderboard[i - 1].score) {
            break;
        }
        if (i < leaderboard.length && username === leaderboard[i].name) {
            leaderboard.splice(i, 1);
        }
    }
    var putFlag = true;
    for (var j = i - 1; j >= 0; j--) {
        if (username === leaderboard[j].name) {
            putFlag = false;
            break;
        }
    }
    if (putFlag) {
        leaderboard.splice(i, 0, {
            name: username, score: score
        });
    }
    leaderboard = leaderboard.slice(0, 3);
    localStorage["tetris.leaderboard"] = JSON.stringify(leaderboard);
    leaderboard.forEach(function (en) {
        var row = lbTable.tBodies[0].insertRow();
        var cell = row.insertCell();
        cell.innerText = en.name;
        cell = row.insertCell();
        cell.innerText = en.score.toString();
        cell.className = "num";
    });
    gameoverDiv.style.visibility = "visible";
    mainBlock.style.filter = "blur(8px)";
}
function spawnNewFigure() {
    figure = next;
    next = getRandomFigure();
    figX = 3;
    figY = 0;
    if (!checkCollisions(figX, figY, figure)) {
        gameOverFlag = true;
        setTimeout(gameOver, 1000);
    }
}
function addScore(num) {
    score += num;
    if (score >= levelThresholds[level + 1]) {
        level++;
        var speed = levelSpeeds[level];
        moveWindow = speed.moveWindow;
        lockWindow = speed.lockWindow;
    }
}
function loop(prevTS) {
    var currentTS = Date.now();
    var timeDelta = currentTS - prevTS;
    if (!gameOverFlag)
        requestAnimationFrame(function () { return loop(currentTS); });
    counter += timeDelta;
    console.log("Added ".concat(timeDelta, " to timer"));
    if (keyState['Space']) {
        while (checkCollisions(figX, figY + 1, figure)) {
            counter = 0;
            figY++;
            addScore(2);
        }
        clearKeyState();
    }
    if (keyState['KeyS']) {
        if (checkCollisions(figX, figY + 1, figure)) {
            counter = 0;
            figY++;
            addScore(1);
        }
        clearKeyState();
    }
    if (keyState['KeyA'] && keyState['KeyD']) {
        clearKeyState();
    }
    if (keyState['KeyA'] || keyState['KeyD']) {
        var shift = keyState['KeyA'] ? -1 : 1;
        if (checkCollisions(figX + shift, figY, figure)) {
            figX += shift;
        }
        clearKeyState();
    }
    if (keyState['KeyW']) {
        var rotated = rotateMatrix(figure);
        if (checkCollisions(figX, figY, rotated)) {
            figure = rotated;
        }
        clearKeyState();
    }
    drawBackground();
    drawField();
    drawFigure(figX, figY, figure);
    drawNext(next);
    scoreP.textContent = "\u0421\u0447\u0451\u0442: ".concat(score);
    speedP.textContent = "\u0423\u0440\u043E\u0432\u0435\u043D\u044C: ".concat(level);
    if (counter > lockWindow / 2 && !checkCollisions(figX, figY + 1, figure) && !stopFlag) {
        drawFigureColor(figX, figY, figure, { first: "#ffffff", second: "#f5f5f5" });
        if (counter > lockWindow) {
            counter = 0;
            clearLines = placeFigure(figX, figY, figure);
            if (!clearLines.length) {
                spawnNewFigure();
            }
            else {
                stopFlag = true;
            }
        }
    }
    if (stopFlag) {
        clearLines.forEach(function (val) {
            drawWhiteLine(val);
        });
        if (counter > 200) {
            console.log("Deleting lines ".concat(clearLines));
            counter = 0;
            field = field.filter(function (_val, idx) { return clearLines.indexOf(idx) === -1; });
            clearLines.forEach(function () { return field.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); });
            linesCleared += clearLines.length;
            addScore(lineClearScorings[clearLines.length]);
            clearLines = [];
            spawnNewFigure();
            stopFlag = false;
        }
    }
    if (counter > moveWindow && !stopFlag) {
        counter = 0;
        if (checkCollisions(figX, figY + 1, figure)) {
            figY++;
        }
    }
}
addEventListener("keydown", function (ev) {
    if (ev.code in keyState) {
        keyState[ev.code] = true;
    }
});
var ts = Date.now();
requestAnimationFrame(function () { return loop(ts); });
