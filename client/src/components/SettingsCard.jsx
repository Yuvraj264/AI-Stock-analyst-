import React from 'react';

/**
 * SettingsCard
 * Container card for grouped settings inputs. Fits inside SettingsSection content.
 * Styled with Graphite system colors: background #1E232D, border rgba(255,255,255,0.06).
 */
export const SettingsCard = ({ title, description, children, footer }) => {
  return (
    <div className="bg-[#1E232D] border border-white/5 rounded-xl shadow-lg overflow-hidden transition-all duration-150">
      {/* Header Area */}
      {(title || description) && (
        <div className="p-4 border-b border-white/5 bg-[#171A21]/30">
          {title && (
            <h4 className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#FFFFFF]">
              {title}
            </h4>
          )}
          {description && (
            <p className="text-[9px] font-sans font-medium text-[#9AA4B2] mt-0.5">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Body Area */}
      <div className="p-5 space-y-4">
        {children}
      </div>

      {/* Footer Area */}
      {footer && (
        <div className="px-5 py-3.5 bg-[#0F1115]/30 border-t border-white/5 flex items-center justify-between">
          {footer}
        </div>
      )}
    </div>
  );
};

export default SettingsCard;
