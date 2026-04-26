import './global.css';

import { StatusBar } from 'expo-status-bar';
import CameraView from './components/camera/CameraView';

export default function App() {
  return (
    <>
      <CameraView />
      <StatusBar style="light" />
    </>
  );
}
