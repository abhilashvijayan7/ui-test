const AddUserModal = ({ isOpen, onClose }) => {
  return (
    isOpen && (
      <div className="fixed inset-0 bg-[#DADADA] bg-opacity-50 flex items-center justify-center z-50 ">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md ">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Add New User</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <form className="space-y-4 ">
            <div className="lg:flex lg:gap-4">
              <div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date Of Joining
                  </label>
                  <input
                    type="date"
                    // Current date and time in IST
                    className="mt-1 block w-full border border-[#DADADA] rounded-md "
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Vendor Type
                  </label>
                  <select className="mt-1 block w-full border border-[#DADADA] rounded-md ">
                    <option>Admin</option>
                    <option>Renderer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Vendor Name
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-[#DADADA] rounded-md "
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select className="mt-1 block w-full border border-[#DADADA] rounded-md ">
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date Of Birth
                  </label>
                  <input
                    type="date"
                    className="mt-1 block w-full border border-[#DADADA] rounded-md "
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Designation
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-[#DADADA] rounded-md "
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-[#DADADA] rounded-md "
                  />
                </div>
              </div>

              <div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-[#DADADA] rounded-md "
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full  border border-[#DADADA] rounded-md "
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contact No
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-[#DADADA] rounded-md "
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    className="mt-1 block w-full border border-[#DADADA] rounded-md "
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Time Interval
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-[#DADADA] rounded-md "
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Devices
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-[#DADADA] rounded-md "
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="bg-[#208CD4] text-white px-4 py-2 rounded-md hover:bg-[#1a6ea4]"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddUserModal;
