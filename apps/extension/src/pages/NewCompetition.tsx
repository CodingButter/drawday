import * as React from "react";
import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { makeQueryFn } from "@/lib/queryFn";

// ---------- shadcn/ui ----------
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// ---------- CSV header reader (kept) ----------
async function getCsvHeaders(file: File): Promise<string[]> {
  const text = await file.text();
  const firstLine = text.split(new RegExp("\\r?\\n"))[0] ?? "";
  return firstLine
    .split(",")
    .map((h) => h.trim())
    .filter(Boolean);
}

// ---------- Types (kept) ----------
export type Mapping = {
  mode: "full" | "split"; // full = single Name column; split = First + Last
  fullName: string; // used when mode === "full"
  firstName: string; // used when mode === "split"
  lastName: string; // used when mode === "split"
  ticketNumber: string; // always required
};

export type SaveMapping =
  | { type: "full"; nameColumn: string; ticketNumberColumn: string }
  | {
      type: "split";
      firstNameColumn: string;
      lastNameColumn: string;
      ticketNumberColumn: string;
    };

// ---------- Small UI helpers ----------
function Field({
  label,
  children,
  helper,
}: {
  label: string;
  children: React.ReactNode;
  helper?: string;
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
      {helper ? (
        <p className="text-xs text-muted-foreground">{helper}</p>
      ) : null}
    </div>
  );
}

