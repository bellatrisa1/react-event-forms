import React, { useEffect, useMemo, useRef } from "react";
import type { FormItem } from "../types/types";
import { clamp } from "../types/utils";
import { regSeriesBase } from "../types/data";

type Props = {
  forms: FormItem[];
  totalParticipants: number;
  avgRating: number;
  standalone?: boolean;
};

export default function AnalyticsSection({
  forms,
  totalParticipants,
  avgRating,
  standalone = false,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const rows = useMemo(() => {
    return [...forms].sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
  }, [forms]);

  const series = useMemo(() => {
    const influence = clamp(Math.round(totalParticipants / 10), 0, 20);
    return regSeriesBase.map(
      (v, i) => v + Math.round(influence * (i / (regSeriesBase.length - 1))),
    );
  }, [totalParticipants]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    const w = parent?.clientWidth ?? 500;
    const h = parent?.clientHeight ?? 160;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const pad = 12;
    const innerW = w - pad * 2;
    const innerH = h - pad * 2;

    const minV = Math.min(...series);
    const maxV = Math.max(...series);
    const range = Math.max(1, maxV - minV);

    ctx.globalAlpha = 0.85;
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#e5e7eb";

    for (let x = 0; x <= 6; x++) {
      const xx = pad + (innerW * x) / 6;
      ctx.beginPath();
      ctx.moveTo(xx, pad);
      ctx.lineTo(xx, pad + innerH);
      ctx.stroke();
    }
    for (let y = 0; y <= 4; y++) {
      const yy = pad + (innerH * y) / 4;
      ctx.beginPath();
      ctx.moveTo(pad, yy);
      ctx.lineTo(pad + innerW, yy);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#7c3aed";
    ctx.beginPath();
    series.forEach((v, i) => {
      const t = i / (series.length - 1);
      const x = pad + innerW * t;
      const y = pad + innerH * (1 - (v - minV) / range);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.fillStyle = "#7c3aed";
    series.forEach((v, i) => {
      const t = i / (series.length - 1);
      const x = pad + innerW * t;
      const y = pad + innerH * (1 - (v - minV) / range);
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [series]);

  return (
    <section className={standalone ? "" : "analytics"}>
      {!standalone && (
        <>
          <h2 className="section-title">
            <span className="icon icon-violet" aria-hidden="true">
              📊
            </span>
            <span>Аналитика форм</span>
          </h2>
          <p className="section-subtitle">Статистика по вашим мероприятиям</p>
        </>
      )}

      <div className="analytics-layout">
        <div className="analytics-stats">
          <div className="stat-card stat-card--violet">
            <div className="stat-header">
              <span className="icon icon-violet" aria-hidden="true">
                👥
              </span>
              <span>Всего участников</span>
            </div>
            <div className="stat-value">{totalParticipants}</div>
          </div>

          <div className="stat-card stat-card--orange">
            <div className="stat-header">
              <span className="icon icon-orange" aria-hidden="true">
                ⭐
              </span>
              <span>Средний рейтинг</span>
            </div>
            <div className="stat-value">{avgRating}</div>
          </div>
        </div>

        <div className="analytics-chart card">
          <div className="chart-header">
            <span className="icon" aria-hidden="true">
              📈
            </span>
            <span>Динамика регистраций</span>
          </div>
          <div className="chart-placeholder">
            <canvas ref={canvasRef} />
          </div>
        </div>
      </div>

      <div className="card table-wrapper">
        <table className="forms-table">
          <thead>
            <tr>
              <th>Форма</th>
              <th>Ответы</th>
              <th>Дата создания</th>
              <th>Последний ответ</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((f) => (
              <tr key={f.id}>
                <td
                  className={
                    f.theme === "orange"
                      ? "cell-highlight-orange"
                      : "cell-highlight-violet"
                  }
                >
                  {f.title}
                </td>
                <td>{f.responses}</td>
                <td>{toRuDate(f.createdAt)}</td>
                <td>{toRuDate(f.lastResponseAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function toRuDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${d}.${m}.${y}` : iso;
}
