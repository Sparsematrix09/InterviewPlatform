import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Play, Settings, ChevronDown, Loader2, Code2 } from "lucide-react";

function CodeEditor({
  selectedLanguage,
  code,
  isRunning,
  onLanguageChange,
  onCodeChange,
  onRunCode,
}) {
  const [theme] = useState("vs-dark");
  const [fontSize] = useState(14);
  const [showSettings, setShowSettings] = useState(false);

  // Language options - make sure these match your data
  const languageOptions = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2 rounded-lg">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <div className="relative">
            <select
              className="appearance-none bg-gray-700 border border-gray-600 text-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              value={selectedLanguage}
              onChange={onLanguageChange}
            >
              {languageOptions.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Run Code Button */}
        <button
          onClick={onRunCode}
          disabled={isRunning}
          className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 ${
            isRunning
              ? 'bg-emerald-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 hover:scale-105 hover:shadow-xl'
          }`}
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Code
            </>
          )}
        </button>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height={"100%"}
          language={selectedLanguage}
          value={code}
          onChange={onCodeChange}
          theme={theme}
          options={{
            fontSize,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: false },
            wordWrap: "on",
            formatOnPaste: true,
            formatOnType: true,
            tabSize: 2,
          }}
        />
      </div>

      {/* Status Bar */}
      <div className="px-6 py-3 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-4">
            <span>Language: {selectedLanguage.toUpperCase()}</span>
            <span>Lines: {code.split('\n').length}</span>
            <span>Characters: {code.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span>Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;