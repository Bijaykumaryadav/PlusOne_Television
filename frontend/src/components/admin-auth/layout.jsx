import { Outlet } from "react-router-dom";
import Logo from "@/assets/Logo1.png";

function AdminAuthLayout() {
  return (
    <div className="flex min-h-screen">
      
      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 bg-[#2563EB] items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          
          {/* Bigger Logo */}
          <img
            src={Logo}
            alt="Sidha Reporting Logo"
            className="w-56 h-56 object-contain"
          />

          {/* Text Section */}
          <div>
            <h1 className="text-white text-5xl font-semibold tracking-wide">
              Sidha Reporting
            </h1>
            <p className="text-white/90 text-xl mt-3"> Delivering Truth, Every Time
            </p>
          </div>

        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-1 items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
        <Outlet />
      </div>

    </div>
  );
}

export default AdminAuthLayout;
