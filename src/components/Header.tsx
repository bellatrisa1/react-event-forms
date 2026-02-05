import React from "react";

type Props = {
  title: string;
  subtitle: string;
  query: string;
  onQuery: (v: string) => void;
  onCreate: () => void;
  showActions: boolean;
};

export default function Header({
  title,
  subtitle,
  query,
  onQuery,
  onCreate,
  showActions,
}: Props) {
  return (
    <header className="main-header">
      <div className="main-header-text">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      {showActions && (
        <div className="main-header-actions">
          <button className="btn btn-primary" type="button" onClick={onCreate}>
            <span className="icon" aria-hidden="true">
              ＋
            </span>
            <span>Новая форма</span>
          </button>

          <div className="search">
            <input
              type="text"
              className="search-input"
              placeholder="Поиск форм…"
              value={query}
              onChange={(e) => onQuery(e.target.value)}
            />
            <span className="search-icon" aria-hidden="true">
              ⌕
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
