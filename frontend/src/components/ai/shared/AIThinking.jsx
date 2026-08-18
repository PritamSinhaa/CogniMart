import AIWelcome from "@/components/ai/assistant/AIWelcome";

export default function AIAssistant() {
  const handleSuggestion = (message) => {
    console.log(message);
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950">
      <AIWelcome onSuggestion={handleSuggestion} />
    </main>
  );
}