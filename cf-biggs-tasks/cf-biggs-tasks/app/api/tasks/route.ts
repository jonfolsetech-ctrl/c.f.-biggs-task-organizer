import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { taskSchema } from "@/lib/validation";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tasks = await prisma.task.findMany({
    where: { userId: user.id },
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }]
  });

  return NextResponse.json({ tasks });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = taskSchema.parse(body);

    const task = await prisma.task.create({
      data: {
        userId: user.id,
        title: data.title,
        description: data.description,
        dueDate: new Date(data.dueDate),
        scheduledTime: data.scheduledTime,
        priority: data.priority,
        status: data.status,
        completedAt: data.status === "COMPLETED" ? new Date() : null
      }
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid task data" }, { status: 400 });
  }
}
