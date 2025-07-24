import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { 
  BarChart3,
  Calendar,
  ChartLine,
  DollarSign,
  Folder,
  Rocket,
  Search,
  Settings,
  Sparkles
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@shared/schema";

const navigation = [
  { name: "Dashboard", href: "/", icon: ChartLine },
  { name: "Content Generator", href: "/content-generator", icon: Sparkles },
  { name: "Content Calendar", href: "/calendar", icon: Calendar },
  { name: "Competitor Analysis", href: "/competitor-analysis", icon: Search },
  { name: "ROI Tracking", href: "/roi-tracking", icon: DollarSign },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Content Library", href: "/content-library", icon: Folder },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const getUserInitials = (user: User | null | undefined) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  return (
    <aside className="w-64 bg-neutral-800 border-r border-neutral-700 flex flex-col fixed h-full z-10 shadow-lg">
      {/* Logo */}
      <div className="p-6 border-b border-neutral-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
            <Rocket className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-white tracking-tight">SocialBoost</span>
            <div className="text-xs text-accent-foreground font-semibold bg-accent px-2 py-0.5 rounded-md">PRO</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 font-medium group cursor-pointer",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-neutral-300 hover:text-white hover:bg-accent"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 transition-transform duration-200",
                  isActive ? "scale-110" : "group-hover:scale-105"
                )} />
                <span>{item.name}</span>
                {isActive && (
                  <div className="w-2 h-2 bg-primary-foreground rounded-full ml-auto"></div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-6 border-t border-neutral-700">
        <div className="flex items-center space-x-3 px-4 py-3 rounded-xl glass-panel">
          <Avatar className="h-12 w-12 ring-2 ring-primary/20">
            <AvatarImage src={user?.profileImageUrl || ""} alt="Profile" />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {getUserInitials(user)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}`
                : user?.email || "User"
              }
            </p>
            <p className="text-xs text-primary font-medium">Professional Plan</p>
          </div>
          <Link href="/settings">
            <div className="text-neutral-400 hover:text-white p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer">
              <Settings className="h-5 w-5" />
            </div>
          </Link>
        </div>
      </div>
    </aside>
  );
}
