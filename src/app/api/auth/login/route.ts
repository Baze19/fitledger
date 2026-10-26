import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, credential } = body;

    if (!identifier || !credential) {
      return NextResponse.json(
        { success: false, message: 'Identifier and credential are required.' },
        { status: 400 }
      );
    }

    const id = identifier.trim().toLowerCase();
    const cred = credential.trim();

    // 1. Founder / Super Admin
    if (
      id === 'wincodes2@gmail.com' ||
      id === 'founder@fitledger.ng' ||
      id === 'abiodun@fitledger.ng' ||
      id.includes('admin')
    ) {
      if (cred.length >= 3) {
        return NextResponse.json({
          success: true,
          role: 'founder',
          targetUrl: '/admin',
          user: {
            fullName: 'Abiodun Oludolapo',
            email: 'wincodes2@gmail.com',
            role: 'SUPER_ADMIN',
          },
          token: `jwt_founder_${Date.now()}`,
        });
      }
    }

    // 2. Gym Owner
    if (id.includes('owner') || id.includes('tunde') || id === '08023456789') {
      return NextResponse.json({
        success: true,
        role: 'owner',
        targetUrl: '/owner',
        user: {
          fullName: 'Fitflex Owner / Manager',
          gymName: 'Fitflex Fitness Irawo',
          tenantId: 'tenant_fitflex',
          role: 'GYM_OWNER',
        },
        token: `jwt_owner_${Date.now()}`,
      });
    }

    // 3. Receptionist PIN
    if (cred === '4821' || cred === '1102' || cred.length === 4) {
      return NextResponse.json({
        success: true,
        role: 'receptionist',
        targetUrl: '/terminal',
        user: {
          fullName: cred === '1102' ? 'John Adeleke' : 'Mary Okafor',
          role: 'RECEPTIONIST',
          shiftStatus: 'active',
        },
        token: `jwt_staff_${Date.now()}`,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Invalid credentials. Account not found in active tenant fleet.',
      },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error processing authentication.' },
      { status: 500 }
    );
  }
}
