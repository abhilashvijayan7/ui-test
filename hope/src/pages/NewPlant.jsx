import React, { useState } from "react";
import cheveron_right from "../images/cheveron-right.png";

function NewPlant() {

    const [formData, setFormData] = useState({
    plantName: '',
    location: '',
    contactPerson: '',
    phone: '',
    address: '',
    contactNo: '',
    email: '',
    deviceId: ''
  });

  const locations = [
    'Select Location',
    'Greenhouse A',
    'Greenhouse B',
    'Outdoor Garden',
    'Indoor Lab',
    'Storage Area'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };
  return (
    <div className="flex-1">
      <div className="max-w-[450px] mx-auto text-[#6B6B6B] my-6 lg:max-w-[1280px] lg:px-11 lg:w-full">
        <div className="font-[500] text-[14px] lg:flex lg:justify-between lg:items-center">
          <div>
            <p className="text-[#4E4D4D] font-[700] text-[28px] mb-[20px]">
              Add New Plant{" "}
            </p>
            <div className="flex bg-gray-100 w-[166px] py-1 px-2 rounded-sm mb-[18px]">
              <p>Home</p>
              <img src={cheveron_right} alt="" className="w-[20px] h-[20px]" />
              <p className="text-[#208CD4]">Add New Plant</p>
            </div>
          </div>
        </div>
      </div>

      <div className="  p-4 lg:p-6 max-w-[480px] mx-auto text-[#6B6B6B] my-6 lg:max-w-[1280px] ">
        <div className="max-w-full bg-white rounded-2xl shadow-sm border border-gray-200">

            <div className=" py-6 px-4 sm:px-6 lg:px-8">
      <div className=" ">
       
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">New Plant</h1>
          
          <div className="space-y-6">
            {/* First Row - Plant Name and Location Dropdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label htmlFor="plantName" className="block text-sm font-medium text-gray-700 mb-2">
                  Plant Name
                </label>
                <input
                  type="text"
                  id="plantName"
                  name="plantName"
                  value={formData.plantName}
                  onChange={handleInputChange}
                  placeholder="Name of Plant"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                >
                  {locations.map((location, index) => (
                    <option key={index} value={index === 0 ? '' : location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Second Row - Contact Person and Phone */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person
                </label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Third Row - Location Address and Contact No */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              <div>
                <label htmlFor="contactNo" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact No
                </label>
                <input
                  type="tel"
                  id="contactNo"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Fourth Row - Email and Device ID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              <div>
                <label htmlFor="deviceId" className="block text-sm font-medium text-gray-700 mb-2">
                  Device ID
                </label>
                <input
                  type="text"
                  id="deviceId"
                  name="deviceId"
                  value={formData.deviceId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-[#208CD4] hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save Changes
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
