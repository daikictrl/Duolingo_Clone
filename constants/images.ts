import icon from "@/assets/images/icon.png";
import mascotAuth from "@/assets/images/mascot-auth.png";
import mascotWelcome from "@/assets/images/mascot-welcome.png";
import mascotSadLittle from "@/assets/images/mascot-sad-little.png";
import mascotSadCompletely from "@/assets/images/mascot-sad-completely.png";
import moscotLogo from "@/assets/images/moscot-logo.png"; // Imported to match filename moscot-logo.png
import earth from "@/assets/images/earth.png";
import palace from "@/assets/images/palace.png";
import streakFire from "@/assets/images/streak-fire.png";
import treasure from "@/assets/images/treasure.png";
import mascotTeacher from "@/assets/images/mascot-teacher.png";
import roomBg from "@/assets/images/room-bg.png";

export const images = {
  icon,
  mascotAuth,
  mascotWelcome,
  mascotSadLittle,
  mascotSadCompletely,
  moscotLogo,
  mascotLogo: moscotLogo, // Keep mascotLogo key for compatibility with AGENTS.md instructions
  earth,
  palace,
  streakFire,
  treasure,
  mascotTeacher,
  roomBg,
} as const;
