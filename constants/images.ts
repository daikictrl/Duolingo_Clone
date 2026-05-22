import icon from "@/assets/images/icon.png";
import mascotAuth from "@/assets/images/mascot-auth.png";
import mascotWelcome from "@/assets/images/mascot-welcome.png";
import moscotLogo from "@/assets/images/moscot-logo.png"; // Imported to match filename moscot-logo.png
import earth from "@/assets/images/earth.png";
import palace from "@/assets/images/palace.png";
import streakFire from "@/assets/images/streak-fire.png";
import treasure from "@/assets/images/treasure.png";

export const images = {
  icon,
  mascotAuth,
  mascotWelcome,
  moscotLogo,
  mascotLogo: moscotLogo, // Keep mascotLogo key for compatibility with AGENTS.md instructions
  earth,
  palace,
  streakFire,
  treasure,
} as const;
