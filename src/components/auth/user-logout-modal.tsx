"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface UserLogoutModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function UserLogoutModal({ open, setOpen }: UserLogoutModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await fetch("/api/auth/logout", { method: "POST" });
      try { localStorage.removeItem("authUser"); } catch {}
      setOpen(false);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-white to-gray-50">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="mt-3 text-xl">Sign out?</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              You will need to sign in again to access your account.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-4 text-sm text-gray-500">
            Make sure any unsaved changes are saved before you continue.
          </div>
          <DialogFooter className="px-6 pb-6 gap-2 sm:gap-3">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirm} disabled={loading}>
              {loading ? "Signing out..." : "Sign out"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}


