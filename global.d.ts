

interface DeviceMotionEvent {
  requestPermission(): Promise<'granted' | 'denied'>;
}

export {};