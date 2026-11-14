/**
 * Deterministic, offline stand-in for `@/integrations/supabase/client`.
 *
 * Only the query-builder surface the app actually uses is implemented; every
 * call is recorded so tests can assert *which* table/operation was hit instead
 * of only the rendered output.
 */

export interface QueryResult<T = unknown> {
  data: T | null;
  error: { message: string } | null;
}

export type QueryResponder = (table: string, operation: string) => QueryResult;

export interface RecordedCall {
  table: string;
  operation: string;
}

const DEFAULT_RESPONDER: QueryResponder = () => ({ data: [], error: null });

let responder: QueryResponder = DEFAULT_RESPONDER;

export const recordedCalls: RecordedCall[] = [];

export function setQueryResponder(next: QueryResponder): void {
  responder = next;
}

export function resetSupabaseMock(): void {
  responder = DEFAULT_RESPONDER;
  recordedCalls.length = 0;
}

/**
 * Convenience responder: every listed table resolves with the given rows,
 * every unlisted table resolves with an empty list.
 */
export function tableRowsResponder(
  rows: Record<string, unknown>,
): QueryResponder {
  return (table) => ({ data: rows[table] ?? [], error: null });
}

class QueryBuilder implements PromiseLike<QueryResult> {
  private readonly operations: string[] = [];

  constructor(private readonly table: string) {}

  private record(operation: string): this {
    this.operations.push(operation);
    return this;
  }

  select(): this {
    return this.record("select");
  }
  insert(): this {
    return this.record("insert");
  }
  update(): this {
    return this.record("update");
  }
  upsert(): this {
    return this.record("upsert");
  }
  delete(): this {
    return this.record("delete");
  }
  eq(): this {
    return this.record("eq");
  }
  neq(): this {
    return this.record("neq");
  }
  in(): this {
    return this.record("in");
  }
  is(): this {
    return this.record("is");
  }
  order(): this {
    return this.record("order");
  }
  limit(): this {
    return this.record("limit");
  }
  single(): this {
    return this.record("single");
  }
  maybeSingle(): this {
    return this.record("maybeSingle");
  }

  then<TResult1 = QueryResult, TResult2 = never>(
    onfulfilled?:
      | ((value: QueryResult) => TResult1 | PromiseLike<TResult1>)
      | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    const operation = this.operations[0] ?? "select";
    recordedCalls.push({ table: this.table, operation });
    return Promise.resolve(responder(this.table, operation)).then(
      onfulfilled,
      onrejected,
    );
  }
}

export const supabaseMock = {
  from(table: string): QueryBuilder {
    return new QueryBuilder(table);
  },
  rpc(functionName: string): Promise<QueryResult<boolean>> {
    recordedCalls.push({ table: `rpc:${functionName}`, operation: "rpc" });
    return Promise.resolve({ data: true, error: null });
  },
  auth: {
    getSession: () =>
      Promise.resolve({ data: { session: null }, error: null }) as Promise<
        QueryResult<{ session: null }>
      >,
    getUser: () =>
      Promise.resolve({ data: { user: null }, error: null }) as Promise<
        QueryResult<{ user: null }>
      >,
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => undefined } },
    }),
    signInWithPassword: () =>
      Promise.resolve({
        data: { user: null, session: null },
        error: null,
      }) as Promise<QueryResult<{ user: null; session: null }>>,
    signUp: () =>
      Promise.resolve({
        data: { user: null, session: null },
        error: null,
      }) as Promise<QueryResult<{ user: null; session: null }>>,
    signOut: () => Promise.resolve({ error: null }),
  },
  channel: () => ({
    on: () => ({ subscribe: () => undefined }),
  }),
  removeChannel: () => undefined,
};