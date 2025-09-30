import React, { useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Company, Image } from "@drawday/db";
import {
  Plus,
  Building2,
  ImageIcon,
  Edit,
  Trash2,
  RefreshCw,
  MoreHorizontal,
  Loader2,
  X,
} from "lucide-react";

// shadcn (latest CLI) components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
// Sonner (new toast system in shadcn)
import { toast } from "sonner";

// Your app hooks (unchanged)
import { useAPIQuery, useAPIMutation } from "../hooks/useAPI";

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------

type CompanyWithImages = Company & {
  logoImage: Image | null;
  bannerImage: Image | null;
  isActive?: boolean | null;
  createdAt?: string | Date | null;
};

type CompanyFormValues = {
  name: string;
  description?: string;
  logoImage?: File | null;
  bannerImage?: File | null;
  isActive?: boolean;
};

const companySchema = z.object({
  name: z.string().min(2, "Name is too short").max(100, "Name is too long"),
  description: z.string().max(500).optional().or(z.literal("")),
  logoImage: z.any().optional(),
  bannerImage: z.any().optional(),
  isActive: z.boolean().optional(),
});

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

function fileFromEvent(e: React.ChangeEvent<HTMLInputElement>): File | null {
  const f = e.target.files?.[0];
  return f ?? null;
}

function initials(name?: string) {
  if (!name) return "?";
  const parts = name.split(" ").filter(Boolean);
  const two = parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
  return two || name[0]?.toUpperCase() || "?";
}

function formatDate(d?: string | Date | null) {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString();
}

// ------------------------------------------------------------
// API hooks (assumes your existing API layer)
// ------------------------------------------------------------

function useCompanies() {
  return useAPIQuery<CompanyWithImages[]>("/companies");
}

function useCreateCompany() {
  return useAPIMutation<{ id: string; name: string }, CompanyFormValues>(
    "/companies",
    "POST",
  );
}

function useUpdateCompany(id: string) {
  return useAPIMutation<CompanyWithImages, Partial<CompanyFormValues>>(
    `/companies/${id}`,
    "PATCH",
  );
}

function useDeleteCompany(id: string) {
  return useAPIMutation<{ success: boolean }>(`/companies/${id}`, "DELETE");
}

// ------------------------------------------------------------
// Components
// ------------------------------------------------------------

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <Card className="border-dashed">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-xl">
          <Building2 className="h-5 w-5" />
          No companies yet
        </CardTitle>
        <CardDescription>
          Get started by creating your first company.
        </CardDescription>
      </CardHeader>
      <CardFooter className="justify-center">
        <Button onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" /> New company
        </Button>
      </CardFooter>
    </Card>
  );
}

function CompanyForm({
  defaults,
  onSubmit,
  submitting,
  mode,
}: {
  defaults?: Partial<CompanyFormValues>;
  onSubmit: (data: CompanyFormValues) => Promise<void> | void;
  submitting?: boolean;
  mode: "create" | "edit";
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
      ...defaults,
    },
  });

  const logo = watch("logoImage");
  const banner = watch("bannerImage");

  const onFile =
    (field: keyof CompanyFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = fileFromEvent(e);
      setValue(field, f as any);
    };

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async (vals) => {
        try {
          await onSubmit(vals);
        } catch (err: any) {
          toast.error(err?.message ?? "Failed to submit company");
        }
      })}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Acme Inc." {...register("name")} />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="flex items-center gap-3 pt-6">
          <Switch id="isActive" defaultChecked {...register("isActive")} />
          <Label htmlFor="isActive">Active</Label>
        </div>
        <div className="sm:col-span-2 space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={3}
            placeholder="What does this company do?"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-sm text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>
      </div>

      <Separator />

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="logo">Logo</Label>
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              {logo ? (
                <AvatarImage
                  src={URL.createObjectURL(logo as File)}
                  alt="logo preview"
                />
              ) : (
                <AvatarFallback>
                  <ImageIcon className="h-5 w-5" />
                </AvatarFallback>
              )}
            </Avatar>
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={onFile("logoImage")}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="banner">Banner</Label>
          <Input
            id="banner"
            type="file"
            accept="image/*"
            onChange={onFile("bannerImage")}
          />
          {banner && (
            <div className="aspect-[3/1] w-full overflow-hidden rounded-xl border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(banner as File)}
                alt="banner preview"
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Create company" : "Save changes"}
        </Button>
      </DialogFooter>
    </form>
  );
}

