import React, { useState, useEffect, useCallback } from 'react';
import ThreeScene from './ThreeScene';
import CommandInterface from './CommandInterface';
import AIAssistant from './AIAssistant';
import DeviceControls from './DeviceControls';
import { CommandType, DeviceState, AssistantFeedback } from '@/types/types';
import { generateFeedback, getCommandEmoji } from '@/utils/nlpProcessor';

// Initial devices state with some devices in each room
const initialDevices: Record<string, DeviceState> = {
  'light_living': {
    id: 'light_living',
    room: 'living',
    type: 'light',
    name: 'Living Room Light',
    isOn: false,
    brightness: 100
  },
  'fan_living': {
    id: 'fan_living',
    room: 'living',
    type: 'fan',
    name: 'Living Room Fan',
    isOn: false,
    speed: 1
  },
  'light_kitchen': {
    id: 'light_kitchen',
    room: 'kitchen',
    type: 'light',
    name: 'Kitchen Light',
    isOn: false,
    brightness: 100
  },
  'switch_kitchen': {
    id: 'switch_kitchen',
    room: 'kitchen',
    type: 'switch',
    name: 'Kitchen Outlet',
    isOn: false
  },
  'light_bedroom': {
    id: 'light_bedroom',
    room: 'bedroom',
    type: 'light',
    name: 'Bedroom Light',
    isOn: false,
    brightness: 80
  },
  'fan_bedroom': {
    id: 'fan_bedroom',
    room: 'bedroom',
    type: 'fan',
    name: 'Bedroom Fan',
    isOn: false,
    speed: 1
  },
  'light_bathroom': {
    id: 'light_bathroom',
    room: 'bathroom',
    type: 'light',
    name: 'Bathroom Light',
    isOn: false,
    brightness: 100
  },
};

export const SmartHome: React.FC = () => {
  const [devices, setDevices] = useState<Record<string, DeviceState>>(initialDevices);
  const [feedback, setFeedback] = useState<AssistantFeedback>({
    message: 'Welcome to your Smart Home! Try saying "Turn on living room lights"',
    emoji: '👋',
    isVisible: true
  });

  // Hide feedback message after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (feedback.isVisible) {
        setFeedback(prev => ({ ...prev, isVisible: false }));
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [feedback]);

  // Process commands and update device states
  const handleCommand = useCallback((command: CommandType) => {
    const { action, device, room } = command;
    
    // Update devices based on the command
    setDevices(currentDevices => {
      const updatedDevices = { ...currentDevices };
      
      Object.keys(updatedDevices).forEach(key => {
        const currentDevice = updatedDevices[key];
        
        // Check if this device should be affected by the command
        const matchesDevice = device === 'all' || currentDevice.type === device;
        const matchesRoom = !room || room === 'all' || currentDevice.room === room;
        
        if (matchesDevice && matchesRoom) {
          switch (action) {
            case 'turn_on':
              updatedDevices[key] = { ...currentDevice, isOn: true };
              break;
            case 'turn_off':
              updatedDevices[key] = { ...currentDevice, isOn: false };
              break;
            case 'increase':
              if (currentDevice.type === 'light' && currentDevice.brightness !== undefined) {
                const newBrightness = Math.min(100, (currentDevice.brightness || 0) + 20);
                updatedDevices[key] = { ...currentDevice, brightness: newBrightness, isOn: true };
              } else if (currentDevice.type === 'fan' && currentDevice.speed !== undefined) {
                const newSpeed = Math.min(3, (currentDevice.speed || 0) + 1);
                updatedDevices[key] = { ...currentDevice, speed: newSpeed, isOn: true };
              }
              break;
            case 'decrease':
              if (currentDevice.type === 'light' && currentDevice.brightness !== undefined) {
                const newBrightness = Math.max(0, (currentDevice.brightness || 0) - 20);
                updatedDevices[key] = { 
                  ...currentDevice, 
                  brightness: newBrightness,
                  isOn: newBrightness > 0
                };
              } else if (currentDevice.type === 'fan' && currentDevice.speed !== undefined) {
                const newSpeed = Math.max(0, (currentDevice.speed || 0) - 1);
                updatedDevices[key] = { 
                  ...currentDevice, 
                  speed: newSpeed,
                  isOn: newSpeed > 0
                };
              }
              break;
            // Other actions can be handled here
          }
        }
      });
      
      return updatedDevices;
    });
    
    // Display feedback from assistant
    const feedbackMessage = generateFeedback(command);
    const emoji = getCommandEmoji(command);
    
    setFeedback({
      message: feedbackMessage,
      emoji: emoji,
      isVisible: true
    });
  }, []);

  // Toggle a specific device
  const handleToggleDevice = useCallback((deviceId: string) => {
    setDevices(current => {
      const device = current[deviceId];
      if (!device) return current;
      
      return {
        ...current,
        [deviceId]: {
          ...device,
          isOn: !device.isOn
        }
      };
    });
  }, []);

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <ThreeScene devices={devices} />
      </div>
      
      {/* Device Controls */}
      <DeviceControls devices={devices} onToggleDevice={handleToggleDevice} />
      
      {/* Command Interface */}
      <CommandInterface onCommand={handleCommand} />
      
      {/* AI Assistant */}
      <AIAssistant feedback={feedback} />
    </div>
  );
};

export default SmartHome;
