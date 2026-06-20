import { MainLayout } from "@/components/layout/main-layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Key, Mail, Building, User as UserIcon } from "lucide-react";

export default function Profile() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6 max-w-2xl mx-auto py-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
          <p className="text-sm text-muted-foreground">Manage your personal account settings</p>
        </div>

        <div className="bg-[#111111] border border-[rgba(255,255,255,0.06)] rounded-lg p-6 space-y-8">
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20 border border-[rgba(255,255,255,0.1)]">
              <AvatarFallback className="bg-[#0A0A0A] text-2xl text-white">AG</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" className="border-[rgba(255,255,255,0.1)] hover:bg-white/5 bg-transparent mb-2">
                Upload New Photo
              </Button>
              <p className="text-xs text-muted-foreground">At least 800x800 px recommended.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white flex items-center gap-2"><UserIcon className="w-4 h-4" /> Full Name</label>
                <Input defaultValue="Admin User" className="bg-[#0A0A0A] border-[rgba(255,255,255,0.1)]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white flex items-center gap-2"><Mail className="w-4 h-4" /> Email</label>
                <Input defaultValue="admin@armorguard.io" type="email" className="bg-[#0A0A0A] border-[rgba(255,255,255,0.1)]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white flex items-center gap-2"><Shield className="w-4 h-4" /> Role</label>
                <Input defaultValue="Lead Security Engineer" className="bg-[#0A0A0A] border-[rgba(255,255,255,0.1)]" disabled />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white flex items-center gap-2"><Building className="w-4 h-4" /> Organization</label>
                <Input defaultValue="ArmorGuard Inc" className="bg-[#0A0A0A] border-[rgba(255,255,255,0.1)]" disabled />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[rgba(255,255,255,0.06)] space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2"><Key className="w-4 h-4" /> Change Password</h3>
            <div className="grid gap-4 max-w-sm">
              <Input placeholder="Current Password" type="password" className="bg-[#0A0A0A] border-[rgba(255,255,255,0.1)]" />
              <Input placeholder="New Password" type="password" className="bg-[#0A0A0A] border-[rgba(255,255,255,0.1)]" />
              <Input placeholder="Confirm New Password" type="password" className="bg-[#0A0A0A] border-[rgba(255,255,255,0.1)]" />
              <Button className="w-full bg-white/5 border border-[rgba(255,255,255,0.1)] hover:bg-white/10 text-white">Update Password</Button>
            </div>
          </div>

          <div className="pt-6 border-t border-[rgba(255,255,255,0.06)] flex justify-end">
            <Button className="bg-accent hover:bg-accent/90 text-white px-8">
              Save Profile
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
