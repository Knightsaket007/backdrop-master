import fonts from '@/app/font/font.json';
import { LockKeyhole } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
// import Head from 'next/head';


type FontSelectorProps = {
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  isPremiumUser?: boolean;
};

const FontSelector = ({ selectedFont, setSelectedFont, isPremiumUser = false }: FontSelectorProps) => (
  <>

    <Select value={selectedFont} onValueChange={setSelectedFont}>
      <SelectTrigger className="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 text-white">
        <SelectValue placeholder="Select Font" style={{ fontFamily: selectedFont }} />
        
      </SelectTrigger>

      <SelectContent className="bg-gray-800 border-b-slate-400">
        {fonts.map((font) => (
          <SelectItem
            key={font.value}
            value={font.value}
            disabled={font.premium && !isPremiumUser}
            className={`flex items-center justify-between px-3 py-2 rounded-md text-white ${font.premium && !isPremiumUser ? 'text-purple-300' : ''
              }`}
            style={{ fontFamily: font.value }}
          >
            <div className="flex items-center justify-between w-full">
              <span style={{ fontFamily: font.value }}>{font.label}</span>
              {font.premium && !isPremiumUser && <LockKeyhole size={16} className="ml-2" />}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </>
);

export default FontSelector;
