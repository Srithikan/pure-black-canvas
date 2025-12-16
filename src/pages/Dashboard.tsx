import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Thermometer, Footprints, Wind, FileText, TrendingUp } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const Dashboard = () => {
  const navigate = useNavigate();
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening";

  const stats = [
    { label: "Pressure", value: "Normal", icon: Activity, color: "text-success" },
    { label: "Temperature", value: "36.5°C", icon: Thermometer, color: "text-info" },
    { label: "Foot Status", value: "Healthy", icon: Footprints, color: "text-primary" },
  ];

  const mainCards = [
    {
      title: "Live Monitoring",
      description: "Real-time foot pressure & temperature",
      icon: Activity,
      gradient: "from-primary to-primary/80",
      path: "/monitor",
    },
    {
      title: "Reports",
      description: "Historical data & AI insights",
      icon: FileText,
      gradient: "from-secondary to-secondary/80",
      path: "/reports",
    },
    {
      title: "Foot Massager",
      description: "Control massage modes",
      icon: Wind,
      gradient: "from-info to-info/80",
      path: "/massager",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header with Gradient */}
      <div className="gradient-medical text-white p-6 pb-8 rounded-b-3xl shadow-lg">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold mb-1">{greeting}, Srithikan</h1>
          <p className="text-white/80 text-sm">Your feet are in good shape today</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="glass-effect shadow-md">
              <CardContent className="p-4 text-center">
                <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className="font-semibold text-sm">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Feature Cards */}
        <div className="space-y-4">
          {mainCards.map((card) => (
            <Card
              key={card.title}
              className="card-hover cursor-pointer overflow-hidden"
              onClick={() => navigate(card.path)}
            >
              <div className={`h-2 bg-gradient-to-r ${card.gradient}`}></div>
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${card.gradient}`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{card.title}</h3>
                    <p className="text-sm text-muted-foreground">{card.description}</p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Daily Tip */}
        <Card className="mt-6 bg-accent/50 border-accent">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-accent-foreground/10 rounded-lg">
                <Footprints className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1 text-accent-foreground">Daily Tip</h4>
                <p className="text-xs text-accent-foreground/80">
                  Keep your feet moisturized and inspect them daily for any changes.
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

export default Dashboard;
