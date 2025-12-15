"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Bot, 
  Settings, 
  Users,
  ShieldCheck,
  Calendar,
  ArrowRight,
  Loader2,
  Clock,
  LogOut,
  ExternalLink
} from "lucide-react";
import { apiFunctions } from "@/services/api.service";
import { useAuth } from "@/components/auth-context";
import { toast } from "sonner";

// --- Interfaces ---
interface AgentData {
  _id: string;
  name: string;
  description: string;
  adminIds: string[];
  userIds: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export function AgentAdminView() {
  const { session } = useAuth();
  const [agent, setAgent] = useState<AgentData | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data
  const refreshData = useCallback(async () => {
    if (!session) return;

    try {
      setLoading(true);
      const user = session.user as any;
      const agentId = user.agentId; 

      if (agentId) {
        const res = await apiFunctions.getAgentById( agentId );
        setAgent(res?.data || res);
      } else {
        // Fallback for dev/testing if no ID assigned
        setAgent({
          _id: "mock_id",
          name: "Unassigned Agent",
          description: "No agent ID found in session. Please contact system admin.",
          adminIds: [],
          userIds: [],
          status: "inactive",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
      toast.error("Failed to load agent details");
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };
   const handleGoogleAuth = async () => {
    try {
      const res = await apiFunctions.authGoogle();
      if (res.url) {
        window.location.href = res.url
      } else {
        toast.error("Failed to authenticate with Google");
      }
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--muted-foreground)]" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 text-center">
        <div className="p-4 bg-[var(--muted)] rounded-full">
          <LogOut className="h-8 w-8 text-[var(--muted-foreground)]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">No Agent Found</h3>
          <p className="text-[var(--muted-foreground)]">You are not assigned to manage any agent.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--background)] p-6 md:p-12">
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-2">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary)] text-[var(--primary-foreground)] shadow-lg shadow-[var(--primary)]/20">
              <Bot className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
                {agent.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                  agent.status === 'active' 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" 
                    : "bg-gray-50 text-gray-600 border-gray-200"
                } capitalize`}>
                  {agent.status}
                </span>
                <span className="text-sm text-[var(--muted-foreground)] flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> 
                  Updated {formatDate(agent.updatedAt)}
                </span>
              </div>
            </div>
          </div>
          
          
            <Button variant="outline" className="gap-2 h-10 px-4" onClick={handleGoogleAuth}>
                
              <Settings className="h-4 w-4" /> 
              Connect Google
            </Button>
         
        </div>

        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. Agent Details (Left - 2 Cols) */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-[var(--foreground)] flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[var(--primary)]" />
                  Agent Overview
                </h3>
              </div>
              
              <p className="text-[var(--muted-foreground)] leading-relaxed flex-grow">
                {agent.description || "No description provided for this agent."}
              </p>
              
              <div className="mt-8 pt-6 border-t border-[var(--border)] grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider font-medium">Created On</p>
                  <p className="text-sm font-medium mt-1 flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" /> {formatDate(agent.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider font-medium">System ID</p>
                  <p className="text-sm font-mono mt-1 text-[var(--muted-foreground)] truncate" title={agent._id}>
                    {agent._id}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Management Cards (Right - 1 Col) */}
          <div className="flex flex-col gap-4">
            
            {/* User Management Card (Clickable) */}
            <Link href={`/agents/${agent._id}/users`} className="group block h-full">
              <div className="h-full rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm relative overflow-hidden transition-all hover:border-[var(--primary)] hover:shadow-md cursor-pointer">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Users className="h-16 w-16 text-blue-500" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <Users className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <p className="text-sm font-medium text-[var(--muted-foreground)]">Assigned Users</p>
                  <div className="flex items-end gap-2 mt-1">
                    <h2 className="text-4xl font-bold text-[var(--foreground)]">{agent.userIds.length}</h2>
                    <span className="text-sm text-[var(--muted-foreground)] mb-1">Active</span>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-[var(--border)] group-hover:border-blue-100 dark:group-hover:border-blue-900/30 transition-colors">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      Manage Users
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Admin Count Card (Static Info) */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-6 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--muted-foreground)]">Administrators</p>
                  <p className="text-xl font-bold text-[var(--foreground)]">{agent.adminIds.length}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}