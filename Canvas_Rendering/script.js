
const canvas = document.getElementById('clockCanvas');
const ctx = canvas.getContext('2d');
const modeToggle = document.getElementById('modeToggle');
const body = document.body;

const radius = canvas.width / 2;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
let isDayMode = true;

// Color schemes
const dayColors = {
    background: 'rgba(255, 255, 255, 0.95)',
    border: '#000000',
    majorTicks: '#ffffff',
    minorTicks: '#32c7fd',
    hourHand: '#2d3436',
    minuteHand: '#636e72',
    secondHand: '#ff4757',
    center: '#2d3436',
    glow: 'rgba(26, 67, 202, 0.89)'
};

const nightColors = {
    background: 'rgba(15, 15, 15, 0.95)',
    border: '#ffffff',
    majorTicks: '#ffffff',
    minorTicks: '#666666',
    hourHand: '#ffffff',
    minuteHand: '#cccccc',
    secondHand: '#4ecdc4',
    center: '#ffffff',
    glow: 'rgba(255, 255, 255, 0.1)'
};

/**
 * @returns {Object} The color configuration object for the current mode.
 * @description Returns either day or night color schemes based on the isDayMode state.
 */
function getColors() {
    return isDayMode ? dayColors : nightColors;
}

/**
 * @param {number} degrees - The angle in degrees.
 * @returns {number} The angle in radians.
 * @description Converts a degree value to radians for use in Canvas drawing methods.
 */
function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * @description Renders the clock's face, including the background, border, hour markers, and numbers on the canvas.
 */
function drawClockFace() {
    const colors = getColors();

    // Draw outer glow effect
    const gradient = ctx.createRadialGradient(centerX, centerY, radius - 20, centerX, centerY, radius);
    gradient.addColorStop(0, colors.glow);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();

    // Draw background circle with gradient
    const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius - 10);
    bgGradient.addColorStop(0, colors.background);
    bgGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
    ctx.fillStyle = bgGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 10, 0, 2 * Math.PI);
    ctx.fill();

    // Draw border with stylish thick outline
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 8;
    ctx.shadowColor = colors.border;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 10, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw hour markers and numbers
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = colors.majorTicks;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 1; i <= 12; i++) {
        const angle = degreesToRadians(i * 30 - 90);
        const markerInnerRadius = radius - 25;
        const markerOuterRadius = radius - 15;
        const numberRadius = radius - 45;

        // Draw hour markers
        const innerX = centerX + Math.cos(angle) * markerInnerRadius;
        const innerY = centerY + Math.sin(angle) * markerInnerRadius;
        const outerX = centerX + Math.cos(angle) * markerOuterRadius;
        const outerY = centerY + Math.sin(angle) * markerOuterRadius;

        ctx.strokeStyle = colors.majorTicks;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(innerX, innerY);
        ctx.lineTo(outerX, outerY);
        ctx.stroke();

        const numberX = centerX + Math.cos(angle) * numberRadius;
        const numberY = centerY + Math.sin(angle) * numberRadius;
        ctx.fillText(i.toString(), numberX, numberY);
    }

    // Draw minute markers
    for (let i = 0; i < 60; i++) {
        if (i % 5 !== 0) {  // Skip hour markers
            const angle = degreesToRadians(i * 6);
            const innerRadius = radius - 20;
            const outerRadius = radius - 17;

            const innerX = centerX + Math.cos(angle) * innerRadius;
            const innerY = centerY + Math.sin(angle) * innerRadius;
            const outerX = centerX + Math.cos(angle) * outerRadius;
            const outerY = centerY + Math.sin(angle) * outerRadius;

            ctx.strokeStyle = colors.minorTicks;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(innerX, innerY);
            ctx.lineTo(outerX, outerY);
            ctx.stroke();
        }
    }
}

/**
 * @param {number} angle - The rotation angle of the hand.
 * @param {number} length - The length of the hand from the center.
 * @param {number} width - The stroke width of the hand.
 * @param {string} color - The stroke color of the hand.
 * @param {boolean} hasArrow - Whether to draw an arrow tip at the end of the hand.
 * @description Draws a clock hand starting from the center point of the canvas.
 */
function drawHand(angle, length, width, color, hasArrow = false) {
    const radians = degreesToRadians(angle);

    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
        centerX + Math.cos(radians) * length,
        centerY + Math.sin(radians) * length
    );
    ctx.stroke();

    if (hasArrow && length > 80) {
        const tipLength = 15;
        const tipWidth = width + 2;
        const tipX = centerX + Math.cos(radians) * length;
        const tipY = centerY + Math.sin(radians) * length;

        ctx.beginPath();
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(
            tipX - Math.cos(radians - Math.PI/6) * tipLength,
            tipY - Math.sin(radians - Math.PI/6) * tipLength
        );
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(
            tipX - Math.cos(radians + Math.PI/6) * tipLength,
            tipY - Math.sin(radians + Math.PI/6) * tipLength
        );
        ctx.stroke();
    }
}

/**
 * @description Draws the center dot of the clock face with a highlight effect.
 */
function drawCenterDot() {
    const colors = getColors();

    // Outer ring
    ctx.fillStyle = colors.center;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 12, 0, 2 * Math.PI);
    ctx.fill();

    // Inner highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(centerX - 2, centerY - 2, 4, 0, 2 * Math.PI);
    ctx.fill();
}

/**
 * @description Calculates the current time and redraws the entire clock on the canvas.
 */
function updateClock() {
    const colors = getColors();
    const now = new Date();

    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();

    // Calculate second angle with smooth movement
    const totalSeconds = seconds + milliseconds / 1000;
    const secondAngle = totalSeconds * 6 - 90;  

    // Calculate minute angle
    const totalMinutes = minutes + totalSeconds / 60;
    const minuteAngle = totalMinutes * 6 - 90;  

    // Calculate hour angle
    const totalHours = (hours % 12) + totalMinutes / 60;
    const hourAngle = totalHours * 30 - 90; 

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawClockFace();

    drawHand(hourAngle, 80, 6, colors.hourHand, true);        // Hour hand with arrow
    drawHand(minuteAngle, 110, 4, colors.minuteHand, true);   // Minute hand with arrow
    drawHand(secondAngle, 120, 2, colors.secondHand, false);  // Second hand without arrow

    drawCenterDot();
}

/**
 * @description Initiates the recursive animation loop using requestAnimationFrame to update the clock.
 */
function animate() {
    updateClock();
    requestAnimationFrame(animate);  
}

// Toggle between Day and Night mode
modeToggle.addEventListener('click', () => {
    isDayMode = !isDayMode;

    if (isDayMode) {
        body.classList.remove('night-mode');
        body.classList.add('day-mode');
        modeToggle.textContent = 'Night Mode';
    } else {
        body.classList.remove('day-mode');
        body.classList.add('night-mode');
        modeToggle.textContent = 'Day Mode';
    }
});

// Start the animation loop
animate();