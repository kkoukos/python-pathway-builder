import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Home,
  BookOpen,
  BarChart,
  User,
  Info,
  Settings,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  };

  const sidebarItems = [
  {
    title: "Home",
    icon: Home,
    to: "/",
  },
  {
    title: "Modules",
    icon: BookOpen,
    to: "/modules",
  },
  {
    title: "My Progress",
    icon: BarChart,
    to: "/progress",
  },
  {
    title: "My Profile",
    icon: User,
    to: "/profile",
  },
  {
    title: "About",
    icon: Info,
    to: "/about",
  },
];

  return (
    <div
      className={cn(
        "flex flex-col h-screen p-4 bg-secondary border-r border-muted transition-all",
        isCollapsed ? "w-20" : "w-64",
        isCollapsed && isMobile ? "hidden" : ""
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="flex items-center text-lg font-semibold">
          <span className="text-2xl mr-2">
            {/* <Logo /> */}
            📚
          </span>
          {!isCollapsed && <span>LearnPython</span>}
        </Link>
        {!isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(true)}
            className="md:hidden"
          >
            <Settings className="h-5 w-5" />
          </Button>
        )}
      </div>

      <nav className="flex-grow">
        <ul className="flex flex-col space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.title}>
              <Link
                to={item.to}
                className={cn(
                  "flex items-center px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                  location.pathname === item.to
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
                onClick={closeSidebar}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-muted pt-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={toggleTheme}
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {!isCollapsed && <span>Toggle {theme === "dark" ? "Light" : "Dark"}</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
