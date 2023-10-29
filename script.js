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

const MAX_PLAYER_SIZE = 100; // Set maximum size for the player sprite
const TWEEN_DURATION = 500; // Duration of the movement animation in milliseconds

function startTween(endX, endY) {
    const startX = player.x;
    const startY = player.y;
    const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    const duration = (distance / MAX_PLAYER_SIZE) * TWEEN_DURATION; // Adjust duration based on distance

    const startTime = Date.now();

    function animateTween() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(1, elapsed / duration);
        player.x = startX + (endX - startX) * progress;
        player.y = startY + (endY - startY) * progress;

        drawRoom();

        if (progress < 1) {
            requestAnimationFrame(animateTween);
        }
    }

    requestAnimationFrame(animateTween);
}

function drawPlayer() {
    // Calculate the scaled width and height for the player sprite
    const scale = Math.min(1, MAX_PLAYER_SIZE / player.sprite.width, MAX_PLAYER_SIZE / player.sprite.height);
    const width = player.sprite.width * scale;
    const height = player.sprite.height * scale;

    // Draw player after the treasure map
    ctx.drawImage(player.sprite, player.x - width / 2, player.y - height / 2, width, height);
}

function drawRoom() {
    const currentRoomData = rooms[0]; // For simplicity, use the first room in the rooms array
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

    foreground.onload = function() {
        ctx.drawImage(foreground, 0, 0, canvas.width, canvas.height);
    };
    foreground.onerror = function() {
        console.error("Error loading foreground image.");
    };
    foreground.src = currentRoomData.foreground;

    treasureMap.onload = function() {
        ctx.globalAlpha = 0;
        ctx.drawImage(treasureMap, 0, 0, canvas.width, canvas.height);
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

    const imageData = ctx.getImageData(mouseX, mouseY, 1, 1).data;
    const isClickable = imageData[3] > 0;

    if (isClickable) {
        startTween(mouseX, mouseY);
    }
});

window.onload = function() {
    // Load the initial room
    player.sprite.onload();
};
