import { LanguageContext } from "@locales/LanguageContext";
import { RR } from "@locales/R";
import { QueryPaging } from "@models/QueryPaging";
import { useContext } from "react";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from "react-icons/fa";

import { Button } from "ui/Button";
import { generatePrimitive, Select } from "ui/Select";
import { classnames } from "ui/shared";

export interface PagedResponse<T> {
  paging: QueryPaging;
  items: Array<T>;
}
interface PagingProps<T> {
  paging: QueryPaging;
  onValue: (paging: QueryPaging) => void;
  className?: string;
}

const pageSizes = generatePrimitive([10, 20, 30, 40, 50].map(String));
const getTotalPages = (total: number, pageSize: number) => Math.ceil(total / pageSize);

export const Paging = <T,>(props: PagingProps<T>) => {
  const { language } = useContext(LanguageContext);

  const { paging, onValue, className } = props;
  const total = paging.total ?? 0;
  const totalPages = getTotalPages(total, paging.pageSize);
  const startItem = (paging.page - 1) * paging.pageSize + 1;
  const endItem = Math.min(paging.page * paging.pageSize, total);

  const setPageSize = (pageSize: string | number) => {
    const newPageSize = Number(pageSize);
    const newTotalPages = getTotalPages(total, newPageSize);
    const newPage = newTotalPages < paging.page ? newTotalPages : paging.page;
    onValue({ ...paging, page: newPage, pageSize: newPageSize });
  };

  const hasNextPage = paging.page < totalPages;
  const hasPreviousPage = paging.page > 1;

  const setPage = (page: string | number) => {
    const newPage = Number(page);
    const newFilter = { ...paging, page: newPage };
    onValue(newFilter);
  };
  const nextPage = () => {
    setPage(paging.page + 1);
  };
  const prevPage = () => {
    setPage(paging.page - 1);
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
      <Select sm options={pageSizes} value={paging.pageSize.toString()} onValue={(_, v) => setPageSize(v!)} width="min-w-[5rem]" />
    </div>
  );
};
