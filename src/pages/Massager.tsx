import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Footprints, Wind, Snowflake, Flame, Sparkles } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { toast } from "sonner";

type MassageMode = "normal" | "cooling" | "warm" | "acupuncture";

const Massager = () => {
  const [isOn, setIsOn] = useState(false);
  const [activeMode, setActiveMode] = useState<MassageMode>("normal");

  const modes = [
    {
      id: "normal" as MassageMode,
      name: "Normal Mode",
      icon: Footprints,
      description: "Standard massage therapy",
      color: "from-primary to-primary/80",
    },
    {
      id: "cooling" as MassageMode,
      name: "Cooling Mode",
      icon: Snowflake,
      description: "Refreshing cold therapy",
      color: "from-info to-info/80",
    },
    {
      id: "warm" as MassageMode,
      name: "Warm Massage",
      icon: Flame,
      description: "Epsom salt simulation",
      color: "from-warning to-warning/80",
    },
    {
      id: "acupuncture" as MassageMode,
      name: "Acupuncture Mode",
      icon: Sparkles,
      description: "Targeted pressure points",
      color: "from-secondary to-secondary/80",
    },
  ];

  const handleToggle = (checked: boolean) => {
    setIsOn(checked);
    if (checked) {
      toast.success("Massager activated");
    } else {
      toast.info("Massager deactivated");
    }
  };

  const handleModeSelect = (mode: MassageMode) => {
    if (!isOn) {
      toast.error("Please turn on the massager first");
      return;
    }
    setActiveMode(mode);
    const modeName = modes.find(m => m.id === mode)?.name;
    toast.success(`Switched to ${modeName}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="gradient-medical text-white p-6 sticky top-0 z-10 shadow-lg">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold mb-2">Foot Massager</h1>
          <p className="text-white/80 text-sm">Control your therapeutic massage</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Power Control */}
        <Card className="glass-effect">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl bg-gradient-to-r transition-all duration-300 ${
                  isOn ? 'from-primary to-primary/80 scale-110' : 'from-muted to-muted/80'
                }`}>
                  <Wind className={`w-8 h-8 ${isOn ? 'text-white' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Massager Power</h3>
                  <p className="text-sm text-muted-foreground">
                    {isOn ? "Currently active" : "Currently off"}
                  </p>
                </div>
              </div>
              <Switch
                checked={isOn}
                onCheckedChange={handleToggle}
                className="scale-125"
              />
            </div>
          </CardContent>
        </Card>

        {/* Mode Selection */}
        <div>
          <h2 className="text-lg font-semibold mb-4 px-1">Select Massage Mode</h2>
          <div className="grid grid-cols-2 gap-4">
            {modes.map((mode) => {
              const Icon = mode.icon;
              const isActive = activeMode === mode.id;
              
              return (
                <Card
                  key={mode.id}
                  className={`cursor-pointer transition-all duration-300 ${
                    isActive 
                      ? 'ring-2 ring-primary shadow-lg scale-105' 
                      : 'hover:shadow-md hover:scale-102'
                  } ${!isOn && 'opacity-50'}`}
                  onClick={() => handleModeSelect(mode.id)}
                >
                  <CardContent className="p-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${mode.color} mb-3 inline-block`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{mode.name}</h3>
                    <p className="text-xs text-muted-foreground">{mode.description}</p>
                    
                    {isActive && isOn && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-primary font-medium">
                        <div className="w-2 h-2 bg-primary rounded-full pulse-gentle"></div>
                        Active
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Current Status */}
        {isOn && (
          <Card className="bg-accent/30 border-accent animate-fade-in">
            <CardHeader>
              <CardTitle className="text-base">Current Session</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Mode</span>
                  <span className="font-medium">
                    {modes.find(m => m.id === activeMode)?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="font-medium">Auto-stop in 15 min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Intensity</span>
                  <span className="font-medium">Medium</span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => handleToggle(false)}
              >
                Stop Session
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Usage Tips */}
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Usage Tips</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Use cooling mode after long walks</li>
                  <li>• Warm massage helps with circulation</li>
                  <li>• Limit sessions to 15-20 minutes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Massager;
