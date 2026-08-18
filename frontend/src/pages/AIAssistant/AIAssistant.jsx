import { useState } from "react";

import AIAssistantHeader from "@/components/ai/assistant/AIAssistantHeader";
import AIWelcome from "@/components/ai/assistant/AIWelcome";
import AIConversation from "@/components/ai/assistant/AIConversation";
import AIChatInput from "@/components/ai/assistant/AIChatInput";
import AIThinking from "@/components/ai/shared/AIThinking";

/*
|--------------------------------------------------------------------------
| Mock product data
|--------------------------------------------------------------------------
*/

const mockProducts = [
  {
    id: "ai-product-1",
    name: "Sony WH-1000XM5 Wireless Headphones",
    image: "https://placehold.co/600x600/e2e8f0/475569?text=Sony+WH-1000XM5",
    price: 29990,
    originalPrice: 34990,
    rating: 4.8,
    reviewCount: 1248,
    discount: 14,
    reason: "Excellent noise cancellation and great for office calls.",
  },

  {
    id: "ai-product-2",
    name: "Bose QuietComfort Wireless Headphones",
    image: "https://placehold.co/600x600/e2e8f0/475569?text=Bose+QuietComfort",
    price: 24900,
    originalPrice: 29900,
    rating: 4.6,
    reviewCount: 892,
    discount: 17,
    reason: "A comfortable choice for long listening sessions.",
  },

  {
    id: "ai-product-3",
    name: "Apple AirPods Max",
    image: "https://placehold.co/600x600/e2e8f0/475569?text=AirPods+Max",
    price: 59900,
    rating: 4.7,
    reviewCount: 634,
    reason: "Premium build quality with excellent Apple ecosystem integration.",
  },
];

/*
|--------------------------------------------------------------------------
| Mock comparison data
|--------------------------------------------------------------------------
*/

const mockComparisonProducts = [
  {
    id: "compare-1",
    name: "Sony WH-1000XM5",
    image: "https://placehold.co/600x600/e2e8f0/475569?text=Sony",
    price: 29990,
    originalPrice: 34990,
    rating: 4.8,
    reviewCount: 1248,
    discount: 14,
    bestFor: "Noise cancellation",
    aiVerdict: "Best overall choice",
    recommended: true,
  },

  {
    id: "compare-2",
    name: "Bose QuietComfort",
    image: "https://placehold.co/600x600/e2e8f0/475569?text=Bose",
    price: 24900,
    originalPrice: 29900,
    rating: 4.6,
    reviewCount: 892,
    discount: 17,
    bestFor: "Comfort",
    aiVerdict: "Best for long listening",
  },

  {
    id: "compare-3",
    name: "Apple AirPods Max",
    image: "https://placehold.co/600x600/e2e8f0/475569?text=AirPods",
    price: 59900,
    rating: 4.7,
    reviewCount: 634,
    bestFor: "Apple ecosystem",
    aiVerdict: "Best premium option",
  },
];

/*
|--------------------------------------------------------------------------
| AI Assistant Page
|--------------------------------------------------------------------------
*/

