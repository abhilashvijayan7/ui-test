import mainImage from "./images/image 3.png";
import dashboard from "./images/dashboard.png";
import devices from "./images/devices.png";
import tv from "./images/tv_options_input_settings.png";
import deployed from "./images/deployed_code_account.png";
import headset from "./images/headset_mic.png";
import passkey from "./images/passkey.png";
import logout from "./images/logout.png";
import icon from "./images/Icon.png";
import headImage from "./images/image 3 (1).png";
import dehaze from "./images/dehaze.png";

function App() {
  return (
    <div className="flex flex-col lg:flex-row lg:bg-[#DADADA] min-h-screen">
      {/* Sidebar */}
      <div className="left-side text-[#6B6B6B] w-[236px] bg-[#FFFFFF] shrink-0 hidden lg:block">
        <img
          src={mainImage}
          alt=""
          className="pt-[40px] ml-[5.5px] mb-[35px]"
        />
        <div className="mr-[26px] ml-[16px]">
          <div className="flex py-[12px] pl-[20px] pr-[12px] gap-3 mb-[12px]">
            <div>
              <img src={dashboard} alt="" />
            </div>
            <div>
              <p>Home</p>
            </div>
          </div>

          <div className="flex py-[12px] pl-[20px] pr-[12px] gap-3 mb-[12px]">
            <div>
              <img src={devices} alt="" />
            </div>
            <div>
              <p>My Device</p>
            </div>
          </div>

          <div className="flex py-[12px] pl-[20px] pr-[12px] gap-3 mb-[12px]">
            <div>
              <img src={tv} alt="" />
            </div>
            <div>
              <p>Device Manager</p>
            </div>
          </div>

          <div className="flex py-[12px] pl-[20px] pr-[12px] gap-3 mb-[12px]">
            <div>
              <img src={deployed} alt="" />
            </div>
            <div>
              <p>User Manager</p>
            </div>
          </div>

          <div className="flex py-[12px] pl-[20px] pr-[12px] gap-3 mb-[12px]">
            <div>
              <img src={headset} alt="" />
            </div>
            <div>
              <p>Support</p>
            </div>
          </div>

          <div className="flex py-[12px] pl-[20px] pr-[12px] gap-3 mb-[12px]">
            <div>
              <img src={passkey} alt="" />
            </div>
            <div>
              <p>Change Password</p>
            </div>
          </div>

          <div className="flex py-[12px] pl-[20px] pr-[12px] gap-3 mb-[12px]">
            <div>
              <img src={logout} alt="" />
            </div>
            <div>
              <p>Logout</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[370px] mx-auto mb-[110px] lg:max-w-none lg:mx-0">
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mt-[40px] mb-[9px] lg:hidden">
            <img src={headImage} alt="" />
            <img src={dehaze} alt="" className="w-[24px] h-[24px]" />
          </div>
          <div className="right-side flex flex-col gap-6 items-start lg:flex-row lg:flex-wrap lg:gap-[12px] lg:px-[22px] lg:py-[110px]">
            {/* Plant Sections */}
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <div
                key={index}
                className="w-[370px] px-[10px] py-[13px] border border-[#DADADA] rounded-[12px] bg-[#FFFFFF] lg:w-[417px]"
              >
                <div className="flex justify-between mb-[20px] items-center">
                  <p className="text-[#4E4D4D] text-[19px] font-[700]">
                    Government Medical College Thrissur Medical College Thrissur 
                  </p>
                  <button className="flex bg-[#66BB6A] items-center py-[10px] px-[18px] ml-[10px]  rounded-[6px] gap-[10px] justify-center text-[16px] text-[#FFFFFF]">
                    <img src={icon} alt="" className="w-[20px] h-[20px]" />
                    START
                  </button>
                </div>

                <div className="flex text-[14px] text-[#6B6B6B] mb-[10px] font-[400] justify-between">
                  <div className="pr-[14px] lg:pr-[55.67px]">
                    <p>Connection</p>
                    <p className="text-[18px] text-[#EF5350] font-[600]">
                      Disconnected
                    </p>
                  </div>
                  <div className="pr-[82px] lg:pr-[123.67px]">
                    <p>Status</p>
                    <p className="text-[18px] text-[#208CD4] font-[600]">
                      Idle
                    </p>
                  </div>
                  <div>
                    <p>Mode</p>
                    <p className="text-[18px] text-[#4CAF50] font-[600]">
                      Auto
                    </p>
                  </div>
                </div>

                <div className="mb-[6px]">
                  <p className="text-[18px] text-[#4E4D4D] pb-[6px] border-b border-b-[#208CD4] mb-[12px] font-[700]">
                    Motor & Power
                  </p>
                  <div className="lg:flex gap-3">
                    {[1].map((motor, motorIndex) => (
                      <div
                        key={motorIndex}
                        className="border border-[#DADADA] rounded-[8px] py-[12px] px-[8px] mb-[10px] text-[14px] font-[400] text-[#6B6B6B] lg:w-[485px]"
                      >
                        <div className="flex items-center justify-between border-b border-b-[#DADADA] pb-[12px] font-[700] text-[#4E4D4D]">
                          <p className="text-[18px]">Motor {motor}</p>
                          <p className="text-[16px] text-[#EF5350]">OFF</p>
                        </div>
                        <div className="flex py-[12px] justify-between text-[14px]">
                          <p>V (L1/L2/L3)</p>
                          <p className="text-[#208CD4] font-[600]">
                            225/226/227 V
                          </p>
                        </div>
                        <div className="flex pt-[2px] pb-[14px] justify-between">
                          <p>I (L1/L2/L3)</p>
                          <p className="text-[#208CD4] font-[600]">8/8.8/9 I</p>
                        </div>
                        <div className="flex justify-between">
                          <p>Timers (Sess/Cum)</p>
                          <p className="text-[#208CD4] font-[600]">
                            1h/ 10m/ 25s
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between">
                    <div className="flex items-center justify-between border border-[#DADADA] rounded-md px-2 py-1.5 font-[700] text-[#4E4D4D] ">
                      <p className="text-[18px] mr-2">Motor 2</p>
                      <p className="text-[16px] text-[#66BB6A]">STAND BY</p>
                    </div>
                    <div className="flex items-center justify-between border border-[#DADADA] rounded-md px-2 py-1.5 font-[700] text-[#4E4D4D]">
                      <p className="text-[18px] mr-2">Motor 3</p>
                      <p className="text-[16px] text-[#EF5350]">OFF</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="border-b border-b-[#208CD4] pb-[6px] text-[#4E4D4D] font-[700] text-[18px]">
                    Sensors & Actuators
                  </p>
                  <div className="mt-[6px] text-[#6B6B6B] text-[14px] font-[400]">
                    <div className="flex border-b border-b-[#DADADA] pb-[6px] gap-15">
                      <div className="w-[33%]">
                        <p className="">
                          Water Inflow
                        </p>
                        <p className="text-[16px] font-[700] text-[#EF5350]">
                          OFF
                        </p>
                      </div>
                      <div className="w-[33%]">
                        <p className="">
                          HOCL/Drainage
                        </p>
                        <p className="text-[16px] font-[700] text-[#EF5350]">
                          OFF
                        </p>
                      </div>
                      <div className="w-[33%]">
                        <p className="">
                          Chlorine Gas
                        </p>
                        <p className="text-[16px] font-[700] text-[#EF5350]">
                          OFF
                        </p>
                      </div>
                    </div>

                    <div className="flex border-b border-b-[#DADADA] py-[6px] gap-15">
                      <div className="w-[33%]">
                        <p className="">Actuator 4</p>
                        <p className="text-[16px] font-[700] text-[#EF5350]">
                          OFF
                        </p>
                      </div>
                      <div className="w-[33%]">
                        <p className="">Water Level</p>
                        <p className="text-[16px] font-[600] text-[#208CD4]">
                          ---%
                        </p>
                      </div>
                      <div className="w-[33%]">
                        <p className="">OHT Level</p>
                        <p className="text-[16px] font-[600] text-[#208CD4]">
                          ---%
                        </p>
                      </div>
                    </div>

                    <div className="flex border-b border-b-[#DADADA] py-[6px] gap-15 ">
                      <div className="w-[33%]">
                        <p className="">
                          Vacuum Switch
                        </p>
                        <p className="text-[16px] font-[600] text-[#66BB6A]">
                          OK
                        </p>
                      </div>
                      <div className="w-[33%]">
                        <p className="">Cylinder wt</p>
                        <p className="text-[16px] font-[600] text-[#208CD4]">
                          ---kg
                        </p>
                      </div>
                      <div className="w-[33%]">
                        <p className="">
                          Res.cl (plant)
                        </p>
                        <p className="text-[16px] font-[600] text-[#208CD4]">
                          ---ppm
                        </p>
                      </div>
                    </div>

                    <div className="flex border-b border-b-[#DADADA] py-[6px] gap-15">
                      <div className="w-[33%]">
                        <p className="">
                          Res.cl (farthest)
                        </p>
                        <p className="text-[16px] font-[600] text-[#208CD4]">
                          ---ppm
                        </p>
                      </div>
                      <div className="w-[33%]">
                        <p className="">Leakage</p>
                        <p className="text-[16px] font-[600] text-[#EF5350]">
                          No
                        </p>
                      </div>
                      <div className="w-[33%]">
                        <p className="">Last Fault</p>
                        <p className="text-[16px] font-[600] text-[#208CD4]">
                          None
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
