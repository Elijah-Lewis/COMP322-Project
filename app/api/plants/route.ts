import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
    const { name, type, datePlanted, wateringSchedule, harvestYield } =
      await request.json();

    if (!name || !type || !datePlanted || !wateringSchedule || !harvestYield) {
      return NextResponse.json(
        { error: 'All plant fields are required for creation.' },
        { status: 400 },
      );
    }

    const newPlant = await prisma.plant.create({
      data: { name, type, datePlanted, wateringSchedule, harvestYield },
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
    const { targetName, updatedType } = await request.json();

    if (!targetName || !updatedType) {
      return NextResponse.json(
        { error: 'Missing required modification parameters.' },
        { status: 400 },
      );
    }

    const updatedPlant = await prisma.plant.update({
      where: { name: targetName },
      data: { type: updatedType },
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
    const { targetName } = await request.json();

    if (!targetName) {
      return NextResponse.json(
        { error: 'Target name must be provided.' },
        { status: 400 },
      );
    }

    await prisma.plant.delete({
      where: { name: targetName },
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
