import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabaseServer
      .from('diagnosticos')
      .delete()
      .eq('id', params.id);

    if (error) throw new Error(error.message);

    return NextResponse.json({ deleted: params.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
