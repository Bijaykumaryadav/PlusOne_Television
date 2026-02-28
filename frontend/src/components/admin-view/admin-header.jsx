import React from "react";
import { Button } from "../ui/button";
import { AlignJustify, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/features/admin/auth-slice";
import privateClient from "@/services/axiosInstance";
// sonner toast is optional; guard import in case it's not installed
let toast;
try {
  // eslint-disable-next-line import/no-extraneous-dependencies
  toast = require("@/components/ui/sonner").useToast?.() || require("sonner").toast;
} catch (e) {
  toast = null;
}

function AdminHeader({ setOpen }) {
  // useEffect(() => {
  //   const header = document.querySelector("header");
  //   const footer = document.querySelector("footer");
  //   const body = document.querySelector("body");

  //   if (header) header.style.display = "none";
  //   if (footer) footer.style.display = "none";
  //   if (body) body.style.paddingTop = "0px";
  // }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (err) {
      // ignore server errors but continue to clear client state
    }

    // Clear localStorage and axios header
    try {
      localStorage.removeItem("accessToken");
    } catch (e) {}
    try {
      delete privateClient.defaults.headers.common["Authorization"];
    } catch (e) {}

    if (toast) {
      try { toast.success && toast.success("Signed out"); } catch (e) {}
    }

    navigate("/auth/admin/login", { replace: true });
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
