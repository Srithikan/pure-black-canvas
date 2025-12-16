import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Thermometer, Wifi, WifiOff, Footprints } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";

const Monitor = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [pressure, setPressure] = useState(45);
  const [temperature, setTemperature] = useState(36.5);

  // Fetch latest sensor data and subscribe to real-time updates
  useEffect(() => {
    // Fetch the latest sensor data
    const fetchLatestData = async () => {
      const { data, error } = await supabase
        .from('sensor_data')
        .select('pressure, temperature')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data && !error) {
        if (data.pressure !== null) setPressure(data.pressure);
        if (data.temperature !== null) setTemperature(data.temperature);
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    };

    fetchLatestData();

    // Poll for updates every second
    const pollInterval = setInterval(fetchLatestData, 1000);

    // Subscribe to real-time updates
    const channel = supabase
      .channel('sensor-data-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sensor_data'
        },
        (payload) => {
          const newData = payload.new as { pressure: number | null; temperature: number | null };
          if (newData.pressure !== null) setPressure(newData.pressure);
          if (newData.temperature !== null) setTemperature(newData.temperature);
          setIsConnected(true);
        }
      )
      .subscribe();

    return () => {
      clearInterval(pollInterval);
      supabase.removeChannel(channel);
    };
  }, []);

  const getPressureColor = (value: number) => {
    if (value < 30) return "hsl(var(--heat-low))";
    if (value < 60) return "hsl(var(--heat-medium))";
    return "hsl(var(--heat-high))";
  };

  const getPressureStatus = (value: number) => {
    if (value < 30) return { label: "Low", variant: "secondary" as const };
    if (value < 60) return { label: "Normal", variant: "default" as const };
    return { label: "High", variant: "destructive" as const };
  };

  const getFootStatus = (pressure: number, temperature: number) => {
    // No contact detected
    if (pressure < 5) {
      return { label: "No Contact", variant: "secondary" as const };
    }
    // Abnormally low temperature (potential circulation issue or sensor error)
    if (temperature < 30) {
      return { label: "Check Sensor", variant: "secondary" as const };
    }
    // High risk conditions
    if (pressure > 70 || temperature > 38) {
      return { label: "At Risk", variant: "destructive" as const };
    }
    // Warning conditions
    if (pressure > 60 || temperature > 37) {
      return { label: "Warning", variant: "secondary" as const };
    }
    return { label: "Healthy", variant: "default" as const };
  };

  const pressureStatus = getPressureStatus(pressure);
  const footStatus = getFootStatus(pressure, temperature);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="gradient-medical text-white p-6 sticky top-0 z-10 shadow-lg">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">Live Monitoring</h1>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Wifi className="w-5 h-5" />
              ) : (
                <WifiOff className="w-5 h-5" />
              )}
              <span className="text-sm">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>
          <p className="text-white/80 text-sm">Real-time foot pressure & temperature</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Live Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="glass-effect">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Pressure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{pressure.toFixed(0)}</span>
                <span className="text-muted-foreground mb-1">kPa</span>
              </div>
              <Badge variant={pressureStatus.variant} className="mt-2">
                {pressureStatus.label}
              </Badge>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-info" />
                Temperature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{temperature.toFixed(1)}</span>
                <span className="text-muted-foreground mb-1">°C</span>
              </div>
              <Badge variant="secondary" className="mt-2">
                Normal
              </Badge>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Footprints className="w-4 h-4 text-success" />
                Foot Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-12">
                <span className="text-2xl font-bold">{footStatus.label}</span>
              </div>
              <Badge variant={footStatus.variant} className="mt-2 w-full justify-center">
                {footStatus.label === "Healthy" ? "All Good" : footStatus.label === "Warning" ? "Monitor" : "Check Now"}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Foot Heatmap Visualization */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pressure Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative flex justify-center py-8">
              {/* Simplified foot outline with pressure zones */}
              <div className="relative w-48 h-64">
                {/* Heel */}
                <div 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full transition-all duration-500 flex items-center justify-center"
                  style={{ 
                    backgroundColor: getPressureColor(pressure * 0.8),
                    opacity: 0.7 
                  }}
                >
                  <span className="text-white font-semibold text-sm">Heel</span>
                </div>
                
                {/* Mid foot */}
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-28 rounded-3xl transition-all duration-500 flex items-center justify-center"
                  style={{ 
                    backgroundColor: getPressureColor(pressure * 0.6),
                    opacity: 0.6 
                  }}
                >
                  <span className="text-white font-semibold text-xs">Mid</span>
                </div>
                
                {/* Forefoot */}
                <div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-20 rounded-t-full transition-all duration-500 flex items-center justify-center"
                  style={{ 
                    backgroundColor: getPressureColor(pressure),
                    opacity: 0.8 
                  }}
                >
                  <span className="text-white font-semibold text-xs">Toes</span>
                </div>

                {/* Animated pulse indicator */}
                {isConnected && (
                  <div className="absolute -top-2 -right-2">
                    <div className="w-4 h-4 bg-success rounded-full pulse-gentle"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "hsl(var(--heat-low))" }}></div>
                <span>Low</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "hsl(var(--heat-medium))" }}></div>
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "hsl(var(--heat-high))" }}></div>
                <span>High</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connection Info */}
        <Card className="bg-accent/30 border-accent">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-accent rounded-lg">
                <Activity className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Device Status</h4>
                <p className="text-xs text-muted-foreground">
                  {isConnected 
                    ? "ESP32 connected via Bluetooth. Data updating every 2 seconds." 
                    : "Device disconnected. Please check your connection."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Monitor;
