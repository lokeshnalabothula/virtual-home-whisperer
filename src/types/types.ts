
// Smart home types
export type RoomType = 'living' | 'kitchen' | 'bedroom' | 'bathroom';

export type DeviceType = 'light' | 'fan' | 'switch';

export type DeviceState = {
  id: string;
  room: RoomType;
  type: DeviceType;
  name: string;
  isOn: boolean;
  brightness?: number; // For lights
  speed?: number; // For fans
};

export type SmartHomeState = {
  devices: Record<string, DeviceState>;
};

export type CommandType = {
  action: 'turn_on' | 'turn_off' | 'increase' | 'decrease' | 'set' | 'status';
  device: DeviceType | 'all';
  room?: RoomType | 'all';
  value?: number;
  raw: string;
};

export type AssistantFeedback = {
  message: string;
  emoji: string;
  isVisible: boolean;
};

export type AssistantMood = 'happy' | 'thinking' | 'confused' | 'excited';
