"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

export default function DraftViewer({ show, onClose, draftText }) {
  if (!show) return null;

  return (
    <Modal show={show}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">AI Generated Draft</h2>
        <button onClick={onClose} className="text-gray-500 text-lg">✕</button>
      </div>

      <div className="max-h-[70vh] overflow-y-auto bg-gray-50 p-4 rounded border mb-4 whitespace-pre-line">
        {draftText}
      </div>

      <div className="flex justify-end gap-3">
        <Button
          className="bg-gray-800"
          onClick={() => {
            navigator.clipboard.writeText(draftText);
            alert("Draft copied to clipboard.");
          }}
        >
          Copy Draft
        </Button>

        <Button onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}
