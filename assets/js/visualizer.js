/**
 * DJ John - Real-Time Canvas Audio Spectrum Visualizer
 * Renders live FFT spectrum bars when audio is active, with ambient standby animation when idle.
 */

(function () {
  'use strict';

  const canvas = document.getElementById('visualizerCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationId = null;
  let activeAnalyser = null;
  let isIdleActive = false;

  function resizeCanvas() {
    if (canvas && canvas.parentElement) {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    }
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  /**
   * Ambient standby animation before audio engine is triggered
   */
  function drawIdleAnimation() {
    if (activeAnalyser) return;
    isIdleActive = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bars = 28;
    const barWidth = canvas.width / bars;
    const time = Date.now() * 0.003;

    for (let i = 0; i < bars; i++) {
      const height = Math.sin(time + i * 0.35) * 14 + 18;
      ctx.fillStyle = 'rgba(255, 229, 0, 0.25)';
      ctx.fillRect(i * barWidth, canvas.height - height, barWidth - 3, height);
    }

    if (!activeAnalyser) {
      requestAnimationFrame(drawIdleAnimation);
    }
  }

  /**
   * Starts the high-speed FFT spectrum analyzer loop
   */
  function startVisualizer(analyserNode) {
    if (!analyserNode) return;
    activeAnalyser = analyserNode;
    isIdleActive = false;

    if (animationId) {
      cancelAnimationFrame(animationId);
    }

    const bufferLength = activeAnalyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function renderSpectrum() {
      animationId = requestAnimationFrame(renderSpectrum);
      activeAnalyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 1.8;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;

        // Tri-color neon gradient: Yellow -> Pink -> Cyan
        const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
        grad.addColorStop(0, '#FFE500');
        grad.addColorStop(0.5, '#FF2E93');
        grad.addColorStop(1, '#00F0FF');

        ctx.fillStyle = grad;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 3, barHeight);

        x += barWidth;
      }
    }

    renderSpectrum();
  }

  // Start idle wave on load
  drawIdleAnimation();

  // Export to global window.DJVisualizer
  window.DJVisualizer = {
    start: startVisualizer,
    resize: resizeCanvas
  };
})();
