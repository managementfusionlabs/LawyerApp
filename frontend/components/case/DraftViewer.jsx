"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

export default function DraftViewer({ show, onClose, draftText }) {
  if (!show) return null;

  return (
    <Modal show={show}>
        <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold font-serif text-[#0B1C39]">AI Generated Draft</h2>
        <button onClick={onClose} className="text-gray-500 text-lg rounded-full p-2 transition-all duration-200 transform-gpu hover:scale-105 hover:bg-[#D4A017] hover:text-[#0B1C39] hover:shadow-md focus:outline-none" aria-label="Close draft viewer">
          ✕
        </button>
      </div>

      <div className="max-h-[70vh] overflow-y-auto bg-gray-50 p-4 rounded border mb-4 whitespace-pre-line">
        {draftText}
      </div>

      <div className="flex justify-end gap-3">
        <Button
          variant="primary"
          onClick={() => {
            navigator.clipboard.writeText(draftText);
            alert("Draft copied to clipboard.");
          }}
        >
          Copy Draft
        </Button>

        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}
