"""
PRESTIJ — Agent 2 Launcher
Paste your Groq API key when prompted, then it runs automatically.
Get free key at: https://console.groq.com
"""

import os
import sys

print("=" * 55)
print("  PRESTIJ — Agent 2 Launcher")
print("=" * 55)
print()
print("  Get free Groq API key at: https://console.groq.com")
print()

# Ask for key if not already set
if not os.environ.get("GROQ_API_KEY"):
    key = input("  Paste your Groq API key here: ").strip()
    if not key:
        print("\n  ERROR: No API key entered. Exiting.")
        sys.exit(1)
    os.environ["GROQ_API_KEY"] = key
    print("  OK  Key set.\n")
else:
    print("  OK  GROQ_API_KEY already set in environment.\n")

# Run agent2
import agent2
agent2.run()
