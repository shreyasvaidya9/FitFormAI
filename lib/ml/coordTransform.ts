export interface CanvasDimensions {
  canvasWidth: number;
  canvasHeight: number;
  frameWidth: number;
  frameHeight: number;
}

export interface ScreenPoint {
  x: number;
  y: number;
}

// Converts MoveNet's normalized (0–1) coordinates to canvas pixels.
// Assumes resizeMode="contain" (letterbox/pillarbox).
// isFrontCamera=true mirrors the x axis to match the live preview.
export function normalizedToScreen(
  normalizedX: number,
  normalizedY: number,
  dims: CanvasDimensions,
  isFrontCamera = true,
): ScreenPoint {
  const { canvasWidth, canvasHeight, frameWidth, frameHeight } = dims;
  const frameAspect = frameWidth / frameHeight;
  const canvasAspect = canvasWidth / canvasHeight;

  let scaledWidth: number;
  let scaledHeight: number;
  let offsetX: number;
  let offsetY: number;

  if (frameAspect > canvasAspect) {
    // Wider frame → letterbox bars on top and bottom
    scaledWidth = canvasWidth;
    scaledHeight = canvasWidth / frameAspect;
    offsetX = 0;
    offsetY = (canvasHeight - scaledHeight) / 2;
  } else {
    // Taller frame → pillarbox bars on left and right
    scaledHeight = canvasHeight;
    scaledWidth = canvasHeight * frameAspect;
    offsetX = (canvasWidth - scaledWidth) / 2;
    offsetY = 0;
  }

  const effectiveX = isFrontCamera ? 1 - normalizedX : normalizedX;

  return {
    x: effectiveX * scaledWidth + offsetX,
    y: normalizedY * scaledHeight + offsetY,
  };
}
