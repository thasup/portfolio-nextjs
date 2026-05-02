"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";

interface ProfileData {
  displayName: string;
  avatarUrl?: string;
  role: string;
}

export function NavbarAuthProfile() {
  const pathname = usePathname() || "";
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      // Try to get from nexus_users first
      const { data: nexusUser } = await supabase
        .from("nexus_users")
        .select("display_name, role")
        .eq("id", user.id)
        .maybeSingle();

      setProfile({
        displayName:
          nexusUser?.display_name ||
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "User",
        avatarUrl: user.user_metadata?.avatar_url,
        role: nexusUser?.role || "MEMBER",
      });
      setLoading(false);
    };

    fetchProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetchProfile();
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const isLandingPage =
    pathname === "/" ||
    pathname === "/en" ||
    pathname === "/th" ||
    pathname === "/en/" ||
    pathname === "/th/";

  if (loading || !profile || isLandingPage) return null;

  const initials = profile.displayName.substring(0, 2).toUpperCase();

  return (
    <div className="pl-4 border-l border-border ml-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 outline-none group cursor-pointer">
            <div className="flex flex-col items-end hidden sm:flex transition-opacity group-hover:opacity-80">
              <span className="text-xs font-semibold text-foreground leading-none">
                {profile.displayName}
              </span>
              <span className="text-[10px] text-[var(--color-praxis-accent)] font-bold uppercase tracking-wider leading-tight">
                {profile.role}
              </span>
            </div>
            <Avatar className="h-8 w-8 border border-border shadow-sm transition-transform group-hover:scale-105 active:scale-95">
              <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
              <AvatarFallback className="text-[10px] font-bold bg-[var(--color-praxis-accent)]/10 text-[var(--color-praxis-accent)]">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{profile.displayName}</span>
              <span className="text-xs text-muted-foreground font-normal">
                Nexus Identity
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
