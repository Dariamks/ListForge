/**
 * NDJSON stream parser for `fetch` responses.
 *
 * Yields each parsed JSON object as it arrives. Handles partial chunks at
 * buffer boundaries (a TCP packet can split a JSON line in half). Returns
 * cleanly when the stream closes.
 */
export async function* readNdjson<T = unknown>(
  body: ReadableStream<Uint8Array>
): AsyncGenerator<T, void, void> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buf = "";

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });

      // Emit any complete lines, keep the trailing partial in the buffer.
      let nl: number;
      while ((nl = buf.indexOf("\n")) !== -1) {
        const line = buf.slice(0, nl).trim();
        buf = buf.slice(nl + 1);
        if (!line) continue;
        try {
          yield JSON.parse(line) as T;
        } catch {
          // Drop unparseable lines. In practice this only happens if the
          // server crashed mid-line; the client recovers on next chunk.
        }
      }
    }
    // Flush any final line without a trailing newline.
    const tail = buf.trim();
    if (tail) {
      try {
        yield JSON.parse(tail) as T;
      } catch {
        /* ignore */
      }
    }
  } finally {
    reader.releaseLock();
  }
}
