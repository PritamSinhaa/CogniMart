import AIMessage from "./AIMessage";

export default function AIConversation({
  messages = [],
  onAddToCart,
}) {
  return (
    <section
      className="
        mx-auto
        w-full
        max-w-5xl
        px-4
        py-6
        sm:px-6
        lg:px-8
      "
    >
      <div className="space-y-7">
        {messages.map((message) => (
          <AIMessage
            key={message.id}
            role={message.role}
            type={message.type}
            content={message.content}
            products={message.products}
            onAddToCart={onAddToCart}
            rating={message.rating}
            totalReviews={message.totalReviews}
            summary={message.summary}
            positivePoints={message.positivePoints}
            negativePoints={message.negativePoints}
            verdict={message.verdict}
          />
        ))}
      </div>
    </section>
  );
}