import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

function NewPlant() {
  const [formData, setFormData] = useState({
    plantName: '',
    location: '',
    contactPerson: '',
    phone: '',
    email: '',
    deviceId: ''
  });

  const [locations, setLocations] = useState([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [locationsError, setLocationsError] = useState('');

  // Auto-dismiss timers
  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000); // Dismiss after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [submitSuccess]);

  useEffect(() => {
    if (submitError) {
      const timer = setTimeout(() => {
        setSubmitError('');
      }, 8000); // Dismiss after 8 seconds (longer for errors)
      return () => clearTimeout(timer);
    }
  }, [submitError]);

  // Fetch locations when component mounts
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setIsLoadingLocations(true);
      setLocationsError('');
      
      const response = await fetch('https://water-pump.onrender.com/api/locations');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched locations:', data);
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLocationsError('Failed to load locations. Please refresh the page.');
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user starts typing
    if (submitError) setSubmitError('');
    if (submitSuccess) setSubmitSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      // Validate required fields
      if (!formData.plantName.trim()) {
        throw new Error('Plant name is required');
      }
      if (!formData.location.trim()) {
        throw new Error('Location is required');
      }
      if (!formData.contactPerson.trim()) {
        throw new Error('Contact person is required');
      }
      if (!formData.phone.trim()) {
        throw new Error('Phone number is required');
      }
      if (!formData.email.trim()) {
        throw new Error('Email is required');
      }
      if (!formData.deviceId.trim()) {
        throw new Error('Device ID is required');
      }

      // Find the selected location to get its ID
      const selectedLocation = locations.find(loc => loc.address === formData.location);
      
      if (!selectedLocation) {
        throw new Error('Please select a valid location');
      }

      // Prepare data for plant creation
      const plantData = {
        plant_name: formData.plantName.trim(),
        plant_location_id: selectedLocation.id,
        contact_person: formData.contactPerson.trim(),
        contact_email: formData.email.trim(),
        contact_phone: formData.phone.trim(),
        device_id: formData.deviceId.trim()
      };

      console.log('Selected location:', selectedLocation);
      console.log('Submitting plant data:', plantData);

      // First API call: Create plant
      const plantResponse = await fetch('https://water-pump.onrender.com/api/plants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(plantData),
      });

      const plantResponseText = await plantResponse.text();
      console.log('Plant creation response status:', plantResponse.status);
      console.log('Plant creation response text:', plantResponseText);

      if (!plantResponse.ok) {
        try {
          const errorData = JSON.parse(plantResponseText);
          throw new Error(errorData.message || errorData.error || `Server Error: ${plantResponse.status}`);
        } catch (parseError) {
          throw new Error(`Server Error (${plantResponse.status}): ${plantResponseText || 'Unknown error'}`);
        }
      }

      // Parse the successful plant creation response
      const plantResult = JSON.parse(plantResponseText);
      console.log('Plant added successfully:', plantResult);

      // Second API call: Create plant-location relationship
      // Using the correct field names from the API response
      const plantLocationData = {
        plant_id: plantResult.plant_id, // Using plant_id from response instead of id
        location_id: plantResult.plant_location_id, // Using plant_location_id from response
        installation_date: new Date().toISOString().split('T')[0] // Current date in YYYY-MM-DD format
      };

      console.log('Submitting plant-location data:', plantLocationData);

      const plantLocationResponse = await fetch('https://water-pump.onrender.com/api/plant-locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(plantLocationData),
      });

      const plantLocationResponseText = await plantLocationResponse.text();
      console.log('Plant-location creation response status:', plantLocationResponse.status);
      console.log('Plant-location creation response text:', plantLocationResponseText);

      if (!plantLocationResponse.ok) {
        try {
          const errorData = JSON.parse(plantLocationResponseText);
          throw new Error(errorData.message || errorData.error || `Server Error: ${plantLocationResponse.status}`);
        } catch (parseError) {
          throw new Error(`Server Error (${plantLocationResponse.status}): ${plantLocationResponseText || 'Unknown error'}`);
        }
      }

      // Parse the successful plant-location creation response
      const plantLocationResult = JSON.parse(plantLocationResponseText);
      console.log('Plant-location added successfully:', plantLocationResult);

      setSubmitSuccess(true);
      
      // Clear form data after successful submission
      setFormData({
        plantName: '',
        location: '',
        contactPerson: '',
        phone: '',
        email: '',
        deviceId: ''
      });

    } catch (error) {
      console.error('Error:', error);
      setSubmitError(error.message || 'Failed to add plant or plant-location. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1">
      <div className="max-w-[450px] mx-auto text-[#6B6B6B] my-6 lg:max-w-[1280px] lg:px-11 lg:w-full">
        <div className="font-[500] text-[14px] lg:flex lg:justify-between lg:items-center">
          <div>
            <p className="text-[#4E4D4D] font-[700] text-[28px] mb-[20px]">
              Add New Plant{" "}
            </p>
            <div className="flex bg-gray-100 w-[166px] py-1 px-2 rounded-sm mb-[18px] items-center">
              <p>Home</p>
              <ChevronRight className="w-[20px] h-[20px] text-gray-500" />
              <p className="text-[#208CD4]">Add New Plant</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6 max-w-[480px] mx-auto text-[#6B6B6B] my-6 lg:max-w-[1280px]">
        <div className="max-w-full bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-8">New Plant</h1>
              
              {/* Success Message */}
              {submitSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 relative">
                  <div className="flex justify-between items-start">
                    <div className="text-green-800">
                      <p className="text-sm font-medium">Plant and location relationship added successfully!</p>
                    </div>
                    <button
                      onClick={() => setSubmitSuccess(false)}
                      className="text-green-600 hover:text-green-800 text-lg font-bold leading-none"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              {/* Error Messages */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 relative">
                  <div className="flex justify-between items-start">
                    <div className="text-red-800">
                      <p className="text-sm font-medium">{submitError}</p>
                    </div>
                    <button
                      onClick={() => setSubmitError('')}
                      className="text-red-600 hover:text-red-800 text-lg font-bold leading-none"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              {locationsError && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex">
                    <div className="text-yellow-800">
                      <p className="text-sm font-medium">{locationsError}</p>
                      <button 
                        onClick={fetchLocations}
                        className="text-sm underline hover:no-underline mt-1"
                      >
                        Retry loading locations
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-6">
                {/* First Row - Plant Name and Location Dropdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="plantName" className="block text-sm font-medium text-gray-700 mb-2">
                      Plant Name *
                    </label>
                    <input
                      type="text"
                      id="plantName"
                      name="plantName"
                      value={formData.plantName}
                      onChange={handleInputChange}
                      placeholder="Name of Plant"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <select
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      disabled={isLoadingLocations}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white disabled:bg-gray-100"
                    >
                      <option value="">
                        {isLoadingLocations ? 'Loading locations...' : 'Select Location'}
                      </option>
                      {locations.map((location) => (
                        <option key={location.id} value={location.address}>
                          {location.address}
                        </option>
                      ))}
                    </select>
                    {/* Debug info - remove this in production */}
                    {!isLoadingLocations && locations.length === 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        No locations loaded. Check console for API response.
                      </p>
                    )}
                  </div>
                </div>

                {/* Second Row - Contact Person and Phone */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      id="contactPerson"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Third Row - Email and Device ID */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="deviceId" className="block text-sm font-medium text-gray-700 mb-2">
                      Device ID *
                    </label>
                    <input
                      type="text"
                      id="deviceId"
                      name="deviceId"
                      value={formData.deviceId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-6">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || isLoadingLocations}
                    className={`font-medium py-3 px-8 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      isSubmitting || isLoadingLocations
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-[#208CD4] hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewPlant;