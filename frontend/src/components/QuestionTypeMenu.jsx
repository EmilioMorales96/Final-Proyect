import React from "react";
import {
  MdShortText, MdSubject, MdRadioButtonChecked, MdCheckBox, MdArrowDropDownCircle,
  MdCloudUpload, MdLinearScale, MdStar, MdApps, MdGridOn, MdDateRange, MdAccessTime
} from "react-icons/md";

const QUESTION_TYPES = [
  { type: "short", label: "Short Text", icon: MdShortText },
  { type: "paragraph", label: "Paragraph", icon: MdSubject },
  { type: "multiple", label: "Multiple", icon: MdRadioButtonChecked },
  { type: "checkbox", label: "Checkbox", icon: MdCheckBox },
  { type: "dropdown", label: "Dropdown", icon: MdArrowDropDownCircle },
  { type: "file", label: "File", icon: MdCloudUpload },
  { type: "linear", label: "Linear Scale", icon: MdLinearScale },
  { type: "rating", label: "Rating", icon: MdStar, badge: "New" },
  { type: "grid", label: "Grid", icon: MdApps },
  { type: "checkboxGrid", label: "Checkbox Grid", icon: MdGridOn },
  { type: "date", label: "Date", icon: MdDateRange },
  { type: "time", label: "Time", icon: MdAccessTime },
];

export default function QuestionTypeMenu({ onSelect, onClose }) {
  return (
    <div className="absolute z-50 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 py-2">
      {QUESTION_TYPES.map(q => (
        <button
          key={q.type}
          className="flex items-center w-full px-4 py-2 hover:bg-violet-100 transition group"
          onClick={() => { onSelect(q.type); onClose(); }}
          type="button"
        >
          <q.icon className="text-xl text-violet-600 mr-3" />
          <span className="flex-1 text-left">{q.label}</span>
          {q.badge && (
            <span className="ml-2 bg-violet-600 text-white text-xs rounded px-2 py-0.5">New</span>
          )}
        </button>
      ))}
    </div>
  );
}