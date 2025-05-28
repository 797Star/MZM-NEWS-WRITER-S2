import React from 'react';

const DisclaimerMessage: React.FC = () => {
  return (
    <div className="w-full flex justify-center mt-8 mb-2">
      <div
        className="bg-stone-50 border border-stone-200 rounded-sm px-4 py-2 shadow-sm"
        style={{ maxWidth: 600 }}
        role="note"
        aria-label="disclaimer"
      >
        <p
          className="text-xs text-neutral-500 text-center italic font-serif leading-relaxed"
          style={{ fontSize: '0.85rem', lineHeight: '1.5' }}
        >
          သတင်းပါ အချက်အလက်များသည် <span className="font-semibold text-neutral-600">Google Fact Check</span> နှင့် <span className="font-semibold text-neutral-600">AP Fact Check</span> တို့မှ စစ်ဆေးအတည်ပြုပြီးသော အချက်အလက်များအပေါ် အခြေခံပါသည်။
        </p>
      </div>
    </div>
  );
};

export default DisclaimerMessage;