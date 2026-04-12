"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function formatDateBR(value: string) {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
}

export default function HomePage() {
    const [date, setDate] = useState("");

    const formattedDate = useMemo(() => formatDateBR(date), [date]);

    const handleDownloadPDF = async () => {
        if (!date) {
            alert("Selecione uma data antes de gerar o PDF.");
            return;
        }

        const element = document.getElementById("print-area");

        if (!element) return;

        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");

        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

        const fileName = `Ticket - ${formattedDate.replaceAll("/", "-")}.pdf`;

        pdf.save(fileName);
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
                            onClick={handleDownloadPDF}
                            className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white cursor-pointer"
                        >
                            Gerar impressão / PDF
                        </button>
                    </div>
                </div>

                <section id="print-area" className="mx-auto grid w-fit grid-cols-3 gap-3">
                    {Array.from({ length: 18 }).map((_, index) => (
                        <div key={index} className="relative h-[140px] w-[230px]">
                            <Image
                                src="/ticket-senai.png"
                                alt="Ticket SENAI"
                                fill
                                sizes=""
                                className="object-contain"
                                priority
                            />

                            <span className="absolute left-1/2 top-[80px] z-10 -translate-x-1/2 text-[20px] font-bold text-black">
                                {formattedDate || "__/__/____"}
                            </span>
                        </div>
                    ))}
                </section>
            </div>
        </main>
    );
}