import React from "react";
import type { FormItem } from "../types/types";
import { formatRelativeRu } from "../types/utils";
import { cn } from "../types/utils";

type Props = {
  form: FormItem;
  onEdit: () => void;
  onAnalytics: () => void;
  onClone: () => void;
  onDelete: () => void;
};

export default function FormCard({
  form,
  onEdit,
  onAnalytics,
  onClone,
  onDelete,
}: Props) {
  const meta = `${form.responses} ответов • обновлено: ${formatRelativeRu(form.updatedAt)}`;

  return (
    <article className="form-card">
      <div className="form-card-header">
        <div
          className={cn(
            "form-card-icon",
            form.theme === "orange"
              ? "form-card-icon--orange"
              : "form-card-icon--violet",
          )}
        >
          <span className="icon" aria-hidden="true">
            {form.theme === "orange" ? "🟧" : "🟪"}
          </span>
        </div>
        <span className="form-card-title">{form.title}</span>
      </div>

      <div className="form-card-meta">{meta}</div>

      <div className="form-card-actions">
        <button className="btn btn-secondary" type="button" onClick={onEdit}>
          <span className="icon" aria-hidden="true">
            ✎
          </span>
          <span>Редактировать</span>
        </button>

        <button
          className="btn btn-secondary"
          type="button"
          onClick={onAnalytics}
        >
          <span className="icon" aria-hidden="true">
            📊
          </span>
          <span>Аналитика</span>
        </button>

        <button className="btn btn-secondary" type="button" onClick={onClone}>
          <span className="icon" aria-hidden="true">
            ⧉
          </span>
          <span>Клонировать</span>
        </button>

        <button
          className="btn btn-danger"
          type="button"
          onClick={() => {
            if (confirm(`Удалить форму «${form.title}»?`)) onDelete();
          }}
        >
          <span className="icon" aria-hidden="true">
            🗑
          </span>
          <span>Удалить</span>
        </button>
      </div>
    </article>
  );
}
