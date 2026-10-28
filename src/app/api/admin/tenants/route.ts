import { NextResponse } from 'next/server';
import { INITIAL_TENANTS } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({
    success: true,
    platform: 'FitLedger OS Multi-Tenant Fleet',
    founder: 'Abiodun Oludolapo (abiodunoludolapo@gmail.com)',
    totalTenants: INITIAL_TENANTS.length,
    tenants: INITIAL_TENANTS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, location, ownerName, ownerPhone, ownerEmail, planTier } = body;

    if (!name || !ownerName || !ownerPhone) {
      return NextResponse.json(
        { success: false, message: 'Gym name, owner name, and owner phone are required.' },
        { status: 400 }
      );
    }

    const tenantId = `tenant_${Date.now()}`;
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const tempPassword = `Fit#${Math.floor(1000 + Math.random() * 9000)}`;
    const monthlyFee = planTier === 'Starter' ? 25000 : planTier === 'Growth' ? 45000 : 95000;

    const newTenant = {
      id: tenantId,
      name,
      slug,
      location: location || 'Lagos, Nigeria',
      ownerName,
      ownerPhone,
      ownerEmail: ownerEmail || `owner@${slug}.ng`,
      planTier: planTier || 'Growth',
      monthlyFee,
      status: 'trial',
      joinedDate: new Date().toISOString().split('T')[0],
    };

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const appUrl = `${protocol}://${host}`;

    const whatsappOnboardingMessage = `*Welcome to FitLedger OS!* 🏋️‍♂️\n\nHello ${ownerName},\nYour enterprise gym workspace for *${name}* is now live!\n\n🔗 *Login Portal:* ${appUrl}/login\n📧 *Email/Username:* ${newTenant.ownerEmail}\n🔑 *Temporary Password:* ${tempPassword}\n\n_Protected by FitLedger OS Lagos Anti-Theft Architecture._`;

    return NextResponse.json({
      success: true,
      message: 'Gym tenant and owner account successfully provisioned.',
      tenant: newTenant,
      ownerCredentials: {
        email: newTenant.ownerEmail,
        temporaryPassword: tempPassword,
        phone: ownerPhone,
      },
      whatsappOnboardingMessage,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error creating gym tenant.' },
      { status: 500 }
    );
  }
}
