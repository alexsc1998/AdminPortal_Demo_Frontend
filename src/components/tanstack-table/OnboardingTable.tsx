"use client";
import React, { useRef } from "react";
import Link from "next/link";
import Table from "./Table";
import {
  SysMaintenance,
  completeMntLogs,
  deleteMntLog,
} from "../../service/system-maintenance";
import { FiCheckCircle, FiCircle } from "react-icons/fi";
import { usePermission } from "@/hooks/usePermission";
import Swal from "sweetalert2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Onboarding, deleteObdLog } from "@/service/onboarding";
import { onboardingColumns } from "@/lib/onboarding-columns";
import QRCode from "react-qr-code";
import crypto from "crypto";
import CryptoJS from "crypto-js";
import Modal from "@/components/Modal";
import html2canvas from "html2canvas";
import { API_URL, DOMAIN_URL } from "@/lib/config";

const Qrcode = ({ obd }: { obd: Onboarding }) => {
  const [visible, setVisible] = useState(false);
  const smallQrRef = useRef(null);
  const bigQrRef = useRef(null);
  const qrValue = DOMAIN_URL + `/portal/onboarding/check/${obd.qrcode}`;

  console.log(qrValue);

  const handleDownload = () => {
    const qrCodeElement = bigQrRef.current;

    if (qrCodeElement) {
      html2canvas(qrCodeElement).then(function (canvas) {
        // Convert the canvas to a data URL
        const dataUrl = canvas.toDataURL("image/png");

        // Create a download link for the image
        const downloadLink = document.createElement("a");
        downloadLink.href = dataUrl;
        downloadLink.download = "qrcode.png"; // Specify the file name
        downloadLink.click();
      });
    }
  };

  return (
    <>
      <div ref={smallQrRef}>
        <QRCode
          value={qrValue}
          size={100}
          onClick={() => setVisible(true)}
          className="cursor-pointer"
        />
      </div>
      {visible && (
        <Modal
          title="Scan QR Code"
          message={
            <div ref={bigQrRef}>
              <QRCode
                value={qrValue}
                size={360}
                onClick={() => setVisible(false)}
              />
            </div>
          }
          onClick={() => setVisible(false)}
          footer={
            <>
              <button
                onClick={() => handleDownload()}
                className="px-4 py-1.5 rounded text-center font-normal text-lg text-white bg-blue-500 hover:bg-blue-600 mr-2"
              >
                Download
              </button>
              <button
                onClick={() => setVisible(false)}
                className="px-4 py-1.5 w-20 rounded text-center font-normal text-lg text-white bg-blue-500 hover:bg-blue-600 mr-2"
              >
                OK
              </button>
            </>
          }
        />
      )}
    </>
  );
};

const Actions = ({ obd }: { obd: Onboarding }) => {
  const { id } = obd;

  const queryClient = useQueryClient();

  const deleteMut = useMutation({
    mutationFn: deleteObdLog,
    onSuccess: async (data) => {
      if ("error" in data) {
        await Swal.fire({
          title: "Error!",
          text: data.error,
          icon: "error",
        });
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["onboarding"] });
    },
  });

  const handleDeleteClick = async () => {
    await Swal.fire({
      title: "Confirmation",
      text: "Are you sure you want to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        deleteMut.mutate({ id });
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      {obd.used == false && (
        <>
          <Link
            href={`/portal/onboarding/edit/${id}`}
            className="text-blue-500"
          >
            Edit
          </Link>
          <span
            onClick={handleDeleteClick}
            className="text-blue-500 cursor-pointer"
          >
            Delete
          </span>
        </>
      )}
    </div>
  );
};

const actions = (obd: Onboarding) => <Actions obd={obd} />;
const qrcode = (obd: Onboarding) => <Qrcode obd={obd} />;

export default function OnboardingTable({
  data,
  hide,
  onClick,
}: {
  data: Onboarding[];
  hide: boolean;
  onClick: () => void;
}) {
  return (
    <Table
      data={data}
      hide={hide}
      onClick={onClick}
      columns={onboardingColumns(qrcode, actions)}
      route="/portal/onboarding/request"
    />
  );
}
