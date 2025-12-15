"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; 
import { Plus, Loader2, Bot } from "lucide-react"; // Added Bot icon for decoration
import { apiFunctions } from "@/services/api.service";

interface CreateAgentDialogProps {
  onSuccess: () => void; 
}

export function CreateAgentDialog({ onSuccess }: CreateAgentDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFunctions.createAgent(formData); 
      setFormData({ name: "", description: "" });
      setOpen(false);
      onSuccess(); 
    } catch (error) {
      console.error("Failed to create agent", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* Primary Button with Indigo color */}
        <Button className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Create Agent
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] bg-[var(--card)] border-[var(--border)] text-[var(--card-foreground)] shadow-xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {/* Decorative Icon Box */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
              <Bot className="h-6 w-6" />
            </div>
            <DialogTitle className="text-xl font-bold">New AI Agent</DialogTitle>
          </div>
          <DialogDescription className="text-[var(--muted-foreground)]">
            Configure the basic details for your new autonomous agent.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-sm font-medium text-[var(--foreground)]">
              Agent Name
            </Label>
            <Input
              id="name"
              placeholder="e.g. Sales Assistant Beta"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-[var(--input)] border-[var(--input-border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:border-[var(--primary)] transition-all"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className="text-sm font-medium text-[var(--foreground)]">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the role and responsibilities of this agent..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[100px] bg-[var(--input)] border-[var(--input-border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:border-[var(--primary)] resize-none transition-all"
            />
          </div>

          <DialogFooter className="mt-4 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--secondary)]"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] font-medium px-6"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Agent
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}