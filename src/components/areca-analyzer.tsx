"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Image from "next/image";
import { AlertCircle, Trash2, UploadCloud } from "lucide-react";

import { getAnalysis, type FormState } from "@/app/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { AnalysisResults } from "./analysis-results";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const IMAGE_CACHE_KEY = "areca-image-cache";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Analyzing..." : "Analyze Areca Nuts"}
    </Button>
  );
}

function AnalysisProgress() {
  const { pending } = useFormStatus();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (pending) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            if (interval) clearInterval(interval);
            return prev;
          }
          return prev + 5;
        });
      }, 200);
    } else {
      setProgress(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pending]);

  if (!pending) return null;

  return (
    <div className="space-y-2 pt-4">
      <Progress value={progress} className="w-full" />
      <p className="text-sm text-center text-muted-foreground">
        AI is analyzing the image. This may take a moment...
      </p>
    </div>
  );
}

export function ArecaAnalyzer() {
  const initialState: FormState = { result: null, error: null };
  const [state, formAction] = useFormState(getAnalysis, initialState);

  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const cachedImage = localStorage.getItem(IMAGE_CACHE_KEY);
      if (cachedImage) {
        setFilePreview(cachedImage);
      }
    } catch (error) {
      console.error("Could not access local storage:", error);
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setLocalError("File size must be less than 5MB.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setLocalError("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setFilePreview(dataUrl);
      try {
        localStorage.setItem(IMAGE_CACHE_KEY, dataUrl);
      } catch (error) {
        console.error("Could not write to local storage:", error);
      }
      setLocalError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setFilePreview(null);
    try {
      localStorage.removeItem(IMAGE_CACHE_KEY);
    } catch (error) {
      console.error("Could not remove from local storage:", error);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const error = state.error || localError;

  return (
    <div className="w-full max-w-2xl space-y-6">
      <form action={formAction}>
        <input type="hidden" name="photoDataUri" value={filePreview || ""} />
        <Card>
          <CardHeader>
            <CardTitle>Upload Areca Nut Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filePreview ? (
              <div className="relative group">
                <Image
                  src={filePreview}
                  alt="Areca nuts preview"
                  width={600}
                  height={400}
                  className="rounded-lg object-cover w-full aspect-video border"
                  data-ai-hint="areca nuts"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleClear}
                  type="button"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove image</span>
                </Button>
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="w-12 h-12 text-muted-foreground" />
                <p className="mt-4 text-sm font-semibold text-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WEBP (max 5MB)
                </p>
                <Input
                  ref={fileInputRef}
                  id="picture"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/webp"
                />
              </div>
            )}
            <AnalysisProgress />
          </CardContent>
          {filePreview && (
            <CardFooter>
              <SubmitButton />
            </CardFooter>
          )}
        </Card>
      </form>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {state.result && <AnalysisResults results={state.result} />}
    </div>
  );
}
