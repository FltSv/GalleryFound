export const Maintenance = () => (
  <div className="flex flex-col items-center gap-4">
    <h2
      className={`
      text-primary-500 text-2xl font-bold
      md:text-3xl
    `}>
      ただいまメンテナンス中です
    </h2>
    <p className="text-center">
      ご迷惑をおかけしております。
      <br />
      現在、メンテナンスを実施しております。
      <br />
      恐れ入りますが、しばらく時間をおいてから
      <br
        className={`
        block
        md:hidden
      `}
      />
      再度アクセスしていただくようお願いします。
    </p>
  </div>
);
