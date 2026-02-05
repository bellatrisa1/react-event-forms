import React from "react";
import "./App.scss";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import FormsToolbar from "./components/FormsToolbar";
import FormCard from "./components/FormCard";
import AnalyticsSection from "./components/AnalyticsSection";
import FormModal from "./components/FormModal";

import { useEventForms } from "./hooks/useEventForms";

export default function App() {
  const vm = useEventForms();

  return (
    <div className="app">
      <Sidebar active={vm.activeNav} onNav={vm.setActiveNav} />

      <main className="main">
        <Header
          title={
            vm.activeNav === "forms"
              ? "Мои формы"
              : vm.activeNav === "analytics"
                ? "Аналитика"
                : "Профиль"
          }
          subtitle={
            vm.activeNav === "forms"
              ? "Управляйте регистрациями на ваши мероприятия"
              : vm.activeNav === "analytics"
                ? "Статистика по вашим мероприятиям"
                : "Настройки и данные аккаунта"
          }
          query={vm.query}
          onQuery={vm.setQuery}
          onCreate={vm.openCreate}
          showActions={vm.activeNav === "forms"}
        />

        <section className="content">
          {vm.activeNav === "forms" && (
            <>
              <FormsToolbar
                count={vm.filtered.length}
                sort={vm.sort}
                onSort={vm.setSort}
              />

              <div className="forms-grid">
                {vm.filtered.map((f) => (
                  <FormCard
                    key={f.id}
                    form={f}
                    onEdit={() => vm.openEdit(f)}
                    onAnalytics={vm.goAnalytics}
                    onClone={() => vm.cloneForm(f)}
                    onDelete={() => vm.removeForm(f.id)}
                  />
                ))}
              </div>

              <AnalyticsSection
                forms={vm.forms}
                totalParticipants={vm.totals.totalParticipants}
                avgRating={vm.totals.avgRating}
              />
            </>
          )}

          {vm.activeNav === "analytics" && (
            <AnalyticsSection
              forms={vm.forms}
              totalParticipants={vm.totals.totalParticipants}
              avgRating={vm.totals.avgRating}
              standalone
            />
          )}

          {vm.activeNav === "profile" && (
            <div className="card profile-card">
              <h2 className="section-title">Профиль</h2>
              <p className="section-subtitle">
                Здесь можно разместить настройки аккаунта. (Мок-экран)
              </p>
              {/* ...как у тебя */}
            </div>
          )}
        </section>
      </main>

      <FormModal
        open={vm.modal.open}
        mode={vm.modal.mode}
        form={vm.modal.open && vm.modal.mode === "edit" ? vm.modal.form : null}
        onClose={vm.closeModal}
        onSubmit={vm.upsertForm}
      />
    </div>
  );
}
