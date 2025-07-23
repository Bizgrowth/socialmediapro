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

  const getUserInitials = (user: any) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  return (
    <aside className="w-64 bg-white shadow-lg flex flex-col fixed h-full z-10">
      {/* Logo */}
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-neutral-800">SocialBoost Pro</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.name} href={item.href}>
              <a
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium",
                  isActive
                    ? "bg-primary text-white"
                    : "text-neutral-600 hover:bg-neutral-100"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </a>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-neutral-200">
        <div className="flex items-center space-x-3 px-4 py-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.profileImageUrl || ""} alt="Profile" />
            <AvatarFallback className="bg-primary text-white">
              {getUserInitials(user)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-800 truncate">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}`
                : user?.email || "User"
              }
            </p>
            <p className="text-xs text-neutral-500">Pro Plan</p>
          </div>
          <Link href="/settings">
            <a className="text-neutral-400 hover:text-neutral-600">
              <Settings className="h-5 w-5" />
            </a>
          </Link>
        </div>
      </div>
    </aside>
  );
}
