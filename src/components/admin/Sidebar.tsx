import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Settings,
  PaintBucket,
  Database,
  FileText,
  Bot,
  Globe,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
}

const SidebarItem = ({
  icon,
  label,
  href,
  isActive = false,
}: SidebarItemProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
        isActive
          ? "bg-brand-primary/10 text-brand-primary font-medium"
          : "text-brand-muted hover:bg-brand-light hover:text-brand-secondary",
      )}
    >
      <div className="flex-shrink-0">{icon}</div>
      <span>{label}</span>
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get("tab");

  const menuItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      href: "/admin/guest-session-management",
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Guest Sessions",
      href: "/admin/guest-session-management?tab=sessions",
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      label: "Chat History",
      href: "/admin/guest-session-management?tab=sessions",
    },
    {
      icon: <Bot className="h-5 w-5" />,
      label: "AI Models",
      href: "/admin/guest-session-management?tab=ai-settings",
    },
    {
      icon: <Globe className="h-5 w-5" />,
      label: "Scraping System",
      href: "/admin/guest-session-management?tab=scraping",
    },
    {
      icon: <PaintBucket className="h-5 w-5" />,
      label: "Branding",
      href: "/admin/guest-session-management?tab=branding",
    },
    {
      icon: <Database className="h-5 w-5" />,
      label: "Knowledge Base",
      href: "/admin/guest-session-management?tab=ai-settings",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: "Audit Logs",
      href: "/admin/guest-session-management?tab=logs",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      href: "/admin/guest-session-management?tab=ai-settings",
    },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-brand-light flex flex-col">
      <div className="p-4 border-b border-brand-light">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-md bg-brand-primary flex items-center justify-center text-white font-bold text-sm">
            GA
          </div>
          <div>
            <h2 className="font-semibold text-brand-secondary">GuestApp</h2>
            <p className="text-xs text-brand-muted">Admin Panel</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item, index) => (
          <SidebarItem
            key={index}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isActive={
              item.href.split("?")[0] === currentPath &&
              (!item.href.includes("?tab=") ||
                item.href.includes(`?tab=${currentTab}`))
            }
          />
        ))}
      </div>

      <div className="p-4 border-t border-brand-light">
        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-amber-800">
                System Notice
              </h4>
              <p className="text-xs text-amber-700 mt-1">
                Maintenance scheduled for Sunday, 10:00 PM UTC. Estimated
                downtime: 30 minutes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
