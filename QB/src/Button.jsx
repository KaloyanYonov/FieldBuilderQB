import { useState } from "react";

export default function Button({ children, variant = "submit", onClick, type="button" }) {
  const [loading, setLoading] = useState(false);

  const baseStyle = "py-2 px-2 mr-3 rounded font-bold text-base";
  const variants = {
    submit: "bg-green-500 text-white hover:bg-green-600",
    cancel: "text-red-500 hover:text-red-700",
  };

  const handleClick = async (e) => {
    if (!onClick) {
        return;
    }
    setLoading(true);
    try {
      await onClick(e);
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <button type={type} onClick={handleClick} className={`${baseStyle} ${variants[variant]}`}>
      {loading ? "Loading..." : children}
    </button>
  );
}


