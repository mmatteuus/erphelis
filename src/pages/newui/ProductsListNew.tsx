import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Link, useNavigate } from "react-router-dom";

type Product = {
  id: string;
  nome: string;
  categoria: string;
  preco: number;
  estoque: number;
};

// Listagem de produtos com filtros, busca e ações.
export default function ProductsListNew() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [stockRange, setStockRange] = useState<string>("all");
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    // Integração de API: buscar produtos
    // fetch("/api/products").then(res => res.json()).then(setProducts)
    setTimeout(() => {
      setProducts([
        { id: "1", nome: "Kit maternidade", categoria: "Recém-nascido", preco: 289.9, estoque: 9 },
        { id: "2", nome: "Body algodão orgânico", categoria: "Recém-nascido", preco: 69.9, estoque: 26 },
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const bySearch =
        !search ||
        p.nome.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase());
      const byCategory = category === "all" || p.categoria === category;
      const byStock =
        stockRange === "all" ||
        (stockRange === "low" && p.estoque < 10) ||
        (stockRange === "ok" && p.estoque >= 10);
      return bySearch && byCategory && byStock;
    });
  }, [products, search, category, stockRange]);

  return (
    <div className="space-y-6">
      {/* Header com ações */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#333]">Produtos</h1>
          <p className="text-sm text-neutral-600">Catálogo do enxoval • /admin/products</p>
        </div>
        <Button
          className="bg-[#6C63FF] hover:bg-[#594ee0]"
          onClick={() => navigate("/admin/products/new")}
        >
          Adicionar Produto
        </Button>
      </div>

      {/* Barra de busca e filtros */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1">
          <Label htmlFor="search">Buscar</Label>
          <Input
            id="search"
            placeholder="Buscar por nome ou ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label>Categoria</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger aria-label="Filtrar categoria">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="Recém-nascido">Recém-nascido</SelectItem>
              <SelectItem value="Acessórios">Acessórios</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Estoque</Label>
          <Select value={stockRange} onValueChange={setStockRange}>
            <SelectTrigger aria-label="Filtrar estoque">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="low">Abaixo de 10</SelectItem>
              <SelectItem value="ok">10 ou mais</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mensagens de estado */}
      {loading && <p className="text-sm text-neutral-600">Carregando produtos...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Tabela de listagem */}
      <div className="overflow-auto border rounded-lg">
        <Table>
          <TableHeader className="bg-[#F8DCE2]/50">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-neutral-600 py-6">
                  Nenhum produto encontrado
                </TableCell>
              </TableRow>
            )}
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.nome}</TableCell>
                <TableCell>{p.categoria}</TableCell>
                <TableCell>R$ {p.preco.toFixed(2)}</TableCell>
                <TableCell>{p.estoque}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/admin/products/${p.id}/edit`)}>
                    Editar
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setProductToDelete(p)}>
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal de confirmação */}
      <AlertDialog open={!!productToDelete} onOpenChange={(o) => !o && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              {productToDelete
                ? `Tem certeza que deseja excluir ${productToDelete.nome}?`
                : "Selecione um produto."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!productToDelete) return;
                // Integração de API: delete
                // fetch(`/api/products/${productToDelete.id}`, { method: "DELETE" })
                setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
                setProductToDelete(null);
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
