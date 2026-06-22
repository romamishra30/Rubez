import { motion } from "framer-motion";

export default function StretchyToggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-14 rounded-full border transition-all duration-300
      ${
        checked
          ? "border-cyan-300 bg-cyan-300/20 shadow-[0_0_20px_rgba(34,211,238,0.6)]"
          : "border-cyan-300/30 bg-black/40"
      }`}
    >
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
        }}
        className={`absolute top-1 h-5 w-5 rounded-full
        ${
          checked
            ? "left-8 bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)]"
            : "left-1 bg-white"
        }`}
      >
        <div className="absolute left-1.5 top-1 h-1.5 w-3 rounded-full bg-white/60 blur-[1px]" />
      </motion.div>
    </button>
  );
}