import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { navItems } from "./navConfig";
import { usePreferencesStore, type UserRole } from "@/store/preferences";

export function ERPMobileNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentRole, setCurrentRole } = usePreferencesStore();
  const [openItems, setOpenItems] = useState<string[]>(["Painéis", "Vendas"]);

  const toggleItem = (title: string) => {
    setOpenItems((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  };

  const isActive = (href: string) => location.pathname === href;

  const handleRoleClick = (role: UserRole) => {
    setCurrentRole(role);
    navigate(`/${role}`);
  };

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="p-4 border-b flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">João e Maria</p>
          <p className="text-sm font-semibold">Escolha o painel por papel</p>
        </div>
      </div>

      <div className="px-4 py-3 flex flex-wrap gap-2">
        {(["admin", "gerente", "vendedor", "estoquista"] as UserRole[]).map((role) => (
          <button
            key={role}
            onClick={() => handleRoleClick(role)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors",
              currentRole === role
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground hover:bg-primary/40",
            )}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      <nav className="py-3 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.title}>
              {item.children ? (
                <Collapsible
                  open={openItems.includes(item.title)}
                  onOpenChange={() => toggleItem(item.title)}
                >
                  <CollapsibleTrigger className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold text-foreground hover:bg-muted/50">
                    <item.icon className="w-5 h-5" />
                    <span className="flex-1 text-left">{item.title}</span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        openItems.includes(item.title) && "rotate-180",
                      )}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-8 pt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        onClick={() => {
                          const [, segment] = child.href.split("/");
                          if (segment && ["admin", "gerente", "vendedor", "estoquista"].includes(segment)) {
                            setCurrentRole(segment as UserRole);
                          }
                        }}
                        className={cn(
                          "block px-3 py-2.5 rounded-md text-sm transition-colors",
                          isActive(child.href)
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        )}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link
                  to={item.href!}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold transition-colors",
                    isActive(item.href!)
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted/50",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </ScrollArea>
  );
}
