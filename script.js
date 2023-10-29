let currentRoom = 0; // Initialize currentRoom variable

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const rooms = [
    {
        background: "Images/background (1).png",
        foreground: "Images/foreground (1).png",
        treasureMap: "Images/navmesh.png"
    }
    // Add more rooms here as needed
];

const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    targetX: canvas.width / 2,
    targetY: canvas.height / 2,
    sprite: new Image()
};

player.sprite.onload = function() {
    drawRoom();
};

player.sprite.onerror = function() {
    console.error("Error loading player sprite.");
};

player.sprite.src = "kakapo.png";

const MAX_PLAYER_SIZE = 100;
const MOVE_SPEED = 0.1; // Adjust the speed of the player's movement

function drawPlayer() {
    player.x += (player.targetX - player.x) * MOVE_SPEED;
    player.y += (player.targetY - player.y) * MOVE_SPEED;

    const scale = Math.min(1, MAX_PLAYER_SIZE / player.sprite.width, MAX_PLAYER_SIZE / player.sprite.height);
    const width = player.sprite.width * scale;
    const height = player.sprite.height * scale;

    ctx.drawImage(player.sprite, player.x, player.y, width, height);
}

function drawRoom() {
    const currentRoomData = rooms[currentRoom];
    const background = new Image();
    const foreground = new Image();
    const treasureMap = new Image();

    background.onload = function() {
        foreground.onload = function() {
            treasureMap.onload = function() {
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                drawPlayer();
                ctx.drawImage(foreground, 0, 0, canvas.width, canvas.height);
                ctx.globalAlpha = 0;
                ctx.drawImage(treasureMap, 0, 0, canvas.width, canvas.height);
                ctx.globalAlpha = 1;
            };
            treasureMap.onerror = function() {
                console.error("Error loading treasure map image.");
            };
            treasureMap.src = currentRoomData.treasureMap;
        };
        foreground.onerror = function() {
            console.error("Error loading foreground image.");
        };
        foreground.src = currentRoomData.foreground;
    };
    background.onerror = function() {
        console.error("Error loading background image.");
    };
    background.src = currentRoomData.background;
}

canvas.addEventListener("click", function(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    player.targetX = mouseX - player.sprite.width / 2;
    player.targetY = mouseY - player.sprite.height / 2;
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRoom();
    requestAnimationFrame(gameLoop);
}

window.onload = function() {
    player.sprite.onload();
    gameLoop();
};
