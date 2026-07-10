import Image from "next/image";

export function CourseIcon({ icon, size = 32 }: { icon: string; size?: number }) {
  if (icon.startsWith("/")) {
    return <Image src={icon} alt="" width={size} height={size} className="object-contain" />;
  }
  return <>{icon}</>;
}
