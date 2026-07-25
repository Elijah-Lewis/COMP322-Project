import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type PlantRecord = {
  name: string;
  type: string;
  datePlanted: string;
  wateringSchedule: string;
  harvestYield: string;
};

type RequestResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string; status: number };

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get('origin');

  if (!origin) {
    return process.env.NODE_ENV !== 'production';
  }

  return origin === new URL(request.url).origin;
}

function readRequiredString(value: unknown, fieldName: string): RequestResult<string> {
  if (typeof value !== 'string') {
    return { ok: false, error: `${fieldName} must be a string.`, status: 400 };
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return { ok: false, error: `${fieldName} is required.`, status: 400 };
  }

  return { ok: true, value: trimmed };
}

function parsePlantPayload(payload: unknown): RequestResult<PlantRecord> {
  if (!payload || typeof payload !== 'object') {
    return { ok: false, error: 'Request body must be a JSON object.', status: 400 };
  }

  const record = payload as Record<string, unknown>;
  const name = readRequiredString(record.name, 'name');
  if (!name.ok) return name;

  const type = readRequiredString(record.type, 'type');
  if (!type.ok) return type;

  const datePlanted = readRequiredString(record.datePlanted, 'datePlanted');
  if (!datePlanted.ok) return datePlanted;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(datePlanted.value)) {
    return {
      ok: false,
      error: 'datePlanted must use the YYYY-MM-DD format.',
      status: 400,
    };
  }

  const wateringSchedule = readRequiredString(record.wateringSchedule, 'wateringSchedule');
  if (!wateringSchedule.ok) return wateringSchedule;

  const harvestYield = readRequiredString(record.harvestYield, 'harvestYield');
  if (!harvestYield.ok) return harvestYield;

  return {
    ok: true,
    value: {
      name: name.value,
      type: type.value,
      datePlanted: datePlanted.value,
      wateringSchedule: wateringSchedule.value,
      harvestYield: harvestYield.value,
    },
  };
}

function parseMutationTarget(payload: unknown, fieldName: 'targetName') {
  if (!payload || typeof payload !== 'object') {
    return { ok: false, error: 'Request body must be a JSON object.', status: 400 } as const;
  }

  const record = payload as Record<string, unknown>;
  return readRequiredString(record[fieldName], fieldName);
}

export async function GET() {
  try {
    const plants = await prisma.plant.findMany({
      orderBy: { id: 'asc' },
    });

    return NextResponse.json(plants);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch plants from database' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!isSameOrigin(request)) {
      return jsonError('Cross-origin requests are not allowed.', 403);
    }

    const parsedBody = parsePlantPayload(await request.json());
    if (!parsedBody.ok) {
      return jsonError(parsedBody.error, parsedBody.status);
    }

    const newPlant = await prisma.plant.create({
      data: parsedBody.value,
    });

    return NextResponse.json(newPlant, { status: 201 });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'A plant with this name already exists.' },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Database transaction failed.' },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    if (!isSameOrigin(request)) {
      return jsonError('Cross-origin requests are not allowed.', 403);
    }

    const payload = await request.json();
    const targetName = parseMutationTarget(payload, 'targetName');
    if (!targetName.ok) {
      return jsonError(targetName.error, targetName.status);
    }

    const record = payload as Record<string, unknown>;
    const updatedType = readRequiredString(record.updatedType, 'updatedType');
    if (!updatedType.ok) {
      return jsonError(updatedType.error, updatedType.status);
    }

    const updatedPlant = await prisma.plant.update({
      where: { name: targetName.value },
      data: { type: updatedType.value },
    });

    return NextResponse.json({ message: 'Plant updated', plant: updatedPlant });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json(
        { error: 'Plant not found on server' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: 'Internal Update Pipeline Failed' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    if (!isSameOrigin(request)) {
      return jsonError('Cross-origin requests are not allowed.', 403);
    }

    const targetName = parseMutationTarget(await request.json(), 'targetName');
    if (!targetName.ok) {
      return jsonError(targetName.error, targetName.status);
    }

    await prisma.plant.delete({
      where: { name: targetName.value },
    });

    return NextResponse.json({ message: 'Plant deleted successfully' });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json(
        { error: 'Plant not found on server' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: 'Internal Deletion Pipeline Failed' },
      { status: 500 },
    );
  }
}
