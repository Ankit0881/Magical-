let highestZ = 1;

class Paper {
  holdingPaper = false;
  rotating = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;

  init(paper) {
    // Mouse movement event only when holding paper
    const onMouseMove = (e) => {
      if (!this.holdingPaper) return;

      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      
      if (!this.rotating) {
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      } else {
        // Calculate rotation angle
        const dirX = e.clientX - this.mouseTouchX;
        const dirY = e.clientY - this.mouseTouchY;
        const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
        const dirNormalizedX = dirX / dirLength;
        const dirNormalizedY = dirY / dirLength;
        const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
        this.rotation = (360 + Math.round((180 * angle) / Math.PI)) % 360;
      }

      // Apply transformations
      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;
    };

    // Start dragging or rotating the paper
    paper.addEventListener('mousedown', (e) => {
      if (this.holdingPaper) return;

      this.holdingPaper = true;
      paper.style.zIndex = highestZ++;
      this.mouseTouchX = e.clientX;
      this.mouseTouchY = e.clientY;
      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;

      if (e.button === 2) {
        this.rotating = true; // Right-click starts rotating
      }

      // Listen for mouse movement while holding the paper
      document.addEventListener('mousemove', onMouseMove);
    });

    // Stop dragging or rotating the paper
    window.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
      document.removeEventListener('mousemove', onMouseMove); // Stop listening to mousemove
    });

    // Add touch event for redirection if this paper is the "touch-me" paper
    if (paper.classList.contains('touch-me')) {
      paper.addEventListener('touchend', () => {
        window.location.href = "https://for-myself.netlify.app";
      });
    }
  }
}

// Initialize all paper elements
document.querySelectorAll('.paper').forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
