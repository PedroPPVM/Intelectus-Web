import { useState, useMemo, useEffect } from 'react';
import dayjs from 'dayjs';

interface UseTableStateProps<T> {
  data: T[];
  initialItemsPerPage?: number;
}

interface UseTableStateReturn<T> {
  processedData: {
    data: T[];
    totalItems: number;
    totalPages: number;
  };
  sorting: {
    column: keyof T | null;
    direction: 'asc' | 'desc' | null;
  };
  pagination: {
    currentPage: number;
    itemsPerPage: number;
  };
  handleSort: (column: keyof T) => void;
  handlePageChange: (page: number) => void;
  handleItemsPerPageChange: (itemsPerPage: number) => void;
}

export function useTableState<T>({
  data,
  initialItemsPerPage = 25,
}: UseTableStateProps<T>): UseTableStateReturn<T> {
  // Estado de ordenação
  const [sorting, setSorting] = useState<{
    column: keyof T | null;
    direction: 'asc' | 'desc' | null;
  }>({
    column: null,
    direction: null,
  });

  // Estado de paginação
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: initialItemsPerPage,
  });

  // Reset para primeira página quando os dados mudarem
  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [data.length]);

  // Processar dados: ordenar e paginar
  const processedData = useMemo(() => {
    let result = [...data];

    // 1. Aplicar ordenação
    if (sorting.column) {
      result.sort((a, b) => {
        let aValue: any = a[sorting.column as keyof T];
        let bValue: any = b[sorting.column as keyof T];

        // Tratamento para valores nulos/undefined
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        // Tratamento especial para datas (verifica se é formato ISO ou data válida)
        if (
          typeof aValue === 'string' &&
          (aValue.includes('-') || aValue.includes('/')) &&
          dayjs(aValue).isValid()
        ) {
          aValue = dayjs(aValue).valueOf();
          bValue = dayjs(bValue).valueOf();
        }
        // Tratamento para booleans
        else if (typeof aValue === 'boolean') {
          aValue = aValue ? 1 : 0;
          bValue = bValue ? 1 : 0;
        }
        // Tratamento para strings (case-insensitive)
        else if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue?.toLowerCase() || '';
        }
        // Números já funcionam nativamente

        if (aValue < bValue) return sorting.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sorting.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // 2. Calcular dados de paginação
    const totalItems = result.length;
    const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);

    // 3. Aplicar paginação
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const paginatedData = result.slice(
      startIndex,
      startIndex + pagination.itemsPerPage
    );

    return { data: paginatedData, totalItems, totalPages };
  }, [data, sorting, pagination]);

  // Handler para ordenação
  const handleSort = (column: keyof T) => {
    setSorting((prev) => {
      if (prev.column === column) {
        // Ciclo: asc -> desc -> null (remove ordenação)
        if (prev.direction === 'asc') {
          return { column, direction: 'desc' };
        } else if (prev.direction === 'desc') {
          return { column: null, direction: null };
        }
      }
      return { column, direction: 'asc' };
    });
  };

  // Handler para mudança de página
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  // Handler para mudança de itens por página
  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setPagination({ currentPage: 1, itemsPerPage });
  };

  return {
    processedData,
    sorting,
    pagination,
    handleSort,
    handlePageChange,
    handleItemsPerPageChange,
  };
}