export default function AIAssistant() {
  const [messages, setMessages] = useState([]);

  const [isThinking, setIsThinking] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Conversation state
  |--------------------------------------------------------------------------
  */

  const hasConversation = messages.length > 0;

  /*
  |--------------------------------------------------------------------------
  | Submit message
  |--------------------------------------------------------------------------
  */

  const handleSubmit = (message) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isThinking) {
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Add user message
    |--------------------------------------------------------------------------
    */

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      type: "text",
      content: trimmedMessage,
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);

    setIsThinking(true);

    /*
    |--------------------------------------------------------------------------
    | Temporary mock AI
    |--------------------------------------------------------------------------
    */

    window.setTimeout(() => {
      const lowerMessage = trimmedMessage.toLowerCase();

      /*
      |--------------------------------------------------------------------------
      | Review request
      |--------------------------------------------------------------------------
      */

      const isReviewRequest =
        lowerMessage.includes("review") ||
        lowerMessage.includes("reviews") ||
        lowerMessage.includes("worth it") ||
        lowerMessage.includes("customer feedback");

      /*
      |--------------------------------------------------------------------------
      | Comparison request
      |--------------------------------------------------------------------------
      */

      const isComparisonRequest =
        lowerMessage.includes("compare") ||
        lowerMessage.includes("comparison") ||
        lowerMessage.includes("difference") ||
        lowerMessage.includes(" vs ") ||
        lowerMessage.includes("versus");

      /*
      |--------------------------------------------------------------------------
      | Review response
      |--------------------------------------------------------------------------
      */

      if (isReviewRequest) {
        setMessages((currentMessages) => [
          ...currentMessages,

          {
            id: crypto.randomUUID(),
            role: "assistant",
            type: "text",
            content:
              "I analyzed the customer feedback and summarized the most common opinions below.",
          },

          {
            id: crypto.randomUUID(),
            role: "assistant",
            type: "review-summary",
            rating: 4.7,
            totalReviews: 1248,
            summary:
              "Customers are highly satisfied with this product. Most reviewers praise its performance, comfort, and overall build quality. The main concern is the premium price.",
            positivePoints: [
              "Excellent overall performance",
              "Strong build quality",
              "Comfortable for long-term use",
              "Very good noise cancellation",
            ],
            negativePoints: [
              "Premium pricing",
              "Some users mention minor connectivity issues",
            ],
            verdict: "Recommended for most buyers",
          },
        ]);

        setIsThinking(false);

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Comparison response
      |--------------------------------------------------------------------------
      */

      if (isComparisonRequest) {
        setMessages((currentMessages) => [
          ...currentMessages,

          {
            id: crypto.randomUUID(),
            role: "assistant",
            type: "text",
            content:
              "I've compared these options based on price, ratings, value, and the experience they offer.",
          },

          {
            id: crypto.randomUUID(),
            role: "assistant",
            type: "comparison",
            products: mockComparisonProducts,
          },
        ]);

        setIsThinking(false);

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Product recommendation response
      |--------------------------------------------------------------------------
      */

      setMessages((currentMessages) => [
        ...currentMessages,

        {
          id: crypto.randomUUID(),
          role: "assistant",
          type: "text",
          content:
            "Based on your request, I found a few products that may be a good fit for you.",
        },

        {
          id: crypto.randomUUID(),
          role: "assistant",
          type: "products",
          products: mockProducts,
        },
      ]);

      setIsThinking(false);
    }, 900);
  };

  /*
  |--------------------------------------------------------------------------
  | Suggestion
  |--------------------------------------------------------------------------
  */

  const handleSuggestion = (prompt) => {
    handleSubmit(prompt);
  };

  /*
  |--------------------------------------------------------------------------
  | New chat
  |--------------------------------------------------------------------------
  */

  const handleNewChat = () => {
    setMessages([]);
    setIsThinking(false);
  };

  /*
  |--------------------------------------------------------------------------
  | Add to cart
  |--------------------------------------------------------------------------
  */

  const handleAddToCart = (product) => {
    console.log("Add to cart:", product);
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div
      className="
        flex
        min-h-screen
        flex-col
        bg-slate-50
        dark:bg-slate-950
      "
    >
      {/* ================================================================ */}
      {/* Header                                                           */}
      {/* ================================================================ */}

      <AIAssistantHeader onNewChat={handleNewChat} />

      {/* ================================================================ */}
      {/* Main                                                             */}
      {/* ================================================================ */}

      <main className="flex min-h-0 flex-1 flex-col">
        {!hasConversation ? (
          <div className="flex flex-1 items-center justify-center">
            <AIWelcome onSuggestion={handleSuggestion} />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <AIConversation messages={messages} onAddToCart={handleAddToCart} />

            {/* AI thinking */}

            {isThinking && (
              <div
                className="
                  mx-auto
                  w-full
                  max-w-5xl
                  px-4
                  pb-6
                  sm:px-6
                  lg:px-8
                "
              >
                <AIThinking />
              </div>
            )}
          </div>
        )}
      </main>

      {/* ================================================================ */}
      {/* Chat input                                                       */}
      {/* ================================================================ */}

      <div
        className="
          sticky
          bottom-0
          z-10
          border-t
          border-slate-200/80
          bg-slate-50/90
          backdrop-blur-xl
          dark:border-slate-800
          dark:bg-slate-950/90
        "
      >
        <AIChatInput onSubmit={handleSubmit} disabled={isThinking} />
      </div>
    </div>
  );
}
