import React from "react";
import type { SortKey } from "../types/types";

type Props = {
  count: number;
  sort: SortKey;
  onSort: (v: SortKey) => void;
};

export default function FormsToolbar({ count, sort, onSort }: Props) {
  return (
    <div className="forms-toolbar">
      <div className="forms-count">
        Всего форм: <span>{count}</span>
      </div>

      <div className="forms-sort">
        <label htmlFor="sort">Сортировать:</label>
        <select
          id="sort"
          className="sort-select"
          value={sort}
          onChange={(e) => onSort(e.target.value as SortKey)}
        >
          <option value="date">По дате</option>
          <option value="alpha">По алфавиту</option>
          <option value="responses">По количеству ответов</option>
        </select>
      </div>
    </div>
  );
}
