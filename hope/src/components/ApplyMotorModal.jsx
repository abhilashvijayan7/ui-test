import React, { useState, useEffect } from 'react';
import { ChevronDown, Plus, Minus, X } from 'lucide-react';
import axios from 'axios'; // Correct import for axios

export default function ApplyMotorModal({ isOpen, onClose, plant_id }) {
  const [motors, setMotors] = useState([
    { id: 1, selectedMotor: '', maxRunningTime: '', workingOrder: '' }
  ]);
  const [availableMotors, setAvailableMotors] = useState([]);
  const [isLoadingMotors, setIsLoadingMotors] = useState(false);
  const [motorsError, setMotorsError] = useState('');

  // Fetch available motors when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchMotors = async () => {
        try {
          setIsLoadingMotors(true);
          setMotorsError('');
          const response = await axios.get('https://water-pump.onrender.com/api/motors');
          // Assuming API returns array of objects with { motor_id, name }
          setAvailableMotors(response.data);
        } catch (error) {
          console.error('Error fetching motors:', error);
          setMotorsError('Failed to load motors. Please try again.');
        } finally {
          setIsLoadingMotors(false);
        }
      };
      fetchMotors();
    }
  }, [isOpen]);

  const addMotor = () => {
    const newId = Math.max(...motors.map(m => m.id)) + 1;
    const newMotor = {
      id: newId,
      selectedMotor: '',
      maxRunningTime: '',
      workingOrder: ''
    };
    setMotors([...motors, newMotor]);
  };

  const removeMotor = (id) => {
    if (motors.length > 1) {
      const updatedMotors = motors.filter(motor => motor.id !== id);
      setMotors(updatedMotors);
    }
  };

  const handleMotorChange = (id, field, value) => {
    if (field === 'maxRunningTime') {
      // Restrict maxRunningTime to 1-6
      if (value === '' || (Number(value) >= 1 && Number(value) <= 6)) {
        setMotors(motors.map(motor =>
          motor.id === id ? { ...motor, [field]: value } : motor
        ));
      }
    } else {
      setMotors(motors.map(motor =>
        motor.id === id ? { ...motor, [field]: value } : motor
      ));
    }
  };

  const handleSave = async () => {
    // Debug plant_id
    console.log('Raw plant_id prop:', plant_id, 'Type:', typeof plant_id);
    
    // Validate plant_id first
    if (!plant_id || plant_id === '' || plant_id === 'undefined' || plant_id === 'null') {
      console.error('Invalid plant_id:', plant_id);
      setMotorsError(`Invalid plant ID: "${plant_id}". Please select a plant first.`);
      return;
    }
    
    const plantIdNum = parseInt(plant_id, 10);
    if (isNaN(plantIdNum) || plantIdNum <= 0) {
      console.error('plant_id conversion failed:', plant_id, '->', plantIdNum);
      setMotorsError(`Invalid plant ID: "${plant_id}". Please select a valid plant.`);
      return;
    }

    // Validate inputs
    const invalidMotors = motors.filter(motor => 
      motor.selectedMotor === '' ||
      motor.maxRunningTime === '' || 
      isNaN(motor.maxRunningTime) || 
      Number(motor.maxRunningTime) < 1 || 
      Number(motor.maxRunningTime) > 6 ||
      motor.workingOrder === '' || 
      isNaN(motor.workingOrder) || 
      Number(motor.workingOrder) < 1
    );
    if (invalidMotors.length > 0) {
      setMotorsError('Please ensure all fields are filled: Select a motor, Max Running Time (1–6), and Working Order (positive number).');
      return;
    }

    // Check for duplicate workingOrder values
    const workingOrders = motors.map(m => Number(m.workingOrder));
    if (new Set(workingOrders).size !== workingOrders.length) {
      setMotorsError('Working Order values must be unique for each motor.');
      return;
    }

    // Check for duplicate motor_id selections
    const selectedMotorIds = motors.map(m => Number(m.selectedMotor));
    if (new Set(selectedMotorIds).size !== selectedMotorIds.length) {
      setMotorsError('Each motor must be unique. Please select different motors.');
      return;
    }

    try {
      setMotorsError('');
      
      console.log('Final plantIdNum:', plantIdNum, 'Type:', typeof plantIdNum);
      
      const payload = motors.map(motor => ({
        plant_id: plantIdNum,
        motor_id: parseInt(motor.selectedMotor, 10),
        installation_date: new Date().toISOString().split('T')[0], 
        motor_brand: 'General', 
        motor_running_time: parseInt(motor.maxRunningTime, 10),
        motor_working_order: parseInt(motor.workingOrder, 10)
      }));

      console.log('Payload being sent 1:', payload);

      const [singlepayload] = payload;

      console.log('Payload being sent:', singlepayload);
      
      // Validate payload before sending
      const invalidPayload = payload.some(item => 
        !item.plant_id || isNaN(item.plant_id) || 
        !item.motor_id || isNaN(item.motor_id) ||
        !item.motor_running_time || isNaN(item.motor_running_time) ||
        !item.motor_working_order || isNaN(item.motor_working_order)
      );
      
      if (invalidPayload) {
        console.error('Invalid payload detected:', payload);
        setMotorsError('Invalid data detected. Please check all fields.');
        return;
      }

      // Note: If the server expects a single object instead of an array, modify to send one motor at a time
      // or use a different endpoint (e.g., POST /api/plantmotors for each motor).
      const response = await axios.post('https://water-pump.onrender.com/api/plantmotors', singlepayload);

      // Refresh plants to ensure parent component updates
      await axios.get('https://water-pump.onrender.com/api/plants');
      onClose();
    } catch (error) {
      console.error('Error submitting motors:', error);
      console.error('Server response:', error.response?.data); // Log full server response for debugging
      setMotorsError(
        error.response?.data?.message || 
        error.response?.data?.error || 
        `Failed to save motor data (Server Error: ${error.response?.status || 'Unknown'}).`
      );
    }
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
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Apply Motor</h2>
            <p className="text-sm text-gray-500 mt-1">Plant ID: {plant_id || 'Not provided'} (Type: {typeof plant_id})</p>
          </div>
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
          {motorsError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-red-800">{motorsError}</p>
                <button
                  onClick={() => setMotorsError('')}
                  className="text-red-600 hover:text-red-800 text-lg font-bold"
                >
                  ×
                </button>
              </div>
            </div>
          )}

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
                      onChange={(e) => handleMotorChange(motor.id, 'selectedMotor', e.target.value)}
                      disabled={isLoadingMotors}
                    >
                      <option value="">
                        {isLoadingMotors ? 'Loading motors...' : 'Select a motor...'}
                      </option>
                      {availableMotors.map((availableMotor) => (
                        <option key={availableMotor.motor_id} value={availableMotor.motor_id}>
                          {availableMotor.motor_name || `Motor ${availableMotor.motor_id}`}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Max Running Time */}
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Max Running Time (Hours)
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={motor.maxRunningTime}
                    onChange={(e) => handleMotorChange(motor.id, 'maxRunningTime', e.target.value)}
                    placeholder="Maximum 6 Hours"
                    min="1"
                    max="6"
                    step="1"
                  />
                </div>

                {/* Working Order */}
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Working Order
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={motor.workingOrder}
                    onChange={(e) => handleMotorChange(motor.id, 'workingOrder', e.target.value)}
                    placeholder="Enter order"
                    min="1"
                    step="1"
                  />
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
            disabled={isLoadingMotors}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}