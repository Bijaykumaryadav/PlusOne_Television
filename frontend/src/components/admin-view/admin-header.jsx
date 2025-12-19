import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import { Button } from "../ui/button";
import { AlignJustify, LogOut } from "lucide-react";


function AdminHeader({setOpen }) {
  useEffect(() => {
    // Dynamically hide the header and footer, and adjust the body padding-top
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");
    const body = document.querySelector("body");

    if (header) {
      // Hide the header for all screens
      header.style.display = "none"; 
    }

    if (footer) {
      // Hide the footer for all screens
      footer.style.display = "none"; 
    }

    if (body) {
      // Remove padding-top from body (pt)
      body.style.paddingTop = "0px"; 
    }
  }, []);

  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;