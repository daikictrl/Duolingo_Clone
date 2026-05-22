import icon from "@/assets/images/icon.png";
import mascotAuth from "@/assets/images/mascot-auth.png";
import mascotWelcome from "@/assets/images/mascot-welcome.png";
import mascotLogo from "@/assets/images/moscot-logo.png"; // Named as moscot-logo.png in assets
import earth from "@/assets/images/earth.png";
import palace from "@/assets/images/palace.png";
import streakFire from "@/assets/images/streak-fire.png";
import treasure from "@/assets/images/treasure.png";

export const images = {
  icon,
  mascotAuth,
  mascotWelcome,
  mascotLogo,
  moscotLogo: mascotLogo, // Correctly mapped to imported variable
  earth,
  palace,
  streakFire,
  treasure,
} as const;
