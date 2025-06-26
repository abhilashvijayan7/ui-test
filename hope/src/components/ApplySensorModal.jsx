import React, { useState, useEffect } from "react";
import { Plus, Minus, X } from "lucide-react";

export default function ApplySensorModal({ isOpen, onClose, onSave, plantId }) {
  const [sensors, setSensors] = useState([
    { id: 1, sensorType: "MIN/MAX", minValue: "", maxValue: "" },
    { id: 2, sensorType: "YES/NO", minValue: "", maxValue: "" },
  ]);

  const addSensor = () => {
    const newId = Math.max(...sensors.map((s) => s.id)) + 1;
    const newSensor = {
      id: newId,
      sensorType: "MIN/MAX",
      minValue: "",
      maxValue: "",
    };
    setSensors([...sensors, newSensor]);
  };

  const removeSensor = (id) => {
    if (sensors.length > 1) {
      setSensors(sensors.filter((sensor) => sensor.id !== id));
    }
  };

  const handleInputChange = (id, field, value) => {
    setSensors(
      sensors.map((sensor) =>
        sensor.id === id ? { ...sensor, [field]: value } : sensor
      )
    );
  };

  const handleSave = () => {
    const validSensors = sensors.map((sensor) => ({
      ...sensor,
      minValue: sensor.minValue ? parseInt(sensor.minValue, 10) : "",
      maxValue: sensor.maxValue ? parseInt(sensor.maxValue, 10) : "",
    }));
    onSave(validSensors, plantId);
    onClose();
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">Apply Sensor</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {sensors.map((sensor) => (
              <div key={sensor.id} className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-4">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Select Sensor
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                    value={sensor.sensorType}
                    onChange={(e) =>
                      handleInputChange(sensor.id, "sensorType", e.target.value)
                    }
                  >
                    <option value="MIN/MAX">MIN/MAX</option>
                    <option value="YES/NO">YES/NO</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Min Value
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={sensor.minValue}
                    onChange={(e) =>
                      handleInputChange(sensor.id, "minValue", e.target.value)
                    }
                    placeholder="1"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Max Value
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={sensor.maxValue}
                    onChange={(e) =>
                      handleInputChange(sensor.id, "maxValue", e.target.value)
                    }
                    placeholder="10"
                  />
                </div>
                <div className="col-span-4 flex justify-end space-x-2">
                  {sensors.length > 1 && (
                    <button
                      onClick={() => removeSensor(sensor.id)}
                      className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors"
                      title="Remove sensor"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={addSensor}
                    className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors"
                    title="Add sensor"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

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
            disabled={sensors.some((s) => !s.minValue || !s.maxValue)}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}