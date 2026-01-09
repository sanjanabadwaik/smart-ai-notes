import SectionTitle from "../components/SectionTitle";
import React from "react";

const toggles = [
  {
    id: "email-alerts",
    label: "Email alerts",
    description: "Get notified when new summaries finish.",
  },
  {
    id: "community-share",
    label: "Auto-share to community",
    description: "Publish notes after manual review.",
  },
  {
    id: "dark-mode",
    label: "Default to dark mode",
    description: "Start every session in dark theme.",
  },
];

const Settings = () => {
  return (
    <div className="space-y-10 text-gray-900">
      <SectionTitle
        eyebrow="Settings"
        title="Customize your lecture lab"
        description="Manage integrations, preferences, and AI usage."
      />

      {/* Preferences & Integrations */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Preferences */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
            Preferences 
          </p>

          <div className="mt-5 space-y-3">
            {toggles.map((toggle) => (
              <label
                key={toggle.id}
                className="flex items-start gap-4 rounded-2xl border border-gray-200
                           p-4 hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  defaultChecked
                  className="mt-1 size-5 accent-indigo-600"
                />

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {toggle.label}
                  </p>
                  <p className="text-sm text-gray-500">
                    {toggle.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Integrations */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
            Integrations
          </p>

          <div className="mt-5 space-y-3">
            {[
              { label: "Canvas LMS", status: "Connected" },
              { label: "Google Drive", status: "Ready to connect" },
              { label: "Notion Workspace", status: "Connected" },
            ].map((integration) => (
              <div
                key={integration.label}
                className="flex items-center justify-between rounded-2xl
                           border border-gray-200 px-4 py-3 hover:bg-gray-50"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {integration.label}
                  </p>
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
                    {integration.status}
                  </p>
                </div>

                <button
                  className="rounded-full border border-gray-300 px-4 py-2
                             text-xs font-semibold uppercase tracking-[0.25em]
                             text-gray-700 hover:border-indigo-500 hover:text-indigo-600"
                >
                  Manage
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Usage */}
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
          Usage
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            {
              label: "AI minutes",
              value: "480 / 600",
              helper: "Reset in 3 days",
            },
            {
              label: "Slides processed",
              value: "82 decks",
              helper: "+12 this week",
            },
            {
              label: "Q&A generated",
              value: "640 prompts",
              helper: "Premium tier unlocked",
            },
          ].map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-gray-200 p-5 hover:bg-gray-50"
            >
              <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
                {metric.label}
              </p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {metric.value}
              </p>
              <p className="text-sm text-indigo-600">
                {metric.helper}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Settings;
