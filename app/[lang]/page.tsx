import { redirect } from "next/navigation";

type Props = { params: Promise<{ lang: string }> };

export default async function LangRootPage({ params }: Props) {
  const { lang } = await params;
  redirect(`/${lang}/articles`);
}
