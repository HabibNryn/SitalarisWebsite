import { KondisiAhliWaris } from "../types";

export const kondisiAhliWaris: KondisiAhliWaris[] = [
  {
    id: "kondisi1",
    label: "Pewaris memiliki 1 istri dan semua anak masih hidup",
    description: "Semua anak dari pernikahan pertama masih hidup",
  },
  {
    id: "kondisi2",
    label: "Pewaris memiliki 1 istri dan ada anak yang meninggal",
    description: "Salah satu anak dari pernikahan pertama telah meninggal",
  },
  {
    id: "kondisi3",
    label:
      "Pewaris memiliki 1 istri, ada anak yang meninggal dan memiliki cucu",
    description: "Anak yang meninggal memiliki keturunan (cucu)",
  },
  {
    id: "kondisi4",
    label: "Pewaris menikah 2 kali",
    description: "Pewaris memiliki istri dari pernikahan pertama dan kedua",
  },
  {
    id: "kondisi5",
    label: "Suami pewaris masih hidup",
    description: "Pewaris perempuan dan suaminya masih hidup",
  },
  {
    id: "kondisi6",
    label: "Pewaris tidak memiliki keturunan",
    description: "Pewaris tidak memiliki anak",
  },
  {
    id: "kondisi7",
    label:
      "Pewaris tidak memiliki keturunan dan hanya memiliki saudara kandung",
    description: "Ahli waris adalah saudara kandung pewaris",
  },
];