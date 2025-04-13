import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

type QueryState<T> = {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isRefetching: boolean;
};

type QueryOptions = {
  enabled?: boolean;
  refetchInterval?: number | false;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
};

/**
 * Custom hook for Supabase queries with automatic refetching and loading states
 */
export function useSupabaseQuery<T>(
  queryFn: () => PostgrestFilterBuilder<any, any, any[]>,
  options: QueryOptions = {},
) {
  const {
    enabled = true,
    refetchInterval = false,
    onSuccess,
    onError,
  } = options;

  const [state, setState] = useState<QueryState<T>>({
    data: null,
    error: null,
    isLoading: true,
    isRefetching: false,
  });

  const fetchData = useCallback(
    async (isRefetching = false) => {
      if (!enabled) return;

      if (!isRefetching) {
        setState((prev) => ({ ...prev, isLoading: true }));
      } else {
        setState((prev) => ({ ...prev, isRefetching: true }));
      }

      try {
        const { data, error } = await queryFn();

        if (error) throw error;

        setState({
          data,
          error: null,
          isLoading: false,
          isRefetching: false,
        });

        if (onSuccess) onSuccess(data);
      } catch (error) {
        const errorObj =
          error instanceof Error ? error : new Error(String(error));

        setState({
          data: null,
          error: errorObj,
          isLoading: false,
          isRefetching: false,
        });

        if (onError) onError(errorObj);
      }
    },
    [queryFn, enabled, onSuccess, onError],
  );

  const refetch = useCallback(() => fetchData(true), [fetchData]);

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled, fetchData]);

  useEffect(() => {
    if (!refetchInterval || !enabled) return;

    const intervalId = setInterval(() => {
      fetchData(true);
    }, refetchInterval);

    return () => clearInterval(intervalId);
  }, [refetchInterval, fetchData, enabled]);

  return { ...state, refetch };
}

/**
 * Custom hook for Supabase real-time subscriptions
 */
export function useSupabaseSubscription<T>(
  tableName: string,
  options: {
    filter?: { column: string; value: any };
    onInsert?: (item: T) => void;
    onUpdate?: (item: T) => void;
    onDelete?: (item: T) => void;
  } = {},
) {
  useEffect(() => {
    const { filter, onInsert, onUpdate, onDelete } = options;

    const channel = supabase
      .channel(`public:${tableName}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: tableName,
          ...(filter ? { filter: `${filter.column}=eq.${filter.value}` } : {}),
        },
        (payload) => {
          if (onInsert) onInsert(payload.new as T);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: tableName,
          ...(filter ? { filter: `${filter.column}=eq.${filter.value}` } : {}),
        },
        (payload) => {
          if (onUpdate) onUpdate(payload.new as T);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: tableName,
          ...(filter ? { filter: `${filter.column}=eq.${filter.value}` } : {}),
        },
        (payload) => {
          if (onDelete) onDelete(payload.old as T);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName, options]);
}
