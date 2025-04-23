
import React from 'react';
import { DeviceState, DeviceType, RoomType } from '@/types/types';

interface DeviceControlsProps {
  devices: Record<string, DeviceState>;
  onToggleDevice: (deviceId: string) => void;
}

export const DeviceControls: React.FC<DeviceControlsProps> = ({ devices, onToggleDevice }) => {
  const rooms: RoomType[] = ['living', 'kitchen', 'bedroom', 'bathroom'];
  
  return (
    <div className="absolute top-4 left-4 bg-white bg-opacity-80 p-4 rounded-lg shadow-md max-h-[90vh] overflow-y-auto">
      <h2 className="text-lg font-semibold mb-2">Device Controls</h2>
      
      {rooms.map((room) => {
        const roomDevices = Object.values(devices).filter(device => device.room === room);
        
        if (roomDevices.length === 0) return null;
        
        return (
          <div key={room} className="mb-4">
            <h3 className="font-medium text-sm text-gray-700 mb-1 capitalize">{room} Room</h3>
            <div className="space-y-2">
              {roomDevices.map((device) => (
                <div key={device.id} className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleDevice(device.id)}
                    className={`px-3 py-1 text-sm rounded-full ${
                      device.isOn ? 'bg-smarthome-purple text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {getDeviceIcon(device.type)} {device.name} {device.isOn ? 'ON' : 'OFF'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

function getDeviceIcon(type: DeviceType): string {
  switch (type) {
    case 'light': return '💡';
    case 'fan': return '💨';
    case 'switch': return '🔌';
    default: return '📱';
  }
}

export default DeviceControls;
