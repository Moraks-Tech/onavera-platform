"use client";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { E164Number } from "libphonenumber-js";

interface PhoneInputProps {
  value: E164Number | undefined;
  onChange: (value: E164Number | undefined) => void;
  required?: boolean;
}

export default function CustomPhoneInput({ value, onChange, required }: PhoneInputProps) {
  return (
    <div className="w-full text-slate-900">
      <PhoneInput
        international
        defaultCountry="NG"
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 py-2 border border-slate-300 rounded-md focus-within:ring-2 focus-within:ring-[#1E40AF] outline-none transition-colors bg-white"
        numberInputProps={{
          className: "outline-none bg-transparent w-full text-slate-900 placeholder:text-slate-400",
        }}
      />
      <style jsx global>{`
        /* Force the dropdown text to be clear */
        .PhoneInputCountrySelect {
          color: #0f172a;
          background-color: #f8fafc;
          border-radius: 4px;
          padding: 2px;
        }
        /* Ensure the flag doesn't break layout */
        .PhoneInputCountryIcon {
          width: 1.5rem;
          height: 1rem;
        }
      `}</style>
    </div>
  );
}