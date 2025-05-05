
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Play, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface TestCase {
  input?: string;
  expected: string;
  args?: any[];
  function_name?: string;
}

interface CodeExerciseProps {
  code: string;
  onCodeChange: (code: string) => void;
  isDisabled?: boolean;
  solution?: string;
  testCases?: TestCase[];
}

const CodeExercise: React.FC<CodeExerciseProps> = ({
  code,
  onCodeChange,
  isDisabled = false,
  solution,
  testCases,
}) => {
  const [activeTab, setActiveTab] = useState("code");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleRunCode = () => {
    // In a real app, this would send the code to a backend service for execution
    // Here we'll simulate code execution for demonstration purposes
    setIsRunning(true);
    setOutput("Running code...\n");
    
    setTimeout(() => {
      try {
        // This is a very simplified simulation!
        // In a real app, you'd never eval user code in the browser like this
        // Instead, you'd use a secure backend service
        
        // Simulate some output
        setOutput(`> print("Hello, Python!")
Hello, Python!

> # Code execution completed successfully`);
        
        toast.success("Code executed successfully!");
      } catch (error) {
        setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
        toast.error("Error executing code");
      } finally {
        setIsRunning(false);
      }
    }, 1000);
  };

  const handleResetCode = () => {
    if (testCases && testCases.length > 0) {
      const starterCode = testCases[0].function_name 
        ? `def ${testCases[0].function_name}():\n    # Write your solution here\n    pass`
        : "# Write your solution here";
      onCodeChange(starterCode);
      toast.info("Code has been reset");
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="code" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="code">Code Editor</TabsTrigger>
          <TabsTrigger value="output">Output</TabsTrigger>
          {solution && <TabsTrigger value="solution">Solution</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="code" className="mt-4">
          <div className="border rounded-md h-[350px] mb-4 bg-muted">
            {/* In a real app, you would use Monaco Editor or CodeMirror here */}
            <textarea
              className="w-full h-full p-4 font-mono text-sm resize-none rounded-md bg-muted focus:outline-none focus:ring-1 focus:ring-primary"
              value={code}
              onChange={(e) => onCodeChange(e.target.value)}
              disabled={isDisabled}
              placeholder="# Write your Python code here..."
              spellCheck="false"
            />
          </div>
          
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleResetCode}
                disabled={isDisabled || isRunning}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Reset Code
              </Button>
            </div>

            {testCases && testCases.length > 0 && (
              <Button size="sm" onClick={handleRunCode} disabled={isDisabled || isRunning}>
                <Play className="h-4 w-4 mr-1" />
                {isRunning ? "Running..." : "Run Code"}
              </Button>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="output" className="mt-4">
          <Card className="bg-muted h-[350px] overflow-auto border border-border">
            <pre className="p-4 text-sm font-mono whitespace-pre-wrap">
              {output || "// Code output will appear here when you run your code"}
            </pre>
          </Card>
        </TabsContent>
        
        {solution && (
          <TabsContent value="solution" className="mt-4">
            <Card className="bg-muted h-[350px] overflow-auto border border-border">
              <pre className="p-4 text-sm font-mono whitespace-pre-wrap">{solution}</pre>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {testCases && testCases.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-sm font-semibold mb-2">Test Cases</h3>
          <div className="space-y-2">
            {testCases.map((test, index) => (
              <div key={index} className="text-xs p-2 bg-muted rounded border border-border">
                {test.input && <div><span className="font-medium">Input:</span> {test.input}</div>}
                {test.args && <div><span className="font-medium">Arguments:</span> {JSON.stringify(test.args)}</div>}
                <div><span className="font-medium">Expected:</span> {test.expected}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeExercise;
