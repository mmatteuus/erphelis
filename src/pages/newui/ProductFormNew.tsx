import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type FormState = {
  nome: string;
  categoria: string;
  preco: string;
  estoque: string;
  descricao: string;
  foto: File | null;
};

// Formulário de produto (novo/edit) com validações e placeholders de API.
export default function ProductFormNew() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    nome: "",
    categoria: "",
    preco: "",
    estoque: "",
    descricao: "",
    foto: null,
  });

  useEffect(() => {
    if (!isEdit) return;
    // Integração de API: buscar produto por id
    // fetch(`/api/products/${id}`).then(res => res.json()).then(popular)
    setForm({
      nome: "Kit maternidade",
      categoria: "Recém-nascido",
      preco: "289.90",
      estoque: "9",
      descricao: "Kit com manta e itens de boas-vindas.",
      foto: null,
    });
  }, [id, isEdit]);

  const handleChange = (field: keyof FormState, value: string | File | null) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!form.nome || !form.categoria || !form.preco || !form.estoque || !form.descricao) {
      setError("Preencha todos os campos");
      return false;
    }
    if (Number(form.preco) <= 0) {
      setError("Preço deve ser maior que 0");
      return false;
    }
    if (Number(form.estoque) < 0) {
      setError("Estoque não pode ser negativo");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setFeedback(null);
    // Integração de API: salvar produto
    // const payload = new FormData(); payload.append("nome", form.nome) ...
    // fetch(isEdit ? `/api/products/${id}` : "/api/products", { method: isEdit ? "PUT" : "POST", body: payload })
    await new Promise((res) => setTimeout(res, 800));
    setLoading(false);
    setFeedback("Produto salvo com sucesso");
    navigate("/admin/products");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#333]">
            {isEdit ? "Editar produto" : "Novo produto"}
          </h1>
          <p className="text-sm text-neutral-600">/admin/products {isEdit && `> ${id}`}</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/admin/products")}>
          Cancelar
        </Button>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Dados do produto</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Nome */}
            <div className="space-y-1">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={form.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
                placeholder="Body algodão orgânico"
                required
              />
            </div>

            {/* Categoria */}
            <div className="space-y-1">
              <Label>Categoria</Label>
              <Select value={form.categoria} onValueChange={(v) => handleChange("categoria", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Recém-nascido">Recém-nascido</SelectItem>
                  <SelectItem value="Acessórios">Acessórios</SelectItem>
                  <SelectItem value="Roupas">Roupas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Preço e Estoque */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="preco">Preço</Label>
                <Input
                  id="preco"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.preco}
                  onChange={(e) => handleChange("preco", e.target.value)}
                  placeholder="0,00"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="estoque">Estoque inicial</Label>
                <Input
                  id="estoque"
                  type="number"
                  min="0"
                  value={form.estoque}
                  onChange={(e) => handleChange("estoque", e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-1">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                rows={3}
                value={form.descricao}
                onChange={(e) => handleChange("descricao", e.target.value)}
                placeholder="Detalhes do produto..."
                required
              />
            </div>

            {/* Upload de foto */}
            <div className="space-y-1">
              <Label htmlFor="foto">Upload de foto</Label>
              <Input
                id="foto"
                type="file"
                accept="image/*"
                onChange={(e) => handleChange("foto", e.target.files?.[0] ?? null)}
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {feedback && <p className="text-sm text-green-700">{feedback}</p>}

            <div className="flex gap-3">
              <Button type="submit" className="bg-[#6C63FF] hover:bg-[#594ee0]" disabled={loading}>
                {loading ? "Salvando..." : "Salvar"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/admin/products")}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
