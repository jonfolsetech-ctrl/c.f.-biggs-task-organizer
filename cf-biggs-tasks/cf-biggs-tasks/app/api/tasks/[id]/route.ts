import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { taskSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const user = await getCurrentUser();
  const { id } = await params;

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = taskSchema.partial().parse(body);

    const existing = await prisma.task.findFirst({ where: { id, userId: user.id } });
    if (!existing) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        completedAt:
          data.status === "COMPLETED"
            ? existing.completedAt ?? new Date()
            : data.status
              ? null
              : undefined
      }
    });

    return NextResponse.json({ task });
  } catch {
    return NextResponse.json({ error: "Unable to update task" }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  const user = await getCurrentUser();
  const { id } = await params;

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.task.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
