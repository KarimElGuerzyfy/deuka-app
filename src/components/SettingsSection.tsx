import React from 'react';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
  id?: string; // Add this
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children, id }) => {
  return (
    <section className="mb-8" id={id}>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
        {title}
      </h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {children}
      </div>
    </section>
  );
};