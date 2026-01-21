// lib/email.ts
import nodemailer from 'nodemailer'
import fs from 'fs/promises'
import path from 'path'

interface EmailOptions {
  to: string
  subject: string
  html: string
  attachments?: Array<{
    filename: string
    content: Buffer
    contentType: string
  }>
}

export async function sendEmail(options: EmailOptions) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  const mailOptions = {
    from: `"Sitalaris" <${process.env.EMAIL_FROM}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    attachments: options.attachments,
  }

  return transporter.sendMail(mailOptions)
}

export async function sendApprovalEmail(
  userEmail: string,
  userName: string,
  nomorSurat: string,
  pdfBuffer: Buffer
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; background-color: #f9f9f9; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Surat Pernyataan Disetujui</h1>
        </div>
        <div class="content">
          <p>Halo <strong>${userName}</strong>,</p>
          <p>Surat Pernyataan Ahli Waris Anda dengan nomor <strong>${nomorSurat}</strong> telah disetujui oleh admin.</p>
          <p>Berikut terlampir surat resmi dalam format PDF yang dapat Anda unduh dan gunakan sesuai kebutuhan.</p>
          <br>
          <p>Terima kasih telah menggunakan layanan Sitalaris.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Sitalaris. Semua hak dilindungi.</p>
          <p>Email ini dikirim secara otomatis, mohon tidak membalas.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: userEmail,
    subject: `Surat Pernyataan Ahli Waris ${nomorSurat} Telah Disetujui`,
    html,
    attachments: [{
      filename: `surat-pernyataan-ahli-waris-${nomorSurat}.pdf`,
      content: pdfBuffer,
      contentType: 'application/pdf'
    }]
  })
}

export async function sendRejectionEmail(
  userEmail: string,
  userName: string,
  nomorSurat: string,
  reason: string
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #d32f2f;">Surat Pernyataan Ditolak</h2>
      <p>Halo <strong>${userName}</strong>,</p>
      <p>Mohon maaf, Surat Pernyataan Ahli Waris Anda dengan nomor <strong>${nomorSurat}</strong> tidak dapat disetujui.</p>
      <div style="background-color: #ffebee; padding: 15px; border-left: 4px solid #d32f2f; margin: 20px 0;">
        <p><strong>Alasan:</strong></p>
        <p>${reason}</p>
      </div>
      <p>Silakan perbaiki data sesuai catatan di atas dan ajukan kembali.</p>
      <br>
      <p>Terima kasih,</p>
      <p>Tim Sitalaris</p>
    </div>
  `

  return sendEmail({
    to: userEmail,
    subject: `Surat Pernyataan Ahli Waris ${nomorSurat} Membutuhkan Perbaikan`,
    html
  })
}