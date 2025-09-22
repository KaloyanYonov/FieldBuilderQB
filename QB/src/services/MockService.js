const MockService = {
  saveField: function (fieldJson) {
    console.log("Saving:", fieldJson);
    localStorage.setItem("savedField", JSON.stringify(fieldJson));
  },
  getField: function () {
    const saved = localStorage.getItem("savedField");
    return saved ? JSON.parse(saved) : null;
  }
};

export default MockService;
