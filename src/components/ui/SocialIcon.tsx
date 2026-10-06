import type { IconType } from "react-icons";
import { FaLinkedinIn } from "react-icons/fa6";
import { SiCodechef, SiGithub, SiInstagram, SiLeetcode, SiMedium } from "react-icons/si";
import type { SocialKey } from "@/data/profile";

export const socialIcons: Record<SocialKey, IconType> = {
  github: SiGithub,
  linkedin: FaLinkedinIn,
  medium: SiMedium,
  leetcode: SiLeetcode,
  codechef: SiCodechef,
  instagram: SiInstagram,
};
