"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type TicketType = "senai" | "sesi";

function formatDateBR(value: string) {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
}

export default function HomePage() {
    const [date, setDate] = useState("");
    const [ticketType, setTicketType] = useState<TicketType>("senai");

    const formattedDate = useMemo(() => formatDateBR(date), [date]);

    const ticketImage =
        ticketType === "senai" ? "/ticket-senai.png" : "/ticket-sesi.png";

    const ticketName = ticketType === "senai" ? "SENAI" : "SESI";

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
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

        const fileName = `Ticket ${ticketName} - ${formattedDate.replaceAll("/", "-")}.pdf`;

        pdf.save(fileName);
    };

    return (
        <main className="min-h-screen bg-red-50 p-4 md:p-6 print:bg-white">
            <div className="mx-auto max-w-5xl">
                <div className="mb-6 rounded-2xl bg-white p-5 shadow print:hidden md:p-6">
                    <h1 className="mb-2 text-2xl font-bold text-red-700">
                        Gerador de Ticket
                    </h1>

                    <p className="mb-4 text-sm text-gray-500">
                        Cada PDF gerado possui 18 tickets por página.
                    </p>

                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                        <select
                            value={ticketType}
                            onChange={(e) => setTicketType(e.target.value as TicketType)}
                            className="w-full rounded-lg border px-3 py-2 sm:w-auto"
                        >
                            <option value="senai">Ticket SENAI</option>
                            <option value="sesi">Ticket SESI</option>
                        </select>

                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full rounded-lg border px-3 py-2 sm:w-auto"
                        />

                        <button
                            onClick={handleDownloadPDF}
                            className="w-full cursor-pointer rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700 sm:w-auto"
                        >
                            Gerar impressão / PDF
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto md:overflow-visible">
                    <section
                        id="print-area"
                        className="mx-auto grid w-fit min-w-[720px] grid-cols-3 gap-3 bg-white p-2"
                    >
                        {Array.from({ length: 18 }).map((_, index) => (
                            <div key={index} className="relative h-[140px] w-[230px]">
                                <Image
                                    src={ticketImage}
                                    alt={`Ticket ${ticketName}`}
                                    fill
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
            </div>
        </main>
    );
}