function CompaniesTable({
  data,
  onEdit,
  onDelete,
  page,
  pageSize,
  setPage,
}: {
  data: CompanyWithImages[];
  onEdit: (c: CompanyWithImages) => void;
  onDelete: (c: CompanyWithImages) => void;
  page: number;
  pageSize: number;
  setPage: (p: number) => void;
}) {
  const total = data.length;
  const start = page * pageSize;
  const end = Math.min(start + pageSize, total);
  const pageData = useMemo(() => data.slice(start, end), [data, start, end]);
  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Companies</CardTitle>
        <CardDescription>
          Manage all organizations tied to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[56px]">Logo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Banner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageData.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <Avatar>
                      {c.logoImage?.url ? (
                        <AvatarImage src={c.logoImage.url} alt={c.name} />
                      ) : (
                        <AvatarFallback>{initials(c.name)}</AvatarFallback>
                      )}
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>
                    {c.bannerImage?.url ? (
                      <Badge variant="secondary">Has banner</Badge>
                    ) : (
                      <Badge variant="outline">No banner</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {c.isActive ? (
                      <Badge>Active</Badge>
                    ) : (
                      <Badge variant="destructive">Disabled</Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(c.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(c)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => onDelete(c)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {pageData.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {total === 0 ? 0 : start + 1}-{end} of {total}
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(Math.max(0, page - 1));
                }}
              />
            </PaginationItem>
            {Array.from({ length: pages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={i === page}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(i);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(Math.min(pages - 1, page + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
}

// ------------------------------------------------------------
// Page
// ------------------------------------------------------------

export default function CompanyPage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CompanyWithImages | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const [search, setSearch] = useState("");

  const companyQuery = useCompanies();
  const createMutation = useCreateCompany();
  const updateMutation = useUpdateCompany(editing?.id ?? "");

  const filtered = useMemo(() => {
    const list = companyQuery.data ?? [];
    if (!search) return list;
    const s = search.toLowerCase();
    return list.filter((c) => c.name.toLowerCase().includes(s));
  }, [companyQuery.data, search]);

  const resetDialogs = () => {
    setOpen(false);
    setEditing(null);
  };

  async function handleCreate(values: CompanyFormValues) {
    try {
      await createMutation.mutateAsync(values as any);
      resetDialogs();
      await companyQuery.refetch();
      toast.success("Company created");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to create company");
    }
  }

  async function handleUpdate(values: CompanyFormValues) {
    if (!editing) return;
    try {
      await updateMutation.mutateAsync(values as any);
      resetDialogs();
      await companyQuery.refetch();
      toast.success("Company updated");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to update company");
    }
  }

  async function handleDelete(company: CompanyWithImages) {
    try {
      const del = useDeleteCompany(company.id);
      await del.mutateAsync();
      await companyQuery.refetch();
      toast.success("Company deleted");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to delete company");
    }
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <Building2 className="h-6 w-6" /> Companies
          </h1>
          <p className="text-sm text-muted-foreground">
            Create, update, and manage your companies.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => companyQuery.refetch()}
            aria-label="Refresh"
          >
            {companyQuery.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New company
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>New company</DialogTitle>
                <DialogDescription>
                  Add a new company to your account.
                </DialogDescription>
              </DialogHeader>
              <CompanyForm
                mode="create"
                submitting={createMutation.isPending}
                onSubmit={handleCreate}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Toolbar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full items-center gap-2 sm:max-w-xs">
              <Input
                placeholder="Search companies…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {companyQuery.data?.length ?? 0} total
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {companyQuery.isLoading ? (
        <Card>
          <CardContent className="space-y-3 p-6">
            <Skeleton className="h-8 w-1/3" />
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      ) : companyQuery.data && companyQuery.data.length > 0 ? (
        <CompaniesTable
          data={filtered}
          onEdit={(c) => setEditing(c)}
          onDelete={handleDelete}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
        />
      ) : (
        <EmptyState onCreate={() => setOpen(true)} />
      )}

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit company</DialogTitle>
            <DialogDescription>Update the company details.</DialogDescription>
          </DialogHeader>
          {editing ? (
            <CompanyForm
              mode="edit"
              defaults={{
                name: editing.name,
                isActive: editing.isActive ?? true,
                description: (editing as any).description ?? "",
              }}
              submitting={false}
              onSubmit={handleUpdate}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
