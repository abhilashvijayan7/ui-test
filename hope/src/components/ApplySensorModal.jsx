import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
import axios from 'axios';

export default function ApplySensorModal({ isOpen, onClose, plantId }) {
  const [sensors, setSensors] = useState([
    { id: 1, sensorType: '', minValue: '', maxValue: '' },
    { id: 2, sensorType: '', minValue: '', maxValue: '' },
  ]);
  const [sensorTypes, setSensorTypes] = useState([]);
  const [plantSensors, setPlantSensors] = useState([]);
  const [isLoadingPlantSensors, setIsLoadingPlantSensors] = useState(false);
  const [plantSensorsError, setPlantSensorsError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sensorsPerPage, setSensorsPerPage] = useState(10);
  const [sensorsError, setSensorsError] = useState('');

  // Fetch sensor types and plant sensors when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchSensorTypes = async () => {
        try {
          const response = await axios.get('https://water-pump.onrender.com/api/sensors/sensor-types');
          setSensorTypes(response.data); // Expecting array of objects: [{ sensor_type_id, sensor_type_name, ... }]
        } catch (error) {
          console.error('Error fetching sensor types:', error);
          setSensorsError('Failed to load sensor types. Please try again.');
        }
      };

      const fetchPlantSensors = async () => {
        try {
          setIsLoadingPlantSensors(true);
          setPlantSensorsError('');
          const response = await axios.get('https://water-pump.onrender.com/api/plantsensors');
          const filteredSensors = response.data.filter(sensor => sensor.plant_id === parseInt(plantId, 10));
          const sortedSensors = filteredSensors.sort((a, b) => 
            new Date(b.installation_date) - new Date(a.installation_date)
          );
          setPlantSensors(sortedSensors);
        } catch (error) {
          console.error('Error fetching plant sensors:', error);
          setPlantSensorsError('Failed to load plant sensors. Please try again.');
        } finally {
          setIsLoadingPlantSensors(false);
        }
      };

      fetchSensorTypes();
      if (plantId) {
        fetchPlantSensors();
      }
    }
  }, [isOpen, plantId]);

  const handleInputChange = (id, field, value) => {
    if (field === 'minValue' || field === 'maxValue') {
      if (value === '' || !isNaN(value)) {
        setSensors(sensors.map(sensor =>
          sensor.id === id ? { ...sensor, [field]: value } : sensor
        ));
      }
    } else {
      setSensors(sensors.map(sensor =>
        sensor.id === id ? { ...sensor, [field]: value } : sensor
      ));
    }
  };

  const handleSave = async () => {
    console.log('Raw plantId prop:', plantId, 'Type:', typeof plantId);
    if (!plantId || plantId === '' || plantId === 'undefined' || plantId === 'null') {
      console.error('Invalid plantId:', plantId);
      setSensorsError(`Invalid plant ID: "${plantId}". Please select a plant first.`);
      return;
    }

    const plantIdNum = parseInt(plantId, 10);
    if (isNaN(plantIdNum) || plantIdNum <= 0) {
      console.error('plantId conversion failed:', plantId, '->', plantIdNum);
      setSensorsError(`Invalid plant ID: "${plantId}". Please select a valid plant.`);
      return;
    }

    const invalidSensors = sensors.filter(sensor => 
      sensor.sensorType === '' ||
      (sensor.sensorType === 'min-max' && (sensor.minValue === '' || isNaN(sensor.minValue) || sensor.maxValue === '' || isNaN(sensor.maxValue)))
    );
    if (invalidSensors.length > 0) {
      setSensorsError('Please ensure all fields are filled: Select a sensor type, and for min-max sensors, provide numeric Min and Max Values.');
      return;
    }

    try {
      setSensorsError('');
      const payload = sensors.map(sensor => ({
        plant_id: plantIdNum,
        sensor_type: sensor.sensorType, // Using sensor_type_name as sensor_type
        min_value: sensor.sensorType === 'min-max' ? parseInt(sensor.minValue, 10) : null,
        max_value: sensor.sensorType === 'min-max' ? parseInt(sensor.maxValue, 10) : null,
        installation_date: new Date().toISOString().split('T')[0],
      }));

      console.log('Payload being sent:', payload);

      const [singlePayload] = payload;

      console.log('Single payload being sent:', singlePayload);

      const invalidPayload = payload.some(item => 
        !item.plant_id || isNaN(item.plant_id) || 
        !item.sensor_type ||
        (item.sensor_type === 'min-max' && (!item.min_value || isNaN(item.min_value) || !item.max_value || isNaN(item.max_value)))
      );

      if (invalidPayload) {
        console.error('Invalid payload detected:', payload);
        setSensorsError('Invalid data detected. Please check all fields.');
        return;
      }

      const response = await axios.post('https://water-pump.onrender.com/api/plantsensors', singlePayload);
      await axios.get('https://water-pump.onrender.com/api/plants');
      const plantSensorsResponse = await axios.get('https://water-pump.onrender.com/api/plantsensors');
      const filteredSensors = plantSensorsResponse.data.filter(sensor => sensor.plant_id === plantIdNum);
      setPlantSensors(filteredSensors.sort((a, b) => 
        new Date(b.installation_date) - new Date(a.installation_date)
      ));
      onClose();
    } catch (error) {
      console.error('Error submitting sensors:', error);
      console.error('Server response:', error.response?.data);
      setSensorsError(
        error.response?.data?.message || 
        error.response?.data?.error || 
        `Failed to save sensor data (Server Error: ${error.response?.status || 'Unknown'}).`
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

  // Search and pagination for plant sensors
  const filteredPlantSensors = plantSensors.filter(sensor =>
    sensor.sensor_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(sensor.min_value || '').includes(searchQuery) ||
    String(sensor.max_value || '').includes(searchQuery)
  );

  const totalPages = Math.ceil(filteredPlantSensors.length / sensorsPerPage);
  const startIndex = (currentPage - 1) * sensorsPerPage;
  const paginatedPlantSensors = filteredPlantSensors.slice(startIndex, startIndex + sensorsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleShowChange = (e) => {
    setSensorsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Apply Sensor</h2>
            <p className="text-sm text-gray-500 mt-1">Plant ID: {plantId || 'Not provided'} </p>
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
          {sensorsError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-red-800">{sensorsError}</p>
                <button
                  onClick={() => setSensorsError('')}
                  className="text-red-600 hover:text-red-800 text-lg font-bold"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {sensors.map((sensor) => (
              <div key={sensor.id} className="grid grid-cols-12 gap-6 items-center">
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Select Sensor
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                      value={sensor.sensorType}
                      onChange={(e) => handleInputChange(sensor.id, 'sensorType', e.target.value)}
                    >
                      <option value="" disabled>
                        Select Sensor Type
                      </option>
                      {sensorTypes.length > 0 ? (
                        sensorTypes.map((type) => (
                          <option key={type.sensor_type_id} value={type.sensor_type_name}>
                            {type.sensor_type_name}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          No sensor types available
                        </option>
                      )}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                {sensor.sensorType === 'min-max' && (
                  <>
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Min Value
                      </label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={sensor.minValue}
                        onChange={(e) => handleInputChange(sensor.id, 'minValue', e.target.value)}
                        placeholder="1"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Max Value
                      </label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={sensor.maxValue}
                        onChange={(e) => handleInputChange(sensor.id, 'maxValue', e.target.value)}
                        placeholder="10"
                      />
                    </div>
                  </>
                )}
                <div className={sensor.sensorType === 'min-max' ? 'col-span-3' : 'col-span-9'} />
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
            disabled={sensors.some((s) => 
              s.sensorType === '' || 
              (s.sensorType === 'min-max' && (!s.minValue || !s.maxValue || isNaN(s.minValue) || isNaN(s.maxValue)))
            )}
          >
            Save Changes
          </button>
        </div>

        {/* Plant Sensors Table Section */}
        <div className="p-6">
          <div className="max-w-full bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="py-6 px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-semibold text-gray-900">Applied Sensors for Plant {plantId}</h2>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search applied sensors..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <select 
                    value={sensorsPerPage}
                    onChange={handleShowChange}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value={1}>Show 1</option>
                    <option value={10}>Show 10</option>
                    <option value={25}>Show 25</option>
                    <option value={50}>Show 50</option>
                  </select>
                </div>
              </div>

              {plantSensorsError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-start">
                    <div className="text-red-800">
                      <p className="text-sm font-medium">{plantSensorsError}</p>
                    </div>
                    <button
                      onClick={() => {
                        setPlantSensorsError('');
                        const fetchPlantSensors = async () => {
                          try {
                            setIsLoadingPlantSensors(true);
                            const response = await axios.get('https://water-pump.onrender.com/api/plantsensors');
                            const filteredSensors = response.data.filter(sensor => sensor.plant_id === parseInt(plantId, 10));
                            setPlantSensors(filteredSensors.sort((a, b) => 
                              new Date(b.installation_date) - new Date(a.installation_date)
                            ));
                          } catch (error) {
                            console.error('Error retrying plant sensors fetch:', error);
                            setPlantSensorsError('Failed to load plant sensors. Please try again.');
                          } finally {
                            setIsLoadingPlantSensors(false);
                          }
                        };
                        fetchPlantSensors();
                      }}
                      className="text-sm underline hover:no-underline"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}

              {isLoadingPlantSensors ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading applied sensors...</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">S/No</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Sensor Type</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Min Value</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Max Value</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Installation Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {paginatedPlantSensors.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                              {searchQuery ? 'No sensors found matching your search.' : 'No sensors applied to this plant yet.'}
                            </td>
                          </tr>
                        ) : (
                          paginatedPlantSensors.map((sensor, index) => (
                            <tr key={sensor.plant_sensor_id} className="hover:bg-gray-50">
                              <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                                {startIndex + index + 1}
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                                {sensor.sensor_type}
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                                {sensor.min_value ?? '-'}
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                                {sensor.max_value ?? '-'}
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                                {new Date(sensor.installation_date).toLocaleDateString()}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4">
                    {paginatedPlantSensors.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        {searchQuery ? 'No sensors found matching your search.' : 'No sensors applied to this plant yet.'}
                      </div>
                    ) : (
                      paginatedPlantSensors.map((sensor, index) => (
                        <div key={sensor.plant_sensor_id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded">
                                #{startIndex + index + 1}
                              </span>
                              <h3 className="font-semibold text-gray-900 text-lg">{sensor.sensor_type}</h3>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex flex-col">
                              <span className="text-gray-500 font-medium">Sensor Type:</span>
                              <span className="text-gray-900">{sensor.sensor_type}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-gray-500 font-medium">Min Value:</span>
                              <span className="text-gray-900">{sensor.min_value ?? '-'}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-gray-500 font-medium">Max Value:</span>
                              <span className="text-gray-900">{sensor.max_value ?? '-'}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-gray-500 font-medium">Installation Date:</span>
                              <span className="text-gray-900">{new Date(sensor.installation_date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 text-sm font-medium rounded ${
                          currentPage === 1
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                        }`}
                      >
                        Previous
                      </button>
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-2 text-sm font-medium rounded ${
                              currentPage === pageNum
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 text-sm font-medium rounded ${
                          currentPage === totalPages
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}