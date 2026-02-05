import { useEffect, useMemo, useState } from "react";
import { initialForms } from "../types/data";
import { safeParseJSON, uid } from "../types/utils";
import type { FormDraft, FormItem, NavKey, SortKey } from "../types/types";

const LS_KEY = "eventforms:v1";

type ModalState =
  | { open: false; mode: "create" | "edit"; form: FormItem | null }
  | { open: true; mode: "create"; form: null }
  | { open: true; mode: "edit"; form: FormItem };

export function useEventForms() {
  const [activeNav, setActiveNav] = useState<NavKey>("forms");

  const [forms, setForms] = useState<FormItem[]>(() => {
    const saved = safeParseJSON<FormItem[] | null>(
      localStorage.getItem(LS_KEY),
      null,
    );
    return Array.isArray(saved) && saved.length ? saved : initialForms;
  });

  const [query, setQuery] = useState<string>("");
  const [sort, setSort] = useState<SortKey>("date");

  const [modal, setModal] = useState<ModalState>({
    open: false,
    mode: "create",
    form: null,
  });

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(forms));
  }, [forms]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = forms.filter((f) => f.title.toLowerCase().includes(q));

    if (sort === "alpha") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title, "ru"));
    } else if (sort === "responses") {
      list = [...list].sort((a, b) => b.responses - a.responses);
    } else {
      list = [...list].sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
    }

    return list;
  }, [forms, query, sort]);

  const totals = useMemo(() => {
    const totalParticipants = forms.reduce(
      (s, f) => s + (Number(f.responses) || 0),
      0,
    );
    const avgRating = 4.8;
    return { totalParticipants, avgRating };
  }, [forms]);

  // Actions
  function openCreate() {
    setModal({ open: true, mode: "create", form: null });
  }

  function openEdit(form: FormItem) {
    setModal({ open: true, mode: "edit", form });
  }

  function closeModal() {
    setModal((m) => ({ ...m, open: false }));
  }

  function upsertForm(payload: FormDraft) {
    if (modal.open && modal.mode === "create") {
      const newForm: FormItem = {
        id: uid(),
        title: payload.title,
        theme: payload.theme,
        responses: payload.responses ?? 0,
        createdAt: payload.createdAt,
        lastResponseAt: payload.lastResponseAt,
        updatedAt: Date.now(),
      };
      setForms((prev) => [newForm, ...prev]);
    } else {
      setForms((prev) =>
        prev.map((f) =>
          f.id === payload.id
            ? {
                ...f,
                ...payload,
                responses: Number(payload.responses) || 0,
                updatedAt: Date.now(),
              }
            : f,
        ),
      );
    }
    closeModal();
  }

  function cloneForm(form: FormItem) {
    const cloned: FormItem = {
      ...form,
      id: uid(),
      title: `${form.title} (копия)`,
      updatedAt: Date.now(),
    };
    setForms((prev) => [cloned, ...prev]);
  }

  function removeForm(id: string) {
    setForms((prev) => prev.filter((f) => f.id !== id));
  }

  function goAnalytics() {
    setActiveNav("analytics");
  }

  return {
    // state
    activeNav,
    forms,
    query,
    sort,
    modal,

    // derived
    filtered,
    totals,

    // setters
    setActiveNav,
    setQuery,
    setSort,

    // actions
    openCreate,
    openEdit,
    closeModal,
    upsertForm,
    cloneForm,
    removeForm,
    goAnalytics,
  };
}
