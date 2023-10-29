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

const TWEEN_DURATION = 500; // Duration of the movement animation in milliseconds

function startTween(endX, endY) {
    const startX = player.x;
    const startY = player.y;
    const startTime = Date.now();

    function animateTween() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(1, elapsed / TWEEN_DURATION);
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
    ctx.drawImage(player.sprite, player.x, player.y);
}

function drawRoom() {
    const currentRoomData = rooms[0]; // For simplicity, considering only the first room
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
    const mouseX = event.clientX - rect.left - player.sprite.width / 2;
    const mouseY = event.clientY - rect.top - player.sprite.height / 2;

    const imageData = ctx.getImageData(mouseX + player.sprite.width / 2, mouseY + player.sprite.height / 2, 1, 1).data;
    const isClickable = imageData[3] > 0;

    if (isClickable) {
        startTween(mouseX, mouseY);
    }
});

window.onload = function() {
    // Load the initial room
    drawRoom();
};
