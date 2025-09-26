const MockService = {
  saveField: async function (fieldJson) {
    console.log("Saving locally:", fieldJson);
    localStorage.setItem("savedField", JSON.stringify(fieldJson));

    try {
      const res = await fetch("http://localhost:4000/api/field", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fieldJson),
      });

      const data = await res.json();
      console.log("Posted to backend:", data);
    } catch (err) {
      console.error("Failed to POST:", err);
    }
  },

  getField: function () {
    const saved = localStorage.getItem("savedField");
    return saved ? JSON.parse(saved) : null;
  },
};

export default MockService;
