import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { AlignJustify, LogOut } from "lucide-react";

function AdminHeader({ setOpen }) {
  // useEffect(() => {
  //   const header = document.querySelector("header");
  //   const footer = document.querySelector("footer");
  //   const body = document.querySelector("body");

  //   if (header) header.style.display = "none";
  //   if (footer) footer.style.display = "none";
  //   if (body) body.style.paddingTop = "0px";
  // }, []);

  // Temporary logout handler
  function handleLogout() {
    console.log("Logout clicked (not integrated yet)");
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
