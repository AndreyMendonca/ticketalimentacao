"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

function formatDateBR(value: string) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

export default function HomePage() {
  const [date, setDate] = useState("");

  const formattedDate = useMemo(() => formatDateBR(date), [date]);

  const handlePrint = () => {
    if (!date) {
      alert("Selecione uma data antes de imprimir.");
      return;
    }

    window.print();
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6 print:bg-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 rounded-2xl bg-white p-6 shadow print:hidden">
          <h1 className="mb-4 text-2xl font-bold">Gerador de Ticket</h1>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-lg border px-3 py-2"
            />

            <button
              onClick={handlePrint}
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white"
            >
              Gerar impressão / PDF
            </button>
          </div>
        </div>

        <section className="mx-auto grid w-fit grid-cols-3 gap-3">
          {Array.from({ length: 21 }).map((_, index) => (
            <div key={index} className="relative h-[140px] w-[230px]">
              <Image
                src="/ticket-senai.png"
                alt="Ticket SENAI"
                fill
                className="object-contain"
                priority
              />

              <span className="absolute left-1/2 top-[85px] z-10 -translate-x-1/2 text-[20px] font-bold text-black">
                {formattedDate || "__/__/____"}
              </span>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}