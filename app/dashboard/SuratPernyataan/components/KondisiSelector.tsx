import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";
import { kondisiAhliWaris } from "../constants/kondisiAhliWaris";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";

interface KondisiSelectorProps {
  form: UseFormReturn<FormValues>;
}

export default function KondisiSelector({ form }: KondisiSelectorProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Step 1: Pilih Kondisi Pewaris
      </h2>
      <FormField
        control={form.control}
        name="kondisi"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              Kondisi Ahli Waris
            </FormLabel>
            <FormControl>
              <select
                value={field.value || ""}
                onChange={field.onChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Pilih Kondisi --</option>
                {kondisiAhliWaris.map((kondisi) => (
                  <option key={kondisi.id} value={kondisi.id}>
                    {kondisi.label}
                  </option>
                ))}
              </select>
            </FormControl>
            {field.value && (
              <p className="text-sm text-gray-500 mt-2">
                {kondisiAhliWaris.find((k) => k.id === field.value)?.description}
              </p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}