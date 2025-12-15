"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AddUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  users: User[];
  showRoleSelect?: boolean;
  onSubmit: (userId: string, role?: string) => Promise<void>;
}

export function AddUserDialog({
  isOpen,
  onClose,
  title,
  description,
  users,
  showRoleSelect = false,
  onSubmit,
}: AddUserDialogProps) {
  const [openCombobox, setOpenCombobox] = React.useState(false);
  const [selectedUserId, setSelectedUserId] = React.useState<string>("");
  const [selectedRole, setSelectedRole] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const safeUsers = Array.isArray(users) ? users : [];

  React.useEffect(() => {
    if (!isOpen) {
      setSelectedUserId("");
      setSelectedRole("");
      setOpenCombobox(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!selectedUserId) return;
    if (showRoleSelect && !selectedRole) return;

    setIsSubmitting(true);
    try {
      await onSubmit(selectedUserId, selectedRole);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedUser = safeUsers.find((u) => u._id === selectedUserId);
  const getInitials = (name: string) => name ? name.substring(0, 2).toUpperCase() : "??";
  const isValid = selectedUserId && (!showRoleSelect || selectedRole);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] bg-[var(--popover)] border-[var(--border)] gap-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label>Select User</Label>
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={openCombobox} className="w-full justify-between h-14 px-3 text-left font-normal">
                  {selectedUser ? (
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-[var(--primary)]/10 text-[var(--primary)] text-xs">{getInitials(selectedUser.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{selectedUser.name}</span>
                        <span className="text-xs text-[var(--muted-foreground)]">{selectedUser.email}</span>
                      </div>
                    </div>
                  ) : <span className="text-[var(--muted-foreground)]">Select a user...</span>}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search user..." />
                  <CommandList>
                    <CommandEmpty>No user found.</CommandEmpty>
                    <CommandGroup>
                      {safeUsers.map((user) => (
                        <CommandItem key={user._id} value={user.name} onSelect={() => { setSelectedUserId(user._id); setOpenCombobox(false); }}>
                          <div className="flex items-center gap-3 w-full">
                            <Avatar className="h-8 w-8"><AvatarFallback>{getInitials(user.name)}</AvatarFallback></Avatar>
                            <div className="flex flex-col"><span className="text-sm font-medium">{user.name}</span><span className="text-xs text-[var(--muted-foreground)]">{user.email}</span></div>
                            <Check className={cn("ml-auto h-4 w-4", selectedUserId === user._id ? "opacity-100" : "opacity-0")} />
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {showRoleSelect && (
            <div className="grid gap-2">
              <Label>Assign Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="h-11"><SelectValue placeholder="Select a role..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="inventory_manager">Inventory Manager</SelectItem>
                  <SelectItem value="sales_executive">Sales Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between gap-2">
          <Button variant="ghost" onClick={() => { setSelectedUserId(""); setSelectedRole(""); }} disabled={isSubmitting}>Clear</Button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!isValid || isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Add
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}