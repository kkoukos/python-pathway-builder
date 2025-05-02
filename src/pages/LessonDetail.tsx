
import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { getModuleBySlug, getLessonById, ContentBlock, Lesson } from "@/services/mockData";
import { useProgress } from "@/contexts/ProgressContext";

const LessonDetail = () => {
  const { slug, lessonId } = useParams<{ slug: string; lessonId: string }>();
  const navigate = useNavigate();
  const { markLessonComplete } = useProgress();

  const module = slug ? getModuleBySlug(slug) : null;
  const lesson = lessonId ? getLessonById(parseInt(lessonId)) : null;

  if (!module || !lesson) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Lesson not found. Please go back and select another lesson.
        </AlertDescription>
      </Alert>
    );
  }

  const currentLessonIndex = module.lessons.findIndex(
    (l) => l.id === lesson.id
  );
  const prevLesson = currentLessonIndex > 0
    ? module.lessons[currentLessonIndex - 1]
    : null;
  const nextLesson = currentLessonIndex < module.lessons.length - 1
    ? module.lessons[currentLessonIndex + 1]
    : null;

  const handleCompleteLesson = () => {
    markLessonComplete(module.id, lesson.id);
    if (nextLesson) {
      navigate(`/modules/${slug}/lessons/${nextLesson.id}`);
    } else {
      navigate(`/modules/${slug}`);
    }
  };

  // Function to render different content types
  const renderContent = (block: ContentBlock) => {
    switch (block.type) {
      case "text":
        return <p className="mb-4 whitespace-pre-line">{block.content}</p>;
      
      case "code":
        return (
          <div className="code-block mb-6">
            <pre>{block.content}</pre>
          </div>
        );
      
      case "image":
        return (
          <div className="my-6 flex justify-center">
            <img
              src={block.content}
              alt="Lesson illustration"
              className="max-w-full rounded-lg"
            />
          </div>
        );
      
      case "exercise":
        return (
          <Card className="p-4 bg-accent mb-6">
            <h3 className="font-semibold mb-2">Practice Exercise</h3>
            <p>{block.content}</p>
          </Card>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="container max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
          <Link to="/modules" className="hover:underline">
            Modules
          </Link>
          <span>/</span>
          <Link to={`/modules/${slug}`} className="hover:underline">
            {module.title}
          </Link>
          <span>/</span>
          <span>Lesson {currentLessonIndex + 1}</span>
        </div>
        <h1 className="text-3xl font-bold mb-6">{lesson.title}</h1>
      </div>

      <div className="prose max-w-none">
        {lesson.content.map((block, index) => (
          <div key={index}>{renderContent(block)}</div>
        ))}
      </div>

      <div className="mt-10 flex justify-between">
        {prevLesson ? (
          <Button
            variant="outline"
            onClick={() => navigate(`/modules/${slug}/lessons/${prevLesson.id}`)}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous Lesson
          </Button>
        ) : (
          <div></div>
        )}

        <Button onClick={handleCompleteLesson} className="flex items-center">
          <CheckCircle className="mr-2 h-4 w-4" />
          {nextLesson ? "Complete & Continue" : "Complete Module"}
        </Button>
      </div>
    </div>
  );
};

export default LessonDetail;
