import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PROBLEMS } from "../data/problems";
import Navbar from "../components/Navbar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditor from "../components/CodeEditor";
import { executeCode } from "../lib/piston";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { Toaster } from "react-hot-toast";

function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentProblemId, setCurrentProblemId] = useState(id || "two-sum");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const currentProblem = PROBLEMS[currentProblemId];

  // Debug logging
  console.log("ProblemPage State:", {
    currentProblemId,
    selectedLanguage,
    codeLength: code?.length,
    hasProblem: !!currentProblem,
    problemTitle: currentProblem?.title
  });

  // Update problem when URL param changes
  useEffect(() => {
    console.log("useEffect triggered with id:", id);
    if (id && PROBLEMS[id]) {
      setCurrentProblemId(id);
      const starterCode = PROBLEMS[id].starterCode[selectedLanguage];
      console.log("Setting starter code for language:", selectedLanguage, starterCode?.substring(0, 50));
      setCode(starterCode || "");
      setOutput(null);
    }
  }, [id, selectedLanguage]);

  // Set initial code on component mount
  useEffect(() => {
    if (currentProblem && !code) {
      const starterCode = currentProblem.starterCode[selectedLanguage];
      console.log("Setting initial code:", starterCode?.substring(0, 50));
      setCode(starterCode || "");
    }
  }, [currentProblem, selectedLanguage]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    console.log("Language changing to:", newLang);
    setSelectedLanguage(newLang);
    // Don't set code here - let the useEffect handle it
  };

  const handleProblemChange = (newProblemId) => {
    console.log("Changing problem to:", newProblemId);
    navigate(`/problems/${newProblemId}`);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.2, y: 0.6 },
    });
    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.8, y: 0.6 },
    });
  };

  const normalizeOutput = (output) => {
    if (!output) return "";
    return output
      .trim()
      .split("\n")
      .map((line) =>
        line
          .trim()
          .replace(/\[\s+/g, "[")
          .replace(/\s+\]/g, "]")
          .replace(/\s*,\s*/g, ",")
      )
      .filter((line) => line.length > 0)
      .join("\n");
  };

  const checkIfTestsPassed = (actualOutput, expectedOutput) => {
    const normalizedActual = normalizeOutput(actualOutput);
    const normalizedExpected = normalizeOutput(expectedOutput);
    console.log("Test comparison:", {
      actual: normalizedActual,
      expected: normalizedExpected,
      match: normalizedActual === normalizedExpected
    });
    return normalizedActual === normalizedExpected;
  };

  const handleRunCode = async () => {
    console.log("Running code...", { selectedLanguage, codeLength: code?.length });
    
    if (!code || code.trim() === "") {
      toast.error("Please write some code before running!");
      return;
    }

    setIsRunning(true);
    setOutput(null);

    try {
      const result = await executeCode(selectedLanguage, code);
      console.log("Execution result:", result);
      setOutput(result);
      
      if (result.success) {
        const expectedOutput = currentProblem?.expectedOutput[selectedLanguage];
        console.log("Expected output:", expectedOutput);
        
        if (expectedOutput) {
          const testsPassed = checkIfTestsPassed(result.output, expectedOutput);
          if (testsPassed) {
            triggerConfetti();
            toast.success("All tests passed! Great job!");
          } else {
            toast.error("Tests failed. Check your output!");
          }
        } else {
          toast.success("Code executed successfully!");
        }
      } else {
        toast.error("Code execution failed!");
      }
    } catch (error) {
      console.error("Execution error:", error);
      setOutput({
        success: false,
        error: `Execution failed: ${error.message}`
      });
      toast.error("Failed to execute code!");
    } finally {
      setIsRunning(false);
    }
  };

  if (!currentProblem) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <Navbar />
        <div className="pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Problem not found</h1>
            <button 
              onClick={() => navigate('/problems')}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg font-semibold"
            >
              Back to Problems
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />
      <Toaster position="top-right" />
      
      {/* Main content */}
      <div className="flex flex-col h-screen">
        <div className="flex-1 pt-20">
          <PanelGroup direction="horizontal" className="h-full">
            {/* Left Panel - Problem Description */}
            <Panel defaultSize={40} minSize={30}>
              <ProblemDescription
                problem={currentProblem}
                currentProblemId={currentProblemId}
                onProblemChange={handleProblemChange}
                allProblems={Object.values(PROBLEMS)}
              />
            </Panel>
            
            {/* Vertical resize handle */}
            <PanelResizeHandle className="w-2 bg-gray-800 hover:bg-emerald-500 transition-colors cursor-col-resize active:bg-emerald-400" />
            
            {/* Right Panel - Code Editor and Output */}
            <Panel>
              <PanelGroup direction="vertical">
                {/* Top panel - Code Editor */}
                <Panel defaultSize={70} minSize={30}>
                  <CodeEditor
                    selectedLanguage={selectedLanguage}
                    code={code}
                    isRunning={isRunning}
                    onLanguageChange={handleLanguageChange}
                    onCodeChange={setCode}
                    onRunCode={handleRunCode}
                  />
                </Panel>
                
                {/* Horizontal resize handle */}
                <PanelResizeHandle className="h-2 bg-gray-800 hover:bg-emerald-500 transition-colors cursor-row-resize active:bg-emerald-400" />
                
                {/* Bottom panel - Output Panel */}
                <Panel defaultSize={30} minSize={20}>
                  <OutputPanel output={output} />
                </Panel>
              </PanelGroup>
            </Panel>
          </PanelGroup>
        </div>
      </div>
    </div>
  );
}

export default ProblemPage;