import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  Calendar,
  ChevronDown,
  Command,
  Menu,
  PanelLeft,
  Plus,
  Search,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CommandPalette } from "./CommandPalette";
import { ERPMobileNav } from "./ERPMobileNav";
import { usePreferencesStore, type UserRole } from "@/store/preferences";

const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  gerente: "Gerente",
  vendedor: "Vendedor",
  estoquista: "Estoquista",
};

const notifications = [
  {
    id: 1,
    title: "NF-e pronta para envio",
    desc: "Pedido #JM-1042 aguardando assinatura",
    type: "info" as const,
  },
  {
    id: 2,
    title: "Estoque crítico",
    desc: "SKU AÇ-021 abaixo do mínimo",
    type: "warning" as const,
  },
  {
    id: 3,
    title: "Aprovação pendente",
    desc: "3 pedidos aguardando gerente",
    type: "danger" as const,
  },
];

export function ERPTopbar() {
  const [showCommand, setShowCommand] = useState(false);
  const [period, setPeriod] = useState("Hoje");
  const { sidebarCollapsed, toggleSidebarCollapsed, currentRole, setCurrentRole } =
    usePreferencesStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const [, segment] = location.pathname.split("/");
    if (segment && roleLabels[segment as UserRole]) {
      setCurrentRole(segment as UserRole);
    }
  }, [location.pathname, setCurrentRole]);

  const roleOptions = useMemo(
    () => (["admin", "gerente", "vendedor", "estoquista"] as UserRole[]),
    [],
  );

  return (
    <>
      <header className="sticky top-0 z-40 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-full items-center gap-3 px-4 lg:px-6">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="hidden lg:inline-flex"
            onClick={toggleSidebarCollapsed}
            aria-label={sidebarCollapsed ? "Abrir navegação" : "Fechar navegação"}
          >
            <PanelLeft className="h-5 w-5" />
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <SheetHeader className="h-16 flex flex-row items-center gap-3 px-6 border-b">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <SheetTitle className="text-left">
                  <span className="font-semibold">ERP João e Maria</span>
                  <span className="block text-xs text-muted-foreground font-normal">
                    Troque de papel e navegue pelos módulos
                  </span>
                </SheetTitle>
              </SheetHeader>
              <ERPMobileNav />
            </SheetContent>
          </Sheet>

          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar pedidos, clientes ou NF-e (Ctrl+K)"
                className="pl-9 pr-12 bg-muted/50 border-0 focus-visible:ring-1"
                onClick={() => setShowCommand(true)}
                readOnly
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <Command className="h-3 w-3" />K
              </kbd>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                <Calendar className="h-4 w-4" />
                {period}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {["Hoje", "7 dias", "30 dias", "Este mês"].map((p) => (
                <DropdownMenuItem key={p} onClick={() => setPeriod(p)}>
                  {p}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                {roleLabels[currentRole]}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {roleOptions.map((role) => (
                <DropdownMenuItem
                  key={role}
                  onClick={() => {
                    setCurrentRole(role);
                    navigate(`/${role}`);
                  }}
                >
                  {roleLabels[role]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="hidden sm:flex items-center gap-2">
            <Button asChild className="gap-2">
              <Link to="/vendas/pedidos/novo">
                <Plus className="h-4 w-4" />
                <span>Novo pedido</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link to="/estoque/produtos/novo">
                <Plus className="h-4 w-4" />
                <span>Novo produto</span>
              </Link>
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-2 border-b">
                <h4 className="font-semibold text-sm">Notificações</h4>
              </div>
              {notifications.map((n) => (
                <DropdownMenuItem
                  key={n.id}
                  className="flex flex-col items-start gap-1 p-3"
                >
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        n.type === "danger"
                          ? "badge-danger"
                          : n.type === "warning"
                            ? "badge-warning"
                            : "badge-info"
                      }
                    >
                      {n.type === "danger"
                        ? "Urgente"
                        : n.type === "warning"
                          ? "Alerta"
                          : "Info"}
                    </Badge>
                    <span className="font-medium text-sm">{n.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{n.desc}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
                  <UserRound className="h-5 w-5 text-primary" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/configuracoes">Configurações</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <CommandPalette open={showCommand} onOpenChange={setShowCommand} />
    </>
  );
}
