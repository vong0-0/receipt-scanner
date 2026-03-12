"use client";

import { FaGoogle } from "react-icons/fa";
import { Button } from "./ui/button";
import { signIn } from "@/lib/auth-client";

export default function LoginGoogleButton() {
  return (
    <Button
      variant="outline"
      type="button"
      onClick={() => {
        console.log("login with google ");
        signIn.social({
          provider: "google",
          callbackURL: "/dashboard",
        });
      }}
    >
      <span>
        <FaGoogle />
      </span>
      <span>ເຂົ້າສູ່ລະບົບດ້ວຍບັນຊີ Google</span>
    </Button>
  );
}
