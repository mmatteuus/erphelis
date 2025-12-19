import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useMemo, useState } from "react";
import { navItems } from "./navConfig";
import { usePreferencesStore, type UserRole } from "@/store/preferences";

const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  gerente: "Gerente",
  vendedor: "Vendedor",
  estoquista: "Estoquista",
};

export function ERPSidebar() {
  const { sidebarCollapsed, currentRole, setCurrentRole } = usePreferencesStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [openItems, setOpenItems] = useState<string[]>([
    "Painéis",
    "Vendas",
    "Estoque",
    "Cadastros",
    "Financeiro",
  ]);

  const updateRoleFromHref = (href: string) => {
    const [, segment] = href.split("/");
    if (segment && roleLabels[segment as UserRole]) {
      setCurrentRole(segment as UserRole);
    }
  };

  if (sidebarCollapsed) return null;

  const toggleItem = (title: string) => {
    setOpenItems((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  };

  const isActive = (href: string) => location.pathname === href;
  const isParentActive = (children?: { href: string }[]) =>
    children?.some((child) => location.pathname.startsWith(child.href));

  const rolePills = useMemo(
    () =>
      (["admin", "gerente", "vendedor", "estoquista"] as UserRole[]).map((role) => ({
        key: role,
        label: roleLabels[role],
        href: `/${role}`,
      })),
    [],
  );

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 border-r bg-sidebar h-screen sticky top-0">
      <div className="h-20 flex items-center gap-3 px-6 border-b bg-gradient-to-r from-secondary/80 via-background to-primary/40">
        <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center shadow-card ring-1 ring-primary/40">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="space-y-0.5">
          <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
            ERP João e Maria
          </p>
          <h1 className="font-semibold text-foreground leading-tight">Operação unificada</h1>
          <p className="text-xs text-muted-foreground">Admin, gerente, vendedor, estoque</p>
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className="flex flex-wrap gap-2">
          {rolePills.map((role) => (
            <button
              key={role.key}
              onClick={() => {
                setCurrentRole(role.key);
                navigate(role.href);
              }}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-semibold transition-all border",
                currentRole === role.key
                  ? "bg-primary/80 text-primary-foreground shadow-sm"
                  : "bg-muted text-foreground hover:bg-primary/30 hover:text-foreground",
              )}
              aria-pressed={currentRole === role.key}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.title}>
              {item.children ? (
                <Collapsible
                  open={openItems.includes(item.title)}
                  onOpenChange={() => toggleItem(item.title)}
                >
                  <CollapsibleTrigger
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-colors",
                      isParentActive(item.children)
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/60",
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="flex-1 text-left">{item.title}</span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        openItems.includes(item.title) && "rotate-180",
                      )}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-6 pt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        onClick={() => updateRoleFromHref(child.href)}
                        className={cn(
                          "block px-3 py-2 rounded-md text-sm transition-colors",
                          isActive(child.href)
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60",
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
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-colors",
                    isActive(item.href!)
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/60",
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
            {roleLabels[currentRole].charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">Painel {roleLabels[currentRole]}</p>
            <p className="text-xs text-muted-foreground">João e Maria • Acesso seguro</p>
          </div>
          <button
            type="button"
            className="text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Sair"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
