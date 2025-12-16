import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Share2, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { toast } from "sonner";

const Reports = () => {
  const handleDownload = () => {
    toast.success("Report downloaded successfully");
  };

  const handleShare = () => {
    toast.success("Report shared with your healthcare provider");
  };

  const weeklyData = [
    { day: "Mon", pressure: 45, temp: 36.5 },
    { day: "Tue", pressure: 52, temp: 36.7 },
    { day: "Wed", pressure: 48, temp: 36.4 },
    { day: "Thu", pressure: 55, temp: 36.8 },
    { day: "Fri", pressure: 50, temp: 36.6 },
    { day: "Sat", pressure: 42, temp: 36.3 },
    { day: "Sun", pressure: 46, temp: 36.5 },
  ];

  const aiSuggestions = [
    {
      type: "success",
      title: "Great Progress!",
      message: "Your pressure distribution has improved by 12% this week",
      icon: CheckCircle2,
      color: "text-success",
    },
    {
      type: "warning",
      title: "Activity Recommendation",
      message: "Avoid standing for more than 2 hours continuously",
      icon: AlertCircle,
      color: "text-warning",
    },
    {
      type: "info",
      title: "Cooling Mode Suggested",
      message: "Consider using cooling mode after extended walking",
      icon: TrendingUp,
      color: "text-info",
    },
  ];

  const maxPressure = Math.max(...weeklyData.map(d => d.pressure));

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="gradient-medical text-white p-6 sticky top-0 z-10 shadow-lg">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold mb-2">Reports & Insights</h1>
          <p className="text-white/80 text-sm">Track your foot health trends</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            onClick={handleDownload}
            className="flex-1"
            variant="outline"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button 
            onClick={handleShare}
            className="flex-1"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Weekly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pressure" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pressure">Pressure</TabsTrigger>
                <TabsTrigger value="temperature">Temperature</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pressure" className="space-y-4">
                <div className="h-48 flex items-end justify-between gap-2 px-2">
                  {weeklyData.map((data) => (
                    <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-lg transition-all duration-500 hover:opacity-80"
                        style={{ height: `${(data.pressure / maxPressure) * 100}%` }}
                      />
                      <span className="text-xs text-muted-foreground">{data.day}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm pt-4 border-t">
                  <div>
                    <p className="text-muted-foreground text-xs">Average</p>
                    <p className="font-semibold">48 kPa</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Peak</p>
                    <p className="font-semibold">55 kPa</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Lowest</p>
                    <p className="font-semibold">42 kPa</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="temperature" className="space-y-4">
                <div className="h-48 flex items-end justify-between gap-2 px-2">
                  {weeklyData.map((data) => {
                    const maxTemp = 37;
                    const minTemp = 36;
                    const range = maxTemp - minTemp;
                    const height = ((data.temp - minTemp) / range) * 100;
                    
                    return (
                      <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className="w-full bg-gradient-to-t from-info to-info/60 rounded-t-lg transition-all duration-500 hover:opacity-80"
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-xs text-muted-foreground">{data.day}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-sm pt-4 border-t">
                  <div>
                    <p className="text-muted-foreground text-xs">Average</p>
                    <p className="font-semibold">36.5°C</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Peak</p>
                    <p className="font-semibold">36.8°C</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Lowest</p>
                    <p className="font-semibold">36.3°C</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* AI Suggestions */}
        <div>
          <h2 className="text-lg font-semibold mb-4 px-1">AI Insights</h2>
          <div className="space-y-3">
            {aiSuggestions.map((suggestion, index) => {
              const Icon = suggestion.icon;
              return (
                <Card key={index} className="card-hover">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-accent ${suggestion.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">{suggestion.title}</h4>
                        <p className="text-xs text-muted-foreground">{suggestion.message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Daily High Pressure */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Daily High Pressure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {weeklyData.map((data) => (
                <div 
                  key={data.day} 
                  className="flex items-center justify-between p-3 rounded-lg bg-accent/30 border border-accent"
                >
                  <span className="text-sm font-medium text-muted-foreground">{data.day}</span>
                  <span className="font-semibold text-primary">{data.pressure} kPa</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <Card className="bg-accent/30 border-accent">
          <CardHeader>
            <CardTitle className="text-base">This Week Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total monitoring time</span>
              <span className="font-semibold">42 hours</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Massager sessions</span>
              <span className="font-semibold">5 sessions</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Abnormal readings</span>
              <span className="font-semibold text-success">0 detected</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Reports;
