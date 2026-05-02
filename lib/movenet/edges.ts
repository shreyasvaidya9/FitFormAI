// MoveNet keypoint indices:
// 0:nose  1:left_eye  2:right_eye  3:left_ear  4:right_ear
// 5:left_shoulder  6:right_shoulder  7:left_elbow  8:right_elbow
// 9:left_wrist  10:right_wrist  11:left_hip  12:right_hip
// 13:left_knee  14:right_knee  15:left_ankle  16:right_ankle

export const EDGES: [number, number][] = [
  // Left arm
  [5, 7], [7, 9],
  // Right arm
  [6, 8], [8, 10],
  // Shoulders
  [5, 6],
  // Torso
  [5, 11], [6, 12], [11, 12],
  // Left leg
  [11, 13], [13, 15],
  // Right leg
  [12, 14], [14, 16],
];
