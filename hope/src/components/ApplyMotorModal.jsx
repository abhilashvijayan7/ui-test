import React, { useState, useEffect } from 'react';
import { ChevronDown, Plus, Minus, X } from 'lucide-react';

export default function ApplyMotorModal({ isOpen, onClose, onSave }) {
  const [motors, setMotors] = useState([
    { id: 1, selectedMotor: '', maxRunningTime: 'Maximum 6 Hours', workingOrder: 1 },
    { id: 2, selectedMotor: '', maxRunningTime: 'Maximum 6 Hours', workingOrder: 2 }
  ]);

  const addMotor = () => {
    const newId = Math.max(...motors.map(m => m.id)) + 1;
    const newMotor = {
      id: newId,
      selectedMotor: '',
      maxRunningTime: 'Maximum 6 Hours',
      workingOrder: motors.length + 1
    };
    setMotors([...motors, newMotor]);
  };

  const removeMotor = (id) => {
    if (motors.length > 1) {
      const updatedMotors = motors.filter(motor => motor.id !== id);
      const reorderedMotors = updatedMotors.map((motor, index) => ({
        ...motor,
        workingOrder: index + 1
      }));
      setMotors(reorderedMotors);
    }
  };

  const handleSave = () => {
    onSave(motors);
    onClose();
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">Apply Motor</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="space-y-6">
            {motors.map((motor) => (
              <div key={motor.id} className="grid grid-cols-12 gap-6 items-center">
                {/* Select Motor */}
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Select Motor
                  </label>
                  <div className="relative">
                    <select 
                      className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                      value={motor.selectedMotor}
                      onChange={(e) => {
                        setMotors(motors.map(m => 
                          m.id === motor.id ? { ...m, selectedMotor: e.target.value } : m
                        ));
                      }}
                    >
                      <option value="">Select a motor...</option>
                      <option value="motor1">Motor 1</option>
                      <option value="motor2">Motor 2</option>
                      <option value="motor3">Motor 3</option>
                      <option value="motor4">Motor 4</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Max Running Time */}
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Max Running Time
                  </label>
                  <div className="px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                    {motor.maxRunningTime}
                  </div>
                </div>

                {/* Working Order */}
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Working Order
                  </label>
                  <div className="px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-700 text-center font-medium">
                    {motor.workingOrder}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="col-span-3 flex justify-end space-x-2">
                  {motors.length > 1 && (
                    <button
                      onClick={() => removeMotor(motor.id)}
                      className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors"
                      title="Remove motor"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={addMotor}
                    className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors"
                    title="Add motor"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}