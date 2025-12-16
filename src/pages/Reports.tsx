import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Share2, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { toast } from "sonner";

const Reports = () => {
  const weeklyData = [
    { day: "Mon", date: "2024-01-08", pressure: 45, temp: 36.5, steps: 4200 },
    { day: "Tue", date: "2024-01-09", pressure: 52, temp: 36.7, steps: 5800 },
    { day: "Wed", date: "2024-01-10", pressure: 48, temp: 36.4, steps: 3900 },
    { day: "Thu", date: "2024-01-11", pressure: 55, temp: 36.8, steps: 6200 },
    { day: "Fri", date: "2024-01-12", pressure: 50, temp: 36.6, steps: 5100 },
    { day: "Sat", date: "2024-01-13", pressure: 42, temp: 36.3, steps: 2800 },
    { day: "Sun", date: "2024-01-14", pressure: 46, temp: 36.5, steps: 3500 },
  ];

  const stats = useMemo(() => {
    const pressures = weeklyData.map(d => d.pressure);
    const temps = weeklyData.map(d => d.temp);
    return {
      avgPressure: Math.round(pressures.reduce((a, b) => a + b, 0) / pressures.length),
      maxPressure: Math.max(...pressures),
      minPressure: Math.min(...pressures),
      avgTemp: (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1),
      maxTemp: Math.max(...temps).toFixed(1),
      minTemp: Math.min(...temps).toFixed(1),
      totalSteps: weeklyData.reduce((a, b) => a + b.steps, 0),
    };
  }, []);

  const handleDownload = () => {
    const csvContent = [
      ["Date", "Day", "Pressure (kPa)", "Temperature (°C)", "Steps"],
      ...weeklyData.map(d => [d.date, d.day, d.pressure, d.temp, d.steps])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `foot-health-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success("Report downloaded as CSV");
  };

  const handleShare = async () => {
    const reportText = `Foot Health Report\n\nWeekly Summary:\n- Avg Pressure: ${stats.avgPressure} kPa\n- Avg Temperature: ${stats.avgTemp}°C\n- Total Steps: ${stats.totalSteps.toLocaleString()}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Foot Health Report",
          text: reportText,
        });
        toast.success("Report shared successfully");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          toast.error("Could not share report");
        }
      }
    } else {
      await navigator.clipboard.writeText(reportText);
      toast.success("Report copied to clipboard");
    }
  };

  const aiSuggestions = useMemo(() => {
    const suggestions = [];
    const pressureVariance = ((stats.maxPressure - stats.minPressure) / stats.maxPressure * 100).toFixed(0);
    
    if (stats.avgPressure < 50) {
      suggestions.push({
        type: "success",
        title: "Great Progress!",
        message: `Your average pressure is ${stats.avgPressure} kPa - within healthy range`,
        icon: CheckCircle2,
        color: "text-success",
      });
    }
    
    if (stats.maxPressure > 50) {
      suggestions.push({
        type: "warning",
        title: "High Pressure Detected",
        message: `Peak pressure of ${stats.maxPressure} kPa recorded. Consider rest periods.`,
        icon: AlertCircle,
        color: "text-warning",
      });
    }
    
    suggestions.push({
      type: "info",
      title: "Weekly Trend",
      message: `Pressure variance of ${pressureVariance}% this week. Stay consistent!`,
      icon: TrendingUp,
      color: "text-info",
    });
    
    return suggestions;
  }, [stats]);

  const maxPressure = stats.maxPressure;

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
                <div className="flex flex-col">
                  <div className="h-40 flex items-end justify-between gap-2 px-2">
                    {weeklyData.map((data) => (
                      <div 
                        key={data.day} 
                        className="flex-1 bg-gradient-to-t from-primary to-primary/60 rounded-t-lg transition-all duration-500 hover:opacity-80"
                        style={{ height: `${(data.pressure / maxPressure) * 100}%`, minHeight: '8px' }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between gap-2 px-2 pt-2">
                    {weeklyData.map((data) => (
                      <span key={data.day} className="flex-1 text-center text-xs text-muted-foreground">{data.day}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm pt-4 border-t">
                  <div>
                    <p className="text-muted-foreground text-xs">Average</p>
                    <p className="font-semibold">{stats.avgPressure} kPa</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Peak</p>
                    <p className="font-semibold">{stats.maxPressure} kPa</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Lowest</p>
                    <p className="font-semibold">{stats.minPressure} kPa</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="temperature" className="space-y-4">
                <div className="flex flex-col">
                  <div className="h-40 flex items-end justify-between gap-2 px-2">
                    {weeklyData.map((data) => {
                      const maxTemp = 37;
                      const minTemp = 36;
                      const range = maxTemp - minTemp;
                      const height = ((data.temp - minTemp) / range) * 100;
                      
                      return (
                        <div
                          key={data.day}
                          className="flex-1 bg-gradient-to-t from-info to-info/60 rounded-t-lg transition-all duration-500 hover:opacity-80"
                          style={{ height: `${height}%`, minHeight: '8px' }}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between gap-2 px-2 pt-2">
                    {weeklyData.map((data) => (
                      <span key={data.day} className="flex-1 text-center text-xs text-muted-foreground">{data.day}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm pt-4 border-t">
                  <div>
                    <p className="text-muted-foreground text-xs">Average</p>
                    <p className="font-semibold">{stats.avgTemp}°C</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Peak</p>
                    <p className="font-semibold">{stats.maxTemp}°C</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Lowest</p>
                    <p className="font-semibold">{stats.minTemp}°C</p>
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
              <span className="text-sm text-muted-foreground">Total steps this week</span>
              <span className="font-semibold">{stats.totalSteps.toLocaleString()}</span>
            </div>
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
