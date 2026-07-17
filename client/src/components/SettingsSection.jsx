import React from 'react';

/**
 * SettingsSection
 * Implements a split layout typical of premium developer platforms (Vercel, Linear, GitHub).
 * Renders a left column with the section title and description, and a right column for input cards.
 */
export const SettingsSection = ({ title, description, children }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-8 border-b border-white/5 first:pt-0 last:border-b-0 animate-fadeInUp">
      {/* Left Column: Title & Description */}
      <div className="lg:col-span-4 space-y-1">
        <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-[#FFFFFF] mt-1">
          {title}
        </h3>
        {description && (
          <p className="text-[10px] font-sans font-medium text-[#9AA4B2] leading-relaxed max-w-sm">
            {description}
          </p>
        )}
      </div>

      {/* Right Column: Configuration Content Area */}
      <div className="lg:col-span-8 space-y-4">
        {children}
      </div>
    </div>
  );
};

export default SettingsSection;
