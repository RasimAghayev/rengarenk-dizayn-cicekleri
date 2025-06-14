import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff, Play, Pause, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onRecordingComplete,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onRecordingComplete(audioBlob, duration);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

      toast({
        title: "Səs yazılışı başladı",
        description: "Danışmağa başlaya bilərsiniz",
      });
    } catch (error) {
      toast({
        title: "Xəta",
        description: "Mikrofona giriş alına bilmədi",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const playAudio = () => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-2xl font-mono">{formatDuration(duration)}</div>

          <div className="flex items-center space-x-2">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full w-16 h-16"
              >
                <Mic className="w-6 h-6" />
              </Button>
            ) : (
              <Button
                onClick={stopRecording}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full w-16 h-16 animate-pulse"
              >
                <Square className="w-6 h-6" />
              </Button>
            )}

            {audioUrl && (
              <Button
                onClick={playAudio}
                variant="outline"
                className="rounded-full w-12 h-12"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>

          {audioUrl && (
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          )}

          {isRecording && (
            <div className="text-red-500 text-sm animate-pulse">
              🔴 Səs yazılır...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceRecorder;
