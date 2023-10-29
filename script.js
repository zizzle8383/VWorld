const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const rooms = [
    {
        background: "townbg.jpeg",
        foreground: "townfg.jpeg",
        treasureMap: "towntm.jpeg"
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

const MAX_PLAYER_SIZE = 100; // Set maximum size for the player sprite
const MOVE_SPEED = 2; // Set the speed at which the player moves (you can adjust this value)

function drawPlayer() {
    // Calculate the interpolated position for smooth movement
    player.x += (player.targetX - player.x) * MOVE_SPEED;
    player.y += (player.targetY - player.y) * MOVE_SPEED;

    // Calculate the scaled width and height for the player sprite
    const scale = Math.min(1, MAX_PLAYER_SIZE / player.sprite.width, MAX_PLAYER_SIZE / player.sprite.height);
    const width = player.sprite.width * scale;
    const height = player.sprite.height * scale;

    // Draw player after the treasure map
    ctx.drawImage(player.sprite, player.x, player.y, width, height);
}

function drawRoom() {
    const currentRoomData = rooms[currentRoom];
    const background = new Image();
    const foreground = new Image();
    const treasureMap = new Image();

    background.onload = function() {
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        drawPlayer(); // Draw the player after the background
    };
    background.onerror = function() {
        console.error("Error loading background image.");
    };
    background.src = currentRoomData.background;

    // ... (same code for foreground and treasureMap as in the previous response)
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
    // Load the initial room and start the game loop
    player.sprite.onload();
    gameLoop();
};
