import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Droplet, LayoutDashboard, LineChart, Bell, Cpu, SlidersHorizontal, Menu, X } from "lucide-react";
import { useListAlerts } from "@workspace/api-client-react";
import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: alerts } = useListAlerts({ status: "active" });
  const activeAlertsCount = alerts?.length ?? 0;

  const navItems = [
    { href: "/", label: "System Overview", icon: LayoutDashboard },
    { href: "/historical", label: "Historical Data", icon: LineChart },
    {
      href: "/alerts",
      label: "Alerts",
      icon: Bell,
      badge: activeAlertsCount > 0 ? activeAlertsCount : undefined,
    },
    { href: "/sensors", label: "Sensors", icon: Cpu },
    { href: "/thresholds", label: "Thresholds", icon: SlidersHorizontal },
  ];

  function NavContent({ onNavigate }: { onNavigate?: () => void }) {
    return (
      <>
        <div className="p-5 border-b border-sidebar-border">
          <Link href="/" onClick={onNavigate} className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg shrink-0">
              <Droplet className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight leading-none">AquaWatch</h1>
              <p className="text-sidebar-foreground/60 text-xs uppercase tracking-wider mt-0.5">IoT Monitor</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={[
                  "flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground",
                ].join(" ")}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={["w-4 h-4", isActive ? "text-primary" : "text-sidebar-foreground/50"].join(" ")} />
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <Badge variant="destructive" className="ml-auto h-5 min-w-5 rounded-full px-1.5 text-xs leading-none justify-center">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Mobile top bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-sidebar text-sidebar-foreground border-b border-sidebar-border shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
            <Droplet className="w-4 h-4" />
          </div>
          <span className="font-bold text-base tracking-tight">AquaWatch</span>
          {activeAlertsCount > 0 && (
            <Badge variant="destructive" className="h-5 min-w-5 rounded-full px-1.5 text-xs">
              {activeAlertsCount}
            </Badge>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="text-sidebar-foreground hover:bg-sidebar-accent/50 h-9 w-9"
          onClick={() => setSidebarOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </header>

      {/* Mobile drawer backdrop */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={[
          "md:hidden fixed top-0 left-0 z-40 h-full w-64 bg-sidebar text-sidebar-foreground flex flex-col",
          "shadow-2xl transition-transform duration-200",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <NavContent onNavigate={() => setSidebarOpen(false)} />
      </aside>

      <div className="flex flex-1 min-h-0">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-56 lg:w-64 bg-sidebar text-sidebar-foreground flex-col border-r border-sidebar-border shrink-0">
          <NavContent />
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
