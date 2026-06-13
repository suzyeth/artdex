"use client"

import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { type ReactNode, useEffect } from "react"

export function BottomSheet({
  open,
  onClose,
  children,
  className,
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
  className?: string
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose()
      }
      window.addEventListener("keydown", onKey)
      return () => {
        document.body.style.overflow = ""
        window.removeEventListener("keydown", onKey)
      }
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120) onClose()
            }}
            className={cn(
              "relative z-10 max-h-[90vh] w-[min(100%,440px)] overflow-y-auto rounded-t-3xl border border-b-0 border-border bg-card no-scrollbar",
              className,
            )}
          >
            <div className="sticky top-0 z-10 flex justify-center bg-card/0 pt-3">
              <span className="h-1.5 w-10 rounded-full bg-muted-foreground/30" />
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
