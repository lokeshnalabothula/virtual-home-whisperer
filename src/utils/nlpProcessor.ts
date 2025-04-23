
import { CommandType, DeviceType, RoomType } from '@/types/types';

// Device types and their synonyms
const deviceMap: Record<string, DeviceType> = {
  'light': 'light',
  'lights': 'light',
  'lamp': 'light',
  'lamps': 'light',
  'fan': 'fan',
  'fans': 'fan',
  'switch': 'switch',
  'switches': 'switch',
};

// Room types and their synonyms
const roomMap: Record<string, RoomType> = {
  'living': 'living',
  'living room': 'living',
  'kitchen': 'kitchen',
  'bedroom': 'bedroom',
  'bathroom': 'bathroom',
};

// Simple command processor (no external dependencies)
export const processCommand = (input: string): CommandType => {
  const text = input.toLowerCase();
  
  // Detect action
  let action: CommandType['action'] = 'status';
  if (/(turn|switch) on|activate|start/i.test(text)) {
    action = 'turn_on';
  } else if (/(turn|switch) off|deactivate|stop/i.test(text)) {
    action = 'turn_off';
  } else if (/increase|raise|higher|brighter|faster/i.test(text)) {
    action = 'increase';
  } else if (/decrease|lower|dimmer|slower/i.test(text)) {
    action = 'decrease';
  } else if (/set|change|make/i.test(text)) {
    action = 'set';
  }
  
  // Detect device
  let device: DeviceType | 'all' = 'all';
  for (const [key, value] of Object.entries(deviceMap)) {
    if (text.includes(key.toLowerCase())) {
      device = value;
      break;
    }
  }
  
  // Detect room
  let room: RoomType | 'all' | undefined = undefined;
  if (/all rooms/i.test(text)) {
    room = 'all';
  } else {
    for (const [key, value] of Object.entries(roomMap)) {
      if (text.includes(key.toLowerCase())) {
        room = value;
        break;
      }
    }
  }
  
  // Extract values (like percentages)
  let value: number | undefined = undefined;
  const percentMatch = text.match(/(\d+)(\s*)(%|percent)/i);
  if (percentMatch) {
    value = parseInt(percentMatch[1], 10);
  }
  
  return {
    action,
    device,
    room,
    value,
    raw: input
  };
};

// Function to generate assistant feedback based on command
export const generateFeedback = (command: CommandType): string => {
  const { action, device, room } = command;
  const deviceText = device === 'all' ? 'all devices' : `${device}s`;
  const locationText = room ? (room === 'all' ? 'all rooms' : `the ${room} room`) : '';
  
  switch (action) {
    case 'turn_on':
      return `Turning on ${deviceText}${locationText ? ' in ' + locationText : ''}`;
    case 'turn_off':
      return `Turning off ${deviceText}${locationText ? ' in ' + locationText : ''}`;
    case 'increase':
      return `Increasing ${deviceText}${locationText ? ' in ' + locationText : ''}`;
    case 'decrease':
      return `Decreasing ${deviceText}${locationText ? ' in ' + locationText : ''}`;
    case 'set':
      return `Setting ${deviceText}${locationText ? ' in ' + locationText : ''}`;
    case 'status':
      return `Checking status of ${deviceText}${locationText ? ' in ' + locationText : ''}`;
    default:
      return "I didn't understand that command";
  }
};

// Get emoji based on device and action
export const getCommandEmoji = (command: CommandType): string => {
  const { action, device } = command;
  
  if (device === 'light') {
    return action === 'turn_on' ? '💡' : '🌑';
  } else if (device === 'fan') {
    return action === 'turn_on' ? '💨' : '🔇';
  } else if (device === 'switch') {
    return action === 'turn_on' ? '🔌' : '⚡';
  } else {
    return action === 'turn_on' ? '✅' : '❌';
  }
};
