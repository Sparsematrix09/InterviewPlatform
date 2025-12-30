import { Terminal, CheckCircle, XCircle, AlertCircle, Copy, Trash2 } from "lucide-react";
import { useState } from "react";

function OutputPanel({ output }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (output?.output) {
      navigator.clipboard.writeText(output.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    // Clear output logic would go here
    console.log("Clear output");
  };

  const getStatusIcon = () => {
    if (!output) return <Terminal className="w-5 h-5 text-gray-500" />;
    if (output.success) return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getStatusText = () => {
    if (!output) return "Output will appear here";
    if (output.success) return "Execution Successful";
    return "Execution Failed";
  };

  const getStatusColor = () => {
    if (!output) return "text-gray-400";
    if (output.success) return "text-emerald-400";
    return "text-red-400";
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Output Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-white">Output</h3>
        </div>

        <div className="flex items-center gap-4">
          {/* Status */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${getStatusColor()} bg-gray-700/50`}>
            {getStatusIcon()}
            <span className="font-medium">{getStatusText()}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              disabled={!output?.output}
              className={`p-2 rounded-lg transition-colors ${
                output?.output
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed'
              }`}
            >
              {copied ? (
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={handleClear}
              disabled={!output}
              className={`p-2 rounded-lg transition-colors ${
                output
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Output Content */}
      <div className="flex-1 overflow-auto p-6">
        {output === null ? (
          <div className="h-full flex flex-col items-center justify-center">
            <Terminal className="w-16 h-16 text-gray-700 mb-4" />
            <p className="text-gray-400 text-lg">No output yet</p>
            <p className="text-gray-600 text-sm mt-2">Click "Run Code" to see the output here</p>
          </div>
        ) : output.success ? (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="bg-emerald-900/20 border border-emerald-800/50 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-emerald-300 mb-1">Code Executed Successfully!</h4>
                  <p className="text-emerald-200 text-sm">
                    Your code ran without any errors.
                  </p>
                </div>
              </div>
            </div>

            {/* Output Box */}
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Output:</h4>
              <pre className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 overflow-x-auto">
                <code className="text-emerald-300 whitespace-pre-wrap font-mono text-sm">
                  {output.output}
                </code>
              </pre>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
                <div className="text-sm text-gray-400 mb-1">Status</div>
                <div className="text-emerald-400 font-semibold">Success</div>
              </div>
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
                <div className="text-sm text-gray-400 mb-1">Output Size</div>
                <div className="text-gray-300 font-semibold">{output.output?.length || 0} chars</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Error Message */}
            <div className="bg-red-900/20 border border-red-800/50 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-300 mb-1">Execution Failed!</h4>
                  <p className="text-red-200 text-sm">
                    There was an error while running your code.
                  </p>
                </div>
              </div>
            </div>

            {/* Error Output */}
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Error:</h4>
              <pre className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 overflow-x-auto">
                <code className="text-red-400 whitespace-pre-wrap font-mono text-sm">
                  {output.error}
                </code>
              </pre>
            </div>

            {/* Regular Output (if any) */}
            {output.output && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Output before error:</h4>
                <pre className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 overflow-x-auto">
                  <code className="text-gray-400 whitespace-pre-wrap font-mono text-sm">
                    {output.output}
                  </code>
                </pre>
              </div>
            )}

            {/* Debugging Tips */}
            <div className="bg-yellow-900/10 border border-yellow-800/30 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-300 mb-1">Debugging Tips</h4>
                  <ul className="text-yellow-200 text-sm space-y-1">
                    <li>• Check for syntax errors in your code</li>
                    <li>• Verify variable names and function calls</li>
                    <li>• Make sure all brackets are properly closed</li>
                    <li>• Check for infinite loops</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-800 border-t border-gray-700 text-sm text-gray-500">
        <div className="flex items-center justify-between">
          <span>Ready for input</span>
          <span>Press Ctrl+Enter to run code</span>
        </div>
      </div>
    </div>
  );
}

export default OutputPanel;