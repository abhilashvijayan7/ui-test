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
  const [plants, setPlants] = useState([]);
  const [isLoadingPlants, setIsLoadingPlants] = useState(true);
  const [plantsError, setPlantsError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [plantsPerPage, setPlantsPerPage] = useState(10);

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
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      setIsLoadingPlants(true);
      setPlantsError('');
      
      const response = await fetch('https://water-pump.onrender.com/api/plants');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched plants:', data);
      
      // Sort plants to show most recent first
      // Assuming the API returns plants with plant_id or created_at field
      // If there's a created_at timestamp, use that; otherwise use plant_id as proxy for creation order
      const sortedPlants = data.sort((a, b) => {
        // First try to sort by created_at if it exists
        if (a.created_at && b.created_at) {
          return new Date(b.created_at) - new Date(a.created_at);
        }
        // Fallback to sorting by plant_id (assuming higher ID = more recent)
        return (b.plant_id || 0) - (a.plant_id || 0);
      });
      
      setPlants(sortedPlants);
    } catch (error) {
      console.error('Error fetching plants:', error);
      setPlantsError('Failed to load plants. Please refresh the page.');
    } finally {
      setIsLoadingPlants(false);
    }
  };

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
      
      // Refresh plants list after successful submission
      await fetchPlants();
      
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

  // Filter and paginate plants (maintaining sort order)
  const filteredPlants = plants.filter(plant =>
    plant.plant_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plant.contact_person?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plant.contact_phone?.includes(searchQuery)
  );

  const totalPages = Math.ceil(filteredPlants.length / plantsPerPage);
  const startIndex = (currentPage - 1) * plantsPerPage;
  const paginatedPlants = filteredPlants.slice(startIndex, startIndex + plantsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleShowChange = (e) => {
    setPlantsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
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

      {/* Plants Table Section */}
      <div className="p-4 lg:p-6 max-w-[480px] mx-auto text-[#6B6B6B] my-6 lg:max-w-[1280px]">
        <div className="max-w-full bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Plants List</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-64 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <select 
                  value={plantsPerPage}
                  onChange={handleShowChange}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value={5}>Show 5</option>
                  <option value={10}>Show 10</option>
                  <option value={15}>Show 15</option>
                  <option value={100}>Show 100</option>
                </select>
              </div>
            </div>

            {plantsError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-start">
                  <div className="text-red-800">
                    <p className="text-sm font-medium">{plantsError}</p>
                  </div>
                  <button
                    onClick={fetchPlants}
                    className="text-sm underline hover:no-underline"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {isLoadingPlants ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading plants...</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">S/No</th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Plant Name</th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Location</th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Contact Person</th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Contact Number</th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {paginatedPlants.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                            {searchQuery ? 'No plants found matching your search.' : 'No plants added yet.'}
                          </td>
                        </tr>
                      ) : (
                        paginatedPlants.map((plant, index) => (
                          <tr key={plant.plant_id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                              {startIndex + index + 1}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                              {plant.plant_name}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                              {locations.find(loc => loc.id === plant.plant_location_id)?.address || 'Unknown'}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                              {plant.contact_person}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                              {plant.contact_phone}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                              <div className="flex gap-2">
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                  Edit
                                </button>
                                <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-2 text-sm font-medium rounded ${
                        currentPage === 1
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                      }`}
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm font-medium rounded ${
                          currentPage === page
                            ? 'bg-gray-400 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-2 text-sm font-medium rounded ${
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
  );
}

export default NewPlant;