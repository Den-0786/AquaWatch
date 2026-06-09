import { Link, useLocation } from "wouter";
import { Droplet, LayoutDashboard, LineChart, Bell, Cpu, SlidersHorizontal } from "lucide-react";
import { useListAlerts } from "@workspace/api-client-react";
import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { data: alerts } = useListAlerts({ status: 'active' });
  const activeAlertsCount = alerts?.length || 0;

  const navItems = [
    { href: "/", label: "System Overview", icon: LayoutDashboard },
    { href: "/historical", label: "Historical Data", icon: LineChart },
    { 
      href: "/alerts", 
      label: "Alerts", 
      icon: Bell, 
      badge: activeAlertsCount > 0 ? activeAlertsCount : undefined 
    },
    { href: "/sensors", label: "Sensors", icon: Cpu },
    { href: "/thresholds", label: "Thresholds", icon: SlidersHorizontal },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border shadow-lg">
        <div className="p-6 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <Droplet className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight">AquaWatch</h1>
              <p className="text-sidebar-foreground/70 text-xs uppercase tracking-wider">IoT Monitor</p>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-sidebar-foreground/60'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <Badge variant="destructive" className="ml-auto rounded-full px-2 py-0 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            )
          })}
        </nav>
      </aside>
      
      <main className="flex-1 overflow-y-auto bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
