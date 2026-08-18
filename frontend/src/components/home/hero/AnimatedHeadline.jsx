import { useEffect, useState } from "react";

const lines = [
  {
    text: "Smart Shopping",
    highlight: false,
  },
  {
    text: "Powered by AI",
    highlight: true,
  },
];

export default function AnimatedHeadline() {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  const currentLine = lines[lineIndex];

  useEffect(() => {
    let timeout;

    // Finished typing the current line
    if (
      !isDeleting &&
      charIndex === currentLine.text.length
    ) {
      // If this is the last line, wait before deleting
      if (lineIndex === lines.length - 1) {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 3500);
      } else {
        // Move to next line
        timeout = setTimeout(() => {
          setLineIndex((prev) => prev + 1);
          setCharIndex(0);
        }, 250);
      }
    }

    // Finished deleting
    else if (
      isDeleting &&
      charIndex === 0
    ) {
      if (lineIndex === 0) {
        // Wait before starting again
        timeout = setTimeout(() => {
          setIsDeleting(false);
        }, 900);
      } else {
        // Delete first line next
        timeout = setTimeout(() => {
          setLineIndex((prev) => prev - 1);
          setCharIndex(lines[lineIndex - 1].text.length);
        }, 120);
      }
    }

    // Typing
    else if (!isDeleting) {
      timeout = setTimeout(() => {
        setCharIndex((prev) => prev + 1);
      }, 65);
    }

    // Deleting
    else {
      timeout = setTimeout(() => {
        setCharIndex((prev) => prev - 1);
      }, 42);
    }

    return () => clearTimeout(timeout);
  }, [
    charIndex,
    lineIndex,
    isDeleting,
    currentLine.text,
  ]);

  const visibleText = currentLine.text.slice(
    0,
    charIndex,
  );

  return (
    <h1
      className="
        min-h-[135px]
        max-w-3xl
        text-4xl
        font-bold
        leading-[1.08]
        tracking-tight
        text-slate-950
        sm:min-h-[150px]
        sm:text-5xl
        lg:min-h-[175px]
        lg:text-6xl
        xl:text-7xl
        dark:text-white
      "
    >
      {/* First line */}
      <span className="block whitespace-nowrap">
        {lineIndex === 0 ? (
          visibleText.split("").map((char, index) => (
            <span
              key={index}
              className="
                inline-block
                animate-[letterIn_0.25s_ease-out]
              "
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))
        ) : (
          "Smart Shopping"
        )}
      </span>

      {/* Second line */}
      <span
        className="
          block
          whitespace-nowrap
          text-emerald-600
          [word-spacing:0.12em]
        "
      >
        {lineIndex === 1
          ? visibleText.split("").map(
              (char, index) => (
                <span
                  key={index}
                  className="
                    inline-block
                    animate-[letterIn_0.25s_ease-out]
                  "
                >
                  {char === " "
                    ? "\u00A0"
                    : char}
                </span>
              ),
            )
          : ""}
      </span>

      
    </h1>
  );
}