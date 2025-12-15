"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Search, 
  MoreHorizontal, 
  Loader2,
  Trash2,
  UserCog,
  UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { apiFunctions } from "@/services/api.service";
import { toast } from "sonner";
import { AddUserDialog, } from "@/components/agent/user-select-dialog";

// Interface matching the mapped data for the table
interface AgentUser {
  _id: string;
  name: string;
  email: string;
  role: string; 
  joinedAt: string;
}

// Interface for system users (for the Add User dialog)
interface SystemUser {
  _id: string;
  name: string;
  email: string;
}

export default function AgentUsersPage() {
  const params = useParams();
  const agentId = params.id as string;

  const [users, setUsers] = useState<AgentUser[]>([]);
  const [allSystemUsers, setAllSystemUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Role Change Dialog State
  const [selectedUser, setSelectedUser] = useState<AgentUser | null>(null);
  const [newRole, setNewRole] = useState<string>("");
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Add User Dialog State
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // 1. Fetch Data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch Agent (which contains assigned users) AND All System Users (for the dropdown)
      // We run these in parallel
      const [agentRes, systemUsersRes] = await Promise.all([
        apiFunctions.getAgentById(agentId), // Use the same API here!
        apiFunctions.getAllUsers()
      ]);

      const agentData = agentRes?.data || agentRes;
      const systemUsers = systemUsersRes?.data || systemUsersRes;

      if (agentData && agentData.userIds) {
        // Map the API response structure to our Table Interface
        // The API returns 'createdAt', we map it to 'joinedAt'
        const mappedUsers: AgentUser[] = agentData.userIds.map((u: any) => ({
          _id: u._id,
          name: u.name,
          email: u.email,
          role: u.role || "user",
          joinedAt: u.createdAt // Mapping API field
        }));
        
        setUsers(mappedUsers);
      }

      if (systemUsers) {
        setAllSystemUsers(systemUsers);
      }

    } catch (error) {
      console.error(error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [agentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 2. Computed: Users available to add (All System Users - Already Assigned Users)
  const usersToAdd = useMemo(() => {
    return allSystemUsers.filter(sysUser => !users.find(u => u._id === sysUser._id));
  }, [allSystemUsers, users]);


  // 3. Handlers

  // ADD USER
  const handleAddUser = async (userId: string, role?: string) => {
    try {
      await apiFunctions.addAgentUser({ agentId, userId, role });
      toast.success("User added successfully");
    fetchData();

    } catch (error) {
      console.error(error);
      toast.error("Failed to add user");
    }
  };

  // UPDATE ROLE
  // const openRoleDialog = (user: AgentUser) => {
  //   setSelectedUser(user);
  //   setNewRole(user.role);
  //   setIsRoleDialogOpen(true);
  // };

  // const handleUpdateRole = async () => {
  //   if (!selectedUser) return;
  //   try {
  //     setUpdating(true);
  //     // await apiFunctions.updateUserRole({ agentId, userId: selectedUser._id, role: newRole });
      
  //     // Optimistic Update
  //     setUsers(prev => prev.map(u => u._id === selectedUser._id ? { ...u, role: newRole } : u));
  //     toast.success(`Role updated for ${selectedUser.name}`);
  //     setIsRoleDialogOpen(false);
  //   } catch (error) {
  //     toast.error("Failed to update role");
  //   } finally {
  //     setUpdating(false);
  //   }
  // };

  // REMOVE USER
  const handleRemoveUser = async (userId: string) => {
    try {
      await apiFunctions.removeAgentUser({ agentId : agentId, userId : userId });
      toast.success("User removed from agent");
    fetchData();
      
    } catch (error) {
      toast.error("Failed to remove user");
    }
  };

  // 4. Helper Functions
  const getInitials = (name: string) => name ? name.substring(0, 2).toUpperCase() : "NA";
  
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "inventory_manager": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "sales_executive": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const formatRole = (role: string) => role ? role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : "Unknown";

  return (
    <div className="min-h-screen bg-[var(--background)] p-6 md:p-12">
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors w-fit">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Managed Users</h1>
              <p className="text-[var(--muted-foreground)] mt-1">
                View and manage roles for users assigned to this agent.
              </p>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
                {/* Search */}
                <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--muted-foreground)]" />
                <Input
                    placeholder="Search users..."
                    className="pl-9 bg-[var(--card)]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                </div>
                {/* Add User Button */}
                <Button onClick={() => setIsAddUserOpen(true)} className="bg-[var(--primary)] text-[var(--primary-foreground)]">
                    <UserPlus className="mr-2 h-4 w-4" /> Add User
                </Button>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 border-b border-[var(--border)] bg-[var(--muted)]/40 px-6 py-4 text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
            <div className="col-span-5">User</div>
            <div className="col-span-4">Role</div>
            <div className="col-span-2">Joined</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          <div className="divide-y divide-[var(--border)]">
            {loading ? (
              <div className="p-12 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[var(--muted-foreground)]" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12 text-center text-[var(--muted-foreground)]">
                No users found matching your search.
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user._id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[var(--muted)]/20 transition-colors group">
                  
                  {/* User Info */}
                  <div className="col-span-5 flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-[var(--primary)]/10 text-[var(--primary)] text-xs">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-[var(--foreground)] truncate">{user.name}</p>
                      <p className="text-xs text-[var(--muted-foreground)] truncate">{user.email}</p>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="col-span-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                      {formatRole(user.role)}
                    </span>
                  </div>

                  {/* Joined Date */}
                  <div className="col-span-2 text-sm text-[var(--muted-foreground)]">
                    {new Date(user.joinedAt).toLocaleDateString()}
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-[var(--popover)] border-[var(--border)]">
                        <DropdownMenuLabel>Manage User</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {/* <DropdownMenuItem onClick={() => openRoleDialog(user)}>
                          <UserCog className="mr-2 h-4 w-4" /> Change Role
                        </DropdownMenuItem> */}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleRemoveUser(user._id)} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/10">
                          <Trash2 className="mr-2 h-4 w-4" /> Remove User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>

        {/* Change Role Dialog */}
        {/* <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-[var(--popover)] border-[var(--border)]">
            <DialogHeader>
              <DialogTitle>Change User Role</DialogTitle>
              <DialogDescription>
                Update access level for <span className="font-semibold text-[var(--foreground)]">{selectedUser?.name}</span>.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Select Role</Label>
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger className="bg-[var(--input)] border-[var(--border)]">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--popover)] border-[var(--border)]">
                    <SelectItem value="user">User (Read Only)</SelectItem>
                    <SelectItem value="sales_executive">Sales Executive</SelectItem>
                    <SelectItem value="inventory_manager">Inventory Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)} disabled={updating}>Cancel</Button>
              <Button onClick={handleUpdateRole} disabled={updating}>
                {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Role
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog> */}

        {/* Add User Dialog */}
        <AddUserDialog
            isOpen={isAddUserOpen}
            onClose={() => setIsAddUserOpen(false)}
            title="Add User to Agent"
            description="Select a user from the system to grant access."
            users={usersToAdd}
            onSubmit={handleAddUser}
            showRoleSelect={true}
        />

      </div>
    </div>
  );
}