import { transporter } from '@/app/lib/mailer';
import path from 'path';

export async function POST(req: Request) {
  const { email, fileName } = await req.json();

  const filePath = path.join(process.cwd(), 'storage/pdf', fileName);

  await transporter.sendMail({
    to: email,
    subject: 'Surat Pernyataan Ahli Waris',
    text: 'Terlampir surat pernyataan ahli waris.',
    attachments: [{ filename: fileName, path: filePath }]
  });

  return Response.json({ success: true });
}
