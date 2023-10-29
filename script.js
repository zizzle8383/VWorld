const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const rooms = [
    {
        background: new Image(),
        foreground: new Image(),
        treasureMap: new Image()
    }
    // Add more rooms here as needed
];

// Set image sources
rooms[0].background.src = "Images/background.png";
rooms[0].foreground.src = "Images/foreground.png";
rooms[0].treasureMap.src = "Images/navmesh.png";

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

const tweenQueue = []; // Queue to store tweening animations

function startTween(endX, endY) {
    const startX = player.x;
    const startY = player.y;
    const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    const duration = (distance / MAX_PLAYER_SIZE) * TWEEN_DURATION; // Adjust duration based on distance

    const startTime = Date.now();

    function animateTween() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(1, elapsed / duration);
        player.x = Math.floor(startX + (endX - startX) * progress);
        player.y = Math.floor(startY + (endY - startY) * progress);

        drawRoom();

        if (progress < 1) {
            requestAnimationFrame(animateTween);
        } else {
            // Remove the completed tween animation from the queue
            tweenQueue.shift();

            // Process the next tween animation in the queue, if any
            const nextTween = tweenQueue[0];
            if (nextTween) {
                startTween(nextTween.endX, nextTween.endY);
            }
        }
    }

    // Clear the existing tween animations in the queue
    tweenQueue.length = 0;

    // Add the new tween animation to the queue and start it immediately
    tweenQueue.push({ endX, endY });
    requestAnimationFrame(animateTween);
}

canvas.addEventListener("click", function(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = Math.floor(event.clientX - rect.left);
    const mouseY = Math.floor(event.clientY - rect.top);

    // Check if the click is within the player's bounding box
    const playerWidth = player.sprite.width/2;
    const playerHeight = player.sprite.height/2;
    const playerX = Math.floor(player.x - playerWidth / 2);
    const playerY = Math.floor(player.y - playerHeight / 2);

    if (
        mouseX >= playerX &&
        mouseX <= playerX + playerWidth &&
        mouseY >= playerY &&
        mouseY <= playerY + playerHeight
    ) {
        return; // Do nothing if the click is on the player
    }

    // Start the new tweening animation for the clicked position
    startTween(mouseX, mouseY);
});

function drawPlayer() {
    // Calculate the scaled width and height for the player sprite
    const scale = Math.min(1, MAX_PLAYER_SIZE / player.sprite.width, MAX_PLAYER_SIZE / player.sprite.height);
    const width = Math.floor(player.sprite.width * scale);
    const height = Math.floor(player.sprite.height * scale);

    // Draw player after the treasure map
    ctx.drawImage(player.sprite, Math.floor(player.x - width / 2), Math.floor(player.y - height / 2), width, height);
}

function drawForeground() {
    ctx.drawImage(rooms[0].foreground, 0, 0, canvas.width, canvas.height);
}

function drawRoom() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    ctx.drawImage(rooms[0].background, 0, 0, canvas.width, canvas.height);
    drawPlayer(); // Draw the player after the background
    drawForeground(); // Draw the foreground on top of the player

    ctx.globalAlpha = 0;
    ctx.drawImage(rooms[0].treasureMap, 0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
}

window.onload = function() {
    // Load the initial room
    player.sprite.onload();
};
