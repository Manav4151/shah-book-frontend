"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  RotateCw,
  MoreHorizontal,
  ShieldCheck,
  Users,
  Calendar,
  ShieldPlus,
  ShieldMinus,
  Trash2,
} from "lucide-react";
import { apiFunctions } from "@/services/api.service";
import { CreateAgentDialog } from "@/components/agent/create-agent-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { RemoveUserDialog } from "@/components/agent/remove-user-dialog";
import { toast } from "sonner"; 
import { AddUserDialog } from "@/components/agent/user-select-dialog";

interface Agent {
  _id: string;
  name: string;
  description?: string;
  status: "Active" | "Inactive";
  adminCount: number;
  userCount: number;
  updatedAt: string;
}

interface AgentsState {
  agents: Agent[];
  page: number;
  limit: number;
  totalAgents: number;
  totalPages: number;
}

// Dialog User Interface
interface DialogUser {
  _id: string;
  name: string;
  email: string;
}

const getInitials = (name: string) => name ? name.substring(0, 2).toUpperCase() : "NA";
const formatDate = (dateString: string) => {
  try {
    return new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).format(new Date(dateString));
  } catch (e) { return "Invalid Date"; }
};

export default function AgentsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AgentsState | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // State for Actions
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [activeDialog, setActiveDialog] = useState<'add_admin' | 'remove_admin' | 'delete' | null>(null);
  
  // Data for Dialogs
  const [dialogUsers, setDialogUsers] = useState<DialogUser[]>([]); 

  // 1. Fetch Agents List
  const fetchAgents = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const response = await apiFunctions.getAgent(page, 10);
      if (response && response.data) {
        setData({
          agents: response.data.agents,
          page: response.data.pagination?.page || page,
          limit: response.data.pagination?.limit || 10,
          totalAgents: response.data.pagination?.total || 0,
          totalPages: response.data.pagination?.totalPages || 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch agents", error);
      toast.error("Failed to load agents.");
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Initial Load
  useEffect(() => {
    fetchAgents(currentPage);
  }, [currentPage, fetchAgents]);

  // 3. Dynamic Data Fetching for Dialogs
  useEffect(() => {
    if (!activeDialog || !selectedAgent) return;

    const loadDialogData = async () => {
      setDialogUsers([]); // Reset list

      try {
        if (activeDialog === 'add_admin') {
          // Fetch ALL users (Anyone can be made an admin)
          const res = await apiFunctions.getAllUsers();
          const users = Array.isArray(res) ? res : res?.data || [];
          setDialogUsers(users);
        } 
        else if (activeDialog === 'remove_admin') {
          // Fetch ONLY this agent's admins
          const res = await apiFunctions.getAgentById(  selectedAgent._id );
          const fullAgent = res?.data || res;
          
          if (fullAgent && fullAgent.adminIds) {
             // Assuming adminIds is an array of populated user objects
             setDialogUsers(fullAgent.adminIds);
          }
        }
      } catch (error) {
        console.error("Failed to load dialog data", error);
        toast.error("Could not load user list");
      }
    };

    loadDialogData();
  }, [activeDialog, selectedAgent]);


  // --- Action Handlers ---

  const handleAddAdmin = async (userId: string) => {
      if(!selectedAgent) return;
      try {
        await apiFunctions.addAgentAdmin({ agentId: selectedAgent._id, adminId: userId });
        toast.success(`Admin added to ${selectedAgent.name}`);
        fetchAgents(currentPage); 
      } catch (error) {
        toast.error("Failed to add admin");
      }
  };

  const handleRemoveAdmin = async (userId: string) => {
      if(!selectedAgent) return;
      try {
        console.log("agent id", selectedAgent._id, userId);
        
        await apiFunctions.removeAgentAdmin({ agentId: selectedAgent._id, adminId: userId });
        toast.success(`Admin removed from ${selectedAgent.name}`);
        fetchAgents(currentPage); 
      } catch (error) {
        toast.error("Failed to remove admin");
      }
  };

  const handleDeleteAgent = async () => {
      toast.info("Delete Agent functionality needs implementation.");
      setActiveDialog(null);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] p-6 md:p-12">
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Agents</h1>
            <p className="mt-1 text-[var(--muted-foreground)]">
              Monitor and manage your AI workforce.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => fetchAgents(currentPage)}
              className="border-[var(--border)] bg-transparent hover:bg-[var(--muted)]"
              disabled={loading}
            >
              <RotateCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <CreateAgentDialog onSuccess={() => fetchAgents(currentPage)} />
          </div>
        </div>

        {/* Table Container */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm overflow-visible">
          
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 border-b border-[var(--border)] bg-[var(--muted)]/30 px-6 py-4 text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
            <div className="col-span-4">Agent Details</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Admins</div>
            <div className="col-span-2">Users</div>
            <div className="col-span-2 flex justify-between"><span>Last Updated</span><span className="sr-only">Actions</span></div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-[var(--border)]">
            {loading && !data ? (
               [...Array(3)].map((_, i) => (
                <div key={i} className="flex h-20 items-center px-6 animate-pulse"><div className="h-10 w-10 rounded-full bg-[var(--muted)]" /><div className="ml-4 h-4 w-32 bg-[var(--muted)] rounded" /></div>
              ))
            ) : (
              Array.isArray(data?.agents) && data.agents.map((agent) => (
                <div key={agent._id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center transition-colors hover:bg-[var(--muted)]/20 relative">
                  
                   {/* Columns */}
                   <div className="col-span-4 flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--muted)] text-sm font-bold text-[var(--foreground)]">{getInitials(agent.name)}</div>
                    <div className="overflow-hidden"><div className="truncate font-semibold text-[var(--foreground)]">{agent.name}</div><div className="truncate text-sm text-[var(--muted-foreground)]">{agent.description || "No description"}</div></div>
                  </div>
                  <div className="col-span-2"><span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${agent.status === 'Active' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 text-red-600 dark:text-red-400"}`}>{agent.status}</span></div>
                  <div className="col-span-2 flex items-center gap-2 text-sm text-[var(--muted-foreground)]"><ShieldCheck className="h-4 w-4 text-[var(--primary)]" /><span>{agent.adminCount || 0}</span></div>
                  <div className="col-span-2 flex items-center gap-2 text-sm text-[var(--muted-foreground)]"><Users className="h-4 w-4 text-blue-500" /><span>{agent.userCount || 0}</span></div>

                  {/* Actions Dropdown */}
                  <div className="col-span-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(agent.updatedAt)}</span>
                    </div>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[var(--foreground)] data-[state=open]:bg-[var(--muted)]">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-[var(--popover)] border-[var(--border)]">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-[var(--border)]" />
                            
                            <DropdownMenuItem onClick={() => { setSelectedAgent(agent); setActiveDialog('add_admin'); }} className="cursor-pointer">
                                <ShieldPlus className="mr-2 h-4 w-4" /> Add Admin
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator className="bg-[var(--border)]" />
                            
                            <DropdownMenuItem 
                                onClick={() => { setSelectedAgent(agent); setActiveDialog('remove_admin'); }} 
                                className="cursor-pointer text-orange-600 focus:text-orange-600 focus:bg-orange-50 dark:focus:bg-orange-900/10"
                            >
                                <ShieldMinus className="mr-2 h-4 w-4" /> Remove Admin
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator className="bg-[var(--border)]" />
                            
                            <DropdownMenuItem onClick={() => { setSelectedAgent(agent); handleDeleteAgent() }} className="cursor-pointer text-[var(--error)] focus:bg-[var(--error)]/10 focus:text-[var(--error)]">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Agent
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
             {!loading && (!data?.agents || data.agents.length === 0) && <div className="py-12 text-center text-[var(--muted-foreground)]">No agents found.</div>}
          </div>

          {/* Footer / Pagination */}
           <div className="border-t border-[var(--border)] bg-[var(--muted)]/20 px-6 py-4 flex items-center justify-between">
             <div className="text-sm text-[var(--muted-foreground)]">Showing <span className="font-medium">{data?.totalAgents ? ((currentPage - 1) * (data?.limit || 10)) + 1 : 0}</span> to <span className="font-medium">{Math.min(currentPage * (data?.limit || 10), data?.totalAgents || 0)}</span> of <span className="font-medium">{data?.totalAgents || 0}</span> agents</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1 || loading} className="h-8 text-xs">Previous</Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={!data || currentPage >= data.totalPages || loading} className="h-8 text-xs">Next</Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 5. Dialogs */}

      {/* Add Admin Dialog */}
      <AddUserDialog 
        isOpen={activeDialog === 'add_admin'}
        onClose={() => setActiveDialog(null)}
        title="Add New Admin"
        description={`Select a user to promote to admin for ${selectedAgent?.name}.`}
        users={dialogUsers} 
        onSubmit={handleAddAdmin}
        showRoleSelect={false} // No role needed for Admin
      />

      {/* Remove Admin Dialog */}
      <RemoveUserDialog 
        isOpen={activeDialog === 'remove_admin'}
        onClose={() => setActiveDialog(null)}
        title="Remove Admin"
        description={`Select an admin to remove from ${selectedAgent?.name}.`}
        users={dialogUsers} 
        onSubmit={handleRemoveAdmin}
        confirmLabel="Remove Admin"
      />

    </div>
  );
}