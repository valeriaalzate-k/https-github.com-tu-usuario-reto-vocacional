import { prisma } from "@/lib/prisma";
import StudentFlow from "@/components/StudentFlow";

export const dynamic = "force-dynamic";

export default async function Home() {
  const school = await prisma.school.findFirst();
  return <StudentFlow schoolName={school?.name ?? "Colegio San Marcos"} />;
}
