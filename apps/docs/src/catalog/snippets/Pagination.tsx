import { useState } from "react";
import { Pagination } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
export function Example() {
  const [page, setPage] = useState(1);
  return <Pagination page={page} pageCount={12} onPageChange={setPage} />;
}
