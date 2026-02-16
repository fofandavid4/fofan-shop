import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    // Лог всего, что приходит с формы
    console.log('NEW ITEM FORM:')
    console.log(Object.fromEntries(formData.entries()))

    // Тут пока ничего не сохраняем, просто отвечаем, что всё ок
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('API /api/items error:', e)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
