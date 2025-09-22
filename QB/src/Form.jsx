import { useState, useEffect } from "react";
import Button from "./components/Button";
import MockService from "./services/MockService";

export default function Form() {
  const [label, setLabel] = useState("");
  const [required, setRequired] = useState(false);
  const [defaultValue, setDefaultValue] = useState("");
  const [choices, setChoices] = useState("");
  const [order, setOrder] = useState("alpha");
  const [error, setError] = useState("");

  const badWords = ["testing", "bad", "word"];

  useEffect(() => {
    const data = MockService.getField();
    if (data) {
      setLabel(data.label || "");
      setRequired(!!data.required);
      setDefaultValue(data.default || "");
      let arr = data.choices || [];
      if (data.default && !arr.includes(data.default)) {
        arr.push(data.default);
      }
      setChoices(arr.join("\n"));
      setOrder(data.order || "alpha");
    }
  }, []);

  const renderHighlighted = (text) => {
    return text.split("\n").map((line, i) => {
      if (line.length <= 40) {
        return <div key={i}>{line}</div>;
      }
      return (
        <div key={i}>
          {line.slice(0, 40)}
          <span className="text-red-600">{line.slice(40)}</span>
        </div>
      );
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    let choicesArr = choices
      .split("\n")
      .map((c) => c.trim())
      .filter((c) => c !== "");

    if (!label.trim()) {
      setError("Label is required!");
      return;
    }
    if (new Set(choicesArr).size !== choicesArr.length) {
      setError("Duplicate choices are not allowed!");
      return;
    }
    if (choicesArr.length > 50) {
      setError("You cannot have more than 50 choices!");
      return;
    }
    if (choicesArr.some((c) => c.length > 40)) {
      setError("One or more choices exceed 40 characters!");
      return;
    }

    if (defaultValue && !choicesArr.includes(defaultValue)) {
      choicesArr.push(defaultValue);
    }

    if (choicesArr.length > 50) {
      setError("Adding the default value made the list exceed 50 choices!");
      return;
    }

    // Added idea by me : prohibit the usage of certain words of your choosing (in the badWords array)
    if (choicesArr.some((choice) => badWords.includes(choice.toLowerCase()))) {
      setError("You cannot use bad words. One or more of your choices contain hateful speech.");
      return;
    }

    const fieldJson = {
      label: label.trim(),
      required,
      choices: choicesArr,
      order,
      default: defaultValue || null,
    };
    MockService.saveField(fieldJson); 

  };

  const handleCancel = () => {
    setLabel("");
    setRequired(false);
    setDefaultValue("");
    setChoices("");
    setOrder("alpha");
    setError("");

    localStorage.removeItem("savedField");
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-md w-full max-w-xl mx-auto">
      <div className="bg-blue-100 text-blue-900 font-bold px-4 py-2 rounded-t-lg border-b border-gray-300">
        Field Builder
      </div>

      <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
        <div className="flex flex-col sm:flex-row items-center p-4">
          <label
            htmlFor="label"
            className="w-full sm:w-40 font-semibold text-gray-700 mb-2 sm:mb-0 pl-6"
          >
            Label
          </label>
          <input
            id="label"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Enter field label"
            className="w-80 border rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center p-4">
          <label className="w-full sm:w-40 font-semibold text-gray-700 mb-2 sm:mb-0 pl-6">
            Type
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <span className="rounded py-1 text-base">Multi-select</span>
            <label className="flex items-center gap-2 text-sm pl-6">
              <input
                type="checkbox"
                checked={required}
                onChange={(e) => setRequired(e.target.checked)}
              />
              A value is required
            </label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center p-4">
          <label
            htmlFor="default"
            className="w-full sm:w-40 font-semibold text-gray-700 mb-2 sm:mb-0 pl-6"
          >
            Default Value
          </label>
          <input
            id="default"
            type="text"
            value={defaultValue}
            onChange={(e) => setDefaultValue(e.target.value)}
            placeholder="Enter default value"
            className="w-80 border rounded px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center p-4">
          <label
            htmlFor="choices"
            className="w-full sm:w-40 font-semibold text-gray-700 mb-6 sm:mb-0 pl-6"
          >
            Choices
          </label>
          <div className="relative w-80 flex flex-col sm:flex-row items-center">
            <div
              className="absolute inset-0 pointer-events-none whitespace-pre-wrap break-words px-3 py-2 text-sm text-gray-700 overflow-y-auto"
              id="highlightLayer"
            >
              {renderHighlighted(choices)}
            </div>

            <textarea
              id="choices"
              rows="6"
              value={choices}
              onChange={(e) => setChoices(e.target.value)}
              onScroll={(e) => {
                const highlight = document.getElementById("highlightLayer");
                if (highlight) {
                  highlight.scrollTop = e.target.scrollTop;
                }
              }}
              placeholder="Enter one choice per line"
              className="relative w-80 border bg-transparent text-transparent border-black rounded px-3 py-2 text-sm resize-y caret-black overflow-y-auto"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center p-4">
          <label
            htmlFor="order"
            className="w-full sm:w-40 font-semibold text-gray-700 mb-2 sm:mb-0 pl-6"
          >
            Order
          </label>
          <select
            id="order"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="w-80 border rounded px-3 py-2 text-sm"
          >
            <option value="alpha">Display choices in Alphabetical order</option>
            <option value="custom">Custom order</option>
          </select>
        </div>

        {error && <div className="text-red-600 text-sm px-4 py-2">{error}</div>}

        <div className="flex flex-col sm:flex-row justify-center items-center p-4">
          <Button type="submit" variant="submit" onClick={handleSubmit}>
            Save changes
          </Button>

          <span className="text-gray-500 hidden sm:inline">Or</span>
          <Button type="button" variant="cancel" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
