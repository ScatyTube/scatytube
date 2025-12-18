import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-gradient-to-b group-[.toaster]:from-[#ffffcc] group-[.toaster]:to-[#ffff99] group-[.toaster]:text-[#333333] group-[.toaster]:border-2 group-[.toaster]:border-[#cc9900] group-[.toaster]:shadow-[2px_2px_0px_#999999] group-[.toaster]:rounded-none group-[.toaster]:font-['Arial'] group-[.toaster]:text-[11px]",
          description: "group-[.toast]:text-[#666666] group-[.toast]:text-[10px]",
          actionButton: "group-[.toast]:bg-gradient-to-b group-[.toast]:from-[#f0f0f0] group-[.toast]:to-[#cccccc] group-[.toast]:text-[#333333] group-[.toast]:border group-[.toast]:border-[#999999] group-[.toast]:rounded-none group-[.toast]:text-[10px] group-[.toast]:font-bold",
          cancelButton: "group-[.toast]:bg-gradient-to-b group-[.toast]:from-[#f0f0f0] group-[.toast]:to-[#cccccc] group-[.toast]:text-[#666666] group-[.toast]:border group-[.toast]:border-[#999999] group-[.toast]:rounded-none group-[.toast]:text-[10px]",
          success: "group-[.toaster]:bg-gradient-to-b group-[.toaster]:from-[#ccffcc] group-[.toaster]:to-[#99ff99] group-[.toaster]:border-[#339933]",
          error: "group-[.toaster]:bg-gradient-to-b group-[.toaster]:from-[#ffcccc] group-[.toaster]:to-[#ff9999] group-[.toaster]:border-[#cc3333]",
          info: "group-[.toaster]:bg-gradient-to-b group-[.toaster]:from-[#ccccff] group-[.toaster]:to-[#9999ff] group-[.toaster]:border-[#3333cc]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
