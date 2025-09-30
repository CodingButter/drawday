import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getCsvHeaders(
  file: File,
  opts: { encoding?: string } = {},
): Promise<string[]> {
  const { encoding = "utf-8" } = opts;
  const firstLine = await readFirstLine(file, encoding);
  const delim = detectDelimiter(firstLine);
  return parseCsvLine(firstLine, delim);
}

async function readFirstLine(file: File, encoding: string): Promise<string> {
  const reader = file
    .stream()
    .pipeThrough(new TextDecoderStream(encoding, { fatal: false }))
    .getReader();

  let buf = "";
  let seenAny = false;

  try {
    // Read until first newline, then cancel the stream.
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      let chunk = value ?? "";

      if (!seenAny) {
        // Strip UTF-8 BOM only once.
        if (chunk.charCodeAt(0) === 0xfeff) chunk = chunk.slice(1);
        seenAny = true;
      }

      const nl = chunk.indexOf("\n");
      if (nl === -1) {
        buf += chunk;
      } else {
        buf += chunk.slice(0, nl);
        await reader.cancel();
        break;
      }
    }
  } finally {
    // No need to release after cancel, but safe if the caller reuses streams elsewhere.
    try {
      reader.releaseLock();
    } catch {
      /* noop */
    }
  }

  // Handle CRLF
  if (buf.endsWith("\r")) buf = buf.slice(0, -1);
  return buf;
}

function detectDelimiter(line: string): string {
  const candidates = [",", "\t", ";", "|"] as const;
  const counts = new Map<string, number>(candidates.map((c) => [c, 0]));
  let inQ = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') {
        i++; // escaped quote
      } else {
        inQ = !inQ;
      }
    } else if (!inQ && counts.has(ch)) {
      counts.set(ch, (counts.get(ch) || 0) + 1);
    }
  }

  // Pick the most frequent; default comma if tie/empty.
  let best = ",";
  let bestCount = -1;
  for (const c of candidates) {
    const n = counts.get(c) ?? 0;
    if (n > bestCount) {
      best = c;
      bestCount = n;
    }
  }
  return best;
}

function parseCsvLine(line: string, delim: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQ) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"'; // escaped quote
          i++;
        } else {
          inQ = false;
        }
      } else {
        cur += ch;
      }
    } else {
      if (ch === '"') {
        inQ = true;
      } else if (ch === delim) {
        out.push(cur.trim());
        cur = "";
      } else {
        cur += ch;
      }
    }
  }
  out.push(cur.trim());
  return out;
}
