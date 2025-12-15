"use client";

import { 
  ShieldAlert, 
  User, 
  RefreshCcw, 
  CheckCircle2,
  Clock,
  Lock,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface UnassignedViewProps {
  user?: { name?: string; email?: string };
  // Removed onLogout since Navbar handles it
}

export function UnassignedUserView({ user }: UnassignedViewProps) {
  
  const handleCheckStatus = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[var(--background)] p-6 md:p-12 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        
        {/* Header Section */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
            Account Status
          </h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            Welcome, <span className="font-semibold text-[var(--foreground)]">{user?.name || "User"}</span>. 
            Here is the current status of your workspace access.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* LEFT COLUMN: Main Status Card */}
          <div className="flex flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm">
            <div>
              <div className="inline-flex rounded-lg p-3 bg-orange-100 text-orange-600 dark:bg-orange-900/20 mb-6">
                <ShieldAlert className="h-8 w-8" />
              </div>
              
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-3">
                Pending Agent Assignment
              </h2>
              
              <p className="text-[var(--muted-foreground)] mb-6 leading-relaxed">
                Your account has been successfully created, but you are not yet assigned to an Agent or specific role. 
                <br /><br />
                We cannot load the dashboard until an Administrator connects your account.
              </p>

              <div className="rounded-lg bg-[var(--muted)]/50 p-4 border border-[var(--border)] mb-8">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-[var(--muted-foreground)]" />
                  <div className="text-sm">
                    <p className="text-[var(--muted-foreground)]">Logged in as:</p>
                    <p className="font-medium text-[var(--foreground)]">{user?.email || "No email detected"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-[var(--border)]">
              <Button 
                onClick={handleCheckStatus} 
                className="w-full sm:w-auto"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh Status
              </Button>
              
              {/* Optional: 'Contact Support' button if you want a second action */}
              <Button 
                variant="ghost" 
                className="w-full sm:w-auto text-[var(--muted-foreground)]"
                onClick={() => alert("Please contact your system administrator.")}
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Contact Admin
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN: The Process Timeline */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm h-full">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-6">
              Onboarding Progress
            </h3>

            <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:h-[80%] before:w-[2px] before:bg-[var(--border)]">
              
              {/* Step 1: Completed */}
              <div className="relative flex gap-4">
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/20 ring-4 ring-[var(--card)]">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="pt-1">
                  <p className="font-medium text-[var(--foreground)]">Account Created</p>
                  <p className="text-sm text-[var(--muted-foreground)]">Credentials verified.</p>
                </div>
              </div>

              {/* Step 2: Current (Active) */}
              <div className="relative flex gap-4">
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/20 ring-4 ring-[var(--card)]">
                  <Clock className="h-5 w-5 animate-pulse" />
                </div>
                <div className="pt-1">
                  <p className="font-medium text-[var(--foreground)]">Awaiting Assignment</p>
                  <p className="text-sm text-[var(--muted-foreground)]">Admin is reviewing role.</p>
                </div>
              </div>

              {/* Step 3: Future (Locked) */}
              <div className="relative flex gap-4 opacity-50">
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] ring-4 ring-[var(--card)]">
                  <Lock className="h-5 w-5" />
                </div>
                <div className="pt-1">
                  <p className="font-medium text-[var(--foreground)]">Dashboard Access</p>
                  <p className="text-sm text-[var(--muted-foreground)]">Full feature access.</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}