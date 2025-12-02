import { FolderTree, Guitar, Mail, Eye } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { useInstruments } from "@/hooks/useInstruments";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function DashboardOverview() {
  const { data: categories } = useCategories();
  const { data: instruments } = useInstruments();
  const { data: messages } = useQuery({
    queryKey: ["contact-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const unreadMessages = messages?.filter((m) => !m.read).length || 0;

  const stats = [
    {
      label: "Categories",
      value: categories?.length || 0,
      icon: FolderTree,
      href: "/admin/categories",
    },
    {
      label: "Instruments",
      value: instruments?.length || 0,
      icon: Guitar,
      href: "/admin/instruments",
    },
    {
      label: "Unread Messages",
      value: unreadMessages,
      icon: Mail,
      href: "/admin/messages",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage your instrument store from here
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.href}
            className="bg-card rounded-xl p-6 shadow-card hover:shadow-elegant transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-gold" />
              </div>
              <span className="font-display text-3xl font-bold">{stat.value}</span>
            </div>
            <h3 className="font-medium text-muted-foreground">{stat.label}</h3>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h2 className="font-display text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/admin/categories">Manage Categories</Link>
          </Button>
          <Button asChild>
            <Link to="/admin/instruments">Add Instruments</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/" target="_blank">
              <Eye className="w-4 h-4 mr-2" />
              View Website
            </Link>
          </Button>
        </div>
      </div>

      {/* Recent Messages */}
      {messages && messages.length > 0 && (
        <div className="bg-card rounded-xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold">Recent Messages</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/messages">View All</Link>
            </Button>
          </div>
          <div className="space-y-3">
            {messages.slice(0, 5).map((message) => (
              <div
                key={message.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div>
                  <div className="font-medium">{message.name}</div>
                  <div className="text-sm text-muted-foreground truncate max-w-xs">
                    {message.message}
                  </div>
                </div>
                {!message.read && (
                  <span className="w-2 h-2 bg-gold rounded-full" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
