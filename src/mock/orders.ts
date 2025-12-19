import type { Order } from "./types";

export const orders: Order[] = [
  {
    id: "o_001",
    numero: "JM-2025-001",
    customerId: "c_maria_silva",
    cliente: "Maria Silva",
    status: "em_rota",
    itens: [
      {
        productId: "p_kit_boa_vinda",
        sku: "BABY-KIT-BOAS",
        nome: "Kit maternidade boas-vindas",
        quantidade: 1,
        precoUnitario: 289.9,
      },
      {
        productId: "p_manta_bebe",
        sku: "BABY-MANTA-ALG",
        nome: "Manta algodão para bebê",
        quantidade: 1,
        precoUnitario: 119.9,
      },
    ],
    total: 409.8,
    criadoEm: "2025-12-19T12:20:00.000Z",
    entregaEm: "2025-12-19T00:00:00.000Z",
  },
  {
    id: "o_002",
    numero: "JM-2025-002",
    customerId: "c_joao_santos",
    cliente: "João Santos",
    status: "novo",
    itens: [
      {
        productId: "p_body_algodao",
        sku: "BABY-BODY-ALG",
        nome: "Body algodão orgânico (P/M/G)",
        quantidade: 2,
        precoUnitario: 69.9,
      },
      {
        productId: "p_naninha",
        sku: "BABY-NANINHA",
        nome: "Naninha lullaby macia",
        quantidade: 1,
        precoUnitario: 79.9,
      },
    ],
    total: 219.7,
    criadoEm: "2025-12-19T13:05:00.000Z",
    entregaEm: "2025-12-19T00:00:00.000Z",
  },
  {
    id: "o_003",
    numero: "JM-2025-003",
    customerId: "c_empresa_alfa",
    cliente: "Empresa Alfa LTDA",
    status: "entregue",
    itens: [
      {
        productId: "p_kit_banho",
        sku: "BABY-KIT-BANHO",
        nome: "Kit banho suave para bebê",
        quantidade: 1,
        precoUnitario: 139.9,
      },
      {
        productId: "p_pelucia_ovelha",
        sku: "BABY-PLUSH-OVL",
        nome: "Pelúcia ovelhinha antialérgica",
        quantidade: 2,
        precoUnitario: 89.9,
      },
    ],
    total: 319.7,
    criadoEm: "2025-12-18T14:00:00.000Z",
    entregaEm: "2025-12-18T00:00:00.000Z",
  },
];
