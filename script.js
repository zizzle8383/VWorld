const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const rooms = [
    {
        background: "Images/background.png",
        foreground: "Images/foreground.png",
        treasureMap: "Images/navmesh.png"
    }
    // Add more rooms here as needed
];

const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    sprite: new Image()
};

player.sprite.onload = function() {
    drawRoom();
};

player.sprite.onerror = function() {
    console.error("Error loading player sprite.");
};

player.sprite.src = "kakapo.png";

const SCROLL_SPEED = 5; // Adjust the scroll speed as needed

function drawPlayer() {
    ctx.drawImage(player.sprite, canvas.width / 2, canvas.height / 2);
}

function drawRoom() {
    const currentRoomData = rooms[0]; // For simplicity, considering only the first room
    const background = new Image();
    const foreground = new Image();
    const treasureMap = new Image();

    background.onload = function() {
        ctx.drawImage(background, canvas.width / 2 - player.x, canvas.height / 2 - player.y);
        drawPlayer();
    };
    background.onerror = function() {
        console.error("Error loading background image.");
    };
    background.src = currentRoomData.background;

    foreground.onload = function() {
        ctx.drawImage(foreground, canvas.width / 2 - player.x, canvas.height / 2 - player.y);
    };
    foreground.onerror = function() {
        console.error("Error loading foreground image.");
    };
    foreground.src = currentRoomData.foreground;

    treasureMap.onload = function() {
        ctx.globalAlpha = 0;
        ctx.drawImage(treasureMap, canvas.width / 2 - player.x, canvas.height / 2 - player.y);
        ctx.globalAlpha = 1;
    };
    treasureMap.onerror = function() {
        console.error("Error loading treasure map image.");
    };
    treasureMap.src = currentRoomData.treasureMap;
}

canvas.addEventListener("click", function(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    player.x = mouseX;
    player.y = mouseY;

    drawRoom();
});

function updateGame() {
    // Implement any game logic here

    // Request a new animation frame
    requestAnimationFrame(updateGame);
}

// Start the game loop
window.onload = function() {
    drawRoom(); // Draw the initial room
    updateGame(); // Start the game loop
};
