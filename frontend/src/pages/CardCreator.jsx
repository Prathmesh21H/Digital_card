// src/pages/CardCreator.jsx
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import CardPreview from "../components/CardPreview";

const templates = [
  { id: "classic", name: "Classic", desc: "Clean & professional" },
  { id: "minimal", name: "Minimal", desc: "Simple & elegant" },
  { id: "bold", name: "Bold", desc: "Strong & eye-catching" },
];

const fonts = ["Inter", "Roboto", "Poppins"];

export default function CardCreator() {
  const { card, setCard } = useApp();
  const nav = useNavigate();

  const setColors = (k, v) =>
    setCard((p) => ({ ...p, colors: { ...p.colors, [k]: v } }));

  const setSections = (k, v) =>
    setCard((p) => ({ ...p, showSections: { ...p.showSections, [k]: v } }));

  const submit = (e) => {
    e.preventDefault();
    nav("/dashboard");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        {/* LEFT – CONTROLS */}
        <form
          onSubmit={submit}
          className="bg-white rounded-2xl shadow-sm border p-8 space-y-8"
        >
          <div>
            <h2 className="text-2xl font-bold">Customize your card</h2>
            <p className="text-sm text-gray-500">
              Personalize the look & feel of your digital identity
            </p>
          </div>

          {/* Templates */}
          <section>
            <h3 className="font-semibold mb-3">Template</h3>
            <div className="grid grid-cols-3 gap-3">
              {templates.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() =>
                    setCard((p) => ({ ...p, template: t.id }))
                  }
                  className={`rounded-xl border p-3 text-left transition ${
                    card.template === t.id
                      ? "border-blue-600 ring-2 ring-blue-100"
                      : "hover:border-gray-400"
                  }`}
                >
                  <p className="font-medium">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.desc}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Font */}
          <section>
            <h3 className="font-semibold mb-2">Font</h3>
            <select
              className="w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-blue-200"
              value={card.font}
              onChange={(e) =>
                setCard((p) => ({ ...p, font: e.target.value }))
              }
            >
              {fonts.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </section>

          {/* Colors */}
          <section>
            <h3 className="font-semibold mb-3">Colors</h3>
            <div className="grid grid-cols-3 gap-4">
              <Color label="Text" value={card.colors.primary} onChange={(v) => setColors("primary", v)} />
              <Color label="Accent" value={card.colors.accent} onChange={(v) => setColors("accent", v)} />
              <Color label="Background" value={card.colors.bg} onChange={(v) => setColors("bg", v)} />
            </div>
          </section>

          {/* Sections */}
          <section>
            <h3 className="font-semibold mb-3">Visible Sections</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(card.showSections).map(([k, val]) => (
                <label
                  key={k}
                  className="flex items-center justify-between rounded-xl border px-4 py-2 cursor-pointer hover:bg-gray-50"
                >
                  <span className="capitalize text-sm">{k}</span>
                  <input
                    type="checkbox"
                    checked={val}
                    onChange={(e) =>
                      setSections(k, e.target.checked)
                    }
                    className="accent-blue-600"
                  />
                </label>
              ))}
            </div>
          </section>

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => nav("/profile")}
              className="px-5 py-2 rounded-xl border hover:bg-gray-50"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"
            >
              Go to Dashboard →
            </button>
          </div>
        </form>

        {/* RIGHT – LIVE PREVIEW */}
        <div className="sticky top-24">
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <p className="text-sm text-gray-500 mb-4">
              Live Preview
            </p>
            <CardPreview />
          </div>
        </div>
      </div>
    </div>
  );
}

/* Color Picker Component */
function Color({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="mt-2 flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-10 rounded border cursor-pointer"
        />
        <span className="text-xs text-gray-500">{value}</span>
      </div>
    </label>
  );
}
