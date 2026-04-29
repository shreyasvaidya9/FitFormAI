import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { usePoseDetection } from '../../hooks/usePoseDetection';

export default function CameraView() {
  const device = useCameraDevice('front');
  const { hasPermission, requestPermission } = useCameraPermission();
  const { frameProcessor } = usePoseDetection();

  if (!hasPermission) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white text-base mb-4 text-center px-8">
          Camera access is required to analyze your form
        </Text>
        <TouchableOpacity
          className="bg-blue-500 px-6 py-3 rounded-lg"
          onPress={requestPermission}
          testID="grant-permission-btn"
        >
          <Text className="text-white font-semibold">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white text-base">No camera available</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <Camera
        device={device}
        isActive={true}
        style={StyleSheet.absoluteFill}
        frameProcessor={frameProcessor}
        testID="camera-view"
      />
    </View>
  );
}
