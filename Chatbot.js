import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function EngagementRingChatbot() {
  const [messages, setMessages] = useState([
    { text: "Welcome! Let's design your perfect engagement ring. What metal do you prefer? (Gold, Platinum, Rose Gold, White Gold)", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const generateImage = async (description) => {
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: description }),
      });
      const data = await response.json();
      setImageUrl(data.imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    setTimeout(() => {
      let botResponse = "";
      let imagePrompt = "";
      if (input.toLowerCase().includes("gold")) {
        botResponse = "Great choice! Now, what stone would you like? (Diamond, Sapphire, Emerald, Ruby)";
        imagePrompt = "A luxurious gold engagement ring with a stunning gemstone";
      } else if (input.toLowerCase().includes("platinum")) {
        botResponse = "Platinum is a timeless option! Which stone do you prefer? (Diamond, Sapphire, Emerald, Ruby)";
        imagePrompt = "A modern platinum engagement ring with a brilliant gemstone";
      } else {
        botResponse = "That sounds wonderful! What stone would you like? (Diamond, Sapphire, Emerald, Ruby)";
        imagePrompt = "A custom engagement ring with an elegant design";
      }
      setMessages([...newMessages, { text: botResponse, sender: "bot" }]);
      generateImage(imagePrompt);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <Card className="w-full max-w-md p-4">
        <CardContent className="space-y-4">
          <div className="h-96 overflow-y-auto p-2 border border-gray-300 rounded-lg bg-white">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={`p-2 my-1 rounded-lg w-fit max-w-xs ${msg.sender === "bot" ? "bg-blue-100 self-start" : "bg-green-100 self-end"}`}
              >
                {msg.text}
              </motion.div>
            ))}
            {imageUrl && <img src={imageUrl} alt="Generated ring design" className="mt-4 w-full rounded-lg" />}
          </div>
          <div className="flex items-center gap-2">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your response..." />
            <Button onClick={handleSend}>Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