function ColumnSelect({
  headers,
  value,
  onChange,
  taken,
  placeholder = "Select a column…",
}: {
  headers: string[];
  value: string;
  onChange: (v: string) => void;
  taken: Set<string>;
  placeholder?: string;
}) {
  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger className="h-10 w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {headers.map((h) => {
          const disabled = taken.has(h) && value !== h;
          return (
            <SelectItem key={h} value={h} disabled={disabled}>
              {h}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

function DropArea({ onFile }: { onFile: (file: File) => void }) {
  const [dragOver, setDragOver] = useState(false);
  const inputId = "participants-csv";

  const onPick = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) onFile(f);
    },
    [onFile],
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
      const f = e.dataTransfer.files?.[0];
      if (f) onFile(f);
    },
    [onFile],
  );

  const onDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const onDragLeave = useCallback(() => setDragOver(false), []);

  return (
    <Card className="border-dashed">
      <CardContent className="p-6">
        <label
          htmlFor={inputId}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={[
            "group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center",
            dragOver
              ? "border-primary/60 bg-muted/40 ring-2 ring-primary/20"
              : "border-muted-foreground/30 hover:border-primary/40 hover:bg-muted/30",
          ].join(" ")}
        >
          <Input
            id={inputId}
            type="file"
            accept=".csv,text/csv"
            onChange={onPick}
            className="sr-only"
          />
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
            {/* Simple upload glyph (no extra deps) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 opacity-80"
            >
              <path d="M12 16a1 1 0 0 1-1-1V9.41L9.7 10.7a1 1 0 1 1-1.4-1.4l3-3a1 1 0 0 1 1.4 0l3 3a1 1 0 1 1-1.4 1.4L13 9.41V15a1 1 0 0 1-1 1Z" />
              <path d="M6 18a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2a1 1 0 1 1 0 2H6v7h12V9h-2a1 1 0 1 1 0-2h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6Z" />
            </svg>
          </div>
          <div className="space-y-1">
            <p className="text-sm">
              Drag & drop your{" "}
              <span className="font-medium text-primary">CSV</span> here
            </p>
            <p className="text-xs text-muted-foreground">
              or click to choose a file
            </p>
          </div>
        </label>
      </CardContent>
    </Card>
  );
}

export function NewCompetition() {
  const [headers, setHeaders] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [mapping, setMapping] = useState<Mapping>({
    mode: "full",
    fullName: "",
    firstName: "",
    lastName: "",
    ticketNumber: "",
  });

  // kept for parity with your original file (even if currently unused)
  const query = useQuery({
    queryKey: ["/competitions"],
    queryFn: makeQueryFn<{ id: string; name: string }[]>(),
  });

  const reset = useCallback(() => {
    setHeaders([]);
    setFile(null);
    setMapping({
      mode: "full",
      fullName: "",
      firstName: "",
      lastName: "",
      ticketNumber: "",
    });
  }, []);

  const onSave = useCallback(async (f: File, mapping: SaveMapping) => {
    // Upload file to server
  }, []);

  const handleFile = useCallback(async (f: File) => {
    // Note: we *do* keep the file (so "Save" can work).
    setFile(f);
    const hdrs = await getCsvHeaders(f);
    setHeaders(hdrs);
  }, []);

  const taken = useMemo(
    () =>
      new Set(
        [
          mapping.mode === "full" ? mapping.fullName : "",
          mapping.mode === "split" ? mapping.firstName : "",
          mapping.mode === "split" ? mapping.lastName : "",
          mapping.ticketNumber,
        ].filter(Boolean),
      ),
    [mapping],
  );

  const values = useMemo(() => {
    if (mapping.mode === "full")
      return [mapping.fullName, mapping.ticketNumber].filter(Boolean);
    return [mapping.firstName, mapping.lastName, mapping.ticketNumber].filter(
      Boolean,
    );
  }, [mapping]);

  const allSelected =
    mapping.mode === "full" ? values.length === 2 : values.length === 3;
  const allDistinct = new Set(values).size === values.length;
  const canSave: boolean =
    Boolean(file) && allSelected && allDistinct && !isSaving;

  const save = useCallback(async () => {
    if (!file || !canSave) return;
    try {
      setIsSaving(true);
      const normalized: SaveMapping =
        mapping.mode === "full"
          ? {
              type: "full",
              nameColumn: mapping.fullName,
              ticketNumberColumn: mapping.ticketNumber,
            }
          : {
              type: "split",
              firstNameColumn: mapping.firstName,
              lastNameColumn: mapping.lastName,
              ticketNumberColumn: mapping.ticketNumber,
            };
      await onSave(file, normalized);
    } finally {
      setIsSaving(false);
    }
  }, [file, canSave, onSave, mapping]);

  return (
    <div className="mx-auto grid max-w-3xl gap-6 p-4 sm:p-6">
      {/* Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>Participants CSV</CardTitle>
            <CardDescription>
              Upload, map columns (single name or first+last), and save.
            </CardDescription>
          </div>
          {file ? (
            <Button variant="outline" onClick={reset}>
              Choose another file
            </Button>
          ) : null}
        </CardHeader>
      </Card>

      {/* Drop vs Mapper */}
      {!headers.length ? (
        <DropArea onFile={handleFile} />
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="mb-5 grid gap-1 text-sm">
              <div className="text-foreground/90">
                File: <span className="font-medium">{file?.name}</span>
              </div>
              <div className="text-muted-foreground">
                Detected columns: {headers.join(", ")}
              </div>
            </div>

            {/* Mode switch */}
            <div className="grid gap-2 mb-5">
              <Label className="text-sm">Name mapping mode</Label>
              <ToggleGroup
                type="single"
                value={mapping.mode}
                onValueChange={(val) => {
                  if (!val) return;
                  setMapping((m) =>
                    val === "full"
                      ? { ...m, mode: "full", firstName: "", lastName: "" }
                      : { ...m, mode: "split", fullName: "" },
                  );
                }}
                className="w-fit"
              >
                <ToggleGroupItem value="full" aria-label="Single Name column">
                  Single Name column
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="split"
                  aria-label="First & Last columns"
                >
                  First &amp; Last columns
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Mapping fields */}
            <div className="grid gap-5">
              {mapping.mode === "full" ? (
                <>
                  <Field
                    label="Name"
                    helper="Select the single column that contains the full name"
                  >
                    <ColumnSelect
                      headers={headers}
                      value={mapping.fullName}
                      onChange={(v) => setMapping({ ...mapping, fullName: v })}
                      taken={taken}
                    />
                  </Field>

                  <Field
                    label="Ticket number"
                    helper="Unique ticket identifier"
                  >
                    <ColumnSelect
                      headers={headers}
                      value={mapping.ticketNumber}
                      onChange={(v) =>
                        setMapping({ ...mapping, ticketNumber: v })
                      }
                      taken={taken}
                    />
                  </Field>
                </>
              ) : (
                <>
                  <Field label="First name" helper="Column with given names">
                    <ColumnSelect
                      headers={headers}
                      value={mapping.firstName}
                      onChange={(v) => setMapping({ ...mapping, firstName: v })}
                      taken={taken}
                    />
                  </Field>

                  <Field label="Last name" helper="Column with family names">
                    <ColumnSelect
                      headers={headers}
                      value={mapping.lastName}
                      onChange={(v) => setMapping({ ...mapping, lastName: v })}
                      taken={taken}
                    />
                  </Field>

                  <Field
                    label="Ticket number"
                    helper="Unique ticket identifier"
                  >
                    <ColumnSelect
                      headers={headers}
                      value={mapping.ticketNumber}
                      onChange={(v) =>
                        setMapping({ ...mapping, ticketNumber: v })
                      }
                      taken={taken}
                    />
                  </Field>
                </>
              )}
            </div>

            {/* Summary */}
            <Separator className="my-6" />
            <div className="grid gap-2 text-sm">
              <div className="font-medium">Mapping summary</div>
              {mapping.mode === "full" ? (
                <ul className="ml-5 list-disc">
                  <li>
                    Name →{" "}
                    {mapping.fullName || (
                      <em className="text-muted-foreground">not set</em>
                    )}
                  </li>
                  <li>
                    Ticket Number →{" "}
                    {mapping.ticketNumber || (
                      <em className="text-muted-foreground">not set</em>
                    )}
                  </li>
                </ul>
              ) : (
                <ul className="ml-5 list-disc">
                  <li>
                    First Name →{" "}
                    {mapping.firstName || (
                      <em className="text-muted-foreground">not set</em>
                    )}
                  </li>
                  <li>
                    Last Name →{" "}
                    {mapping.lastName || (
                      <em className="text-muted-foreground">not set</em>
                    )}
                  </li>
                  <li>
                    Ticket Number →{" "}
                    {mapping.ticketNumber || (
                      <em className="text-muted-foreground">not set</em>
                    )}
                  </li>
                </ul>
              )}

              {!allDistinct && (
                <div className="text-amber-600">
                  Each field must use a different column.
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center gap-3">
              <Button onClick={save} disabled={!canSave}>
                {isSaving ? "Saving…" : "Save to database"}
              </Button>
              {!canSave && (
                <span className="text-xs text-muted-foreground">
                  Select distinct columns to enable saving.
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footnote */}
      <p className="mx-auto max-w-prose text-center text-xs text-muted-foreground">
        Pro tip: if a CSV only has a single name column, switch to “Single Name
        column” mode—simple and sturdy.
      </p>
    </div>
  );
}

export default NewCompetition;
