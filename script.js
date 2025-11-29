document.addEventListener('DOMContentLoaded', () => {

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Simulation Logic
    const calcBtn = document.getElementById('calc-btn');
    if (calcBtn) {
        calcBtn.addEventListener('click', calculateLoan);
    }

    function calculateLoan() {
        const price = parseFloat(document.getElementById('price').value) * 10000; // 万円 -> 円
        const residual = parseFloat(document.getElementById('residual').value) * 10000; // 万円 -> 円
        const rate = parseFloat(document.getElementById('rate').value) / 100;
        const years = parseInt(document.getElementById('years').value);
        const months = years * 12;

        if (isNaN(price) || isNaN(residual) || isNaN(rate) || isNaN(years)) {
            alert('全ての項目に数値を入力してください。');
            return;
        }

        // 残クレ計算 (簡易版: アドオン方式に近い形や、元利均等などあるが、ここでは一般的なイメージとして)
        // 通常、残クレは (車両価格 - 残価) を分割払い + 残価に対する金利 も払う必要がある場合が多い
        // ここではトヨタの一般的な計算式（元利均等返済の変形）を簡易的にシミュレート

        // 借入元金 = 車両価格
        // 据置額 = 残価

        // 毎月の支払額 = ( (車両価格 - 残価) × (1 + 金利 × 年数) ) / 回数 ... これは単純すぎる

        // より正確な簡易計算:
        // 1. 残価部分の金利 = 残価 × 月利
        // 2. 分割部分（車両価格 - 残価）の元利均等返済額
        // これらを足すのが一般的だが、メーカーにより異なる。

        // ここでは「分割元金 = 車両価格 - 残価」とし、
        // 「分割元金 + 全期間の金利総額」を月割りする簡易ロジックを採用
        // ※金利総額は 車両価格全体にかかるケースが多い

        // 簡易計算ロジック (あくまで目安)
        // 総金利 ≈ (車両価格 × 金利 × 年数)
        // 支払総額 = 車両価格 + 総金利
        // 月々の支払 = (支払総額 - 残価) / 回数

        const totalInterest = price * rate * years;
        const totalPayment = price + totalInterest;
        const monthlyPayment = (totalPayment - residual) / months;

        // Display Results
        document.getElementById('monthly-payment').textContent = Math.floor(monthlyPayment).toLocaleString() + ' 円';
        document.getElementById('total-payment').textContent = Math.floor(totalPayment).toLocaleString() + ' 円';
        document.getElementById('interest-payment').textContent = Math.floor(totalInterest).toLocaleString() + ' 円';
    }
});
