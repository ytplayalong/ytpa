"use client";

import { useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, ReactNode } from "react";
import { getButtonAttrs } from "../util/styles";
import {
  MdFirstPage,
  MdLastPage,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";

type UsePaginatedListResult<T> = {
  currentChunk: T[];
  navComponent: ReactNode;
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
};

export const paginationKey = "page";

/**
 * Hook to use pagination for an object list.
 *
 * @param items Items to paginate.
 * @param chunkSize Max. number of items shown on a page.
 */
export function usePaginatedList<T>(
  items: T[],
  chunkSize: number
): UsePaginatedListResult<T> {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const param = searchParams.get(paginationKey);
  const initialPage = param ? Math.max(1, Number.parseInt(param, 10)) : 1;

  const totalPages = Math.max(1, Math.ceil(items.length / chunkSize));
  const [page, setPage] = useState(initialPage);

  // Keep page within bounds when items change
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  // Sync URL when page changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (page > 1) {
      params.set(paginationKey, page.toString());
    } else {
      params.delete(paginationKey);
    }

    if (globalThis.history !== undefined) {
      const newUrl = `${pathname}?${params.toString()}`;
      globalThis.history.replaceState(null, "", newUrl);
    }
  }, [page, pathname, searchParams]);

  // Update state when query param changes (browser back/forward)
  useEffect(() => {
    const param = searchParams.get("page");
    const parsed = param ? Number.parseInt(param, 10) : 1;
    if (parsed !== page) setPage(parsed);
  }, [searchParams]);

  // Compute current chunk
  const start = (page - 1) * chunkSize;
  const end = start + chunkSize;
  const currentChunk = items.slice(start, end);

  // Navigation component
  const buttAttrs = getButtonAttrs("20px");
  const iconSize = 24;
  const navComponent = (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "0.4rem",
        marginBlock: "1rem",
      }}
    >
      <button
        disabled={page === 1}
        onClick={() => setPage(() => 1)}
        {...buttAttrs}
      >
        <MdFirstPage size={iconSize} />
      </button>
      <button
        disabled={page === 1}
        onClick={() => setPage((p) => p - 1)}
        {...buttAttrs}
      >
        <MdNavigateBefore size={iconSize} />
      </button>
      <span style={{ marginInline: "2rem" }}>
        {page} / {totalPages}
      </span>
      <button
        disabled={page === totalPages}
        onClick={() => setPage((p) => p + 1)}
        {...buttAttrs}
      >
        <MdNavigateNext size={iconSize} />
      </button>
      <button
        disabled={page === totalPages}
        onClick={() => setPage((p) => totalPages)}
        {...buttAttrs}
      >
        <MdLastPage size={iconSize} />
      </button>
    </div>
  );

  return { currentChunk, navComponent, page, totalPages, setPage };
}
