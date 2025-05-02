
import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { toast } from "sonner";

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
  const [activeTab, setActiveTab] = React.useState("code");
  const [output, setOutput] = React.useState("");

  const handleRunCode = () => {
    // In a real app, this would send the code to a backend service for execution
    // Here we'll simulate code execution for demonstration purposes
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
      }
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="code" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="code">Code Editor</TabsTrigger>
          <TabsTrigger value="output">Output</TabsTrigger>
          {solution && <TabsTrigger value="solution">Solution</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="code" className="mt-2">
          <div className="border rounded-md h-[300px] mb-4">
            {/* In a real app, you would use Monaco Editor or CodeMirror here */}
            <textarea
              className="w-full h-full p-3 font-mono text-sm resize-none rounded-md bg-muted focus:outline-none focus:ring-1 focus:ring-primary"
              value={code}
              onChange={(e) => onCodeChange(e.target.value)}
              disabled={isDisabled}
              placeholder="# Write your Python code here..."
              spellCheck="false"
            />
          </div>
          
          <div className="flex justify-between">
            {testCases && testCases.length > 0 && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleRunCode}>
                  <Play className="h-4 w-4 mr-1" />
                  Run Code
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="output" className="mt-2">
          <Card className="bg-muted h-[300px] overflow-auto">
            <pre className="p-4 text-sm font-mono whitespace-pre-wrap">
              {output || "// Code output will appear here when you run your code"}
            </pre>
          </Card>
        </TabsContent>
        
        {solution && (
          <TabsContent value="solution" className="mt-2">
            <Card className="bg-muted h-[300px] overflow-auto">
              <pre className="p-4 text-sm font-mono whitespace-pre-wrap">{solution}</pre>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default CodeExercise;
