import React, { useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Save,
  Globe,
  Mail,
  ShieldAlert,
  Database,
  Server,
  UserCog,
  BellRing,
  Palette,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const generalSettingsSchema = z.object({
  siteName: z.string().min(2, {
    message: "Site name must be at least 2 characters.",
  }),
  siteUrl: z.string().url({
    message: "Please enter a valid URL.",
  }),
  adminEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  enableMaintenanceMode: z.boolean().default(false),
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  companyAddress: z.string().optional(),
  supportPhone: z.string().optional(),
});

const securitySettingsSchema = z.object({
  maxLoginAttempts: z.number().int().min(1).max(10),
  sessionTimeout: z.number().int().min(15).max(1440),
  enableTwoFactor: z.boolean().default(false),
  passwordMinLength: z.number().int().min(8).max(30),
  requireSpecialChar: z.boolean().default(true),
  enforcePasswordHistory: z.number().int().min(0).max(24),
  accountLockoutDuration: z.number().int().min(5).max(1440),
});

const emailSettingsSchema = z.object({
  smtpServer: z.string().min(1, {
    message: "SMTP server is required.",
  }),
  smtpPort: z.number().int().min(1).max(65535),
  smtpUsername: z.string().min(1, {
    message: "SMTP username is required.",
  }),
  smtpPassword: z.string().min(1, {
    message: "SMTP password is required.",
  }),
  enableTLS: z.boolean().default(true),
  fromEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  fromName: z.string().min(1, {
    message: "From name is required.",
  }),
});

const notificationSettingsSchema = z.object({
  enableEmailNotifications: z.boolean().default(true),
  enableBrowserNotifications: z.boolean().default(true),
  digestFrequency: z.enum(["never", "daily", "weekly", "monthly"]),
  notifyOnLogin: z.boolean().default(true),
  notifyOnFailedLogin: z.boolean().default(true),
});

type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>;
type SecuritySettingsValues = z.infer<typeof securitySettingsSchema>;
type EmailSettingsValues = z.infer<typeof emailSettingsSchema>;
type NotificationSettingsValues = z.infer<typeof notificationSettingsSchema>;

const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const generalForm = useForm<GeneralSettingsValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      siteName: "My Admin Dashboard",
      siteUrl: "https://example.com",
      adminEmail: "admin@example.com",
      enableMaintenanceMode: false,
      companyName: "Example Corp",
      companyAddress: "123 Main St, Anytown, ST 12345",
      supportPhone: "+1 555-123-4567",
    },
  });

  const securityForm = useForm<SecuritySettingsValues>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      maxLoginAttempts: 5,
      sessionTimeout: 60,
      enableTwoFactor: false,
      passwordMinLength: 12,
      requireSpecialChar: true,
      enforcePasswordHistory: 6,
      accountLockoutDuration: 30,
    },
  });

  const emailForm = useForm<EmailSettingsValues>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      smtpServer: "smtp.example.com",
      smtpPort: 587,
      smtpUsername: "smtp_user",
      smtpPassword: "********",
      enableTLS: true,
      fromEmail: "no-reply@example.com",
      fromName: "Admin System",
    },
  });

  const notificationForm = useForm<NotificationSettingsValues>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      enableEmailNotifications: true,
      enableBrowserNotifications: true,
      digestFrequency: "daily",
      notifyOnLogin: true,
      notifyOnFailedLogin: true,
    },
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const onGeneralSubmit = async (data: GeneralSettingsValues) => {
    setSaving(true);
    try {
      // In a real application, this would save to a settings table in the database
      console.log("Saving general settings:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Settings Saved",
        description: "Your general settings have been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast({
        variant: "destructive",
        title: "Failed to Save Settings",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setSaving(false);
    }
  };

  const onSecuritySubmit = async (data: SecuritySettingsValues) => {
    setSaving(true);
    try {
      console.log("Saving security settings:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Settings Saved",
        description: "Your security settings have been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast({
        variant: "destructive",
        title: "Failed to Save Settings",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setSaving(false);
    }
  };

  const onEmailSubmit = async (data: EmailSettingsValues) => {
    setSaving(true);
    try {
      console.log("Saving email settings:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Settings Saved",
        description: "Your email settings have been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast({
        variant: "destructive",
        title: "Failed to Save Settings",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setSaving(false);
    }
  };

  const onNotificationSubmit = async (data: NotificationSettingsValues) => {
    setSaving(true);
    try {
      console.log("Saving notification settings:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Settings Saved",
        description:
          "Your notification settings have been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast({
        variant: "destructive",
        title: "Failed to Save Settings",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">System Settings</h1>
          <Alert
            variant="default"
            className="max-w-md bg-blue-50 text-blue-800 border-blue-200"
          >
            <AlertDescription className="flex items-center text-sm">
              <Globe className="h-4 w-4 mr-2" />
              Changes made here will affect the entire system
            </AlertDescription>
          </Alert>
        </div>

        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>System Configuration</CardTitle>
            <CardDescription>
              Manage global settings for your application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-6 mb-8 h-14 p-1">
                <TabsTrigger
                  value="general"
                  className="flex flex-col items-center gap-1 h-full data-[state=active]:bg-primary/10"
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-xs">General</span>
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="flex flex-col items-center gap-1 h-full data-[state=active]:bg-primary/10"
                >
                  <ShieldAlert className="h-4 w-4" />
                  <span className="text-xs">Security</span>
                </TabsTrigger>
                <TabsTrigger
                  value="email"
                  className="flex flex-col items-center gap-1 h-full data-[state=active]:bg-primary/10"
                >
                  <Mail className="h-4 w-4" />
                  <span className="text-xs">Email</span>
                </TabsTrigger>
                <TabsTrigger
                  value="database"
                  className="flex flex-col items-center gap-1 h-full data-[state=active]:bg-primary/10"
                >
                  <Database className="h-4 w-4" />
                  <span className="text-xs">Database</span>
                </TabsTrigger>
                <TabsTrigger
                  value="appearance"
                  className="flex flex-col items-center gap-1 h-full data-[state=active]:bg-primary/10"
                >
                  <Palette className="h-4 w-4" />
                  <span className="text-xs">Appearance</span>
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="flex flex-col items-center gap-1 h-full data-[state=active]:bg-primary/10"
                >
                  <BellRing className="h-4 w-4" />
                  <span className="text-xs">Notifications</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-md mb-6">
                  <p className="text-amber-800 text-sm flex items-center">
                    <Server className="h-4 w-4 mr-2 text-amber-600" />
                    These settings affect your entire site and all users
                  </p>
                </div>

                <Form {...generalForm}>
                  <form
                    onSubmit={generalForm.handleSubmit(onGeneralSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={generalForm.control}
                        name="siteName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Site Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              The name of your site as it appears to users
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={generalForm.control}
                        name="siteUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Site URL</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              The full URL of your website
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={generalForm.control}
                        name="adminEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Admin Email</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              Email address for system notifications
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={generalForm.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              Your organization or company name
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={generalForm.control}
                      name="companyAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Address</FormLabel>
                          <FormControl>
                            <Textarea rows={3} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={generalForm.control}
                      name="supportPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Support Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={generalForm.control}
                      name="enableMaintenanceMode"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Maintenance Mode
                            </FormLabel>
                            <FormDescription>
                              Put your site in maintenance mode to prevent user
                              access
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="flex gap-2 items-center"
                      disabled={saving}
                    >
                      <Save className="h-4 w-4" />
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mb-6">
                  <p className="text-blue-800 text-sm flex items-center">
                    <ShieldAlert className="h-4 w-4 mr-2 text-blue-600" />
                    Configure security settings to protect your application
                  </p>
                </div>

                <Form {...securityForm}>
                  <form
                    onSubmit={securityForm.handleSubmit(onSecuritySubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={securityForm.control}
                        name="maxLoginAttempts"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Login Attempts</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 0)
                                }
                              />
                            </FormControl>
                            <FormDescription>
                              Maximum number of failed login attempts before
                              lockout
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={securityForm.control}
                        name="sessionTimeout"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Session Timeout (minutes)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 0)
                                }
                              />
                            </FormControl>
                            <FormDescription>
                              How long user sessions remain active after
                              inactivity
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={securityForm.control}
                        name="passwordMinLength"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum Password Length</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 0)
                                }
                              />
                            </FormControl>
                            <FormDescription>
                              Minimum required length for user passwords
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={securityForm.control}
                        name="accountLockoutDuration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Account Lockout Duration (minutes)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 0)
                                }
                              />
                            </FormControl>
                            <FormDescription>
                              Duration accounts remain locked after exceeding
                              max login attempts
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={securityForm.control}
                      name="enforcePasswordHistory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password History</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Number of previous passwords that users cannot reuse
                            (0 to disable)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <FormField
                        control={securityForm.control}
                        name="enableTwoFactor"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Two-Factor Authentication
                              </FormLabel>
                              <FormDescription>
                                Require users to verify identity using a second
                                method
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={securityForm.control}
                        name="requireSpecialChar"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Require Special Characters
                              </FormLabel>
                              <FormDescription>
                                Require passwords to contain at least one
                                special character
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="flex gap-2 items-center"
                      disabled={saving}
                    >
                      <Save className="h-4 w-4" />
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="email">
                <div className="bg-green-50 border border-green-200 p-4 rounded-md mb-6">
                  <p className="text-green-800 text-sm flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-green-600" />
                    Configure email server settings and notification templates
                  </p>
                </div>

                <Form {...emailForm}>
                  <form
                    onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={emailForm.control}
                        name="smtpServer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SMTP Server</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              Mail server hostname or IP address
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={emailForm.control}
                        name="smtpPort"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SMTP Port</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 0)
                                }
                              />
                            </FormControl>
                            <FormDescription>
                              Common ports are 25, 465 (SSL), or 587 (TLS)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={emailForm.control}
                        name="smtpUsername"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SMTP Username</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={emailForm.control}
                        name="smtpPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SMTP Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={emailForm.control}
                        name="fromEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>From Email</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              The email address that appears as the sender
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={emailForm.control}
                        name="fromName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>From Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              The name that appears as the sender
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={emailForm.control}
                      name="enableTLS"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Enable TLS/SSL
                            </FormLabel>
                            <FormDescription>
                              Use secure connection for sending emails
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="flex gap-2 items-center"
                      disabled={saving}
                    >
                      <Save className="h-4 w-4" />
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="notifications">
                <div className="bg-purple-50 border border-purple-200 p-4 rounded-md mb-6">
                  <p className="text-purple-800 text-sm flex items-center">
                    <BellRing className="h-4 w-4 mr-2 text-purple-600" />
                    Configure system notification settings
                  </p>
                </div>

                <Form {...notificationForm}>
                  <form
                    onSubmit={notificationForm.handleSubmit(
                      onNotificationSubmit,
                    )}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 gap-6">
                      <FormField
                        control={notificationForm.control}
                        name="digestFrequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Digest Frequency</FormLabel>
                            <FormControl>
                              <select
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                              >
                                <option value="never">Never</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                              </select>
                            </FormControl>
                            <FormDescription>
                              How often to send notification digests to users
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={notificationForm.control}
                        name="enableEmailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Email Notifications
                              </FormLabel>
                              <FormDescription>
                                Send notification emails to users
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={notificationForm.control}
                        name="enableBrowserNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Browser Notifications
                              </FormLabel>
                              <FormDescription>
                                Enable push notifications in browser
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={notificationForm.control}
                        name="notifyOnLogin"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Login Notifications
                              </FormLabel>
                              <FormDescription>
                                Send notifications when users log in
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={notificationForm.control}
                        name="notifyOnFailedLogin"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Failed Login Notifications
                              </FormLabel>
                              <FormDescription>
                                Send notifications on failed login attempts
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="flex gap-2 items-center"
                      disabled={saving}
                    >
                      <Save className="h-4 w-4" />
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="database">
                <div className="p-8 text-center text-gray-500">
                  <Database className="mx-auto h-12 w-12 opacity-30" />
                  <h3 className="mt-4 text-lg font-medium">
                    Database Settings
                  </h3>
                  <p className="mt-2 mb-4">
                    Manage database connections and configure backups
                  </p>
                  <Button disabled>Coming Soon</Button>
                </div>
              </TabsContent>

              <TabsContent value="appearance">
                <div className="p-8 text-center text-gray-500">
                  <Palette className="mx-auto h-12 w-12 opacity-30" />
                  <h3 className="mt-4 text-lg font-medium">
                    Appearance Settings
                  </h3>
                  <p className="mt-2 mb-4">
                    Customize the look and feel of your application
                  </p>
                  <Button disabled>Coming Soon</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
