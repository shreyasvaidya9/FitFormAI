import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { useCameraPermission, useCameraDevice } from 'react-native-vision-camera';
import CameraView from '../../components/camera/CameraView';

const mockRequestPermission = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(useCameraPermission).mockReturnValue({
    hasPermission: true,
    requestPermission: mockRequestPermission,
  });
});

describe('CameraView — permission denied', () => {
  beforeEach(() => {
    jest.mocked(useCameraPermission).mockReturnValue({
      hasPermission: false,
      requestPermission: mockRequestPermission,
    });
  });

  it('shows the grant permission button', () => {
    render(<CameraView />);
    expect(screen.getByTestId('grant-permission-btn')).toBeTruthy();
  });

  it('does not render the camera feed', () => {
    render(<CameraView />);
    expect(screen.queryByTestId('camera-view')).toBeNull();
  });

  it('calls requestPermission when the button is pressed', () => {
    render(<CameraView />);
    fireEvent.press(screen.getByTestId('grant-permission-btn'));
    expect(mockRequestPermission).toHaveBeenCalledTimes(1);
  });
});

describe('CameraView — permission granted', () => {
  it('renders the camera feed', () => {
    render(<CameraView />);
    expect(screen.getByTestId('camera-view')).toBeTruthy();
  });

  it('does not show the permission button', () => {
    render(<CameraView />);
    expect(screen.queryByTestId('grant-permission-btn')).toBeNull();
  });

  it('shows no-camera message when device is unavailable', () => {
    jest.mocked(useCameraDevice).mockReturnValueOnce(undefined as any);
    render(<CameraView />);
    expect(screen.getByText('No camera available')).toBeTruthy();
  });
});
