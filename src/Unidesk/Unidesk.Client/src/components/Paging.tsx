import { LanguageContext } from "@locales/LanguageContext";
import { RR } from "@locales/R";
import { QueryFilter } from "@models/QueryFilter";
import { useContext } from "react";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from "react-icons/fa";

import { Button } from "ui/Button";
import { generatePrimitive, Select } from "ui/Select";
import { classnames } from "ui/shared";

export interface PagedResponse<T> {
  filter: QueryFilter;
  items: Array<T>;
}
interface PagingProps<T> {
  filter: QueryFilter;
  onValue: (filter: QueryFilter) => void;
  className?: string;
}

const pageSizes = generatePrimitive([10, 20, 30, 40, 50].map(String));
const getTotalPages = (total: number, pageSize: number) => Math.ceil(total / pageSize);

export const Paging = <T,>(props: PagingProps<T>) => {
  const { language } = useContext(LanguageContext);

  const { filter, onValue, className } = props;
  const total = filter.total ?? 0;
  const totalPages = getTotalPages(total, filter.pageSize);
  const startItem = (filter.page - 1) * filter.pageSize + 1;
  const endItem = Math.min(filter.page * filter.pageSize, total);

  const setPageSize = (pageSize: string | number) => {
    const newPageSize = Number(pageSize);
    const newTotalPages = getTotalPages(total, newPageSize);
    const newPage = newTotalPages < filter.page ? newTotalPages : filter.page;
    onValue({ ...filter, page: newPage, pageSize: newPageSize });
  };

  const hasNextPage = filter.page < totalPages;
  const hasPreviousPage = filter.page > 1;

  const setPage = (page: string | number) => {
    const newPage = Number(page);
    const newFilter = { ...filter, page: newPage };
    onValue(newFilter);
  };
  const nextPage = () => {
    setPage(filter.page + 1);
  };
  const prevPage = () => {
    setPage(filter.page - 1);
  };

  const firstPage = () => {
    setPage(1);
  };
  const lastPage = () => {
    setPage(totalPages);
  };

  return (
    <div className={classnames("flex items-stretch gap-1", className)}>
      <div className="flex items-stretch gap-1 rounded border border-solid border-neutral-400 bg-white/80">
        <Button sm text onClick={firstPage} disabled={!hasPreviousPage}>
          <FaAngleDoubleLeft className="text-base" />
        </Button>
        <Button sm text onClick={prevPage} disabled={!hasPreviousPage}>
          <FaAngleLeft className="text-base" />
        </Button>
        <span className="grid select-none place-items-center whitespace-nowrap text-sm font-semibold">
          {startItem} - {endItem} {RR("page-of", language)} {total}
        </span>
        <Button sm text onClick={nextPage} disabled={!hasNextPage}>
          <FaAngleRight className="text-base" />
        </Button>
        <Button sm text onClick={lastPage} disabled={!hasNextPage}>
          <FaAngleDoubleRight className="text-base" />
        </Button>
      </div>
      <Select sm options={pageSizes} value={filter.pageSize.toString()} onValue={(_, v) => setPageSize(v!)} width="min-w-[5rem]" />
    </div>
  );
};
