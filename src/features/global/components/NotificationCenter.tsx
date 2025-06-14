import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, BellOff, Check, X, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Xoş gəldiniz!",
      message: "Sistemi istifadəyə başlaya bilərsiniz",
      type: "success",
      timestamp: new Date(),
      read: false,
    },
    {
      id: "2",
      title: "Yeni funksiya",
      message: "AI köməkçi artıq əlçatandır",
      type: "info",
      timestamp: new Date(Date.now() - 3600000),
      read: false,
    },
  ]);

  const [isEnabled, setIsEnabled] = useState(true);
  const { toast } = useToast();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const requestPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setIsEnabled(true);
        toast({
          title: "Bildirişlər aktivləşdirildi",
          description: "İndi bildirişlər alacaqsınız",
        });
      }
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffMinutes < 1) return "İndi";
    if (diffMinutes < 60) return `${diffMinutes} dəq əvvəl`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} saat əvvəl`;
    return `${Math.floor(diffMinutes / 1440)} gün əvvəl`;
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Bildirişlər
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button size="sm" variant="ghost" onClick={markAllAsRead}>
                <Check className="w-4 h-4" />
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEnabled(!isEnabled)}
            >
              {isEnabled ? (
                <Bell className="w-4 h-4" />
              ) : (
                <BellOff className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isEnabled && (
          <div className="text-center py-4">
            <BellOff className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 mb-2">Bildirişlər deaktivdir</p>
            <Button size="sm" onClick={requestPermission}>
              Aktivləşdir
            </Button>
          </div>
        )}

        {isEnabled && (
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Bildiriş yoxdur
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${
                      notification.read
                        ? "bg-gray-50"
                        : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className={`w-2 h-2 rounded-full ${getTypeColor(notification.type)}`}
                          />
                          <h4 className="font-medium text-sm">
                            {notification.title}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">
                          {notification.message}
                        </p>
                        <span className="text-xs text-gray-400">
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsRead(notification.id)}
                            className="h-6 w-6 p-0"
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteNotification(notification.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
