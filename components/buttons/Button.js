import { Loader2 } from "lucide-react";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = "left",
  onClick = () => {},
  pushLeft = false,
  ...props
}) => {
  const variants = {
    green: `bg-[#1FB25A] hover:bg-[#198C47] hover:bg-green-700 dark:bg-green-700 border-2 border-black dark:hover:bg-green-800 text-white`,
    red: `bg-[#F11C26] hover:bg-[#B81A21] hover:bg-green-700 dark:bg-green-700 border-2 border-black dark:hover:bg-green-800 text-white`,
  };

  const sizes = {
    xs: "px-2 py-1 text-xs",
    sm: "px-4 py-2 text-xs",
    md: "px-5 pb-2 pt-2.5 text-xs h-max w-max",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center ${
          pushLeft ? "justify-start" : "justify-center"
        } ITC-demi whitespace-nowrap tracking-wide transition-all duration-500 ease-in-out
        focus:outline-none
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}
      `}
      {...props}
    >
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />}
      {Icon && iconPosition === "left" && !loading && (
        <Icon className={`w-3.5 h-3.5 ${children && "mr-2"}`} />
      )}
      {children && children}
      {Icon && iconPosition === "right" && !loading && (
        <Icon className={`w-3.5 h-3.5 ${children && "mr-2"}`} />
      )}
    </button>
  );
};
