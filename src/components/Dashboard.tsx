
import React, { useState, useEffect } from "react";
import MoodTracker from "./MoodTracker";
import MoodChart from "./MoodChart";
import JournalPrompt from "./JournalPrompt";
import JournalHistory from "./JournalHistory";
import ChatInterface from "./ChatInterface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import ThemeToggle from "./ThemeToggle";
import AuthButtons from "./AuthButtons";
import { v4 as uuidv4 } from "uuid";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset
} from "@/components/ui/sidebar";
import { Book, MessageSquare, BarChart, History, Home } from "lucide-react";

type MoodType = "great" | "good" | "neutral" | "bad" | "terrible";

// Mock data for mood history
const mockMoodData = [
  { date: "Mon", value: 3, mood: "neutral" as MoodType },
  { date: "Tue", value: 2, mood: "bad" as MoodType },
  { date: "Wed", value: 4, mood: "good" as MoodType },
  { date: "Thu", value: 5, mood: "great" as MoodType },
  { date: "Fri", value: 4, mood: "good" as MoodType },
  { date: "Sat", value: 3, mood: "neutral" as MoodType },
  { date: "Sun", value: 4, mood: "good" as MoodType }
];

// Journal prompts
const journalPrompts = [
  "What are three things you're grateful for today?",
  "What's something that made you smile today?",
  "What's one thing you're looking forward to tomorrow?",
  "Describe a challenge you faced today and how you handled it.",
  "What's something new you learned about yourself recently?",
  "What boundaries do you need to set or maintain for your mental wellbeing?",
  "Describe a moment when you felt at peace today."
];

// Interface for journal entries
interface JournalEntry {
  id: string;
  content: string;
  prompt: string;
  timestamp: Date;
}

const Dashboard: React.FC = () => {
  const isMobile = useIsMobile();
  // State for mood data
  const [moodData, setMoodData] = useState(mockMoodData);
  // Active tab (used for mobile navigation)
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Journal entries
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const savedEntries = localStorage.getItem("journalEntries");
    return savedEntries ? JSON.parse(savedEntries) : [];
  });
  
  // Randomly select a journal prompt
  const [prompt, setPrompt] = useState(
    journalPrompts[Math.floor(Math.random() * journalPrompts.length)]
  );
  
  // Save journal entries to localStorage
  useEffect(() => {
    localStorage.setItem("journalEntries", JSON.stringify(journalEntries));
  }, [journalEntries]);
  
  // Handle mood submission
  const handleMoodSubmit = (mood: MoodType, notes: string) => {
    // Get today's day name
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    
    // Update mood data
    setMoodData(prev => {
      // Create new array without changing the original
      const newData = [...prev];
      // Find if today already exists
      const todayIndex = newData.findIndex(item => item.date === today);
      
      if (todayIndex >= 0) {
        // Update existing entry
        newData[todayIndex] = { 
          date: today, 
          value: getMoodValue(mood), 
          mood 
        };
      } else {
        // Add new entry
        newData.push({ 
          date: today, 
          value: getMoodValue(mood), 
          mood 
        });
      }
      
      return newData;
    });
    
    // Apply mood-based color theme
    applyMoodTheme(mood);
    
    toast.success("Mood tracked successfully!");
  };
  
  // Apply color theme based on mood
  const applyMoodTheme = (mood: MoodType) => {
    document.documentElement.classList.remove('mood-great', 'mood-good', 'mood-neutral', 'mood-bad', 'mood-terrible');
    document.documentElement.classList.add(`mood-${mood}`);
  };
  
  // Get numerical value for mood
  const getMoodValue = (mood: MoodType): number => {
    switch (mood) {
      case "terrible": return 1;
      case "bad": return 2;
      case "neutral": return 3;
      case "good": return 4;
      case "great": return 5;
      default: return 3;
    }
  };
  
  // Handle journal entry submission
  const handleJournalSave = (entry: string, prompt: string) => {
    // Create new entry
    const newEntry: JournalEntry = {
      id: uuidv4(),
      content: entry,
      prompt,
      timestamp: new Date()
    };
    
    // Add to journal entries
    setJournalEntries(prev => [newEntry, ...prev]);
    
    toast.success("Journal entry saved!");
    
    // Set a new random prompt
    setPrompt(journalPrompts[Math.floor(Math.random() * journalPrompts.length)]);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  // Mobile sidebar navigation
  const MobileSidebar = () => (
    <Sidebar>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => handleTabChange("dashboard")} 
              isActive={activeTab === "dashboard"}
              tooltip="Dashboard"
            >
              <BarChart />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => handleTabChange("chat")} 
              isActive={activeTab === "chat"}
              tooltip="Chat"
            >
              <MessageSquare />
              <span>Chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => handleTabChange("journal")} 
              isActive={activeTab === "journal"}
              tooltip="Journal"
            >
              <Book />
              <span>Journal</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => handleTabChange("history")} 
              isActive={activeTab === "history"}
              tooltip="History"
            >
              <History />
              <span>History</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
  
  const HeaderSection = () => (
    <div className="flex justify-between items-center mb-4 md:mb-6">
      <h1 className="text-2xl md:text-3xl font-bold text-mental-tertiary">Mental Health Copilot</h1>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <AuthButtons />
      </div>
    </div>
  );
  
  const MainContent = () => (
    <div className="container px-4 py-4 md:py-8 max-w-6xl">
      <HeaderSection />
      
      {isMobile ? (
        // Mobile view with active tab content
        <div className="animate-fade-in">
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 gap-4">
              <MoodTracker onSubmit={handleMoodSubmit} />
              <MoodChart data={moodData} />
            </div>
          )}
          
          {activeTab === "chat" && (
            <ChatInterface />
          )}
          
          {activeTab === "journal" && (
            <JournalPrompt prompt={prompt} onSave={handleJournalSave} />
          )}
          
          {activeTab === "history" && (
            <JournalHistory entries={journalEntries} />
          )}
        </div>
      ) : (
        // Desktop tabs view
        <Tabs defaultValue="dashboard" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-mental-light">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-mental-primary data-[state=active]:text-white">Dashboard</TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-mental-primary data-[state=active]:text-white">Chat</TabsTrigger>
            <TabsTrigger value="journal" className="data-[state=active]:bg-mental-primary data-[state=active]:text-white">Journal</TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-mental-primary data-[state=active]:text-white">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MoodTracker onSubmit={handleMoodSubmit} />
              <MoodChart data={moodData} />
            </div>
          </TabsContent>
          
          <TabsContent value="chat" className="animate-fade-in">
            <ChatInterface />
          </TabsContent>
          
          <TabsContent value="journal" className="animate-fade-in">
            <JournalPrompt prompt={prompt} onSave={handleJournalSave} />
          </TabsContent>
          
          <TabsContent value="history" className="animate-fade-in">
            <JournalHistory entries={journalEntries} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
  
  return isMobile ? (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-svh w-full">
        <MobileSidebar />
        <SidebarInset>
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold text-mental-tertiary">Mental Health Copilot</h2>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <SidebarTrigger />
            </div>
          </div>
          <MainContent />
        </SidebarInset>
      </div>
    </SidebarProvider>
  ) : (
    <MainContent />
  );
};

export default Dashboard;
