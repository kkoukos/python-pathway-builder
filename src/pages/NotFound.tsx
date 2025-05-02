
import React from "react";
import { useLocation } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="container max-w-md py-16">
      <Alert variant="destructive" className="mb-6">
        <AlertTitle className="text-lg font-semibold">Page Not Found</AlertTitle>
        <AlertDescription>
          The page '{location.pathname}' you're looking for doesn't exist.
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-center">
        <Link to="/">
          <Button className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
