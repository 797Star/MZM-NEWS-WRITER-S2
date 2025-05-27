import React, { useState, useCallback } from 'react';
import { UI_STRINGS_MY } from '../constants';
import pdfParse from 'pdf-parse'; 
import mammoth from 'mammoth';

interface FileInputProps {
  onFileProcessed: (content: string) => void;
  onError: (message: string) => void;
}

const FileInput: React.FC<FileInputProps> = ({ onFileProcessed, onError }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState<boolean>(false);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setIsParsing(true);
      onError(''); 

      try {
        let textContent = '';
        if (file.type === 'text/plain') {
          textContent = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = () => reject(new Error(UI_STRINGS_MY.ERROR_FILE_READ));
            reader.readAsText(file);
          });
        } else if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
          const arrayBuffer = await file.arrayBuffer();
          const data = await pdfParse(arrayBuffer as any); 
          textContent = data.text;
        } else if (
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
            file.name.toLowerCase().endsWith('.docx')
          ) {
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          textContent = result.value;
        } else {
          throw new Error(UI_STRINGS_MY.ERROR_UNSUPPORTED_FILE_TYPE);
        }
        
        if (!textContent.trim()) {
            throw new Error(UI_STRINGS_MY.ERROR_FILE_PARSE + " (ဖိုင်တွင် စာသားမတွေ့ပါ သို့မဟုတ် ထုတ်ယူ၍မရပါ။)");
        }
        onFileProcessed(textContent);

      } catch (err: any) {
        console.error("File processing error:", err);
        onError(err.message || UI_STRINGS_MY.ERROR_FILE_PARSE);
        setFileName(null);
        onFileProcessed(''); 
      } finally {
        setIsParsing(false);
        if (event.target) {
            event.target.value = ''; 
        }
      }
    } else {
        setFileName(null);
        onFileProcessed('');
    }
  }, [onFileProcessed, onError]);

  return (
    <div className="space-y-3">
      <label htmlFor="file-upload-input-trigger" className="block text-sm font-medium text-neutral-700 font-serif">
        {UI_STRINGS_MY.UPLOAD_PROMPT_LABEL}
      </label>
      <div className="mt-1 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
        <label
          htmlFor="file-upload-input-trigger"
          className={`cursor-pointer bg-white py-2 px-4 border border-neutral-400 rounded-sm shadow-sm text-sm font-semibold text-neutral-700 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-neutral-500 ${isParsing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span>{isParsing ? (UI_STRINGS_MY.LOADING + '...') : UI_STRINGS_MY.UPLOAD_BUTTON_TEXT}</span>
          <input 
            id="file-upload-input-trigger" 
            name="file-upload" 
            type="file" 
            className="sr-only" 
            accept=".txt,.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
            onChange={handleFileChange}
            disabled={isParsing}
          />
        </label>
        {fileName && !isParsing && (
          <span className="text-sm text-neutral-600 font-serif">{UI_STRINGS_MY.FILE_SELECTED_PREFIX}{fileName}</span>
        )}
        {!fileName && !isParsing && (
          <span className="text-sm text-neutral-500 font-serif">{UI_STRINGS_MY.NO_FILE_SELECTED}</span>
        )}
         {isParsing && fileName && (
          <span className="text-sm text-neutral-500 flex items-center font-serif">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-neutral-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {fileName} ကို စစ်ဆေးနေပါသည်...
          </span>
        )}
      </div>
    </div>
  );
};

export default FileInput;