"use client"

import { useState } from "react"
import { CollectionProvider } from "@/lib/collection-store"
import { BottomNav, type Tab } from "@/components/bottom-nav"
import { DexScreen } from "@/components/screens/dex-screen"
import { CaptureScreen } from "@/components/screens/capture-screen"
import { MapScreen } from "@/components/screens/map-screen"
import { ProfileScreen } from "@/components/screens/profile-screen"
import { PremiumScreen } from "@/components/screens/premium-screen"

export function ArtDexApp() {
  const [tab, setTab] = useState<Tab>("dex")
  const [premium, setPremium] = useState(false)

  return (
    <CollectionProvider>
      <div className="relative mx-auto min-h-dvh w-full max-w-[440px] bg-background">
        {premium ? (
          <PremiumScreen onBack={() => setPremium(false)} />
        ) : (
          <>
            {tab === "dex" && <DexScreen onPremium={() => setPremium(true)} />}
            {tab === "capture" && <CaptureScreen />}
            {tab === "map" && <MapScreen />}
            {tab === "profile" && <ProfileScreen />}
            <BottomNav active={tab} onChange={setTab} />
          </>
        )}
      </div>
    </CollectionProvider>
  )
}
