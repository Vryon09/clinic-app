import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../shadcn/dialog";
import { Button } from "../../shadcn/button";
import { Input } from "../../shadcn/input";
import { Label } from "../../shadcn/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../shadcn/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../shadcn/table";
import { Badge } from "../../shadcn/badge";
import { Plus, Trash2, Check, X, Pen } from "lucide-react";
import {
  useCreateService,
  useDeleteService,
  useServices,
  useUpdateService,
} from "@/services/apiBilling";
import type { IServiceCatalog, ServiceCategory } from "@/types/BillingType";
import { formatPHP, SERVICE_CATEGORY_LABELS } from "./billingUtils";

interface ServiceCatalogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ServiceCatalogDialog({
  open,
  onOpenChange,
}: ServiceCatalogDialogProps) {
  const { data: services = [], isLoading } = useServices(false);
  const { mutate: createService, isPending: isCreating } = useCreateService();
  const { mutate: updateService } = useUpdateService();
  const { mutate: deleteService } = useDeleteService();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<ServiceCategory>("CONSULTATION");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editName, setEditName] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = parseFloat(price);
    if (!name.trim() || isNaN(numericPrice) || numericPrice < 0) return;

    createService(
      {
        name: name.trim(),
        category,
        defaultPrice: numericPrice,
      },
      {
        onSuccess: () => {
          setName("");
          setPrice("");
        },
      },
    );
  };

  const startEdit = (svc: IServiceCatalog) => {
    setEditingId(svc.id);
    setEditName(svc.name);
    setEditPrice(String(svc.defaultPrice));
  };

  const saveEdit = (id: string) => {
    const numericPrice = parseFloat(editPrice);
    if (!editName.trim() || isNaN(numericPrice) || numericPrice < 0) return;

    updateService(
      {
        id,
        payload: { name: editName.trim(), defaultPrice: numericPrice },
      },
      {
        onSuccess: () => setEditingId(null),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Service Fee Catalog</DialogTitle>
          <DialogDescription>
            Manage standard consultation fees, procedures, lab tests, and supplies for quick invoicing.
          </DialogDescription>
        </DialogHeader>

        {/* Quick Add Form */}
        <form
          onSubmit={handleAdd}
          className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 rounded-xl border border-border bg-muted/30 p-3"
        >
          <div className="sm:col-span-5">
            <Label className="text-xs mb-1 block">Service / Item Name</Label>
            <Input
              placeholder="e.g., General Consultation"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-8.5 text-xs"
              required
            />
          </div>
          <div className="sm:col-span-3">
            <Label className="text-xs mb-1 block">Category</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as ServiceCategory)}
            >
              <SelectTrigger className="h-8.5 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SERVICE_CATEGORY_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key} className="text-xs">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs mb-1 block">Price (₱)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="500.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="h-8.5 text-xs"
              required
            />
          </div>
          <div className="sm:col-span-2 flex items-end">
            <Button
              type="submit"
              size="sm"
              disabled={isCreating}
              className="w-full h-8.5 text-xs gap-1 cursor-pointer"
            >
              <Plus className="size-3.5" />
              Add
            </Button>
          </div>
        </form>

        {/* Catalog List */}
        <div className="flex-1 overflow-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Service Name</TableHead>
                <TableHead className="text-xs">Category</TableHead>
                <TableHead className="text-xs text-right">Default Fee</TableHead>
                <TableHead className="text-xs text-center">Status</TableHead>
                <TableHead className="text-xs text-right w-28">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-xs text-muted-foreground py-8">
                    Loading catalog...
                  </TableCell>
                </TableRow>
              ) : services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-xs text-muted-foreground py-8">
                    No services configured yet. Add your first clinic fee above.
                  </TableCell>
                </TableRow>
              ) : (
                services.map((svc) => (
                  <TableRow key={svc.id}>
                    <TableCell className="text-xs font-medium">
                      {editingId === svc.id ? (
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="h-7 text-xs"
                        />
                      ) : (
                        svc.name
                      )}
                    </TableCell>
                    <TableCell className="text-xs">
                      <Badge variant="outline" className="text-[10px]">
                        {SERVICE_CATEGORY_LABELS[svc.category]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-right font-mono">
                      {editingId === svc.id ? (
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          className="h-7 text-xs w-24 ml-auto text-right"
                        />
                      ) : (
                        formatPHP(svc.defaultPrice)
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        type="button"
                        onClick={() =>
                          updateService({
                            id: svc.id,
                            payload: { isActive: !svc.isActive },
                          })
                        }
                        className="cursor-pointer"
                      >
                        <Badge
                          variant={svc.isActive ? "default" : "secondary"}
                          className="text-[10px]"
                        >
                          {svc.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      {editingId === svc.id ? (
                        <div className="flex justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-7 text-emerald-600 cursor-pointer"
                            onClick={() => saveEdit(svc.id)}
                          >
                            <Check className="size-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-7 text-muted-foreground cursor-pointer"
                            onClick={() => setEditingId(null)}
                          >
                            <X className="size-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-7 cursor-pointer"
                            onClick={() => startEdit(svc)}
                          >
                            <Pen className="size-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-7 text-destructive hover:text-destructive cursor-pointer"
                            onClick={() => deleteService(svc.id)}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
