"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2, Search, Trash2 } from "lucide-react"; // Import Trash icon
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface RemoveUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  users: User[]; // List of currently assigned users/admins
  onSubmit: (userId: string) => Promise<void>;
  confirmLabel?: string;
}

export function RemoveUserDialog({
  isOpen,
  onClose,
  title,
  description,
  users,
  onSubmit,
  confirmLabel = "Remove",
}: RemoveUserDialogProps) {
  const [openCombobox, setOpenCombobox] = React.useState(false);
  const [selectedUserId, setSelectedUserId] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const safeUsers = Array.isArray(users) ? users : [];

  React.useEffect(() => {
    if (!isOpen) {
      setSelectedUserId("");
      setOpenCombobox(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!selectedUserId) return;
    setIsSubmitting(true);
    try {
      await onSubmit(selectedUserId);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedUser = safeUsers.find((u) => u._id === selectedUserId);
  const getInitials = (name: string) => name ? name.substring(0, 2).toUpperCase() : "??";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] bg-[var(--popover)] border-[var(--border)] gap-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-red-600 flex items-center gap-2">
             <Trash2 className="h-5 w-5" /> {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-2">
          <Label>Select Person to Remove</Label>
          <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={openCombobox} className="w-full justify-between h-14 px-3 text-left font-normal border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/10">
                {selectedUser ? (
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8"><AvatarFallback>{getInitials(selectedUser.name)}</AvatarFallback></Avatar>
                    <div className="flex flex-col"><span className="text-sm font-medium">{selectedUser.name}</span><span className="text-xs text-[var(--muted-foreground)]">{selectedUser.email}</span></div>
                  </div>
                ) : <span className="text-[var(--muted-foreground)]">Select...</span>}
                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search..." />
                <CommandList>
                  <CommandEmpty>No one found.</CommandEmpty>
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

        <DialogFooter className="flex items-center gap-2">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!selectedUserId || isSubmitting} className="bg-red-600 hover:bg-red-700 text-white">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}