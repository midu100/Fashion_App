const emailTemp = (item) => {
  return `
  <div class="max-w-xl mx-auto font-sans bg-gray-100 p-5">

          <div class="bg-white p-8 rounded-lg text-center flex flex-col items-center">

            <h2 class="text-gray-900 text-2xl mb-2 font-semibold">
              Email Verification
            </h2>

            <p class="text-gray-600 text-sm mb-6">
              Thank you for choosing <b>KAZIR NATION</b>.
              Please use the OTP below to verify your email address.
            </p>

            <div class="my-6 w-48 bg-gray-900 text-white text-2xl tracking-widest rounded-md font-bold py-3 flex justify-center">
              ${item}
            </div>

            <p class="text-gray-500 text-xs">
              This OTP will expire in <b>2 minutes</b>.
            </p>

            <p class="text-gray-400 text-xs mt-6">
              If you did not request this, please ignore this email.
            </p>

          </div>

          <p class="text-center text-gray-300 text-[10px] mt-4">
            © ${new Date().getFullYear()} KAZIR NATION. All rights reserved.
          </p>

        </div>`
}

const resetPassTemp = (item) => {
  return `
  <div class="max-w-xl mx-auto font-sans bg-gray-100 p-5">

    <div class="bg-white p-8 rounded-lg text-center flex flex-col items-center">

      <h2 class="text-gray-900 text-2xl mb-2 font-semibold">
        Reset Your Password
      </h2>

      <p class="text-gray-600 text-sm mb-6">
        We received a request to reset your <b>KAZIR NATION</b> account password.
        Click the button below to create a new password.
      </p>

      <a href="${item}"
        style="
          background:#111827;
          color:#ffffff;
          text-decoration:none;
          padding:12px 28px;
          border-radius:6px;
          font-size:14px;
          font-weight:600;
          margin:16px 0;
          display:inline-block;
        ">
        Reset Password
      </a>

      <p class="text-gray-500 text-xs mt-4">
        This link will expire in <b>10 minutes</b>.
      </p>

      <p class="text-gray-400 text-xs mt-6">
        If you did not request a password reset, please ignore this email.
      </p>

      <p class="text-gray-400 text-xs mt-4 break-all">
        Or copy and paste this link:<br/>
        ${item}
      </p>

    </div>

    <p class="text-center text-gray-300 text-[10px] mt-4">
      © ${new Date().getFullYear()} KAZIR NATION. All rights reserved.
    </p>

  </div>`
}

const orderConfirmTemp = (order) => {
  const money = (n) => `$${Number(n || 0).toLocaleString('en-US')}`
  const a = order.shippingAddress || {}
  const rows = (order.items || [])
    .map(
      (it) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #eee;color:#111827;font-size:14px;">
          ${it.name}${it.size ? ` <span style="color:#9ca3af;">· Size ${it.size}</span>` : ''}
          <span style="color:#9ca3af;"> × ${it.qty}</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #eee;color:#111827;font-size:14px;text-align:right;font-weight:600;">
          ${money(it.price * it.qty)}
        </td>
      </tr>`
    )
    .join('')

  return `
  <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;background:#f3f4f6;padding:24px;">
    <div style="background:#111827;padding:26px;border-radius:12px 12px 0 0;text-align:center;">
      <h1 style="color:#C9A96E;margin:0;font-size:22px;letter-spacing:3px;">KAZIR NATION</h1>
    </div>
    <div style="background:#ffffff;padding:28px;border-radius:0 0 12px 12px;">
      <h2 style="color:#111827;font-size:20px;margin:0 0 6px;">Thank you for your order, ${a.firstName || ''}!</h2>
      <p style="color:#6b7280;font-size:14px;margin:0 0 20px;">
        We've received your order <b>${order.orderNumber}</b> and it's now being processed.
      </p>

      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        ${rows}
      </table>

      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="color:#6b7280;padding:4px 0;">Subtotal</td><td style="text-align:right;color:#111827;">${money(order.subtotal)}</td></tr>
        <tr><td style="color:#6b7280;padding:4px 0;">Shipping</td><td style="text-align:right;color:#111827;">${order.shipping ? money(order.shipping) : 'Free'}</td></tr>
        <tr><td style="color:#111827;padding:10px 0 0;font-weight:700;font-size:16px;border-top:1px solid #eee;">Total</td><td style="text-align:right;color:#111827;font-weight:700;font-size:16px;border-top:1px solid #eee;padding-top:10px;">${money(order.total)}</td></tr>
      </table>

      <div style="margin-top:22px;padding:16px;background:#f9fafb;border-radius:8px;">
        <p style="color:#111827;font-size:13px;font-weight:600;margin:0 0 6px;">Shipping to</p>
        <p style="color:#6b7280;font-size:13px;margin:0;line-height:1.6;">
          ${a.firstName || ''} ${a.lastName || ''}<br/>
          ${a.address || ''}${a.city ? `, ${a.city}` : ''}${a.country ? `, ${a.country}` : ''}<br/>
          ${a.phone ? `Phone: ${a.phone}` : ''}
        </p>
      </div>

      <p style="color:#9ca3af;font-size:12px;margin-top:22px;">
        You'll get another update when your order ships. Payment method: <b>${(order.paymentMethod || '').toUpperCase()}</b>.
      </p>
    </div>
    <p style="text-align:center;color:#9ca3af;font-size:11px;margin-top:14px;">
      © ${new Date().getFullYear()} KAZIR NATION. All rights reserved.
    </p>
  </div>`
}

module.exports = { emailTemp, resetPassTemp, orderConfirmTemp }
