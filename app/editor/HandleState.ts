 const HandleState = async (userId: string, texts: string) => {
    try {
      const res = await fetch("/api/save-editor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, texts }),
      });
  
      const data = await res.json();
      console.log("🧠 Saved:", data);
    } catch (err) {
      console.error("❌ Save failed:", err);
    }
  };

  export default HandleState;
  