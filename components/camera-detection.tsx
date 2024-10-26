"use client";

import { useRef, useState } from "react";
import { Camera, CameraIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function CameraDetection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );
  const [processing, setProcessing] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  const switchCamera = () => {
    stopCamera();
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current || processing) return;

    setProcessing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.8)
      );

      // Create FormData and append image
      const formData = new FormData();
      formData.append("image", blob);

      // Here you would typically send the image to your AI service
      // For demo purposes, we'll just show a loading state
      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert(
        "This is a demo! In a production environment, this would send the image to an AI service for Pokémon recognition."
      );
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog onOpenChange={(open) => !open && stopCamera()}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 p-0 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white"
        >
          <Camera className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Scan Pokémon</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={cn(
                "w-full h-full object-cover",
                facingMode === "user" && "scale-x-[-1]"
              )}
              onPlay={() => setIsStreaming(true)}
            />
            <canvas ref={canvasRef} className="hidden" />

            {!isStreaming && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button onClick={startCamera}>Start Camera</Button>
              </div>
            )}

            {isStreaming && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/90 backdrop-blur-sm"
                  onClick={switchCamera}
                >
                  <CameraIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full bg-white/90 backdrop-blur-sm"
                  onClick={captureImage}
                  disabled={processing}
                >
                  {processing ? "Processing..." : "Capture"}
                </Button>
              </div>
            )}
          </div>
          <p className="text-sm text-center text-muted-foreground">
            Point your camera at a Pokémon to identify it
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
